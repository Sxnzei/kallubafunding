// server/auth.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { storage } from './storage';
import { registerUserSchema, loginUserSchema } from '@shared/schema';

const JWT_SECRET = process.env.JWT_SECRET || 'kalluba-secret-key-2025';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
}

// Register controller with enhanced security
export const register = async (req: Request, res: Response) => {
  try {
    // Validate input
    const validatedData = registerUserSchema.parse(req.body);
    
    // Rate limiting check
    const ip = req.ip;
    const registrationAttemptsKey = `registration_attempts_${ip}`;
    const registrationAttempts = await storage.getRateLimit(registrationAttemptsKey);
    
    if (registrationAttempts >= 3) {
      return res.status(429).json({
        message: 'Too many registration attempts. Please try again later.',
        error: 'RATE_LIMIT_EXCEEDED'
      });
    }

    // Check if user already exists
    const existingUser = await storage.getUserByEmail(validatedData.email);
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User already exists',
        error: 'USER_EXISTS'
      });
    }

    // Validate password strength
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(validatedData.password)) {
      return res.status(400).json({
        message: 'Password must contain at least 8 characters, including uppercase, lowercase, and numbers',
        error: 'INVALID_PASSWORD'
      });
    }

    // Hash password with stronger salt rounds
    const passwordHash = await bcrypt.hash(validatedData.password, 12);

    // Create user
    const user = await storage.createUserWithPassword({
      name: validatedData.name,
      email: validatedData.email,
      bio: validatedData.bio || null,
      profileImageUrl: validatedData.profileImageUrl || null,
      role: 'USER',
      passwordHash,
    });

    // Generate JWT with enhanced security
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        role: user.role,
        iss: 'kalluba',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60 // 7 days
      },
      JWT_SECRET,
      { 
        algorithm: 'HS256',
        expiresIn: '7d'
      }
    );

    // Return user without password
    const { passwordHash: _, ...userWithoutPassword } = user;
    
    res.status(201).json({
      token,
      user: userWithoutPassword,
      meta: {
        tokenExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        userId: user.id
      }
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(400).json({ 
      message: 'Registration failed',
      error: 'REGISTRATION_FAILED',
      details: error.message
    });
  }
};

// Login controller with enhanced security
export const login = async (req: Request, res: Response) => {
  try {
    // Validate input
    const validatedData = loginUserSchema.parse(req.body);
    
    // Rate limiting check
    const ip = req.ip;
    const loginAttemptsKey = `login_attempts_${ip}`;
    const loginAttempts = await storage.getRateLimit(loginAttemptsKey);
    
    if (loginAttempts >= 5) {
      return res.status(429).json({
        message: 'Too many login attempts. Please try again later.',
        error: 'RATE_LIMIT_EXCEEDED'
      });
    }

    // Find user
    const user = await storage.getUserByEmail(validatedData.email);
    if (!user) {
      // Increment failed login attempts
      await storage.incrementRateLimit(loginAttemptsKey);
      return res.status(401).json({ 
        message: 'Invalid credentials',
        error: 'INVALID_CREDENTIALS'
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(validatedData.password, user.passwordHash);
    if (!isValidPassword) {
      // Increment failed login attempts
      await storage.incrementRateLimit(loginAttemptsKey);
      return res.status(401).json({ 
        message: 'Invalid credentials',
        error: 'INVALID_CREDENTIALS'
      });
    }

    // Reset failed login attempts on successful login
    await storage.resetRateLimit(loginAttemptsKey);

    // Generate JWT with enhanced security
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        role: user.role,
        iss: 'kalluba',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60 // 7 days
      },
      JWT_SECRET,
      { 
        algorithm: 'HS256',
        expiresIn: '7d'
      }
    );

    // Return user without password
    const { passwordHash: _, ...userWithoutPassword } = user;
    
    res.json({
      token,
      user: userWithoutPassword,
      meta: {
        tokenExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(400).json({ 
      message: 'Login failed',
      error: 'LOGIN_FAILED',
      details: error.message
    });
  }
};

// Get current user
export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const user = await storage.getUser(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user without password
    const { passwordHash: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error: any) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Auth middleware
export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      message: 'No token provided', 
      error: 'AUTH_TOKEN_MISSING'
    });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    // Validate token expiration
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      return res.status(401).json({ 
        message: 'Token expired', 
        error: 'TOKEN_EXPIRED'
      });
    }

    // Validate token issuer
    if (!decoded.iss || decoded.iss !== 'kalluba') {
      return res.status(401).json({ 
        message: 'Invalid token issuer', 
        error: 'INVALID_ISSUER'
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ 
      message: 'Invalid token', 
      error: 'INVALID_TOKEN'
    });
  }
};
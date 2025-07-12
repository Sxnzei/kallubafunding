// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  users;
  categories;
  projects;
  rewards;
  pledges;
  currentUserId;
  currentCategoryId;
  currentProjectId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.categories = /* @__PURE__ */ new Map();
    this.projects = /* @__PURE__ */ new Map();
    this.rewards = /* @__PURE__ */ new Map();
    this.pledges = /* @__PURE__ */ new Map();
    this.currentUserId = 1;
    this.currentCategoryId = 1;
    this.currentProjectId = 1;
    this.seedData();
  }
  seedData() {
    const categoryData = [
      { name: "Technology", slug: "technology", iconName: "laptop-code", color: "blue", description: "Innovative tech solutions" },
      { name: "Art & Design", slug: "art-design", iconName: "palette", color: "purple", description: "Creative and artistic projects" },
      { name: "Health", slug: "health", iconName: "heartbeat", color: "green", description: "Healthcare and wellness initiatives" },
      { name: "Education", slug: "education", iconName: "graduation-cap", color: "indigo", description: "Educational and learning projects" },
      { name: "Environment", slug: "environment", iconName: "leaf", color: "teal", description: "Environmental sustainability projects" },
      { name: "Music", slug: "music", iconName: "music", color: "pink", description: "Musical and audio projects" }
    ];
    categoryData.forEach((cat) => {
      const category = {
        id: this.currentCategoryId++,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        iconName: cat.iconName,
        color: cat.color,
        projectCount: Math.floor(Math.random() * 150) + 30,
        createdAt: /* @__PURE__ */ new Date()
      };
      this.categories.set(category.id, category);
    });
    const userData = [
      { name: "Kwame Asante", email: "kwame@example.com", profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face", bio: "Solar energy entrepreneur from Ghana", passwordHash: "$2b$10$hashedpassword1", role: "USER" },
      { name: "Amara Kone", email: "amara@example.com", profileImageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b0e5?w=100&h=100&fit=crop&crop=face", bio: "Tech educator and developer", passwordHash: "$2b$10$hashedpassword2", role: "USER" },
      { name: "Jabari Ochieng", email: "jabari@example.com", profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face", bio: "AgriTech innovator from Kenya", passwordHash: "$2b$10$hashedpassword3", role: "USER" },
      { name: "Zara Mwangi", email: "zara@example.com", profileImageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face", bio: "Healthcare technology specialist", passwordHash: "$2b$10$hashedpassword4", role: "USER" },
      { name: "Kofi Mensah", email: "kofi@example.com", profileImageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face", bio: "Environmental activist and engineer", passwordHash: "$2b$10$hashedpassword5", role: "ADMIN" }
    ];
    userData.forEach((user) => {
      const newUser = {
        id: this.currentUserId++,
        name: user.name,
        email: user.email,
        passwordHash: user.passwordHash,
        profileImageUrl: user.profileImageUrl,
        bio: user.bio,
        role: user.role,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      };
      this.users.set(newUser.id, newUser);
    });
    const projectData = [
      {
        title: "Solar Power for Rural Communities",
        subtitle: "Bringing clean energy to remote villages across Kenya",
        description: "Our innovative solar power initiative aims to provide sustainable electricity to rural communities that have been overlooked by traditional power grids. By installing solar panels and battery storage systems, we're empowering families with clean, reliable energy for their homes, schools, and small businesses.",
        goal: "60000",
        pledged: "45230",
        durationDays: 45,
        status: "LIVE",
        heroImageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=400&fit=crop",
        creatorId: 1,
        categoryId: 1,
        backerCount: 158,
        endDate: new Date(Date.now() + 24 * 24 * 60 * 60 * 1e3)
      },
      {
        title: "Coding Academy for Youth",
        subtitle: "Empowering young minds with digital skills",
        description: "A comprehensive coding bootcamp designed specifically for African youth aged 16-25. Our program covers web development, mobile app creation, and data science, providing students with the skills they need to thrive in the digital economy.",
        goal: "50000",
        pledged: "32450",
        durationDays: 60,
        status: "LIVE",
        heroImageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop",
        creatorId: 2,
        categoryId: 2,
        backerCount: 203,
        endDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1e3)
      },
      {
        title: "Smart Farming Solutions",
        subtitle: "IoT-powered agriculture for sustainable growth",
        description: "Revolutionary IoT sensors and mobile app system that helps farmers optimize crop yields while conserving water and reducing pesticide use. Our technology provides real-time data on soil moisture, temperature, and plant health.",
        goal: "40000",
        pledged: "28900",
        durationDays: 30,
        status: "LIVE",
        heroImageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=400&fit=crop",
        creatorId: 3,
        categoryId: 5,
        backerCount: 89,
        endDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1e3)
      },
      {
        title: "Mobile Health Clinic Network",
        subtitle: "Bringing healthcare to underserved communities",
        description: "A network of mobile health clinics equipped with telemedicine technology to provide primary healthcare services to rural and remote areas. Each clinic will be staffed by qualified healthcare professionals and connected to major hospitals via satellite internet.",
        goal: "75000",
        pledged: "21340",
        durationDays: 90,
        status: "LIVE",
        heroImageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop",
        creatorId: 4,
        categoryId: 3,
        backerCount: 67,
        endDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1e3)
      },
      {
        title: "African Music Preservation Project",
        subtitle: "Digitizing traditional music for future generations",
        description: "A comprehensive initiative to record, digitize, and preserve traditional African music from various ethnic groups. We're working with local musicians and cultural experts to create a digital archive that will be accessible to researchers and music lovers worldwide.",
        goal: "25000",
        pledged: "18750",
        durationDays: 60,
        status: "LIVE",
        heroImageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop",
        creatorId: 5,
        categoryId: 6,
        backerCount: 94,
        endDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1e3)
      },
      {
        title: "Clean Water Initiative",
        subtitle: "Providing safe drinking water through innovative filtration",
        description: "Developing and distributing low-cost, high-efficiency water filtration systems for communities without access to clean water. Our bio-sand filters remove 99% of pathogens and can be manufactured locally using sustainable materials.",
        goal: "35000",
        pledged: "42100",
        durationDays: 45,
        status: "FUNDED",
        heroImageUrl: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=800&h=400&fit=crop",
        creatorId: 1,
        categoryId: 5,
        backerCount: 156,
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3)
      }
    ];
    projectData.forEach((proj) => {
      const project = {
        id: this.currentProjectId++,
        title: proj.title,
        subtitle: proj.subtitle,
        description: proj.description,
        goal: proj.goal,
        pledged: proj.pledged,
        durationDays: proj.durationDays,
        status: proj.status,
        heroImageUrl: proj.heroImageUrl,
        creatorId: proj.creatorId,
        categoryId: proj.categoryId,
        backerCount: proj.backerCount,
        endDate: proj.endDate,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      };
      this.projects.set(project.id, project);
    });
  }
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByEmail(email) {
    return Array.from(this.users.values()).find((user) => user.email === email);
  }
  async createUser(insertUser) {
    const user = {
      id: this.currentUserId++,
      ...insertUser,
      passwordHash: "temp-hash",
      // This should be set via createUserWithPassword
      profileImageUrl: insertUser.profileImageUrl || null,
      bio: insertUser.bio || null,
      role: insertUser.role || "USER",
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.users.set(user.id, user);
    return user;
  }
  async createUserWithPassword(userData) {
    const user = {
      id: this.currentUserId++,
      ...userData,
      profileImageUrl: userData.profileImageUrl || null,
      bio: userData.bio || null,
      role: userData.role || "USER",
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.users.set(user.id, user);
    return user;
  }
  async getCategories() {
    return Array.from(this.categories.values());
  }
  async getCategoryBySlug(slug) {
    return Array.from(this.categories.values()).find((cat) => cat.slug === slug);
  }
  async getProjects(filters) {
    let projects2 = Array.from(this.projects.values());
    if (filters?.category) {
      const category = await this.getCategoryBySlug(filters.category);
      if (category) {
        projects2 = projects2.filter((p) => p.categoryId === category.id);
      }
    }
    if (filters?.status) {
      projects2 = projects2.filter((p) => p.status === filters.status);
    }
    if (filters?.limit) {
      projects2 = projects2.slice(0, filters.limit);
    }
    return projects2.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  async getProjectById(id) {
    const project = this.projects.get(id);
    if (!project) return void 0;
    const creator = await this.getUser(project.creatorId);
    const category = this.categories.get(project.categoryId);
    if (!creator || !category) return void 0;
    return {
      ...project,
      creator,
      category,
      rewards: [],
      pledges: []
    };
  }
  async getFeaturedProjects(limit = 6) {
    const projects2 = Array.from(this.projects.values()).filter((p) => p.status === "LIVE").sort((a, b) => parseFloat(b.pledged) - parseFloat(a.pledged)).slice(0, limit);
    return projects2;
  }
  async createProject(insertProject) {
    const project = {
      id: this.currentProjectId++,
      ...insertProject,
      description: insertProject.description || null,
      subtitle: insertProject.subtitle || null,
      status: insertProject.status || "DRAFT",
      heroImageUrl: insertProject.heroImageUrl || null,
      creatorId: insertProject.creatorId || null,
      categoryId: insertProject.categoryId || null,
      endDate: insertProject.endDate || null,
      pledged: "0",
      backerCount: 0,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.projects.set(project.id, project);
    return project;
  }
  async updateProject(id, updates) {
    const project = this.projects.get(id);
    if (!project) throw new Error("Project not found");
    const updatedProject = { ...project, ...updates, updatedAt: /* @__PURE__ */ new Date() };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }
  async searchProjects(query, limit = 10) {
    const lowercaseQuery = query.toLowerCase();
    const projects2 = Array.from(this.projects.values()).filter(
      (p) => p.title.toLowerCase().includes(lowercaseQuery) || p.subtitle?.toLowerCase().includes(lowercaseQuery) || p.description?.toLowerCase().includes(lowercaseQuery)
    ).slice(0, limit);
    return projects2;
  }
};
var storage = new MemStorage();

// server/auth.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// shared/schema.ts
import { pgTable, text, serial, integer, timestamp, decimal } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  profileImageUrl: text("profile_image_url"),
  bio: text("bio"),
  role: text("role").notNull().default("USER"),
  // USER, ADMIN
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  iconName: text("icon_name").notNull(),
  color: text("color").notNull(),
  projectCount: integer("project_count").default(0),
  createdAt: timestamp("created_at").defaultNow()
});
var projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  description: text("description"),
  goal: decimal("goal", { precision: 10, scale: 2 }).notNull(),
  pledged: decimal("pledged", { precision: 10, scale: 2 }).default("0"),
  durationDays: integer("duration_days").notNull(),
  status: text("status").notNull().default("DRAFT"),
  // DRAFT, LIVE, ENDED, FUNDED
  heroImageUrl: text("hero_image_url"),
  creatorId: integer("creator_id").references(() => users.id),
  categoryId: integer("category_id").references(() => categories.id),
  backerCount: integer("backer_count").default(0),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var rewards = pgTable("rewards", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id),
  title: text("title").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description"),
  quantity: integer("quantity"),
  shippingRegions: text("shipping_regions").array(),
  createdAt: timestamp("created_at").defaultNow()
});
var pledges = pgTable("pledges", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id),
  userId: integer("user_id").references(() => users.id),
  rewardId: integer("reward_id").references(() => rewards.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paymentStatus: text("payment_status").notNull().default("PENDING"),
  // PENDING, COMPLETED, FAILED
  createdAt: timestamp("created_at").defaultNow()
});
var usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
  pledges: many(pledges)
}));
var categoriesRelations = relations(categories, ({ many }) => ({
  projects: many(projects)
}));
var projectsRelations = relations(projects, ({ one, many }) => ({
  creator: one(users, { fields: [projects.creatorId], references: [users.id] }),
  category: one(categories, { fields: [projects.categoryId], references: [categories.id] }),
  rewards: many(rewards),
  pledges: many(pledges)
}));
var rewardsRelations = relations(rewards, ({ one }) => ({
  project: one(projects, { fields: [rewards.projectId], references: [projects.id] })
}));
var pledgesRelations = relations(pledges, ({ one }) => ({
  project: one(projects, { fields: [pledges.projectId], references: [projects.id] }),
  user: one(users, { fields: [pledges.userId], references: [users.id] }),
  reward: one(rewards, { fields: [pledges.rewardId], references: [rewards.id] })
}));
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  passwordHash: true
});
var registerUserSchema = insertUserSchema.extend({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});
var loginUserSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required")
});
var insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
  projectCount: true
});
var insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  pledged: true,
  backerCount: true
});
var insertRewardSchema = createInsertSchema(rewards).omit({
  id: true,
  createdAt: true
});
var insertPledgeSchema = createInsertSchema(pledges).omit({
  id: true,
  createdAt: true
});

// server/auth.ts
var JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-here";
var register = async (req, res) => {
  try {
    const validatedData = registerUserSchema.parse(req.body);
    const existingUser = await storage.getUserByEmail(validatedData.email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const passwordHash = await bcrypt.hash(validatedData.password, 10);
    const user = await storage.createUserWithPassword({
      name: validatedData.name,
      email: validatedData.email,
      bio: validatedData.bio,
      profileImageUrl: validatedData.profileImageUrl,
      role: validatedData.role,
      passwordHash
    });
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    const { passwordHash: _, ...userWithoutPassword } = user;
    res.status(201).json({
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(400).json({
      message: error.message || "Registration failed"
    });
  }
};
var login = async (req, res) => {
  try {
    const validatedData = loginUserSchema.parse(req.body);
    const user = await storage.getUserByEmail(validatedData.email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isValidPassword = await bcrypt.compare(validatedData.password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    const { passwordHash: _, ...userWithoutPassword } = user;
    res.json({
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(400).json({
      message: error.message || "Login failed"
    });
  }
};
var getCurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const user = await storage.getUser(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { passwordHash: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
var authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }
  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// server/routes.ts
async function registerRoutes(app2) {
  app2.post("/api/auth/register", register);
  app2.post("/api/auth/login", login);
  app2.get("/api/auth/me", authMiddleware, getCurrentUser);
  app2.get("/api/categories", async (req, res) => {
    try {
      const categories2 = await storage.getCategories();
      res.json(categories2);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });
  app2.get("/api/categories/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const category = await storage.getCategoryBySlug(slug);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      console.error("Error fetching category:", error);
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });
  app2.get("/api/projects", async (req, res) => {
    try {
      const { category, status, limit } = req.query;
      const filters = {
        category,
        status,
        limit: limit ? parseInt(limit) : void 0
      };
      const projects2 = await storage.getProjects(filters);
      res.json(projects2);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });
  app2.get("/api/projects/featured", async (req, res) => {
    try {
      const { limit } = req.query;
      const projects2 = await storage.getFeaturedProjects(
        limit ? parseInt(limit) : 6
      );
      res.json(projects2);
    } catch (error) {
      console.error("Error fetching featured projects:", error);
      res.status(500).json({ message: "Failed to fetch featured projects" });
    }
  });
  app2.get("/api/projects/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const project = await storage.getProjectById(parseInt(id));
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });
  app2.get("/api/search", async (req, res) => {
    try {
      const { q, limit } = req.query;
      if (!q) {
        return res.status(400).json({ message: "Search query is required" });
      }
      const projects2 = await storage.searchProjects(
        q,
        limit ? parseInt(limit) : 10
      );
      res.json(projects2);
    } catch (error) {
      console.error("Error searching projects:", error);
      res.status(500).json({ message: "Failed to search projects" });
    }
  });
  app2.get("/api/search/suggestions", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q) {
        return res.json([]);
      }
      const projects2 = await storage.searchProjects(q, 5);
      const suggestions = projects2.map((p) => ({
        id: p.id,
        title: p.title,
        subtitle: p.subtitle
      }));
      res.json(suggestions);
    } catch (error) {
      console.error("Error fetching search suggestions:", error);
      res.status(500).json({ message: "Failed to fetch suggestions" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();

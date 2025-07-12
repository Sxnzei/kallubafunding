import { 
  users, 
  categories, 
  projects, 
  rewards, 
  pledges,
  type User, 
  type InsertUser,
  type Category,
  type InsertCategory,
  type Project,
  type InsertProject,
  type ProjectWithDetails,
  type CategoryWithProjects
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createUserWithPassword(user: InsertUser & { passwordHash: string }): Promise<User>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  
  // Project operations
  getProjects(filters?: { category?: string; status?: string; limit?: number }): Promise<Project[]>;
  getProjectById(id: number): Promise<ProjectWithDetails | undefined>;
  getFeaturedProjects(limit?: number): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, updates: Partial<InsertProject>): Promise<Project>;
  
  // Search operations
  searchProjects(query: string, limit?: number): Promise<Project[]>;
  
  // Rate limiting operations
  getRateLimit(key: string): Promise<number>;
  incrementRateLimit(key: string): Promise<void>;
  resetRateLimit(key: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private projects: Map<number, Project>;
  private rewards: Map<number, any>;
  private pledges: Map<number, any>;
  private currentUserId: number;
  private currentCategoryId: number;
  private currentProjectId: number;
  private rateLimits: Map<string, { count: number; resetTime: number }>;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.projects = new Map();
    this.rewards = new Map();
    this.pledges = new Map();
    this.rateLimits = new Map();
    this.currentUserId = 1;
    this.currentCategoryId = 1;
    this.currentProjectId = 1;
    
    this.seedData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(user: InsertUser): Promise<User> {
    const newUser: User = {
      id: this.currentUserId++,
      ...user,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(newUser.id, newUser);
    return newUser;
  }

  async createUserWithPassword(user: InsertUser & { passwordHash: string }): Promise<User> {
    const newUser: User = {
      id: this.currentUserId++,
      ...user,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(newUser.id, newUser);
    return newUser;
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(cat => cat.slug === slug);
  }

  // Project operations
  async getProjects(filters?: { category?: string; status?: string; limit?: number }): Promise<Project[]> {
    let projects = Array.from(this.projects.values());
    
    if (filters?.category) {
      projects = projects.filter(p => p.categorySlug === filters.category);
    }
    
    if (filters?.status) {
      projects = projects.filter(p => p.status === filters.status);
    }
    
    if (filters?.limit) {
      projects = projects.slice(0, filters.limit);
    }
    
    return projects;
  }

  async getProjectById(id: number): Promise<ProjectWithDetails | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;

    // Add related data to project
    const projectWithDetails: ProjectWithDetails = {
      ...project,
      rewards: Array.from(this.rewards.values()).filter(r => r.projectId === id),
      pledges: Array.from(this.pledges.values()).filter(p => p.projectId === id)
    };

    return projectWithDetails;
  }

  async getFeaturedProjects(limit = 10): Promise<Project[]> {
    return Array.from(this.projects.values())
      .filter(p => p.status === 'active')
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async createProject(project: InsertProject): Promise<Project> {
    const newProject: Project = {
      id: this.currentProjectId++,
      ...project,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.projects.set(newProject.id, newProject);
    return newProject;
  }

  async updateProject(id: number, updates: Partial<InsertProject>): Promise<Project> {
    const project = this.projects.get(id);
    if (!project) throw new Error('Project not found');
    
    const updatedProject = { ...project, ...updates, updatedAt: new Date() };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  // Search operations
  async searchProjects(query: string, limit = 10): Promise<Project[]> {
    const lowercaseQuery = query.toLowerCase();
    const projects = Array.from(this.projects.values())
      .filter(p => 
        p.title.toLowerCase().includes(lowercaseQuery) ||
        p.subtitle?.toLowerCase().includes(lowercaseQuery) ||
        p.description?.toLowerCase().includes(lowercaseQuery)
      )
      .slice(0, limit);
    
    return projects;
  }

  // Rate limiting operations
  async getRateLimit(key: string): Promise<number> {
    const limit = this.rateLimits.get(key);
    if (!limit) return 0;

    // Check if limit should be reset
    if (limit.resetTime < Date.now()) {
      this.rateLimits.delete(key);
      return 0;
    }

    return limit.count;
  }

  async incrementRateLimit(key: string): Promise<void> {
    const limit = this.rateLimits.get(key) || { count: 0, resetTime: Date.now() + 15 * 60 * 1000 }; // 15 minutes
    limit.count++;
    this.rateLimits.set(key, limit);
  }

  async resetRateLimit(key: string): Promise<void> {
    this.rateLimits.delete(key);
  }

  private seedData() {
    // Seed categories
    const categoryData = [
      { name: "Technology", slug: "technology", iconName: "laptop-code", color: "blue", description: "Innovative tech solutions" },
      { name: "Art & Design", slug: "art-design", iconName: "palette", color: "purple", description: "Creative and artistic projects" },
      { name: "Health", slug: "health", iconName: "heartbeat", color: "green", description: "Healthcare and wellness initiatives" },
      { name: "Education", slug: "education", iconName: "graduation-cap", color: "indigo", description: "Educational and learning projects" },
      { name: "Environment", slug: "environment", iconName: "leaf", color: "teal", description: "Environmental sustainability projects" },
      { name: "Music", slug: "music", iconName: "music", color: "pink", description: "Musical and audio projects" },
    ];

    categoryData.forEach(cat => {
      const category: Category = {
        id: this.currentCategoryId++,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        iconName: cat.iconName,
        color: cat.color,
        projectCount: Math.floor(Math.random() * 150) + 30,
        createdAt: new Date(),
      };
      this.categories.set(category.id, category);
    });

    // Seed users
    const userData = [
      { name: "Kwame Asante", email: "kwame@example.com", profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face", bio: "Solar energy entrepreneur from Ghana", passwordHash: "$2b$10$hashedpassword1", role: "USER" },
      { name: "Amara Kone", email: "amara@example.com", profileImageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b0e5?w=100&h=100&fit=crop&crop=face", bio: "Tech educator and developer", passwordHash: "$2b$10$hashedpassword2", role: "USER" },
      { name: "Jabari Ochieng", email: "jabari@example.com", profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face", bio: "AgriTech innovator from Kenya", passwordHash: "$2b$10$hashedpassword3", role: "USER" },
      { name: "Zara Mwangi", email: "zara@example.com", profileImageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face", bio: "Healthcare technology specialist", passwordHash: "$2b$10$hashedpassword4", role: "USER" },
      { name: "Kofi Mensah", email: "kofi@example.com", profileImageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face", bio: "Environmental activist and engineer", passwordHash: "$2b$10$hashedpassword5", role: "ADMIN" },
    ];

    userData.forEach(user => {
      const newUser: User = {
        id: this.currentUserId++,
        name: user.name,
        email: user.email,
        passwordHash: user.passwordHash,
        profileImageUrl: user.profileImageUrl,
        bio: user.bio,
        role: user.role,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.users.set(newUser.id, newUser);
    });

    // Seed projects
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
        endDate: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000),
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
        endDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
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
        endDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
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
        endDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
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
        endDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
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
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    ];

    projectData.forEach(proj => {
      const project: Project = {
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
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.projects.set(project.id, project);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: this.currentUserId++,
      ...insertUser,
      passwordHash: 'temp-hash', // This should be set via createUserWithPassword
      profileImageUrl: insertUser.profileImageUrl || null,
      bio: insertUser.bio || null,
      role: insertUser.role || 'USER',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async createUserWithPassword(userData: InsertUser & { passwordHash: string }): Promise<User> {
    const user: User = {
      id: this.currentUserId++,
      ...userData,
      profileImageUrl: userData.profileImageUrl || null,
      bio: userData.bio || null,
      role: userData.role || 'USER',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(cat => cat.slug === slug);
  }

  async getProjects(filters?: { category?: string; status?: string; limit?: number }): Promise<Project[]> {
    let projects = Array.from(this.projects.values());
    
    if (filters?.category) {
      const category = await this.getCategoryBySlug(filters.category);
      if (category) {
        projects = projects.filter(p => p.categoryId === category.id);
      }
    }
    
    if (filters?.status) {
      projects = projects.filter(p => p.status === filters.status);
    }
    
    if (filters?.limit) {
      projects = projects.slice(0, filters.limit);
    }
    
    return projects.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getProjectById(id: number): Promise<ProjectWithDetails | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    
    const creator = await this.getUser(project.creatorId!);
    const category = this.categories.get(project.categoryId!);
    
    if (!creator || !category) return undefined;
    
    return {
      ...project,
      creator,
      category,
      rewards: [],
      pledges: [],
    };
  }

  async getFeaturedProjects(limit = 6): Promise<Project[]> {
    const projects = Array.from(this.projects.values())
      .filter(p => p.status === 'LIVE')
      .sort((a, b) => parseFloat(b.pledged!) - parseFloat(a.pledged!))
      .slice(0, limit);
    
    return projects;
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const project: Project = {
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
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.projects.set(project.id, project);
    return project;
  }

  async updateProject(id: number, updates: Partial<InsertProject>): Promise<Project> {
}

class MemStorage implements IStorage {
  // ... existing properties and methods

  private rateLimits: Map<string, { count: number; resetTime: number }>;

  constructor() {
    // ... existing initialization
    this.rateLimits = new Map();
  }

  // ... existing methods

  async getRateLimit(key: string): Promise<number> {
    const limit = this.rateLimits.get(key);
    if (!limit) return 0;

    // Check if limit should be reset
    if (limit.resetTime < Date.now()) {
      this.rateLimits.delete(key);
      return 0;
    }

    return limit.count;
  }

  async incrementRateLimit(key: string): Promise<void> {
    const limit = this.rateLimits.get(key) || { count: 0, resetTime: Date.now() + 15 * 60 * 1000 }; // 15 minutes
    limit.count++;
    this.rateLimits.set(key, limit);
  }

  async resetRateLimit(key: string): Promise<void> {
    this.rateLimits.delete(key);
  }
}

export const storage = new MemStorage();

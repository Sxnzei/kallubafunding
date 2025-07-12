import { pgTable, text, serial, integer, timestamp, decimal, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  profileImageUrl: text("profile_image_url"),
  bio: text("bio"),
  role: text("role").notNull().default("USER"), // USER, ADMIN
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  iconName: text("icon_name").notNull(),
  color: text("color").notNull(),
  projectCount: integer("project_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  description: text("description"),
  goal: decimal("goal", { precision: 10, scale: 2 }).notNull(),
  pledged: decimal("pledged", { precision: 10, scale: 2 }).default("0"),
  durationDays: integer("duration_days").notNull(),
  status: text("status").notNull().default("DRAFT"), // DRAFT, LIVE, ENDED, FUNDED
  heroImageUrl: text("hero_image_url"),
  creatorId: integer("creator_id").references(() => users.id),
  categoryId: integer("category_id").references(() => categories.id),
  backerCount: integer("backer_count").default(0),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const rewards = pgTable("rewards", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id),
  title: text("title").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description"),
  quantity: integer("quantity"),
  shippingRegions: text("shipping_regions").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const pledges = pgTable("pledges", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id),
  userId: integer("user_id").references(() => users.id),
  rewardId: integer("reward_id").references(() => rewards.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paymentStatus: text("payment_status").notNull().default("PENDING"), // PENDING, COMPLETED, FAILED
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
  pledges: many(pledges),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  projects: many(projects),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  creator: one(users, { fields: [projects.creatorId], references: [users.id] }),
  category: one(categories, { fields: [projects.categoryId], references: [categories.id] }),
  rewards: many(rewards),
  pledges: many(pledges),
}));

export const rewardsRelations = relations(rewards, ({ one }) => ({
  project: one(projects, { fields: [rewards.projectId], references: [projects.id] }),
}));

export const pledgesRelations = relations(pledges, ({ one }) => ({
  project: one(projects, { fields: [pledges.projectId], references: [projects.id] }),
  user: one(users, { fields: [pledges.userId], references: [users.id] }),
  reward: one(rewards, { fields: [pledges.rewardId], references: [rewards.id] }),
}));

// Schema types
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  passwordHash: true,
});

export const registerUserSchema = insertUserSchema.extend({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const loginUserSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
  projectCount: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  pledged: true,
  backerCount: true,
});

export const insertRewardSchema = createInsertSchema(rewards).omit({
  id: true,
  createdAt: true,
});

export const insertPledgeSchema = createInsertSchema(pledges).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Reward = typeof rewards.$inferSelect;
export type InsertReward = z.infer<typeof insertRewardSchema>;
export type Pledge = typeof pledges.$inferSelect;
export type InsertPledge = z.infer<typeof insertPledgeSchema>;

// Extended types for API responses
export type ProjectWithDetails = Project & {
  creator: User;
  category: Category;
  rewards: Reward[];
  pledges: Pledge[];
};

export type CategoryWithProjects = Category & {
  projects: Project[];
};

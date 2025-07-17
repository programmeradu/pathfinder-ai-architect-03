import { pgTable, text, serial, integer, boolean, timestamp, jsonb, uuid, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table - enhanced for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImage: text("profile_image"),
  currentGoal: text("current_goal"),
  learningStyle: text("learning_style"), // visual, auditory, kinesthetic, reading
  skillLevel: text("skill_level"), // beginner, intermediate, advanced
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Career paths and roadmaps
export const careerPaths = pgTable("career_paths", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  targetRole: text("target_role"),
  estimatedDuration: integer("estimated_duration"), // in weeks
  difficulty: text("difficulty"), // beginner, intermediate, advanced
  skills: jsonb("skills"), // array of skills needed
  roadmapData: jsonb("roadmap_data"), // interactive roadmap structure
  progress: integer("progress").default(0), // percentage complete
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Learning resources
export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  url: text("url").notNull(),
  type: text("type").notNull(), // video, article, course, project, book
  difficulty: text("difficulty"), // beginner, intermediate, advanced
  estimatedTime: integer("estimated_time"), // in minutes
  tags: jsonb("tags"), // array of tags
  rating: integer("rating"), // 1-5 stars
  metadata: jsonb("metadata"), // additional data like video length, author, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

// Path steps - links resources to career paths
export const pathSteps = pgTable("path_steps", {
  id: serial("id").primaryKey(),
  pathId: integer("path_id").references(() => careerPaths.id),
  resourceId: integer("resource_id").references(() => resources.id),
  stepOrder: integer("step_order").notNull(),
  isCompleted: boolean("is_completed").default(false),
  completedAt: timestamp("completed_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// AI conversations
export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title"),
  messages: jsonb("messages"), // array of conversation messages
  context: jsonb("context"), // conversation context and metadata
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User portfolio projects
export const portfolioProjects = pgTable("portfolio_projects", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  githubUrl: text("github_url"),
  liveUrl: text("live_url"),
  technologies: jsonb("technologies"), // array of technologies used
  images: jsonb("images"), // array of project images
  featured: boolean("featured").default(false),
  skillsProven: jsonb("skills_proven"), // skills demonstrated in this project
  aiEvaluation: jsonb("ai_evaluation"), // AI code review and scoring
  verificationStatus: text("verification_status"), // pending, verified, rejected
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User achievements and milestones
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type"), // milestone, badge, certificate
  data: jsonb("data"), // achievement metadata
  unlockedAt: timestamp("unlocked_at").defaultNow(),
});

// Learning analytics
export const learningAnalytics = pgTable("learning_analytics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  date: timestamp("date").defaultNow(),
  resourcesCompleted: integer("resources_completed").default(0),
  timeSpent: integer("time_spent").default(0), // in minutes
  skillsImproved: jsonb("skills_improved"), // skills worked on
  efficiency: integer("efficiency"), // learning efficiency score
  streakDays: integer("streak_days").default(0),
  weeklyGoalProgress: integer("weekly_goal_progress").default(0),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  careerPaths: many(careerPaths),
  conversations: many(conversations),
  portfolioProjects: many(portfolioProjects),
  achievements: many(achievements),
  learningAnalytics: many(learningAnalytics),
}));

export const careerPathsRelations = relations(careerPaths, ({ one, many }) => ({
  user: one(users, { fields: [careerPaths.userId], references: [users.id] }),
  pathSteps: many(pathSteps),
}));

export const pathStepsRelations = relations(pathSteps, ({ one }) => ({
  careerPath: one(careerPaths, { fields: [pathSteps.pathId], references: [careerPaths.id] }),
  resource: one(resources, { fields: [pathSteps.resourceId], references: [resources.id] }),
}));

export const conversationsRelations = relations(conversations, ({ one }) => ({
  user: one(users, { fields: [conversations.userId], references: [users.id] }),
}));

export const portfolioProjectsRelations = relations(portfolioProjects, ({ one }) => ({
  user: one(users, { fields: [portfolioProjects.userId], references: [users.id] }),
}));

export const achievementsRelations = relations(achievements, ({ one }) => ({
  user: one(users, { fields: [achievements.userId], references: [users.id] }),
}));

export const learningAnalyticsRelations = relations(learningAnalytics, ({ one }) => ({
  user: one(users, { fields: [learningAnalytics.userId], references: [users.id] }),
}));

// Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  firstName: true,
  lastName: true,
});

export const insertCareerPathSchema = createInsertSchema(careerPaths).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
  createdAt: true,
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPortfolioProjectSchema = createInsertSchema(portfolioProjects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type CareerPath = typeof careerPaths.$inferSelect;
export type Resource = typeof resources.$inferSelect;
export type PathStep = typeof pathSteps.$inferSelect;
export type Conversation = typeof conversations.$inferSelect;
export type PortfolioProject = typeof portfolioProjects.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
export type LearningAnalytics = typeof learningAnalytics.$inferSelect;

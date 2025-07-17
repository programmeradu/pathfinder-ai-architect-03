import { 
  users, 
  careerPaths, 
  resources, 
  pathSteps, 
  conversations, 
  portfolioProjects, 
  achievements, 
  learningAnalytics,
  type User, 
  type InsertUser,
  type CareerPath,
  type Resource,
  type PathStep,
  type Conversation,
  type PortfolioProject,
  type Achievement,
  type LearningAnalytics
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  
  // Career path operations
  createCareerPath(userId: number, pathData: Omit<CareerPath, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<CareerPath>;
  getUserCareerPaths(userId: number): Promise<CareerPath[]>;
  updateCareerPath(id: number, updates: Partial<CareerPath>): Promise<CareerPath | undefined>;
  
  // Resource operations
  createResource(resourceData: Omit<Resource, 'id' | 'createdAt'>): Promise<Resource>;
  getResourcesByTags(tags: string[]): Promise<Resource[]>;
  searchResources(query: string): Promise<Resource[]>;
  
  // Path step operations
  createPathStep(stepData: Omit<PathStep, 'id' | 'createdAt'>): Promise<PathStep>;
  getPathSteps(pathId: number): Promise<PathStep[]>;
  updatePathStep(id: number, updates: Partial<PathStep>): Promise<PathStep | undefined>;
  
  // Conversation operations
  createConversation(userId: number, conversationData: Omit<Conversation, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Conversation>;
  getUserConversations(userId: number): Promise<Conversation[]>;
  updateConversation(id: number, updates: Partial<Conversation>): Promise<Conversation | undefined>;
  
  // Portfolio operations
  createPortfolioProject(userId: number, projectData: Omit<PortfolioProject, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<PortfolioProject>;
  getUserPortfolioProjects(userId: number): Promise<PortfolioProject[]>;
  updatePortfolioProject(id: number, updates: Partial<PortfolioProject>): Promise<PortfolioProject | undefined>;
  
  // Achievement operations
  createAchievement(userId: number, achievementData: Omit<Achievement, 'id' | 'userId' | 'unlockedAt'>): Promise<Achievement>;
  getUserAchievements(userId: number): Promise<Achievement[]>;
  
  // Analytics operations
  createLearningAnalytics(userId: number, analyticsData: Omit<LearningAnalytics, 'id' | 'userId' | 'date'>): Promise<LearningAnalytics>;
  getUserLearningAnalytics(userId: number, days?: number): Promise<LearningAnalytics[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  // Career path operations
  async createCareerPath(userId: number, pathData: Omit<CareerPath, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<CareerPath> {
    const [careerPath] = await db
      .insert(careerPaths)
      .values({ ...pathData, userId })
      .returning();
    return careerPath;
  }

  async getUserCareerPaths(userId: number): Promise<CareerPath[]> {
    return await db
      .select()
      .from(careerPaths)
      .where(eq(careerPaths.userId, userId))
      .orderBy(desc(careerPaths.createdAt));
  }

  async updateCareerPath(id: number, updates: Partial<CareerPath>): Promise<CareerPath | undefined> {
    const [careerPath] = await db
      .update(careerPaths)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(careerPaths.id, id))
      .returning();
    return careerPath || undefined;
  }

  // Resource operations
  async createResource(resourceData: Omit<Resource, 'id' | 'createdAt'>): Promise<Resource> {
    const [resource] = await db
      .insert(resources)
      .values(resourceData)
      .returning();
    return resource;
  }

  async getResourcesByTags(tags: string[]): Promise<Resource[]> {
    // This is a simplified implementation - in production, you'd want more sophisticated tag matching
    return await db
      .select()
      .from(resources)
      .orderBy(desc(resources.rating));
  }

  async searchResources(query: string): Promise<Resource[]> {
    // This is a simplified implementation - in production, you'd want full-text search
    return await db
      .select()
      .from(resources)
      .orderBy(desc(resources.rating));
  }

  // Path step operations
  async createPathStep(stepData: Omit<PathStep, 'id' | 'createdAt'>): Promise<PathStep> {
    const [pathStep] = await db
      .insert(pathSteps)
      .values(stepData)
      .returning();
    return pathStep;
  }

  async getPathSteps(pathId: number): Promise<PathStep[]> {
    return await db
      .select()
      .from(pathSteps)
      .where(eq(pathSteps.pathId, pathId))
      .orderBy(asc(pathSteps.stepOrder));
  }

  async updatePathStep(id: number, updates: Partial<PathStep>): Promise<PathStep | undefined> {
    const [pathStep] = await db
      .update(pathSteps)
      .set(updates)
      .where(eq(pathSteps.id, id))
      .returning();
    return pathStep || undefined;
  }

  // Conversation operations
  async createConversation(userId: number, conversationData: Omit<Conversation, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Conversation> {
    const [conversation] = await db
      .insert(conversations)
      .values({ ...conversationData, userId })
      .returning();
    return conversation;
  }

  async getUserConversations(userId: number): Promise<Conversation[]> {
    return await db
      .select()
      .from(conversations)
      .where(eq(conversations.userId, userId))
      .orderBy(desc(conversations.updatedAt));
  }

  async updateConversation(id: number, updates: Partial<Conversation>): Promise<Conversation | undefined> {
    const [conversation] = await db
      .update(conversations)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(conversations.id, id))
      .returning();
    return conversation || undefined;
  }

  // Portfolio operations
  async createPortfolioProject(userId: number, projectData: Omit<PortfolioProject, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<PortfolioProject> {
    const [project] = await db
      .insert(portfolioProjects)
      .values({ ...projectData, userId })
      .returning();
    return project;
  }

  async getUserPortfolioProjects(userId: number): Promise<PortfolioProject[]> {
    return await db
      .select()
      .from(portfolioProjects)
      .where(eq(portfolioProjects.userId, userId))
      .orderBy(desc(portfolioProjects.createdAt));
  }

  async updatePortfolioProject(id: number, updates: Partial<PortfolioProject>): Promise<PortfolioProject | undefined> {
    const [project] = await db
      .update(portfolioProjects)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(portfolioProjects.id, id))
      .returning();
    return project || undefined;
  }

  // Achievement operations
  async createAchievement(userId: number, achievementData: Omit<Achievement, 'id' | 'userId' | 'unlockedAt'>): Promise<Achievement> {
    const [achievement] = await db
      .insert(achievements)
      .values({ ...achievementData, userId })
      .returning();
    return achievement;
  }

  async getUserAchievements(userId: number): Promise<Achievement[]> {
    return await db
      .select()
      .from(achievements)
      .where(eq(achievements.userId, userId))
      .orderBy(desc(achievements.unlockedAt));
  }

  // Analytics operations
  async createLearningAnalytics(userId: number, analyticsData: Omit<LearningAnalytics, 'id' | 'userId' | 'date'>): Promise<LearningAnalytics> {
    const [analytics] = await db
      .insert(learningAnalytics)
      .values({ ...analyticsData, userId })
      .returning();
    return analytics;
  }

  async getUserLearningAnalytics(userId: number, days: number = 30): Promise<LearningAnalytics[]> {
    return await db
      .select()
      .from(learningAnalytics)
      .where(eq(learningAnalytics.userId, userId))
      .orderBy(desc(learningAnalytics.date))
      .limit(days);
  }
}

export const storage = new DatabaseStorage();

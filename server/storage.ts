import * as schema from "@shared/schema";
import mongoose from 'mongoose';

export interface IStorage {
  // User operations
  getUser(id: number | string): Promise<schema.User | undefined>;
  getUserByUsername(username: string): Promise<schema.User | undefined>;
  getUserByEmail(email: string): Promise<schema.User | undefined>;
  createUser(user: schema.InsertUser): Promise<schema.User>;
  updateUser(id: number | string, updates: Partial<schema.User>): Promise<schema.User | undefined>;
  
  // Career path operations
  createCareerPath(userId: number | string, pathData: Omit<schema.CareerPath, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<schema.CareerPath>;
  getUserCareerPaths(userId: number | string): Promise<schema.CareerPath[]>;
  updateCareerPath(id: number | string, updates: Partial<schema.CareerPath>): Promise<schema.CareerPath | undefined>;
  
  // Resource operations
  createResource(resourceData: Omit<schema.Resource, 'id' | 'createdAt'>): Promise<schema.Resource>;
  getResourcesByTags(tags: string[]): Promise<schema.Resource[]>;
  searchResources(query: string): Promise<schema.Resource[]>;
  
  // Path step operations
  createPathStep(stepData: Omit<schema.PathStep, 'id' | 'createdAt'>): Promise<schema.PathStep>;
  getPathSteps(pathId: number | string): Promise<schema.PathStep[]>;
  updatePathStep(id: number | string, updates: Partial<schema.PathStep>): Promise<schema.PathStep | undefined>;
  
  // Conversation operations
  createConversation(userId: number | string, conversationData: Omit<schema.Conversation, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<schema.Conversation>;
  getUserConversations(userId: number | string): Promise<schema.Conversation[]>;
  updateConversation(id: number | string, updates: Partial<schema.Conversation>): Promise<schema.Conversation | undefined>;
  
  // Portfolio operations
  createPortfolioProject(userId: number | string, projectData: Omit<schema.PortfolioProject, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<schema.PortfolioProject>;
  getUserPortfolioProjects(userId: number | string): Promise<schema.PortfolioProject[]>;
  updatePortfolioProject(id: number | string, updates: Partial<schema.PortfolioProject>): Promise<schema.PortfolioProject | undefined>;
  
  // Achievement operations
  createAchievement(userId: number | string, achievementData: Omit<schema.Achievement, 'id' | 'userId' | 'unlockedAt'>): Promise<schema.Achievement>;
  getUserAchievements(userId: number | string): Promise<schema.Achievement[]>;
  
  // Analytics operations
  createLearningAnalytics(userId: number | string, analyticsData: Omit<schema.LearningAnalytics, 'id' | 'userId' | 'date'>): Promise<schema.LearningAnalytics>;
  getUserLearningAnalytics(userId: number | string, days?: number): Promise<schema.LearningAnalytics[]>;
}

export class MongoDBStorage implements IStorage {
  // User operations
  async getUser(id: number | string): Promise<schema.User | undefined> {
    try {
      const user = await schema.User.findById(id);
      return user || undefined;
    } catch (error) {
      console.error('Error getting user:', error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<schema.User | undefined> {
    try {
      const user = await schema.User.findOne({ username });
      return user || undefined;
    } catch (error) {
      console.error('Error getting user by username:', error);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<schema.User | undefined> {
    try {
      const user = await schema.User.findOne({ email });
      return user || undefined;
    } catch (error) {
      console.error('Error getting user by email:', error);
      return undefined;
    }
  }

  async createUser(insertUser: schema.InsertUser): Promise<schema.User> {
    try {
      const user = new schema.User(insertUser);
      return await user.save();
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async updateUser(id: number | string, updates: Partial<schema.User>): Promise<schema.User | undefined> {
    try {
      const user = await schema.User.findByIdAndUpdate(
        id,
        { ...updates, updatedAt: new Date() },
        { new: true }
      );
      return user || undefined;
    } catch (error) {
      console.error('Error updating user:', error);
      return undefined;
    }
  }

  // Career path operations
  async createCareerPath(userId: number | string, pathData: any): Promise<schema.CareerPath> {
    try {
      const careerPath = new schema.CareerPath({
        ...pathData,
        userId: new mongoose.Types.ObjectId(userId.toString())
      });
      return await careerPath.save();
    } catch (error) {
      console.error('Error creating career path:', error);
      throw error;
    }
  }

  async getUserCareerPaths(userId: number | string): Promise<schema.CareerPath[]> {
    try {
      return await schema.CareerPath.find({ 
        userId: new mongoose.Types.ObjectId(userId.toString()) 
      }).sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error getting user career paths:', error);
      return [];
    }
  }

  async updateCareerPath(id: number | string, updates: Partial<schema.CareerPath>): Promise<schema.CareerPath | undefined> {
    try {
      const careerPath = await schema.CareerPath.findByIdAndUpdate(
        id,
        { ...updates, updatedAt: new Date() },
        { new: true }
      );
      return careerPath || undefined;
    } catch (error) {
      console.error('Error updating career path:', error);
      return undefined;
    }
  }

  // Resource operations
  async createResource(resourceData: any): Promise<schema.Resource> {
    try {
      const resource = new schema.Resource(resourceData);
      return await resource.save();
    } catch (error) {
      console.error('Error creating resource:', error);
      throw error;
    }
  }

  async getResourcesByTags(tags: string[]): Promise<schema.Resource[]> {
    try {
      // Simplified implementation - in production, you'd want more sophisticated tag matching
      return await schema.Resource.find({ tags: { $in: tags } }).sort({ rating: -1 });
    } catch (error) {
      console.error('Error getting resources by tags:', error);
      return [];
    }
  }

  async searchResources(query: string): Promise<schema.Resource[]> {
    try {
      // Basic text search - in production, you'd want to use MongoDB text indexes
      const regex = new RegExp(query, 'i');
      return await schema.Resource.find({
        $or: [
          { title: regex },
          { description: regex }
        ]
      }).sort({ rating: -1 });
    } catch (error) {
      console.error('Error searching resources:', error);
      return [];
    }
  }

  // Path step operations
  async createPathStep(stepData: any): Promise<schema.PathStep> {
    try {
      const pathStep = new schema.PathStep({
        ...stepData,
        pathId: new mongoose.Types.ObjectId(stepData.pathId.toString()),
        resourceId: new mongoose.Types.ObjectId(stepData.resourceId.toString())
      });
      return await pathStep.save();
    } catch (error) {
      console.error('Error creating path step:', error);
      throw error;
    }
  }

  async getPathSteps(pathId: number | string): Promise<schema.PathStep[]> {
    try {
      return await schema.PathStep.find({
        pathId: new mongoose.Types.ObjectId(pathId.toString())
      }).sort({ stepOrder: 1 });
    } catch (error) {
      console.error('Error getting path steps:', error);
      return [];
    }
  }

  async updatePathStep(id: number | string, updates: Partial<schema.PathStep>): Promise<schema.PathStep | undefined> {
    try {
      const pathStep = await schema.PathStep.findByIdAndUpdate(
        id,
        updates,
        { new: true }
      );
      return pathStep || undefined;
    } catch (error) {
      console.error('Error updating path step:', error);
      return undefined;
    }
  }

  // Conversation operations
  async createConversation(userId: number | string, conversationData: any): Promise<schema.Conversation> {
    try {
      const conversation = new schema.Conversation({
        ...conversationData,
        userId: new mongoose.Types.ObjectId(userId.toString())
      });
      return await conversation.save();
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }

  async getUserConversations(userId: number | string): Promise<schema.Conversation[]> {
    try {
      return await schema.Conversation.find({
        userId: new mongoose.Types.ObjectId(userId.toString())
      }).sort({ updatedAt: -1 });
    } catch (error) {
      console.error('Error getting user conversations:', error);
      return [];
    }
  }

  async updateConversation(id: number | string, updates: Partial<schema.Conversation>): Promise<schema.Conversation | undefined> {
    try {
      const conversation = await schema.Conversation.findByIdAndUpdate(
        id,
        { ...updates, updatedAt: new Date() },
        { new: true }
      );
      return conversation || undefined;
    } catch (error) {
      console.error('Error updating conversation:', error);
      return undefined;
    }
  }

  // Portfolio operations
  async createPortfolioProject(userId: number | string, projectData: any): Promise<schema.PortfolioProject> {
    try {
      const project = new schema.PortfolioProject({
        ...projectData,
        userId: new mongoose.Types.ObjectId(userId.toString())
      });
      return await project.save();
    } catch (error) {
      console.error('Error creating portfolio project:', error);
      throw error;
    }
  }

  async getUserPortfolioProjects(userId: number | string): Promise<schema.PortfolioProject[]> {
    try {
      return await schema.PortfolioProject.find({
        userId: new mongoose.Types.ObjectId(userId.toString())
      }).sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error getting user portfolio projects:', error);
      return [];
    }
  }

  async updatePortfolioProject(id: number | string, updates: Partial<schema.PortfolioProject>): Promise<schema.PortfolioProject | undefined> {
    try {
      const project = await schema.PortfolioProject.findByIdAndUpdate(
        id,
        { ...updates, updatedAt: new Date() },
        { new: true }
      );
      return project || undefined;
    } catch (error) {
      console.error('Error updating portfolio project:', error);
      return undefined;
    }
  }

  // Achievement operations
  async createAchievement(userId: number | string, achievementData: any): Promise<schema.Achievement> {
    try {
      const achievement = new schema.Achievement({
        ...achievementData,
        userId: new mongoose.Types.ObjectId(userId.toString())
      });
      return await achievement.save();
    } catch (error) {
      console.error('Error creating achievement:', error);
      throw error;
    }
  }

  async getUserAchievements(userId: number | string): Promise<schema.Achievement[]> {
    try {
      return await schema.Achievement.find({
        userId: new mongoose.Types.ObjectId(userId.toString())
      }).sort({ unlockedAt: -1 });
    } catch (error) {
      console.error('Error getting user achievements:', error);
      return [];
    }
  }

  // Analytics operations
  async createLearningAnalytics(userId: number | string, analyticsData: any): Promise<schema.LearningAnalytics> {
    try {
      const analytics = new schema.LearningAnalytics({
        ...analyticsData,
        userId: new mongoose.Types.ObjectId(userId.toString())
      });
      return await analytics.save();
    } catch (error) {
      console.error('Error creating learning analytics:', error);
      throw error;
    }
  }

  async getUserLearningAnalytics(userId: number | string, days: number = 30): Promise<schema.LearningAnalytics[]> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      return await schema.LearningAnalytics.find({
        userId: new mongoose.Types.ObjectId(userId.toString()),
        date: { $gte: cutoffDate }
      }).sort({ date: -1 }).limit(days);
    } catch (error) {
      console.error('Error getting user learning analytics:', error);
      return [];
    }
  }
}

export const storage = new MongoDBStorage();
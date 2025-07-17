import mongoose, { Schema, Document, Model } from 'mongoose';

// User schema
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  currentGoal?: string;
  learningStyle?: string;
  skillLevel?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: String,
  lastName: String,
  profileImage: String,
  currentGoal: String,
  learningStyle: String,
  skillLevel: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Career paths schema
export interface ICareerPath extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  targetRole?: string;
  estimatedDuration?: number;
  difficulty?: string;
  skills?: any;
  roadmapData?: any;
  progress: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const careerPathSchema = new Schema<ICareerPath>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: String,
  targetRole: String,
  estimatedDuration: Number,
  difficulty: String,
  skills: Schema.Types.Mixed,
  roadmapData: Schema.Types.Mixed,
  progress: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Learning resources schema
export interface IResource extends Document {
  title: string;
  description?: string;
  url: string;
  type: string;
  difficulty?: string;
  estimatedTime?: number;
  tags?: any;
  rating?: number;
  metadata?: any;
  createdAt: Date;
}

const resourceSchema = new Schema<IResource>({
  title: { type: String, required: true },
  description: String,
  url: { type: String, required: true },
  type: { type: String, required: true },
  difficulty: String,
  estimatedTime: Number,
  tags: Schema.Types.Mixed,
  rating: Number,
  metadata: Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now }
});

// Path steps schema
export interface IPathStep extends Document {
  pathId: mongoose.Types.ObjectId;
  resourceId: mongoose.Types.ObjectId;
  stepOrder: number;
  isCompleted: boolean;
  completedAt?: Date;
  notes?: string;
  createdAt: Date;
}

const pathStepSchema = new Schema<IPathStep>({
  pathId: { type: Schema.Types.ObjectId, ref: 'CareerPath', required: true },
  resourceId: { type: Schema.Types.ObjectId, ref: 'Resource', required: true },
  stepOrder: { type: Number, required: true },
  isCompleted: { type: Boolean, default: false },
  completedAt: Date,
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

// Conversation schema
export interface IConversation extends Document {
  userId: mongoose.Types.ObjectId;
  title?: string;
  messages: any;
  context?: any;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: String,
  messages: Schema.Types.Mixed,
  context: Schema.Types.Mixed,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Portfolio projects schema
export interface IPortfolioProject extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  githubUrl?: string;
  liveUrl?: string;
  technologies?: any;
  images?: any;
  featured: boolean;
  skillsProven?: any;
  aiEvaluation?: any;
  verificationStatus?: string;
  createdAt: Date;
  updatedAt: Date;
}

const portfolioProjectSchema = new Schema<IPortfolioProject>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: String,
  githubUrl: String,
  liveUrl: String,
  technologies: Schema.Types.Mixed,
  images: Schema.Types.Mixed,
  featured: { type: Boolean, default: false },
  skillsProven: Schema.Types.Mixed,
  aiEvaluation: Schema.Types.Mixed,
  verificationStatus: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Achievements schema
export interface IAchievement extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  type?: string;
  data?: any;
  unlockedAt: Date;
}

const achievementSchema = new Schema<IAchievement>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: String,
  type: String,
  data: Schema.Types.Mixed,
  unlockedAt: { type: Date, default: Date.now }
});

// Learning analytics schema
export interface ILearningAnalytics extends Document {
  userId: mongoose.Types.ObjectId;
  date: Date;
  resourcesCompleted: number;
  timeSpent: number;
  skillsImproved?: any;
  efficiency?: number;
  streakDays: number;
  weeklyGoalProgress: number;
}

const learningAnalyticsSchema = new Schema<ILearningAnalytics>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  resourcesCompleted: { type: Number, default: 0 },
  timeSpent: { type: Number, default: 0 },
  skillsImproved: Schema.Types.Mixed,
  efficiency: Number,
  streakDays: { type: Number, default: 0 },
  weeklyGoalProgress: { type: Number, default: 0 }
});

// Create models
export const User = mongoose.model<IUser>('User', userSchema);
export const CareerPath = mongoose.model<ICareerPath>('CareerPath', careerPathSchema);
export const Resource = mongoose.model<IResource>('Resource', resourceSchema);
export const PathStep = mongoose.model<IPathStep>('PathStep', pathStepSchema);
export const Conversation = mongoose.model<IConversation>('Conversation', conversationSchema);
export const PortfolioProject = mongoose.model<IPortfolioProject>('PortfolioProject', portfolioProjectSchema);
export const Achievement = mongoose.model<IAchievement>('Achievement', achievementSchema);
export const LearningAnalytics = mongoose.model<ILearningAnalytics>('LearningAnalytics', learningAnalyticsSchema);

// Type definitions for insertion
export type InsertUser = Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>;
export type User = IUser;
export type CareerPath = ICareerPath;
export type Resource = IResource;
export type PathStep = IPathStep;
export type Conversation = IConversation;
export type PortfolioProject = IPortfolioProject;
export type Achievement = IAchievement;
export type LearningAnalytics = ILearningAnalytics;
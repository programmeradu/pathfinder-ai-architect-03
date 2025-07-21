/**
 * Career Trajectory Prediction Model
 * Advanced ML model for predicting career progression paths
 */

import { logger } from '@/lib/logger';
import { databaseManager } from '@/services/database/DatabaseManager';
import type { UserProfile } from '@/types';

export interface CareerStep {
  role: string;
  level: string;
  industry: string;
  skills: string[];
  experience: number;
  salary: number;
  probability: number;
  timeframe: string;
}

export interface CareerTrajectory {
  id: string;
  userId: string;
  currentStep: CareerStep;
  predictedSteps: CareerStep[];
  confidence: number;
  factors: string[];
  alternatives: CareerTrajectory[];
  generatedAt: Date;
}

export interface TrajectoryPredictionInput {
  currentRole: string;
  experience: number;
  skills: string[];
  education: string[];
  industry: string;
  location: string;
  goals: string[];
  preferences: {
    workStyle: string;
    salaryImportance: number;
    growthImportance: number;
    stabilityImportance: number;
  };
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  trainingLoss: number;
  validationLoss: number;
  lastUpdated: Date;
}

// Mock transformer-based model implementation
class TransformerCareerModel {
  private modelVersion = 'v2.1.0';
  private isLoaded = false;
  private weights: Map<string, number[]> = new Map();
  private vocabulary: Map<string, number> = new Map();
  private metrics: ModelMetrics;

  constructor() {
    this.metrics = {
      accuracy: 0.87,
      precision: 0.85,
      recall: 0.89,
      f1Score: 0.87,
      trainingLoss: 0.23,
      validationLoss: 0.28,
      lastUpdated: new Date(),
    };
    
    this.initializeModel();
  }

  private async initializeModel(): Promise<void> {
    logger.info('Initializing Career Trajectory Model', {
      component: 'CareerTrajectoryModel',
      action: 'initialize',
      metadata: { version: this.modelVersion },
    });

    try {
      // Mock model loading - in production, this would load actual model weights
      await this.loadVocabulary();
      await this.loadWeights();
      
      this.isLoaded = true;
      
      logger.info('Career Trajectory Model loaded successfully', {
        component: 'CareerTrajectoryModel',
        action: 'loaded',
        metadata: { 
          version: this.modelVersion,
          vocabularySize: this.vocabulary.size,
          accuracy: this.metrics.accuracy,
        },
      });
    } catch (error) {
      logger.error('Failed to load Career Trajectory Model', {
        component: 'CareerTrajectoryModel',
        action: 'load_error',
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
      });
    }
  }

  private async loadVocabulary(): Promise<void> {
    // Mock vocabulary loading
    const commonTerms = [
      'software', 'engineer', 'developer', 'senior', 'junior', 'lead', 'manager',
      'director', 'architect', 'analyst', 'scientist', 'researcher', 'consultant',
      'javascript', 'python', 'react', 'node', 'aws', 'docker', 'kubernetes',
      'machine', 'learning', 'data', 'science', 'artificial', 'intelligence',
      'frontend', 'backend', 'fullstack', 'devops', 'cloud', 'mobile', 'web',
      'startup', 'enterprise', 'fintech', 'healthcare', 'education', 'ecommerce',
    ];

    commonTerms.forEach((term, index) => {
      this.vocabulary.set(term, index);
    });
  }

  private async loadWeights(): Promise<void> {
    // Mock weight loading - in production, this would load actual neural network weights
    const layerNames = ['embedding', 'encoder_1', 'encoder_2', 'decoder', 'output'];
    
    layerNames.forEach(layerName => {
      const weights = Array.from({ length: 512 }, () => Math.random() * 2 - 1);
      this.weights.set(layerName, weights);
    });
  }

  async predict(input: TrajectoryPredictionInput): Promise<CareerTrajectory> {
    if (!this.isLoaded) {
      throw new Error('Model not loaded');
    }

    logger.debug('Predicting career trajectory', {
      component: 'CareerTrajectoryModel',
      action: 'predict',
      metadata: { 
        currentRole: input.currentRole,
        experience: input.experience,
        skillCount: input.skills.length,
      },
    });

    const startTime = performance.now();

    try {
      // Encode input features
      const encodedInput = this.encodeInput(input);
      
      // Run through transformer layers
      const hiddenStates = this.forwardPass(encodedInput);
      
      // Decode predictions
      const predictions = this.decodePredictions(hiddenStates, input);
      
      // Generate trajectory
      const trajectory = this.generateTrajectory(predictions, input);
      
      const processingTime = performance.now() - startTime;
      
      logger.info('Career trajectory predicted', {
        component: 'CareerTrajectoryModel',
        action: 'prediction_complete',
        metadata: { 
          trajectoryId: trajectory.id,
          confidence: trajectory.confidence,
          stepsCount: trajectory.predictedSteps.length,
          processingTime,
        },
      });

      return trajectory;
    } catch (error) {
      logger.error('Career trajectory prediction failed', {
        component: 'CareerTrajectoryModel',
        action: 'prediction_error',
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
      });
      throw error;
    }
  }

  private encodeInput(input: TrajectoryPredictionInput): number[] {
    // Mock input encoding - convert text to numerical features
    const features: number[] = [];
    
    // Encode role
    const roleTokens = input.currentRole.toLowerCase().split(' ');
    roleTokens.forEach(token => {
      const tokenId = this.vocabulary.get(token) || 0;
      features.push(tokenId);
    });
    
    // Encode experience (normalized)
    features.push(Math.min(input.experience / 20, 1.0));
    
    // Encode skills
    input.skills.forEach(skill => {
      const skillTokens = skill.toLowerCase().split(' ');
      skillTokens.forEach(token => {
        const tokenId = this.vocabulary.get(token) || 0;
        features.push(tokenId / this.vocabulary.size);
      });
    });
    
    // Encode preferences
    features.push(input.preferences.salaryImportance / 10);
    features.push(input.preferences.growthImportance / 10);
    features.push(input.preferences.stabilityImportance / 10);
    
    // Pad or truncate to fixed size
    const targetSize = 128;
    while (features.length < targetSize) {
      features.push(0);
    }
    
    return features.slice(0, targetSize);
  }

  private forwardPass(input: number[]): number[] {
    // Mock transformer forward pass
    let hiddenState = [...input];
    
    // Apply attention and feed-forward layers
    for (let layer = 0; layer < 3; layer++) {
      hiddenState = this.applyAttention(hiddenState);
      hiddenState = this.applyFeedForward(hiddenState);
    }
    
    return hiddenState;
  }

  private applyAttention(input: number[]): number[] {
    // Mock self-attention mechanism
    return input.map((value, index) => {
      const attention = Math.exp(value) / input.reduce((sum, v) => sum + Math.exp(v), 0);
      return value * attention;
    });
  }

  private applyFeedForward(input: number[]): number[] {
    // Mock feed-forward network
    return input.map(value => Math.tanh(value * 1.5 + 0.1));
  }

  private decodePredictions(hiddenStates: number[], input: TrajectoryPredictionInput): any {
    // Mock prediction decoding
    const predictions = {
      nextRoles: this.predictNextRoles(hiddenStates, input),
      salaryGrowth: this.predictSalaryGrowth(hiddenStates, input),
      skillProgression: this.predictSkillProgression(hiddenStates, input),
      timeframes: this.predictTimeframes(hiddenStates, input),
    };
    
    return predictions;
  }

  private predictNextRoles(hiddenStates: number[], input: TrajectoryPredictionInput): Array<{role: string, probability: number}> {
    // Mock role prediction based on current role and experience
    const baseRoles = [
      'Senior Software Engineer',
      'Lead Developer',
      'Engineering Manager',
      'Principal Engineer',
      'Director of Engineering',
      'VP of Engineering',
      'CTO',
    ];
    
    const currentLevel = this.getCurrentLevel(input.currentRole);
    const nextLevelRoles = baseRoles.slice(currentLevel, currentLevel + 3);
    
    return nextLevelRoles.map((role, index) => ({
      role,
      probability: Math.max(0.1, 0.9 - index * 0.2 + Math.random() * 0.1),
    }));
  }

  private predictSalaryGrowth(hiddenStates: number[], input: TrajectoryPredictionInput): number[] {
    // Mock salary growth prediction
    const baseSalary = this.estimateCurrentSalary(input);
    const growthRates = [0.1, 0.15, 0.12, 0.08, 0.06]; // Annual growth rates
    
    return growthRates.map((rate, index) => baseSalary * Math.pow(1 + rate, index + 1));
  }

  private predictSkillProgression(hiddenStates: number[], input: TrajectoryPredictionInput): string[] {
    // Mock skill progression prediction
    const recommendedSkills = [
      'Leadership',
      'System Design',
      'Architecture',
      'Team Management',
      'Strategic Planning',
      'Product Management',
      'Business Development',
    ];
    
    return recommendedSkills.slice(0, 3 + Math.floor(Math.random() * 3));
  }

  private predictTimeframes(hiddenStates: number[], input: TrajectoryPredictionInput): string[] {
    return ['1-2 years', '2-4 years', '4-6 years', '6-8 years', '8-10 years'];
  }

  private generateTrajectory(predictions: any, input: TrajectoryPredictionInput): CareerTrajectory {
    const trajectoryId = `trajectory-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const currentStep: CareerStep = {
      role: input.currentRole,
      level: this.getCurrentLevel(input.currentRole).toString(),
      industry: input.industry,
      skills: input.skills,
      experience: input.experience,
      salary: this.estimateCurrentSalary(input),
      probability: 1.0,
      timeframe: 'current',
    };

    const predictedSteps: CareerStep[] = predictions.nextRoles.map((roleData: any, index: number) => ({
      role: roleData.role,
      level: (this.getCurrentLevel(input.currentRole) + index + 1).toString(),
      industry: input.industry,
      skills: [...input.skills, ...predictions.skillProgression.slice(0, index + 1)],
      experience: input.experience + (index + 1) * 2,
      salary: predictions.salaryGrowth[index] || currentStep.salary * 1.2,
      probability: roleData.probability,
      timeframe: predictions.timeframes[index] || `${index + 1}-${index + 3} years`,
    }));

    const trajectory: CareerTrajectory = {
      id: trajectoryId,
      userId: 'current-user', // Would be actual user ID
      currentStep,
      predictedSteps,
      confidence: this.calculateConfidence(predictions),
      factors: this.identifyFactors(input, predictions),
      alternatives: [], // Would generate alternative paths
      generatedAt: new Date(),
    };

    return trajectory;
  }

  private getCurrentLevel(role: string): number {
    const levelKeywords = [
      ['intern', 'junior', 'entry'],
      ['developer', 'engineer', 'analyst'],
      ['senior', 'sr'],
      ['lead', 'principal', 'staff'],
      ['manager', 'director'],
      ['vp', 'vice president', 'cto', 'ceo'],
    ];
    
    const lowerRole = role.toLowerCase();
    
    for (let level = levelKeywords.length - 1; level >= 0; level--) {
      if (levelKeywords[level].some(keyword => lowerRole.includes(keyword))) {
        return level;
      }
    }
    
    return 1; // Default to mid-level
  }

  private estimateCurrentSalary(input: TrajectoryPredictionInput): number {
    // Mock salary estimation based on role, experience, and location
    const baseSalaries: Record<string, number> = {
      'software engineer': 95000,
      'senior software engineer': 130000,
      'lead developer': 150000,
      'engineering manager': 170000,
      'director': 200000,
    };
    
    const roleKey = Object.keys(baseSalaries).find(key => 
      input.currentRole.toLowerCase().includes(key)
    ) || 'software engineer';
    
    const baseSalary = baseSalaries[roleKey];
    const experienceMultiplier = 1 + (input.experience * 0.05);
    const locationMultiplier = input.location.includes('San Francisco') ? 1.3 : 1.0;
    
    return Math.round(baseSalary * experienceMultiplier * locationMultiplier);
  }

  private calculateConfidence(predictions: any): number {
    // Mock confidence calculation
    const avgProbability = predictions.nextRoles.reduce((sum: number, role: any) => sum + role.probability, 0) / predictions.nextRoles.length;
    return Math.min(0.95, Math.max(0.6, avgProbability + Math.random() * 0.1));
  }

  private identifyFactors(input: TrajectoryPredictionInput, predictions: any): string[] {
    const factors = [];
    
    if (input.experience > 5) {
      factors.push('Strong experience foundation');
    }
    
    if (input.skills.length > 8) {
      factors.push('Diverse skill set');
    }
    
    if (input.preferences.growthImportance > 7) {
      factors.push('High growth orientation');
    }
    
    if (input.education.some(edu => edu.toLowerCase().includes('master'))) {
      factors.push('Advanced education');
    }
    
    factors.push('Market demand trends', 'Industry growth patterns');
    
    return factors;
  }

  getModelMetrics(): ModelMetrics {
    return { ...this.metrics };
  }

  async updateModel(trainingData: any[]): Promise<void> {
    logger.info('Updating Career Trajectory Model', {
      component: 'CareerTrajectoryModel',
      action: 'update_model',
      metadata: { trainingDataSize: trainingData.length },
    });

    // Mock model update
    this.metrics.lastUpdated = new Date();
    this.metrics.accuracy = Math.min(0.95, this.metrics.accuracy + 0.01);
  }
}

// Main Career Trajectory Service
export class CareerTrajectoryService {
  private model: TransformerCareerModel;
  private cache: Map<string, CareerTrajectory> = new Map();

  constructor() {
    this.model = new TransformerCareerModel();
  }

  async predictTrajectory(userProfile: UserProfile): Promise<CareerTrajectory> {
    const cacheKey = this.generateCacheKey(userProfile);
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      if (Date.now() - cached.generatedAt.getTime() < 24 * 60 * 60 * 1000) { // 24 hours
        return cached;
      }
    }

    const input: TrajectoryPredictionInput = {
      currentRole: userProfile.currentRole || 'Software Engineer',
      experience: userProfile.experience || 0,
      skills: userProfile.skills?.map(s => s.name) || [],
      education: userProfile.education?.map(e => e.degree) || [],
      industry: userProfile.industry || 'Technology',
      location: userProfile.location || 'United States',
      goals: userProfile.careerGoals || [],
      preferences: {
        workStyle: userProfile.workStyle || 'flexible',
        salaryImportance: 7,
        growthImportance: 8,
        stabilityImportance: 6,
      },
    };

    const trajectory = await this.model.predict(input);
    
    // Cache result
    this.cache.set(cacheKey, trajectory);
    
    // Store in database
    await this.storeTrajectory(trajectory);
    
    return trajectory;
  }

  private generateCacheKey(userProfile: UserProfile): string {
    return `${userProfile.id}-${userProfile.currentRole}-${userProfile.experience}-${userProfile.skills?.length || 0}`;
  }

  private async storeTrajectory(trajectory: CareerTrajectory): Promise<void> {
    try {
      await databaseManager.storeUserProfile({
        type: 'career_trajectory',
        user_id: trajectory.userId,
        trajectory_id: trajectory.id,
        current_step: JSON.stringify(trajectory.currentStep),
        predicted_steps: JSON.stringify(trajectory.predictedSteps),
        confidence: trajectory.confidence,
        factors: JSON.stringify(trajectory.factors),
        generated_at: trajectory.generatedAt,
      });
    } catch (error) {
      logger.error('Failed to store career trajectory', {
        component: 'CareerTrajectoryService',
        action: 'store_trajectory',
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
      });
    }
  }

  getModelMetrics(): ModelMetrics {
    return this.model.getModelMetrics();
  }

  async retrainModel(): Promise<void> {
    // In production, this would fetch training data and retrain the model
    logger.info('Retraining career trajectory model', {
      component: 'CareerTrajectoryService',
      action: 'retrain_model',
    });
    
    await this.model.updateModel([]);
  }
}

// Singleton instance
export const careerTrajectoryService = new CareerTrajectoryService();

export default careerTrajectoryService;

/**
 * Advanced Application Configuration
 * Centralized configuration management for Pathfinder AI
 */

export interface APIEndpoints {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  mlModels: {
    careerDNA: string;
    opportunityOracle: string;
    skillGraph: string;
    cultureMatch: string;
    careerSimulator: string;
  };
  external: {
    bls: string;
    onet: string;
    linkedin: string;
    github: string;
    glassdoor: string;
    immigration: string;
  };
}

export interface FeatureFlags {
  realTimeAnalysis: boolean;
  advancedVisualization: boolean;
  aiTransparency: boolean;
  mobileOptimization: boolean;
  internationalData: boolean;
  careerSimulation: boolean;
  personalityAssessment: boolean;
  resumeAnalysis: boolean;
}

export interface MLModelConfig {
  careerTrajectory: {
    modelVersion: string;
    confidenceThreshold: number;
    maxPredictionYears: number;
  };
  skillDemand: {
    forecastHorizon: number;
    updateFrequency: string;
    geographicScope: string[];
  };
  personalityFit: {
    assessmentQuestions: number;
    matchingAlgorithm: string;
    culturalFactors: string[];
  };
  resumeMatching: {
    similarityThreshold: number;
    skillWeighting: number;
    experienceWeighting: number;
  };
  learningPath: {
    adaptivePersonalization: boolean;
    progressTracking: boolean;
    difficultyAdjustment: boolean;
  };
}

export interface DatabaseConfig {
  vector: {
    provider: string;
    dimensions: number;
    indexType: string;
  };
  timeSeries: {
    retention: string;
    aggregationLevels: string[];
  };
  graph: {
    nodeTypes: string[];
    relationshipTypes: string[];
  };
  relational: {
    connectionPool: number;
    queryTimeout: number;
  };
}

export interface SecurityConfig {
  encryption: {
    algorithm: string;
    keyRotation: string;
  };
  authentication: {
    sessionTimeout: number;
    mfaRequired: boolean;
    passwordPolicy: {
      minLength: number;
      requireSpecialChars: boolean;
      requireNumbers: boolean;
    };
  };
  dataPrivacy: {
    anonymization: boolean;
    retentionPeriod: string;
    gdprCompliant: boolean;
  };
}

export interface PerformanceConfig {
  caching: {
    ttl: number;
    maxSize: string;
    strategy: string;
  };
  bundling: {
    chunkSize: string;
    lazyLoading: boolean;
    preloading: string[];
  };
  monitoring: {
    errorTracking: boolean;
    performanceMetrics: boolean;
    userAnalytics: boolean;
  };
}

// Environment-specific configurations
const getEnvironmentConfig = (): Partial<AppConfig> => {
  const env = import.meta.env.MODE;
  
  switch (env) {
    case 'development':
      return {
        api: {
          baseUrl: 'http://localhost:3001',
          timeout: 10000,
          retryAttempts: 2,
        },
        features: {
          realTimeAnalysis: true,
          advancedVisualization: true,
          aiTransparency: true,
          mobileOptimization: false,
          internationalData: true,
          careerSimulation: true,
          personalityAssessment: true,
          resumeAnalysis: true,
        },
        performance: {
          monitoring: {
            errorTracking: true,
            performanceMetrics: true,
            userAnalytics: false,
          },
        },
      };
    
    case 'staging':
      return {
        api: {
          baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://staging-api.pathfinder-ai.com',
          timeout: 15000,
          retryAttempts: 3,
        },
        features: {
          realTimeAnalysis: true,
          advancedVisualization: true,
          aiTransparency: true,
          mobileOptimization: true,
          internationalData: true,
          careerSimulation: true,
          personalityAssessment: true,
          resumeAnalysis: true,
        },
      };
    
    case 'production':
      return {
        api: {
          baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.pathfinder-ai.com',
          timeout: 30000,
          retryAttempts: 3,
        },
        features: {
          realTimeAnalysis: true,
          advancedVisualization: true,
          aiTransparency: true,
          mobileOptimization: true,
          internationalData: true,
          careerSimulation: true,
          personalityAssessment: true,
          resumeAnalysis: true,
        },
        performance: {
          monitoring: {
            errorTracking: true,
            performanceMetrics: true,
            userAnalytics: true,
          },
        },
      };
    
    default:
      return {};
  }
};

export interface AppConfig {
  api: APIEndpoints;
  features: FeatureFlags;
  mlModels: MLModelConfig;
  database: DatabaseConfig;
  security: SecurityConfig;
  performance: PerformanceConfig;
}

// Default configuration
const defaultConfig: AppConfig = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.pathfinder-ai.com',
    timeout: 30000,
    retryAttempts: 3,
    mlModels: {
      careerDNA: '/api/v1/career-dna',
      opportunityOracle: '/api/v1/opportunity-oracle',
      skillGraph: '/api/v1/skill-graph',
      cultureMatch: '/api/v1/culture-match',
      careerSimulator: '/api/v1/career-simulator',
    },
    external: {
      bls: 'https://api.bls.gov/publicAPI/v2',
      onet: 'https://services.onetcenter.org/ws',
      linkedin: 'https://api.linkedin.com/v2',
      github: 'https://api.github.com',
      glassdoor: 'https://api.glassdoor.com/api',
      immigration: 'https://api.immigration.gov',
    },
  },
  features: {
    realTimeAnalysis: true,
    advancedVisualization: true,
    aiTransparency: true,
    mobileOptimization: true,
    internationalData: true,
    careerSimulation: true,
    personalityAssessment: true,
    resumeAnalysis: true,
  },
  mlModels: {
    careerTrajectory: {
      modelVersion: 'v2.1.0',
      confidenceThreshold: 0.75,
      maxPredictionYears: 10,
    },
    skillDemand: {
      forecastHorizon: 24,
      updateFrequency: 'weekly',
      geographicScope: ['US', 'CA', 'UK', 'AU', 'DE', 'FR', 'JP', 'SG'],
    },
    personalityFit: {
      assessmentQuestions: 50,
      matchingAlgorithm: 'neural_collaborative_filtering',
      culturalFactors: ['work_life_balance', 'innovation', 'hierarchy', 'collaboration'],
    },
    resumeMatching: {
      similarityThreshold: 0.8,
      skillWeighting: 0.4,
      experienceWeighting: 0.6,
    },
    learningPath: {
      adaptivePersonalization: true,
      progressTracking: true,
      difficultyAdjustment: true,
    },
  },
  database: {
    vector: {
      provider: 'pinecone',
      dimensions: 1536,
      indexType: 'cosine',
    },
    timeSeries: {
      retention: '2y',
      aggregationLevels: ['1h', '1d', '1w', '1m'],
    },
    graph: {
      nodeTypes: ['skill', 'job', 'company', 'education', 'location'],
      relationshipTypes: ['requires', 'leads_to', 'similar_to', 'located_in'],
    },
    relational: {
      connectionPool: 20,
      queryTimeout: 30000,
    },
  },
  security: {
    encryption: {
      algorithm: 'AES-256-GCM',
      keyRotation: '90d',
    },
    authentication: {
      sessionTimeout: 3600000, // 1 hour
      mfaRequired: false,
      passwordPolicy: {
        minLength: 8,
        requireSpecialChars: true,
        requireNumbers: true,
      },
    },
    dataPrivacy: {
      anonymization: true,
      retentionPeriod: '7y',
      gdprCompliant: true,
    },
  },
  performance: {
    caching: {
      ttl: 300000, // 5 minutes
      maxSize: '100MB',
      strategy: 'lru',
    },
    bundling: {
      chunkSize: '250KB',
      lazyLoading: true,
      preloading: ['dashboard', 'analysis'],
    },
    monitoring: {
      errorTracking: true,
      performanceMetrics: true,
      userAnalytics: true,
    },
  },
};

// Merge default config with environment-specific overrides
export const appConfig: AppConfig = {
  ...defaultConfig,
  ...getEnvironmentConfig(),
} as AppConfig;

// Configuration validation
export const validateConfig = (): boolean => {
  try {
    // Validate required environment variables
    const requiredEnvVars = ['VITE_GEMINI_API_KEY'];
    
    for (const envVar of requiredEnvVars) {
      if (!import.meta.env[envVar]) {
        console.warn(`Missing required environment variable: ${envVar}`);
      }
    }
    
    // Validate API endpoints
    if (!appConfig.api.baseUrl) {
      throw new Error('API base URL is required');
    }
    
    // Validate ML model configuration
    if (appConfig.mlModels.careerTrajectory.confidenceThreshold < 0 || 
        appConfig.mlModels.careerTrajectory.confidenceThreshold > 1) {
      throw new Error('Career trajectory confidence threshold must be between 0 and 1');
    }
    
    return true;
  } catch (error) {
    console.error('Configuration validation failed:', error);
    return false;
  }
};

// Initialize configuration
validateConfig();

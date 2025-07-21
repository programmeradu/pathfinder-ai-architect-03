/**
 * Global Type Definitions for Pathfinder AI
 */

// User Profile Types
export interface UserProfile {
  id: string;
  email?: string;
  name?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Career Information
  currentRole?: string;
  experience?: number;
  industry?: string;
  location?: string;
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  
  // Goals and Preferences
  careerGoals?: string[];
  preferredLocations?: string[];
  workStyle?: 'remote' | 'hybrid' | 'onsite' | 'flexible';
  
  // Skills and Education
  skills?: Skill[];
  education?: Education[];
  certifications?: Certification[];
  
  // Personality and Preferences
  personality?: PersonalityProfile;
  preferences?: UserPreferences;
  
  // Analysis Results
  careerDNA?: CareerDNAResult;
  lastAnalysis?: Date;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience?: number;
  verified?: boolean;
  trending?: boolean;
  demandScore?: number;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: Date;
  endDate?: Date;
  gpa?: number;
  honors?: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: Date;
  expiryDate?: Date;
  credentialId?: string;
  verified?: boolean;
}

export interface PersonalityProfile {
  bigFive?: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  };
  workStyle?: {
    learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
    motivation: 'intrinsic' | 'extrinsic' | 'mixed';
    riskTolerance: 'low' | 'medium' | 'high';
    decisionMaking: 'analytical' | 'intuitive' | 'collaborative';
  };
  values?: string[];
  interests?: string[];
}

export interface UserPreferences {
  notifications: {
    email: boolean;
    push: boolean;
    frequency: 'immediate' | 'daily' | 'weekly';
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'connections';
    dataSharing: boolean;
    analytics: boolean;
  };
  display: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    timezone: string;
  };
}

// Analysis Results Types
export interface AnalysisResults {
  careerFit: number;
  marketDemand: number;
  salaryProjection: SalaryProjection;
  skillGaps: SkillGap[];
  recommendations: Recommendation[];
  confidenceScore: number;
  lastUpdated: Date;
}

export interface SalaryProjection {
  current: number;
  projected1Year: number;
  projected5Year: number;
  projected10Year: number;
  currency: string;
  factors: string[];
}

export interface SkillGap {
  skill: string;
  currentLevel: number;
  requiredLevel: number;
  priority: 'high' | 'medium' | 'low';
  timeToAcquire: number; // in months
  learningResources: LearningResource[];
}

export interface LearningResource {
  id: string;
  title: string;
  provider: string;
  type: 'course' | 'certification' | 'book' | 'tutorial' | 'bootcamp';
  duration: number; // in hours
  cost: number;
  rating: number;
  url: string;
}

export interface Recommendation {
  id: string;
  type: 'career' | 'skill' | 'education' | 'location' | 'company';
  title: string;
  description: string;
  reasoning: string[];
  confidence: number;
  priority: number;
  actionItems: ActionItem[];
  timeline: string;
}

export interface ActionItem {
  id: string;
  description: string;
  type: 'immediate' | 'short_term' | 'long_term';
  estimatedTime: number; // in days
  resources: string[];
  completed?: boolean;
}

// Real-time Data Types
export interface RealTimeData {
  marketTrends: MarketTrend[];
  jobOpportunities: JobOpportunity[];
  skillDemand: SkillDemandData[];
  salaryTrends: SalaryTrend[];
  lastUpdated: Date;
}

export interface MarketTrend {
  id: string;
  industry: string;
  trend: 'growing' | 'stable' | 'declining';
  growthRate: number;
  timeframe: string;
  factors: string[];
  confidence: number;
}

export interface JobOpportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  remote: boolean;
  requiredSkills: string[];
  matchScore: number;
  postedDate: Date;
  applicationDeadline?: Date;
  url: string;
}

export interface SkillDemandData {
  skill: string;
  demand: number; // 0-100 scale
  growth: number; // percentage
  averageSalary: number;
  jobCount: number;
  locations: string[];
  trending: boolean;
}

export interface SalaryTrend {
  role: string;
  location: string;
  experience: string;
  salary: number;
  change: number; // percentage change
  timeframe: string;
}

// ML Model Status Types
export interface ModelStatus {
  modelName: string;
  version: string;
  status: 'active' | 'training' | 'updating' | 'error';
  lastUpdated: Date;
  accuracy: number;
  confidence: number;
  processingTime: number; // in milliseconds
}

// Visualization Data Types
export interface VisualizationData {
  careerPath: CareerPathNode[];
  skillNetwork: SkillNetworkNode[];
  opportunityMap: OpportunityMapData;
  decisionTree: DecisionTreeNode[];
  progressMetrics: ProgressMetric[];
}

export interface CareerPathNode {
  id: string;
  role: string;
  level: number;
  probability: number;
  timeframe: string;
  requirements: string[];
  connections: string[];
}

export interface SkillNetworkNode {
  id: string;
  name: string;
  category: string;
  importance: number;
  connections: SkillConnection[];
  position: { x: number; y: number };
}

export interface SkillConnection {
  targetId: string;
  strength: number;
  type: 'prerequisite' | 'complementary' | 'alternative';
}

export interface OpportunityMapData {
  regions: RegionData[];
  opportunities: GeographicOpportunity[];
  filters: MapFilter[];
}

export interface RegionData {
  id: string;
  name: string;
  coordinates: [number, number];
  opportunityCount: number;
  averageSalary: number;
  costOfLiving: number;
  qualityOfLife: number;
}

export interface GeographicOpportunity {
  id: string;
  location: [number, number];
  title: string;
  company: string;
  salary: number;
  matchScore: number;
}

export interface MapFilter {
  id: string;
  name: string;
  type: 'salary' | 'industry' | 'remote' | 'experience';
  values: string[] | number[];
  active: boolean;
}

export interface DecisionTreeNode {
  id: string;
  question: string;
  options: DecisionOption[];
  level: number;
  confidence: number;
  reasoning: string[];
}

export interface DecisionOption {
  id: string;
  text: string;
  outcome: string;
  probability: number;
  nextNodeId?: string;
}

export interface ProgressMetric {
  id: string;
  name: string;
  current: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  timeframe: string;
}

// Career DNA Types
export interface CareerDNAResult {
  id: string;
  userId: string;
  overallFit: number;
  dimensions: CareerDimension[];
  recommendations: CareerRecommendation[];
  riskFactors: RiskFactor[];
  opportunities: OpportunityArea[];
  generatedAt: Date;
}

export interface CareerDimension {
  name: string;
  score: number;
  description: string;
  factors: string[];
  improvement: string[];
}

export interface CareerRecommendation {
  type: 'role' | 'industry' | 'skill' | 'location';
  title: string;
  description: string;
  fit: number;
  reasoning: string[];
  timeline: string;
}

export interface RiskFactor {
  factor: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  mitigation: string[];
}

export interface OpportunityArea {
  area: string;
  potential: number;
  description: string;
  actionItems: string[];
}

// API Response Types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    timestamp: Date;
    requestId: string;
    processingTime: number;
  };
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  context?: any;
  timestamp: Date;
  userId?: string;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
}

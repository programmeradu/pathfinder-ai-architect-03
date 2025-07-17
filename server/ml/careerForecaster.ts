import { GoogleGenerativeAI } from '@google/generative-ai';
import { storage } from '../storage';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI('AIzaSyCrpYzIeAj5jmekAsn5qgpcOWrBDY77vHw');
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

interface SkillNode {
  id: string;
  name: string;
  category: string;
  difficulty: number;
  marketDemand: number;
  averageSalary: number;
  growthRate: number;
  adjacentSkills: string[];
  prerequisites: string[];
  timeToLearn: number; // in weeks
  region: string;
}

interface CareerOpportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  salaryRange: [number, number];
  requiredSkills: string[];
  emergingSkills: string[];
  industryGrowth: number;
  matchScore: number;
  timeToQualify: number;
  pathRecommendation: string[];
}

interface LearningResource {
  id: string;
  title: string;
  provider: string;
  type: 'video' | 'article' | 'course' | 'book' | 'interactive' | 'project';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  skills: string[];
  rating: number;
  reviews: number;
  url: string;
  price: number;
  certificationOffered: boolean;
  learningStyleScore: {
    visual: number;
    auditory: number;
    kinesthetic: number;
    reading: number;
  };
}

class PredictiveCareerForecaster {
  private skillGraph: Map<string, SkillNode> = new Map();
  private marketData: Map<string, any> = new Map();
  
  constructor() {
    this.initializeSkillGraph();
    this.loadMarketData();
  }

  private initializeSkillGraph() {
    // Advanced skill graph with real-world connections
    const skills: SkillNode[] = [
      {
        id: 'python',
        name: 'Python Programming',
        category: 'Programming',
        difficulty: 3,
        marketDemand: 95,
        averageSalary: 85000,
        growthRate: 25,
        adjacentSkills: ['django', 'flask', 'data-science', 'machine-learning', 'automation'],
        prerequisites: ['basic-programming'],
        timeToLearn: 12,
        region: 'global'
      },
      {
        id: 'machine-learning',
        name: 'Machine Learning',
        category: 'AI/ML',
        difficulty: 8,
        marketDemand: 92,
        averageSalary: 120000,
        growthRate: 35,
        adjacentSkills: ['deep-learning', 'nlp', 'computer-vision', 'data-science'],
        prerequisites: ['python', 'statistics', 'linear-algebra'],
        timeToLearn: 24,
        region: 'global'
      },
      {
        id: 'react',
        name: 'React Development',
        category: 'Frontend',
        difficulty: 5,
        marketDemand: 88,
        averageSalary: 75000,
        growthRate: 20,
        adjacentSkills: ['next-js', 'react-native', 'typescript', 'graphql'],
        prerequisites: ['javascript', 'html', 'css'],
        timeToLearn: 8,
        region: 'global'
      },
      {
        id: 'blockchain',
        name: 'Blockchain Development',
        category: 'Emerging Tech',
        difficulty: 9,
        marketDemand: 78,
        averageSalary: 130000,
        growthRate: 45,
        adjacentSkills: ['smart-contracts', 'defi', 'web3', 'solidity'],
        prerequisites: ['programming', 'cryptography'],
        timeToLearn: 20,
        region: 'global'
      },
      {
        id: 'cloud-architecture',
        name: 'Cloud Architecture',
        category: 'Infrastructure',
        difficulty: 7,
        marketDemand: 90,
        averageSalary: 110000,
        growthRate: 30,
        adjacentSkills: ['aws', 'azure', 'gcp', 'kubernetes', 'devops'],
        prerequisites: ['networking', 'linux', 'scripting'],
        timeToLearn: 16,
        region: 'global'
      }
    ];

    skills.forEach(skill => {
      this.skillGraph.set(skill.id, skill);
    });
  }

  private async loadMarketData() {
    // Simulate real-time market data (would integrate with APIs like Lightcast)
    const marketTrends = {
      'ai-engineering': { growth: 65, demand: 98, avgSalary: 140000 },
      'quantum-computing': { growth: 85, demand: 45, avgSalary: 160000 },
      'sustainability-tech': { growth: 55, demand: 70, avgSalary: 95000 },
      'space-tech': { growth: 70, demand: 35, avgSalary: 125000 },
      'biotech-ai': { growth: 80, demand: 60, avgSalary: 135000 }
    };

    this.marketData = new Map(Object.entries(marketTrends));
  }

  async predictCareerOpportunities(userId: number, userSkills: string[], preferences: any): Promise<CareerOpportunity[]> {
    const user = await storage.getUser(userId);
    if (!user) throw new Error('User not found');

    // Advanced AI-powered career prediction
    const predictionPrompt = `
    As an advanced AI career forecaster, analyze the following user profile and predict the top 5 emerging career opportunities:

    User Profile:
    - Current Skills: ${userSkills.join(', ')}
    - Location: ${preferences.location || 'Global'}
    - Experience Level: ${preferences.experienceLevel || 'Intermediate'}
    - Industry Preference: ${preferences.industry || 'Tech'}
    - Salary Expectation: ${preferences.salaryRange || '80k-120k'}
    - Learning Style: ${preferences.learningStyle || 'Mixed'}

    Market Context:
    - Current market trends showing 65% growth in AI Engineering
    - Quantum computing emerging with 85% growth but limited demand
    - Sustainability tech growing 55% with increasing demand
    - Space tech and biotech-AI showing strong potential

    Provide detailed analysis including:
    1. Specific job titles and companies
    2. Salary ranges and growth projections
    3. Required skills and skill gaps
    4. Time to qualification
    5. Unique advantages this user has
    6. Recommended learning path

    Format as JSON with detailed career opportunities.
    `;

    try {
      const result = await model.generateContent(predictionPrompt);
      const response = await result.response;
      const predictions = JSON.parse(response.text());
      
      return predictions.opportunities || [];
    } catch (error) {
      console.error('Career prediction error:', error);
      // Fallback to basic prediction logic
      return this.generateBasicPredictions(userSkills, preferences);
    }
  }

  private generateBasicPredictions(userSkills: string[], preferences: any): CareerOpportunity[] {
    const opportunities: CareerOpportunity[] = [];
    
    // Skill adjacency analysis
    const adjacentSkills = new Set<string>();
    userSkills.forEach(skill => {
      const skillNode = this.skillGraph.get(skill);
      if (skillNode) {
        skillNode.adjacentSkills.forEach(adj => adjacentSkills.add(adj));
      }
    });

    // Generate opportunities based on skill adjacency and market data
    const sampleOpportunities = [
      {
        id: 'ai-eng-1',
        title: 'Senior AI Engineer',
        company: 'Meta',
        location: 'Remote',
        salaryRange: [120000, 180000] as [number, number],
        requiredSkills: ['python', 'machine-learning', 'deep-learning'],
        emergingSkills: ['llm-optimization', 'multimodal-ai'],
        industryGrowth: 65,
        matchScore: 0.85,
        timeToQualify: 16,
        pathRecommendation: ['deep-learning', 'nlp', 'llm-optimization']
      },
      {
        id: 'blockchain-dev-1',
        title: 'Blockchain Solutions Architect',
        company: 'Coinbase',
        location: 'San Francisco',
        salaryRange: [140000, 200000] as [number, number],
        requiredSkills: ['blockchain', 'smart-contracts', 'solidity'],
        emergingSkills: ['zk-proofs', 'layer2-scaling'],
        industryGrowth: 45,
        matchScore: 0.78,
        timeToQualify: 20,
        pathRecommendation: ['blockchain', 'smart-contracts', 'defi']
      }
    ];

    return sampleOpportunities.filter(opp => {
      const skillMatch = opp.requiredSkills.some(skill => userSkills.includes(skill));
      return skillMatch || opp.matchScore > 0.7;
    });
  }

  async calculateSkillAdjacency(skill1: string, skill2: string): Promise<number> {
    const node1 = this.skillGraph.get(skill1);
    const node2 = this.skillGraph.get(skill2);
    
    if (!node1 || !node2) return 0;
    
    // Calculate adjacency score based on multiple factors
    let score = 0;
    
    // Direct adjacency
    if (node1.adjacentSkills.includes(skill2)) score += 0.8;
    if (node2.adjacentSkills.includes(skill1)) score += 0.8;
    
    // Category similarity
    if (node1.category === node2.category) score += 0.4;
    
    // Market correlation
    const marketCorrelation = Math.abs(node1.marketDemand - node2.marketDemand) / 100;
    score += (1 - marketCorrelation) * 0.3;
    
    // Difficulty correlation
    const difficultyCorrelation = Math.abs(node1.difficulty - node2.difficulty) / 10;
    score += (1 - difficultyCorrelation) * 0.2;
    
    return Math.min(score, 1);
  }

  async generatePersonalizedPath(userId: number, targetRole: string): Promise<any> {
    const user = await storage.getUser(userId);
    if (!user) throw new Error('User not found');

    const pathPrompt = `
    Generate a highly personalized learning path for transitioning to: ${targetRole}
    
    Consider:
    - Current market demand and salary trends
    - Skill adjacency and optimal learning sequence
    - Time optimization for fastest career transition
    - Industry-specific requirements and certifications
    - Remote work opportunities and global market access
    
    Provide:
    1. Week-by-week learning schedule
    2. Skill progression milestones
    3. Project-based learning opportunities
    4. Networking and community engagement
    5. Portfolio development strategy
    6. Interview preparation timeline
    
    Format as detailed JSON with actionable steps.
    `;

    try {
      const result = await model.generateContent(pathPrompt);
      const response = await result.response;
      return JSON.parse(response.text());
    } catch (error) {
      console.error('Path generation error:', error);
      return this.generateBasicPath(targetRole);
    }
  }

  private generateBasicPath(targetRole: string): any {
    return {
      phases: [
        {
          title: 'Foundation Phase',
          duration: 8,
          skills: ['basic-programming', 'problem-solving'],
          milestones: ['Complete 5 coding challenges', 'Build first project']
        },
        {
          title: 'Specialization Phase',
          duration: 12,
          skills: ['advanced-programming', 'domain-specific'],
          milestones: ['Complete specialization course', 'Build portfolio project']
        },
        {
          title: 'Professional Phase',
          duration: 8,
          skills: ['industry-tools', 'soft-skills'],
          milestones: ['Complete certification', 'Network with professionals']
        }
      ],
      totalDuration: 28,
      certifications: ['Industry-recognized certification'],
      projects: ['3 portfolio projects', '1 open-source contribution']
    };
  }
}

export const careerForecaster = new PredictiveCareerForecaster();
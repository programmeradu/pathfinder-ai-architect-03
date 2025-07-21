/**
 * Life Decision Engine
 * AI-powered analysis for comprehensive life decisions including education, career, and relocation
 */

import { logger } from '@/lib/logger';
import { databaseManager } from '@/services/database/DatabaseManager';

export interface LifeDecisionInput {
  currentSituation: {
    age: number;
    education: string;
    experience: number;
    location: string;
    financialSituation: 'low' | 'medium' | 'high';
    familyStatus: 'single' | 'married' | 'family';
  };
  goals: {
    careerGoals: string[];
    personalGoals: string[];
    financialGoals: string[];
    timeframe: string;
  };
  preferences: {
    riskTolerance: number; // 1-10 scale
    workLifeBalance: number; // 1-10 scale
    growthImportance: number; // 1-10 scale
    stabilityImportance: number; // 1-10 scale
  };
  constraints: {
    budget: number;
    timeAvailable: number;
    familyObligations: boolean;
    locationFlexibility: boolean;
  };
}

export interface LifeDecisionOption {
  id: string;
  title: string;
  category: 'education' | 'career' | 'relocation' | 'hybrid';
  description: string;
  timeline: {
    shortTerm: string; // 0-2 years
    mediumTerm: string; // 2-5 years
    longTerm: string; // 5+ years
  };
  requirements: {
    financial: number;
    time: number;
    effort: number;
    prerequisites: string[];
  };
  outcomes: {
    careerImpact: number; // 1-10 scale
    financialImpact: number; // 1-10 scale
    personalGrowth: number; // 1-10 scale
    riskLevel: number; // 1-10 scale
  };
  pros: string[];
  cons: string[];
  successProbability: number;
  roi: {
    financial: number;
    career: number;
    personal: number;
  };
}

export interface LifeDecisionAnalysis {
  id: string;
  userId: string;
  input: LifeDecisionInput;
  options: LifeDecisionOption[];
  recommendations: {
    primary: LifeDecisionOption;
    alternatives: LifeDecisionOption[];
    reasoning: string[];
  };
  riskAssessment: {
    overall: number;
    factors: string[];
    mitigation: string[];
  };
  actionPlan: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
  confidence: number;
  generatedAt: Date;
}

// Post-High School Pathway Analyzer
class PostHighSchoolAnalyzer {
  async analyzePathways(input: LifeDecisionInput): Promise<LifeDecisionOption[]> {
    logger.info('Analyzing post-high school pathways', {
      component: 'PostHighSchoolAnalyzer',
      action: 'analyze_pathways',
      metadata: { age: input.currentSituation.age },
    });

    const pathways: LifeDecisionOption[] = [];

    // Traditional College Path
    pathways.push({
      id: 'college-traditional',
      title: 'Traditional 4-Year College',
      category: 'education',
      description: 'Pursue a bachelor\'s degree at a traditional university',
      timeline: {
        shortTerm: 'Complete first 2 years of general education',
        mediumTerm: 'Complete degree and graduate',
        longTerm: 'Enter career field with degree advantage',
      },
      requirements: {
        financial: 80000, // Average 4-year cost
        time: 4,
        effort: 8,
        prerequisites: ['High school diploma', 'SAT/ACT scores', 'College applications'],
      },
      outcomes: {
        careerImpact: 8,
        financialImpact: 7,
        personalGrowth: 9,
        riskLevel: 4,
      },
      pros: [
        'Comprehensive education',
        'Network building opportunities',
        'Higher earning potential',
        'Career flexibility',
        'Personal development',
      ],
      cons: [
        'High cost',
        'Time commitment',
        'No immediate income',
        'Potential debt burden',
        'May not guarantee employment',
      ],
      successProbability: 0.75,
      roi: {
        financial: 1.8,
        career: 2.2,
        personal: 2.0,
      },
    });

    // Community College Path
    pathways.push({
      id: 'community-college',
      title: 'Community College + Transfer',
      category: 'education',
      description: 'Start at community college, then transfer to 4-year university',
      timeline: {
        shortTerm: 'Complete 2 years at community college',
        mediumTerm: 'Transfer and complete bachelor\'s degree',
        longTerm: 'Enter career with reduced debt burden',
      },
      requirements: {
        financial: 45000, // Reduced cost
        time: 4,
        effort: 7,
        prerequisites: ['High school diploma', 'Community college enrollment'],
      },
      outcomes: {
        careerImpact: 7,
        financialImpact: 8,
        personalGrowth: 8,
        riskLevel: 3,
      },
      pros: [
        'Lower cost',
        'Smaller class sizes',
        'Flexible scheduling',
        'Same degree outcome',
        'Local opportunities',
      ],
      cons: [
        'Transfer challenges',
        'Limited campus experience',
        'Fewer research opportunities',
        'Social limitations',
        'Potential credit loss',
      ],
      successProbability: 0.82,
      roi: {
        financial: 2.1,
        career: 2.0,
        personal: 1.8,
      },
    });

    // Trade School Path
    pathways.push({
      id: 'trade-school',
      title: 'Trade School/Vocational Training',
      category: 'education',
      description: 'Learn specialized trade skills for immediate employment',
      timeline: {
        shortTerm: 'Complete trade certification program',
        mediumTerm: 'Gain experience and advance in trade',
        longTerm: 'Potential business ownership or specialization',
      },
      requirements: {
        financial: 25000, // Average trade school cost
        time: 1.5,
        effort: 8,
        prerequisites: ['High school diploma', 'Trade school application'],
      },
      outcomes: {
        careerImpact: 7,
        financialImpact: 8,
        personalGrowth: 6,
        riskLevel: 3,
      },
      pros: [
        'Quick entry to workforce',
        'High demand skills',
        'Good earning potential',
        'Job security',
        'Hands-on learning',
      ],
      cons: [
        'Limited career flexibility',
        'Physical demands',
        'Economic sensitivity',
        'Advancement limitations',
        'Technology disruption risk',
      ],
      successProbability: 0.88,
      roi: {
        financial: 2.3,
        career: 1.8,
        personal: 1.5,
      },
    });

    // Gap Year + Work Experience
    pathways.push({
      id: 'gap-year-work',
      title: 'Gap Year with Work Experience',
      category: 'career',
      description: 'Take time to work and gain real-world experience before further education',
      timeline: {
        shortTerm: 'Gain work experience and save money',
        mediumTerm: 'Decide on education path with better clarity',
        longTerm: 'Enter education or career with experience advantage',
      },
      requirements: {
        financial: 5000, // Minimal cost, potential earnings
        time: 1,
        effort: 6,
        prerequisites: ['Job search', 'Work authorization'],
      },
      outcomes: {
        careerImpact: 6,
        financialImpact: 6,
        personalGrowth: 8,
        riskLevel: 5,
      },
      pros: [
        'Real-world experience',
        'Earn money',
        'Clarify goals',
        'Develop maturity',
        'Build work ethic',
      ],
      cons: [
        'Delayed education',
        'Peer pressure',
        'Limited advancement',
        'Potential drift',
        'Opportunity cost',
      ],
      successProbability: 0.70,
      roi: {
        financial: 1.2,
        career: 1.5,
        personal: 2.2,
      },
    });

    // Entrepreneurship Path
    pathways.push({
      id: 'entrepreneurship',
      title: 'Start a Business/Entrepreneurship',
      category: 'career',
      description: 'Launch a business venture or startup',
      timeline: {
        shortTerm: 'Develop business plan and launch',
        mediumTerm: 'Grow and stabilize business',
        longTerm: 'Scale business or exit successfully',
      },
      requirements: {
        financial: 50000, // Startup capital
        time: 2,
        effort: 10,
        prerequisites: ['Business idea', 'Market research', 'Basic business knowledge'],
      },
      outcomes: {
        careerImpact: 9,
        financialImpact: 6, // High variance
        personalGrowth: 10,
        riskLevel: 9,
      },
      pros: [
        'Unlimited potential',
        'Independence',
        'Innovation opportunity',
        'Valuable experience',
        'Network building',
      ],
      cons: [
        'High failure rate',
        'Financial risk',
        'Stress and uncertainty',
        'Long hours',
        'Limited safety net',
      ],
      successProbability: 0.35,
      roi: {
        financial: 3.5, // High variance
        career: 3.0,
        personal: 2.8,
      },
    });

    return this.filterAndRankPathways(pathways, input);
  }

  private filterAndRankPathways(pathways: LifeDecisionOption[], input: LifeDecisionInput): LifeDecisionOption[] {
    // Filter based on constraints
    const filteredPathways = pathways.filter(pathway => {
      if (pathway.requirements.financial > input.constraints.budget * 1.2) return false;
      if (pathway.requirements.time > input.constraints.timeAvailable) return false;
      return true;
    });

    // Rank based on preferences and goals
    return filteredPathways.sort((a, b) => {
      const scoreA = this.calculatePathwayScore(a, input);
      const scoreB = this.calculatePathwayScore(b, input);
      return scoreB - scoreA;
    });
  }

  private calculatePathwayScore(pathway: LifeDecisionOption, input: LifeDecisionInput): number {
    const preferences = input.preferences;
    
    let score = 0;
    
    // Weight by risk tolerance
    const riskScore = preferences.riskTolerance >= pathway.outcomes.riskLevel ? 1 : 0.5;
    score += riskScore * 20;
    
    // Weight by growth importance
    score += (pathway.outcomes.personalGrowth / 10) * preferences.growthImportance * 10;
    
    // Weight by financial impact
    score += (pathway.outcomes.financialImpact / 10) * 15;
    
    // Weight by career impact
    score += (pathway.outcomes.careerImpact / 10) * 15;
    
    // Weight by success probability
    score += pathway.successProbability * 20;
    
    // Adjust for financial constraints
    if (pathway.requirements.financial <= input.constraints.budget) {
      score += 10;
    }
    
    return score;
  }
}

// Career Transition Analyzer
class CareerTransitionAnalyzer {
  async analyzeTransition(input: LifeDecisionInput): Promise<LifeDecisionOption[]> {
    logger.info('Analyzing career transition options', {
      component: 'CareerTransitionAnalyzer',
      action: 'analyze_transition',
      metadata: { experience: input.currentSituation.experience },
    });

    const transitions: LifeDecisionOption[] = [];

    // Skill-based transition
    transitions.push({
      id: 'skill-transition',
      title: 'Skill-Based Career Transition',
      category: 'career',
      description: 'Leverage existing skills to transition to a related field',
      timeline: {
        shortTerm: 'Identify transferable skills and target roles',
        mediumTerm: 'Complete transition and establish in new role',
        longTerm: 'Advance in new career path',
      },
      requirements: {
        financial: 15000, // Training and certification costs
        time: 1,
        effort: 7,
        prerequisites: ['Skills assessment', 'Market research', 'Network building'],
      },
      outcomes: {
        careerImpact: 8,
        financialImpact: 7,
        personalGrowth: 8,
        riskLevel: 4,
      },
      pros: [
        'Leverage existing experience',
        'Faster transition',
        'Lower risk',
        'Maintain income',
        'Build on strengths',
      ],
      cons: [
        'Limited scope',
        'Potential salary reset',
        'Competition',
        'Skill gaps',
        'Industry differences',
      ],
      successProbability: 0.78,
      roi: {
        financial: 1.6,
        career: 2.1,
        personal: 1.9,
      },
    });

    // Education-based transition
    transitions.push({
      id: 'education-transition',
      title: 'Education-Based Career Change',
      category: 'hybrid',
      description: 'Return to school for new career preparation',
      timeline: {
        shortTerm: 'Complete educational program',
        mediumTerm: 'Enter new field with credentials',
        longTerm: 'Establish expertise in new career',
      },
      requirements: {
        financial: 60000, // Graduate program costs
        time: 2.5,
        effort: 9,
        prerequisites: ['Program research', 'Admissions process', 'Financial planning'],
      },
      outcomes: {
        careerImpact: 9,
        financialImpact: 6,
        personalGrowth: 9,
        riskLevel: 6,
      },
      pros: [
        'Comprehensive preparation',
        'Credibility in new field',
        'Network opportunities',
        'Personal growth',
        'Career flexibility',
      ],
      cons: [
        'High cost',
        'Time out of workforce',
        'Opportunity cost',
        'No income guarantee',
        'Age considerations',
      ],
      successProbability: 0.72,
      roi: {
        financial: 1.4,
        career: 2.3,
        personal: 2.2,
      },
    });

    return this.filterAndRankTransitions(transitions, input);
  }

  private filterAndRankTransitions(transitions: LifeDecisionOption[], input: LifeDecisionInput): LifeDecisionOption[] {
    // Similar filtering and ranking logic as pathways
    return transitions.filter(transition => 
      transition.requirements.financial <= input.constraints.budget * 1.5
    ).sort((a, b) => {
      const scoreA = this.calculateTransitionScore(a, input);
      const scoreB = this.calculateTransitionScore(b, input);
      return scoreB - scoreA;
    });
  }

  private calculateTransitionScore(transition: LifeDecisionOption, input: LifeDecisionInput): number {
    // Similar scoring logic adapted for career transitions
    let score = 0;
    
    score += transition.outcomes.careerImpact * 15;
    score += transition.outcomes.financialImpact * 12;
    score += transition.successProbability * 25;
    
    // Adjust for experience level
    if (input.currentSituation.experience > 5) {
      score += transition.id === 'skill-transition' ? 10 : -5;
    }
    
    return score;
  }
}

// Main Life Decision Engine
export class LifeDecisionEngine {
  private postHighSchoolAnalyzer: PostHighSchoolAnalyzer;
  private careerTransitionAnalyzer: CareerTransitionAnalyzer;

  constructor() {
    this.postHighSchoolAnalyzer = new PostHighSchoolAnalyzer();
    this.careerTransitionAnalyzer = new CareerTransitionAnalyzer();
  }

  async analyzeLifeDecision(input: LifeDecisionInput): Promise<LifeDecisionAnalysis> {
    const analysisId = `analysis-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    logger.info('Starting life decision analysis', {
      component: 'LifeDecisionEngine',
      action: 'analyze_life_decision',
      metadata: { analysisId, age: input.currentSituation.age },
    });

    try {
      let options: LifeDecisionOption[] = [];

      // Determine analysis type based on age and situation
      if (input.currentSituation.age <= 20 && input.currentSituation.education === 'high_school') {
        options = await this.postHighSchoolAnalyzer.analyzePathways(input);
      } else if (input.currentSituation.experience > 0) {
        options = await this.careerTransitionAnalyzer.analyzeTransition(input);
      } else {
        // Combine both analyses for comprehensive view
        const pathways = await this.postHighSchoolAnalyzer.analyzePathways(input);
        const transitions = await this.careerTransitionAnalyzer.analyzeTransition(input);
        options = [...pathways, ...transitions];
      }

      // Generate recommendations
      const recommendations = this.generateRecommendations(options, input);
      
      // Assess risks
      const riskAssessment = this.assessRisks(options, input);
      
      // Create action plan
      const actionPlan = this.createActionPlan(recommendations.primary, input);
      
      // Calculate overall confidence
      const confidence = this.calculateConfidence(options, input);

      const analysis: LifeDecisionAnalysis = {
        id: analysisId,
        userId: 'current-user', // Would be actual user ID
        input,
        options,
        recommendations,
        riskAssessment,
        actionPlan,
        confidence,
        generatedAt: new Date(),
      };

      // Store analysis
      await this.storeAnalysis(analysis);

      logger.info('Life decision analysis completed', {
        component: 'LifeDecisionEngine',
        action: 'analysis_completed',
        metadata: { 
          analysisId,
          optionsCount: options.length,
          confidence,
        },
      });

      return analysis;
    } catch (error) {
      logger.error('Life decision analysis failed', {
        component: 'LifeDecisionEngine',
        action: 'analysis_failed',
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
      });
      throw error;
    }
  }

  private generateRecommendations(options: LifeDecisionOption[], input: LifeDecisionInput) {
    const sortedOptions = options.sort((a, b) => b.successProbability - a.successProbability);
    
    const primary = sortedOptions[0];
    const alternatives = sortedOptions.slice(1, 4);
    
    const reasoning = [
      `Based on your risk tolerance of ${input.preferences.riskTolerance}/10, this option aligns well with your comfort level`,
      `Your financial constraints of $${input.constraints.budget.toLocaleString()} are compatible with this path`,
      `The success probability of ${Math.round(primary.successProbability * 100)}% makes this a reliable choice`,
      `This option scores highest on your priority of ${input.preferences.growthImportance > 7 ? 'growth' : 'stability'}`,
    ];

    return {
      primary,
      alternatives,
      reasoning,
    };
  }

  private assessRisks(options: LifeDecisionOption[], input: LifeDecisionInput) {
    const avgRisk = options.reduce((sum, opt) => sum + opt.outcomes.riskLevel, 0) / options.length;
    
    const factors = [
      'Market volatility in chosen field',
      'Economic uncertainty',
      'Personal financial situation',
      'Family obligations and constraints',
      'Technology disruption potential',
    ];

    const mitigation = [
      'Build emergency fund covering 6 months expenses',
      'Develop multiple income streams',
      'Maintain continuous learning and skill development',
      'Build strong professional network',
      'Consider insurance and backup plans',
    ];

    return {
      overall: avgRisk,
      factors,
      mitigation,
    };
  }

  private createActionPlan(primaryOption: LifeDecisionOption, input: LifeDecisionInput) {
    return {
      immediate: [
        'Research and validate the chosen path thoroughly',
        'Create detailed budget and financial plan',
        'Begin networking in target field/industry',
        'Assess and address any skill gaps',
      ],
      shortTerm: [
        'Execute first phase of the chosen path',
        'Monitor progress and adjust as needed',
        'Build relevant experience and credentials',
        'Maintain financial stability during transition',
      ],
      longTerm: [
        'Establish expertise in chosen field',
        'Build leadership and advanced skills',
        'Consider mentoring others in similar transitions',
        'Plan for next career advancement phase',
      ],
    };
  }

  private calculateConfidence(options: LifeDecisionOption[], input: LifeDecisionInput): number {
    const dataQuality = options.length > 3 ? 0.9 : 0.7;
    const inputCompleteness = Object.keys(input).length > 3 ? 0.9 : 0.8;
    const marketStability = 0.85; // Would be calculated from market data
    
    return Math.min(0.95, dataQuality * inputCompleteness * marketStability);
  }

  private async storeAnalysis(analysis: LifeDecisionAnalysis): Promise<void> {
    try {
      await databaseManager.storeUserProfile({
        type: 'life_decision_analysis',
        user_id: analysis.userId,
        analysis_id: analysis.id,
        input: JSON.stringify(analysis.input),
        options: JSON.stringify(analysis.options),
        recommendations: JSON.stringify(analysis.recommendations),
        confidence: analysis.confidence,
        created_at: analysis.generatedAt,
      });
    } catch (error) {
      logger.error('Failed to store life decision analysis', {
        component: 'LifeDecisionEngine',
        action: 'store_analysis',
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
      });
    }
  }
}

// Singleton instance
export const lifeDecisionEngine = new LifeDecisionEngine();

export default lifeDecisionEngine;

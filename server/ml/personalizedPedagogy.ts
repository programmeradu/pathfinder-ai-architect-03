import { GoogleGenerativeAI } from '@google/generative-ai';
import { storage } from '../storage';

const genAI = new GoogleGenerativeAI('AIzaSyCrpYzIeAj5jmekAsn5qgpcOWrBDY77vHw');
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

interface LearningStyle {
  visual: number;
  auditory: number;
  kinesthetic: number;
  reading: number;
  social: number;
  solitary: number;
}

interface LearningBehavior {
  averageSessionLength: number;
  preferredTimeOfDay: string;
  completionRate: number;
  skipRate: number;
  pauseFrequency: number;
  replayFrequency: number;
  notesTaken: boolean;
  interactionLevel: number;
}

interface ContentMetrics {
  engagementScore: number;
  completionTime: number;
  difficulty: number;
  satisfaction: number;
  retentionScore: number;
}

interface PersonalizedResource {
  id: string;
  title: string;
  provider: string;
  type: 'video' | 'article' | 'interactive' | 'course' | 'book' | 'project' | 'podcast';
  url: string;
  duration: number;
  difficulty: number;
  personalizedScore: number;
  adaptationReason: string;
  learningStyleMatch: number;
  prerequisites: string[];
  outcomes: string[];
  estimatedCompletionTime: number;
}

class PersonalizedPedagogyEngine {
  private learningProfiles: Map<number, LearningStyle> = new Map();
  private behaviorPatterns: Map<number, LearningBehavior> = new Map();
  private contentDatabase: Map<string, any> = new Map();

  constructor() {
    this.initializeContentDatabase();
  }

  private initializeContentDatabase() {
    // Simulated content database with rich metadata
    const sampleContent = [
      {
        id: 'python-basics-video',
        title: 'Python Programming Fundamentals',
        provider: 'CodeWithMosh',
        type: 'video',
        url: 'https://example.com/python-basics',
        duration: 180,
        difficulty: 3,
        learningStyleWeights: { visual: 0.9, auditory: 0.8, kinesthetic: 0.3, reading: 0.2 },
        interactivityLevel: 0.4,
        practiceComponents: 0.3,
        conceptualDepth: 0.7
      },
      {
        id: 'ml-interactive-course',
        title: 'Machine Learning Interactive Course',
        provider: 'Coursera',
        type: 'interactive',
        url: 'https://example.com/ml-course',
        duration: 600,
        difficulty: 7,
        learningStyleWeights: { visual: 0.8, auditory: 0.5, kinesthetic: 0.9, reading: 0.6 },
        interactivityLevel: 0.9,
        practiceComponents: 0.8,
        conceptualDepth: 0.9
      },
      {
        id: 'react-documentation',
        title: 'React Official Documentation',
        provider: 'Meta',
        type: 'article',
        url: 'https://react.dev/docs',
        duration: 240,
        difficulty: 5,
        learningStyleWeights: { visual: 0.4, auditory: 0.1, kinesthetic: 0.2, reading: 0.9 },
        interactivityLevel: 0.3,
        practiceComponents: 0.4,
        conceptualDepth: 0.8
      }
    ];

    sampleContent.forEach(content => {
      this.contentDatabase.set(content.id, content);
    });
  }

  async assessLearningStyle(userId: number, responses: any[]): Promise<LearningStyle> {
    const assessmentPrompt = `
    Analyze the following learning style assessment responses and determine the user's learning preferences:

    Assessment Responses:
    ${JSON.stringify(responses, null, 2)}

    Determine scores (0-1) for each learning style:
    1. Visual: Preference for diagrams, charts, images, and visual demonstrations
    2. Auditory: Preference for lectures, podcasts, discussions, and verbal explanations
    3. Kinesthetic: Preference for hands-on activities, experiments, and physical interaction
    4. Reading: Preference for text-based learning, documentation, and written materials
    5. Social: Preference for group learning, discussions, and collaborative activities
    6. Solitary: Preference for independent study and self-paced learning

    Provide detailed analysis and reasoning for each score.
    Format as JSON with scores and explanations.
    `;

    try {
      const result = await model.generateContent(assessmentPrompt);
      const response = await result.response;
      const assessment = JSON.parse(response.text());
      
      const learningStyle: LearningStyle = {
        visual: assessment.visual || 0.5,
        auditory: assessment.auditory || 0.5,
        kinesthetic: assessment.kinesthetic || 0.5,
        reading: assessment.reading || 0.5,
        social: assessment.social || 0.5,
        solitary: assessment.solitary || 0.5
      };

      this.learningProfiles.set(userId, learningStyle);
      return learningStyle;
    } catch (error) {
      console.error('Learning style assessment error:', error);
      // Default balanced profile
      const defaultStyle: LearningStyle = {
        visual: 0.5, auditory: 0.5, kinesthetic: 0.5,
        reading: 0.5, social: 0.5, solitary: 0.5
      };
      this.learningProfiles.set(userId, defaultStyle);
      return defaultStyle;
    }
  }

  async updateLearningBehavior(userId: number, sessionData: any): Promise<void> {
    const currentBehavior = this.behaviorPatterns.get(userId) || {
      averageSessionLength: 30,
      preferredTimeOfDay: 'evening',
      completionRate: 0.7,
      skipRate: 0.1,
      pauseFrequency: 0.3,
      replayFrequency: 0.2,
      notesTaken: false,
      interactionLevel: 0.5
    };

    // Update behavior based on session data using weighted average
    const weight = 0.1; // Learning rate
    currentBehavior.averageSessionLength = 
      (1 - weight) * currentBehavior.averageSessionLength + weight * sessionData.sessionLength;
    currentBehavior.completionRate = 
      (1 - weight) * currentBehavior.completionRate + weight * (sessionData.completed ? 1 : 0);
    currentBehavior.skipRate = 
      (1 - weight) * currentBehavior.skipRate + weight * (sessionData.skipped ? 1 : 0);
    currentBehavior.pauseFrequency = 
      (1 - weight) * currentBehavior.pauseFrequency + weight * sessionData.pauseCount;
    currentBehavior.replayFrequency = 
      (1 - weight) * currentBehavior.replayFrequency + weight * sessionData.replayCount;
    currentBehavior.notesTaken = sessionData.notesTaken || currentBehavior.notesTaken;
    currentBehavior.interactionLevel = 
      (1 - weight) * currentBehavior.interactionLevel + weight * sessionData.interactionLevel;

    this.behaviorPatterns.set(userId, currentBehavior);
  }

  async generatePersonalizedCurriculum(userId: number, topic: string, targetSkills: string[]): Promise<PersonalizedResource[]> {
    const learningStyle = this.learningProfiles.get(userId);
    const behavior = this.behaviorPatterns.get(userId);

    if (!learningStyle) {
      throw new Error('Learning style not assessed. Please complete the learning style assessment first.');
    }

    const curriculumPrompt = `
    Generate a personalized learning curriculum for:
    Topic: ${topic}
    Target Skills: ${targetSkills.join(', ')}
    
    User Learning Profile:
    - Visual Learning: ${learningStyle.visual}
    - Auditory Learning: ${learningStyle.auditory}
    - Kinesthetic Learning: ${learningStyle.kinesthetic}
    - Reading Learning: ${learningStyle.reading}
    - Social Learning: ${learningStyle.social}
    - Solitary Learning: ${learningStyle.solitary}
    
    Behavioral Patterns:
    - Average Session Length: ${behavior?.averageSessionLength || 30} minutes
    - Completion Rate: ${behavior?.completionRate || 0.7}
    - Preferred Time: ${behavior?.preferredTimeOfDay || 'evening'}
    - Interaction Level: ${behavior?.interactionLevel || 0.5}
    
    Create a curriculum with:
    1. 8-12 learning resources optimized for this user's profile
    2. Varied content types matching learning preferences
    3. Progressive difficulty levels
    4. Estimated completion times
    5. Skill-building sequence
    6. Assessment checkpoints
    
    Format as JSON array of resources with detailed metadata.
    `;

    try {
      const result = await model.generateContent(curriculumPrompt);
      const response = await result.response;
      const curriculum = JSON.parse(response.text());
      
      return curriculum.resources.map((resource: any) => ({
        id: resource.id,
        title: resource.title,
        provider: resource.provider,
        type: resource.type,
        url: resource.url,
        duration: resource.duration,
        difficulty: resource.difficulty,
        personalizedScore: this.calculatePersonalizationScore(resource, learningStyle, behavior),
        adaptationReason: resource.adaptationReason,
        learningStyleMatch: this.calculateLearningStyleMatch(resource, learningStyle),
        prerequisites: resource.prerequisites || [],
        outcomes: resource.outcomes || [],
        estimatedCompletionTime: this.estimateCompletionTime(resource, behavior)
      }));
    } catch (error) {
      console.error('Curriculum generation error:', error);
      return this.generateBasicCurriculum(topic, targetSkills, learningStyle);
    }
  }

  private calculatePersonalizationScore(resource: any, learningStyle: LearningStyle, behavior?: LearningBehavior): number {
    let score = 0;
    
    // Learning style match
    const styleMatch = this.calculateLearningStyleMatch(resource, learningStyle);
    score += styleMatch * 0.6;
    
    // Difficulty appropriateness
    const difficultyScore = 1 - Math.abs(resource.difficulty - 5) / 5;
    score += difficultyScore * 0.2;
    
    // Duration appropriateness
    if (behavior) {
      const durationScore = 1 - Math.abs(resource.duration - behavior.averageSessionLength) / behavior.averageSessionLength;
      score += durationScore * 0.2;
    }
    
    return Math.min(score, 1);
  }

  private calculateLearningStyleMatch(resource: any, learningStyle: LearningStyle): number {
    if (!resource.learningStyleWeights) return 0.5;
    
    const weights = resource.learningStyleWeights;
    let match = 0;
    
    match += weights.visual * learningStyle.visual;
    match += weights.auditory * learningStyle.auditory;
    match += weights.kinesthetic * learningStyle.kinesthetic;
    match += weights.reading * learningStyle.reading;
    
    return match / 4;
  }

  private estimateCompletionTime(resource: any, behavior?: LearningBehavior): number {
    let estimatedTime = resource.duration;
    
    if (behavior) {
      // Adjust based on user's completion patterns
      estimatedTime *= (1 / behavior.completionRate);
      estimatedTime *= (1 + behavior.pauseFrequency * 0.2);
      estimatedTime *= (1 + behavior.replayFrequency * 0.5);
    }
    
    return Math.round(estimatedTime);
  }

  private generateBasicCurriculum(topic: string, targetSkills: string[], learningStyle: LearningStyle): PersonalizedResource[] {
    // Fallback basic curriculum
    const basicResources: PersonalizedResource[] = [
      {
        id: 'intro-' + topic,
        title: `Introduction to ${topic}`,
        provider: 'PathfinderAI',
        type: 'video',
        url: '#',
        duration: 30,
        difficulty: 3,
        personalizedScore: 0.8,
        adaptationReason: 'Beginner-friendly introduction',
        learningStyleMatch: learningStyle.visual,
        prerequisites: [],
        outcomes: [`Basic understanding of ${topic}`],
        estimatedCompletionTime: 35
      },
      {
        id: 'practice-' + topic,
        title: `Hands-on ${topic} Practice`,
        provider: 'PathfinderAI',
        type: 'interactive',
        url: '#',
        duration: 60,
        difficulty: 5,
        personalizedScore: 0.9,
        adaptationReason: 'Interactive practice session',
        learningStyleMatch: learningStyle.kinesthetic,
        prerequisites: [`Basic understanding of ${topic}`],
        outcomes: [`Practical skills in ${topic}`],
        estimatedCompletionTime: 75
      }
    ];

    return basicResources;
  }

  async getAdaptiveRecommendations(userId: number, currentResource: string, progress: number): Promise<any> {
    const learningStyle = this.learningProfiles.get(userId);
    const behavior = this.behaviorPatterns.get(userId);
    
    if (!learningStyle) return null;

    const recommendationPrompt = `
    Provide adaptive learning recommendations based on:
    
    Current Resource: ${currentResource}
    Progress: ${progress}%
    Learning Style: ${JSON.stringify(learningStyle)}
    Behavior Pattern: ${JSON.stringify(behavior)}
    
    Recommendations needed:
    1. If struggling (progress < 30%): Suggest easier alternatives or support resources
    2. If progressing well (progress > 70%): Suggest advanced challenges or next steps
    3. If stagnating (progress 30-70%): Suggest different learning approaches
    4. Motivation and engagement strategies
    5. Optimal break timing and study schedule
    
    Format as JSON with specific actionable recommendations.
    `;

    try {
      const result = await model.generateContent(recommendationPrompt);
      const response = await result.response;
      return JSON.parse(response.text());
    } catch (error) {
      console.error('Adaptive recommendations error:', error);
      return {
        recommendations: ['Continue with current resource', 'Take breaks every 25 minutes'],
        nextSteps: ['Complete current section', 'Practice with exercises']
      };
    }
  }
}

export const pedagogyEngine = new PersonalizedPedagogyEngine();
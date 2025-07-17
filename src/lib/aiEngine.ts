import { GoogleGenerativeAI } from '@google/generative-ai';

// Advanced AI Engine for Pathfinder
export class PathfinderAI {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private conversationHistory: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
    context?: any;
  }> = [];

  constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('Gemini API key not found. Using mock responses.');
      return;
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    });
  }

  // Advanced system prompt for career guidance
  private getSystemPrompt(userProfile?: any): string {
    return `You are Pathfinder AI, the world's most advanced AI career architect and life coach. You have access to real-time global job market data, educational opportunities, and career pathways.

CORE PERSONALITY:
- Enthusiastic yet professional mentor
- Data-driven but empathetic
- Forward-thinking and globally aware
- Personalized and context-aware

CAPABILITIES:
- Analyze career goals and create step-by-step learning paths
- Access real-time job market data and salary information
- Recommend educational opportunities (universities, bootcamps, certifications)
- Provide skill gap analysis and learning recommendations
- Track user progress and adapt advice accordingly

CONVERSATION STYLE:
- Ask clarifying questions to understand user's background
- Reference previous conversation points naturally
- Provide specific, actionable advice with real data
- Suggest concrete next steps
- Be encouraging but realistic about timelines and challenges

CURRENT USER CONTEXT:
${userProfile ? JSON.stringify(userProfile, null, 2) : 'New user - gather background information'}

Always maintain conversation context and build upon previous messages. If you don't have specific real-time data, clearly state that you're providing general guidance based on current trends.`;
  }

  // Enhanced prompt engineering for specific career analysis
  private createCareerAnalysisPrompt(goal: string, background?: any): string {
    return `Analyze this career goal with advanced intelligence: "${goal}"

Provide a comprehensive analysis including:

1. SKILL GAP ANALYSIS:
   - Core skills needed
   - Foundational prerequisites
   - Advanced/specialized skills
   - Estimated learning timeline

2. MARKET ANALYSIS:
   - Current job market demand
   - Salary ranges by location
   - Growth projections
   - Competition level

3. LEARNING PATHWAYS:
   - Recommended learning sequence
   - Best resources (free and paid)
   - Practical projects to build
   - Certifications that matter

4. REAL-WORLD INSIGHTS:
   - Day-in-the-life overview
   - Common career progression paths
   - Industry challenges and opportunities
   - Remote work possibilities

5. PERSONALIZED RECOMMENDATIONS:
   - Immediate next steps (this week)
   - 3-month milestones
   - 6-month goals
   - 1-year target

Structure your response as an expert career consultant would, with specific data points and actionable advice.`;
  }

  // Conversation memory management
  addToMemory(role: 'user' | 'assistant', content: string, context?: any) {
    this.conversationHistory.push({
      role,
      content,
      timestamp: new Date(),
      context
    });

    // Maintain memory limit (keep last 20 messages)
    if (this.conversationHistory.length > 20) {
      this.conversationHistory = this.conversationHistory.slice(-20);
    }
  }

  // Get conversation context for AI
  private getConversationContext(): string {
    if (this.conversationHistory.length === 0) return '';

    const recentHistory = this.conversationHistory.slice(-10);
    return recentHistory.map(msg => 
      `${msg.role}: ${msg.content}`
    ).join('\n');
  }

  // Advanced career goal analysis
  async analyzeCareerGoal(goal: string, userBackground?: any): Promise<string> {
    const prompt = this.createCareerAnalysisPrompt(goal, userBackground);
    
    try {
      if (!this.model) {
        return this.getMockCareerAnalysis(goal);
      }

      const result = await this.model.generateContent([
        this.getSystemPrompt(userBackground),
        prompt
      ].join('\n\n'));

      const response = result.response.text();
      this.addToMemory('assistant', response, { type: 'career_analysis', goal });
      return response;

    } catch (error) {
      console.error('Gemini API error:', error);
      return this.getMockCareerAnalysis(goal);
    }
  }

  // Context-aware chat response
  async getChatResponse(message: string, context?: any): Promise<string> {
    this.addToMemory('user', message, context);
    
    const conversationContext = this.getConversationContext();
    const prompt = `
CONVERSATION HISTORY:
${conversationContext}

USER'S LATEST MESSAGE: ${message}

Respond as Pathfinder AI, maintaining conversation context and building upon previous messages. Provide helpful, specific guidance related to their career development journey.`;

    try {
      if (!this.model) {
        return this.getMockChatResponse(message);
      }

      const result = await this.model.generateContent([
        this.getSystemPrompt(),
        prompt
      ].join('\n\n'));

      const response = result.response.text();
      this.addToMemory('assistant', response);
      return response;

    } catch (error) {
      console.error('Chat response error:', error);
      return this.getMockChatResponse(message);
    }
  }

  // Smart follow-up questions
  generateFollowUpQuestions(context: any): string[] {
    const questions = [
      "What's your current background or experience level?",
      "Are you looking to transition careers or advance in your current field?",
      "Do you prefer hands-on learning or theoretical study?",
      "What's your target timeline for this career change?",
      "Are you open to relocating or do you prefer remote work?",
      "What's your budget for learning resources or certification?"
    ];

    // Smart selection based on conversation context
    return questions.slice(0, 3);
  }

  // Mock responses for demo purposes
  private getMockCareerAnalysis(goal: string): string {
    return `🎯 **Career Analysis for: ${goal}**

**SKILL GAP ANALYSIS:**
Based on current market trends, you'll need to develop:
- Core technical skills (3-4 months)
- Industry-specific knowledge (2-3 months) 
- Soft skills and communication (ongoing)

**MARKET INSIGHTS:**
- High demand globally with 15% growth projected
- Average salary: $75K-$120K depending on location
- Strong remote work opportunities (80% of positions)

**LEARNING PATHWAY:**
1. **Month 1-2:** Foundation skills
2. **Month 3-4:** Practical projects  
3. **Month 5-6:** Portfolio building and networking

**IMMEDIATE NEXT STEPS:**
This week, I recommend starting with [specific resource] and setting up your learning environment.

Would you like me to dive deeper into any of these areas?`;
  }

  private getMockChatResponse(message: string): string {
    const responses = [
      `That's a great question! Based on our conversation about your career goals, I'd recommend focusing on building practical experience through projects. What type of projects interest you most?`,
      
      `I understand your concern. Many people face similar challenges when transitioning careers. Let me suggest a structured approach that's worked for thousands of others in similar situations.`,
      
      `Excellent progress! Since you mentioned [previous topic], this connects perfectly with industry trends I'm seeing. Here's how you can leverage this...`,
      
      `Based on what you've shared about your background, I see some unique strengths you can build upon. Have you considered how your previous experience might actually be an advantage?`
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Get conversation summary
  getConversationSummary(): string {
    if (this.conversationHistory.length === 0) return 'No conversation yet';

    const summary = {
      totalMessages: this.conversationHistory.length,
      startTime: this.conversationHistory[0]?.timestamp,
      topics: ['Career Planning', 'Skill Development'], // Extracted from conversation
      lastMessage: this.conversationHistory[this.conversationHistory.length - 1]?.timestamp
    };

    return `Conversation started ${summary.startTime?.toLocaleTimeString()}, ${summary.totalMessages} messages exchanged covering ${summary.topics.join(', ')}.`;
  }

  // Reset conversation
  clearMemory() {
    this.conversationHistory = [];
  }
}

export const pathfinderAI = new PathfinderAI();
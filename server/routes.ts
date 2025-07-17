
import type { Express } from "express";
import { createServer, type Server } from "http";
import { GoogleGenerativeAI } from '@google/generative-ai';
import { storage } from "./storage";
import { authenticateToken, register, login, getCurrentUser, type AuthRequest } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize Gemini AI
  const genAI = new GoogleGenerativeAI('AIzaSyCrpYzIeAj5jmekAsn5qgpcOWrBDY77vHw');
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  // Authentication routes
  app.post('/api/auth/register', register);
  app.post('/api/auth/login', login);
  app.get('/api/auth/user', authenticateToken, getCurrentUser);

  // AI Chat endpoint for career mentorship (protected)
  app.post('/api/chat', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;
    
    // Create context-aware prompt for career mentorship
    const systemPrompt = `You are PathfinderAI, an expert career mentor and life architect. Your role is to:
    - Provide personalized career guidance and learning path recommendations
    - Analyze user goals and break them down into actionable steps
    - Suggest relevant skills, resources, and opportunities
    - Maintain an encouraging, professional, and insightful tone
    - Reference global opportunities, education paths, and career strategies
    
    Keep responses concise but comprehensive, always focusing on actionable advice.`;
    
    // Build conversation context
    const context = conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n');
    const fullPrompt = `${systemPrompt}\n\nConversation History:\n${context}\n\nUser: ${message}\n\nPathfinderAI:`;
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();
    
    res.json({ 
      response: text,
      success: true 
    });
  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({ 
      error: 'Failed to get AI response',
      success: false 
    });
  }
  });

  // Career Path Generation endpoint (protected)
  app.post('/api/generate-path', authenticateToken, async (req: AuthRequest, res) => {
    try {
    const { goal, currentLevel = 'beginner', timeframe = '6 months' } = req.body;
    
    const prompt = `As PathfinderAI, create a comprehensive career development path for this goal: "${goal}"
    
    Current Level: ${currentLevel}
    Timeframe: ${timeframe}
    
    Please provide:
    1. A clear breakdown of required skills (Foundational, Core, Advanced)
    2. Specific learning milestones with timeframes
    3. Recommended resources and learning paths
    4. Career opportunities and next steps
    5. Global opportunities and pathways
    
    Format the response as a structured JSON object with sections for skills, milestones, resources, and opportunities.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Try to parse as JSON, fallback to structured text
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(text);
    } catch {
      parsedResponse = {
        rawResponse: text,
        goal: goal,
        timeframe: timeframe,
        success: true
      };
    }
    
    res.json({
      ...parsedResponse,
      success: true
    });
  } catch (error) {
    console.error('Path Generation Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate career path',
      success: false 
    });
  }
  });

  // Global Opportunities Search endpoint (protected)
  app.post('/api/search-opportunities', authenticateToken, async (req: AuthRequest, res) => {
    try {
    const { career, location = 'global', type = 'all' } = req.body;
    
    const prompt = `As PathfinderAI, search for comprehensive global opportunities for someone pursuing: "${career}"
    
    Location preference: ${location}
    Opportunity type: ${type}
    
    Please provide a detailed analysis including:
    1. University programs and educational pathways
    2. Professional certifications and bootcamps
    3. Job opportunities and market demand
    4. International opportunities and fellowships
    5. Remote work possibilities
    6. Networking and community opportunities
    
    For each opportunity, include:
    - Match percentage (how well it fits the career goal)
    - Requirements and prerequisites
    - Timeline and duration
    - Location and accessibility
    - Expected outcomes and benefits
    
    Format as a structured response with categorized opportunities.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    res.json({
      opportunities: text,
      career: career,
      location: location,
      success: true
    });
  } catch (error) {
    console.error('Opportunity Search Error:', error);
    res.status(500).json({ 
      error: 'Failed to search opportunities',
      success: false 
    });
  }
  });

  // Dashboard API - Get user overview
  app.get('/api/dashboard', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const userId = req.user!.id;
      
      // Get user's active career path
      const careerPaths = await storage.getUserCareerPaths(userId);
      const activePath = careerPaths.find(path => path.isActive);
      
      // Get recent achievements
      const achievements = await storage.getUserAchievements(userId);
      const recentAchievements = achievements.slice(0, 5);
      
      // Get learning analytics
      const analytics = await storage.getUserLearningAnalytics(userId, 7);
      
      // Get next steps if there's an active path
      let nextSteps = [];
      if (activePath) {
        const pathSteps = await storage.getPathSteps(activePath.id);
        nextSteps = pathSteps.filter(step => !step.isCompleted).slice(0, 3);
      }
      
      res.json({
        user: req.user,
        activePath,
        nextSteps,
        recentAchievements,
        weeklyAnalytics: analytics
      });
    } catch (error) {
      console.error('Dashboard error:', error);
      res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
  });

  // Career Paths API
  app.get('/api/career-paths', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const userId = req.user!.id;
      const careerPaths = await storage.getUserCareerPaths(userId);
      res.json(careerPaths);
    } catch (error) {
      console.error('Career paths error:', error);
      res.status(500).json({ error: 'Failed to fetch career paths' });
    }
  });

  app.post('/api/career-paths', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const userId = req.user!.id;
      const { title, description, targetRole, estimatedDuration, difficulty, skills } = req.body;
      
      // Generate roadmap using AI
      const roadmapPrompt = `Create a detailed learning roadmap for becoming a ${targetRole}. 
      Target: ${title}
      Description: ${description}
      Duration: ${estimatedDuration} weeks
      Difficulty: ${difficulty}
      Required skills: ${JSON.stringify(skills)}
      
      Generate a structured roadmap with phases, milestones, and specific learning steps.
      Format as JSON with phases array containing: {title, duration, steps, skills}`;
      
      const roadmapResult = await model.generateContent(roadmapPrompt);
      const roadmapResponse = await roadmapResult.response;
      let roadmapData;
      
      try {
        roadmapData = JSON.parse(roadmapResponse.text());
      } catch {
        roadmapData = { phases: [], rawResponse: roadmapResponse.text() };
      }
      
      const careerPath = await storage.createCareerPath(userId, {
        title,
        description,
        targetRole,
        estimatedDuration,
        difficulty,
        skills,
        roadmapData
      });
      
      res.status(201).json(careerPath);
    } catch (error) {
      console.error('Create career path error:', error);
      res.status(500).json({ error: 'Failed to create career path' });
    }
  });

  // Path Steps API
  app.get('/api/career-paths/:pathId/steps', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const pathId = parseInt(req.params.pathId);
      const steps = await storage.getPathSteps(pathId);
      res.json(steps);
    } catch (error) {
      console.error('Path steps error:', error);
      res.status(500).json({ error: 'Failed to fetch path steps' });
    }
  });

  app.patch('/api/path-steps/:stepId', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const stepId = parseInt(req.params.stepId);
      const updates = req.body;
      
      if (updates.isCompleted) {
        updates.completedAt = new Date();
        
        // Award achievement for completion
        await storage.createAchievement(req.user!.id, {
          title: 'Step Completed',
          description: `Completed a learning step`,
          type: 'milestone',
          data: { stepId }
        });
      }
      
      const updatedStep = await storage.updatePathStep(stepId, updates);
      res.json(updatedStep);
    } catch (error) {
      console.error('Update path step error:', error);
      res.status(500).json({ error: 'Failed to update path step' });
    }
  });

  // Conversations API
  app.get('/api/conversations', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const userId = req.user!.id;
      const conversations = await storage.getUserConversations(userId);
      res.json(conversations);
    } catch (error) {
      console.error('Conversations error:', error);
      res.status(500).json({ error: 'Failed to fetch conversations' });
    }
  });

  app.post('/api/conversations', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const userId = req.user!.id;
      const { title, messages, context } = req.body;
      
      const conversation = await storage.createConversation(userId, {
        title,
        messages: messages || [],
        context: context || {}
      });
      
      res.status(201).json(conversation);
    } catch (error) {
      console.error('Create conversation error:', error);
      res.status(500).json({ error: 'Failed to create conversation' });
    }
  });

  app.patch('/api/conversations/:conversationId', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const conversationId = parseInt(req.params.conversationId);
      const updates = req.body;
      
      const updatedConversation = await storage.updateConversation(conversationId, updates);
      res.json(updatedConversation);
    } catch (error) {
      console.error('Update conversation error:', error);
      res.status(500).json({ error: 'Failed to update conversation' });
    }
  });

  // Portfolio API
  app.get('/api/portfolio', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const userId = req.user!.id;
      const projects = await storage.getUserPortfolioProjects(userId);
      res.json(projects);
    } catch (error) {
      console.error('Portfolio error:', error);
      res.status(500).json({ error: 'Failed to fetch portfolio' });
    }
  });

  app.post('/api/portfolio', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const userId = req.user!.id;
      const { title, description, githubUrl, liveUrl, technologies, skillsProven } = req.body;
      
      // AI evaluation of the project (basic implementation)
      let aiEvaluation = null;
      if (githubUrl) {
        const evaluationPrompt = `Evaluate this portfolio project:
        Title: ${title}
        Description: ${description}
        GitHub: ${githubUrl}
        Technologies: ${JSON.stringify(technologies)}
        Skills claimed: ${JSON.stringify(skillsProven)}
        
        Provide a brief evaluation focusing on technical complexity, code quality indicators, and skill demonstration.
        Format as JSON: {score: number, strengths: string[], improvements: string[], skillsValidated: string[]}`;
        
        try {
          const evaluationResult = await model.generateContent(evaluationPrompt);
          const evaluationResponse = await evaluationResult.response;
          aiEvaluation = JSON.parse(evaluationResponse.text());
        } catch {
          aiEvaluation = { score: 0, note: 'Evaluation failed' };
        }
      }
      
      const project = await storage.createPortfolioProject(userId, {
        title,
        description,
        githubUrl,
        liveUrl,
        technologies,
        skillsProven,
        aiEvaluation,
        verificationStatus: 'pending'
      });
      
      res.status(201).json(project);
    } catch (error) {
      console.error('Create portfolio project error:', error);
      res.status(500).json({ error: 'Failed to create portfolio project' });
    }
  });

  // Analytics API
  app.get('/api/analytics', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const userId = req.user!.id;
      const days = parseInt(req.query.days as string) || 30;
      const analytics = await storage.getUserLearningAnalytics(userId, days);
      res.json(analytics);
    } catch (error) {
      console.error('Analytics error:', error);
      res.status(500).json({ error: 'Failed to fetch analytics' });
    }
  });

  app.post('/api/analytics', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const userId = req.user!.id;
      const analyticsData = req.body;
      
      const analytics = await storage.createLearningAnalytics(userId, analyticsData);
      res.status(201).json(analytics);
    } catch (error) {
      console.error('Create analytics error:', error);
      res.status(500).json({ error: 'Failed to create analytics' });
    }
  });

  // User Profile API
  app.patch('/api/user/profile', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const userId = req.user!.id;
      const updates = req.body;
      
      const updatedUser = await storage.updateUser(userId, updates);
      res.json(updatedUser);
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  });

  const httpServer = createServer(app);
  
  return httpServer;
}


import { Router } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = Router();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI('AIzaSyCrpYzIeAj5jmekAsn5qgpcOWrBDY77vHw');
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

// AI Chat endpoint for career mentorship
router.post('/api/chat', async (req, res) => {
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

// Career Path Generation endpoint
router.post('/api/generate-path', async (req, res) => {
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

// Global Opportunities Search endpoint
router.post('/api/search-opportunities', async (req, res) => {
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

export default router;

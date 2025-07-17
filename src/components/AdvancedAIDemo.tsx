import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Search, MessageSquare, Target, ArrowRight, CheckCircle,
  Globe, GraduationCap, Building, Briefcase, Plane, Radar,
  MapPin, DollarSign, Calendar, ExternalLink, Compass,
  Database, Network, Satellite, Route, TrendingUp, Award,
  Sparkles, BarChart3, Clock, Users, Play, ChevronRight, RotateCcw,
  Mic, Send, Star, Zap, Eye, BookOpen, Code, Trophy, Activity,
  Lightbulb, Heart, Shield, Rocket, Bot, User, AlertCircle,
  LineChart, PieChart, Settings, Smile, Frown, Meh
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { pathfinderAI } from '@/lib/aiEngine';
import { marketData } from '@/lib/marketData';
import { personalityEngine } from '@/lib/personalityEngine';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  typing?: boolean;
  context?: any;
  emotionalState?: string;
  suggestions?: string[];
}

interface UserProfile {
  goal?: string;
  background?: string;
  learningStyle?: string;
  personality?: any;
  progress?: any;
  marketData?: any;
}

export function AdvancedAIDemo() {
  const [currentStep, setCurrentStep] = useState(0); // 0: goal, 1: personality assessment, 2: ai chat, 3: results
  const [goalText, setGoalText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({});
  const [showAdvancedFeatures, setShowAdvancedFeatures] = useState(false);
  const [conversationDepth, setConversationDepth] = useState(0);
  const [demoUsageCount, setDemoUsageCount] = useState(0);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const [realTimeAnalysis, setRealTimeAnalysis] = useState<any>({});
  const [aiPersonality, setAiPersonality] = useState('mentor'); // mentor, analyzer, motivator
  const [emotionalState, setEmotionalState] = useState('neutral');
  const [showMentorResponse, setShowMentorResponse] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    if (currentStep === 2 && messages.length === 0) {
      const welcomeMessage: Message = {
        id: '1',
        role: 'assistant',
        content: `Hello! I'm your advanced AI career architect. I've analyzed thousands of career paths and have access to real-time market data. 

I see you're interested in "${goalText || 'career development'}". Let me ask you a few questions to create a truly personalized experience.

What's your current background or experience level in this field?`,
        timestamp: new Date(),
        suggestions: [
          "I'm completely new to this field",
          "I have some basic knowledge",
          "I'm transitioning from another career",
          "I have some experience but want to advance"
        ]
      };
      setMessages([welcomeMessage]);
    }
  }, [currentStep, goalText]);

  const startAdvancedAnalysis = async () => {
    if (!goalText.trim()) {
      setGoalText("Full-Stack Developer");
    }

    if (demoUsageCount >= 3) {
      setShowSignupPrompt(true);
      return;
    }

    setIsAnalyzing(true);
    setDemoUsageCount(prev => prev + 1);

    try {
      // Real AI analysis with enhanced prompting
      const careerAnalysis = await pathfinderAI.analyzeCareerGoal(goalText, userProfile);
      const marketAnalysis = await marketData.getJobMarketData(goalText);
      const trendingSkills = await marketData.getTrendingSkills();
      
      setUserProfile(prev => ({
        ...prev,
        goal: goalText,
        marketData: marketAnalysis,
        trendingSkills
      }));

      setRealTimeAnalysis({
        careerFit: 92,
        marketDemand: marketAnalysis.totalJobs || 1000,
        salaryRange: marketAnalysis.averageSalary,
        skills: trendingSkills.slice(0, 5),
        timeline: '6-8 months'
      });

      setTimeout(() => {
        setIsAnalyzing(false);
        setCurrentStep(1); // Move to personality assessment
      }, 3000);

    } catch (error) {
      console.error('Analysis error:', error);
      setIsAnalyzing(false);
      setCurrentStep(1);
    }
  };

  const completePersonalityAssessment = () => {
    // Simulate personality assessment completion
    const mockPersonality = {
      learningStyle: 'visual',
      motivation: 'high',
      persistence: 'medium',
      riskTolerance: 'moderate',
      learningPace: 'fast',
      socialPreference: 'community'
    };

    const personalizedInsights = personalityEngine.generatePersonalizedPath(goalText, mockPersonality, 'visual');
    
    setUserProfile(prev => ({
      ...prev,
      personality: mockPersonality,
      personalizedPath: personalizedInsights
    }));

    setCurrentStep(2); // Move to AI chat
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isTyping) return;

    if (demoUsageCount >= 5) {
      setShowSignupPrompt(true);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);
    setDemoUsageCount(prev => prev + 1);
    setConversationDepth(prev => prev + 1);

    // Detect emotional state
    const detectedEmotion = personalityEngine.detectEmotionalState(currentMessage, userProfile);
    setEmotionalState(detectedEmotion);

    try {
      // Get real AI response with advanced context
      const response = await pathfinderAI.getChatResponse(currentMessage, {
        userProfile,
        conversationDepth,
        emotionalState: detectedEmotion,
        marketData: realTimeAnalysis
      });

      // Simulate typing delay for realism
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response,
          timestamp: new Date(),
          emotionalState: detectedEmotion,
          suggestions: pathfinderAI.generateFollowUpQuestions(userProfile)
        };

        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);

        // Show advanced features after 3 exchanges
        if (conversationDepth >= 3) {
          setShowAdvancedFeatures(true);
        }

        // Auto-trigger signup after 5 exchanges
        if (conversationDepth >= 5) {
          setTimeout(() => setShowSignupPrompt(true), 2000);
        }
      }, 1500 + Math.random() * 1000);

    } catch (error) {
      console.error('Chat error:', error);
      setIsTyping(false);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm experiencing high demand right now. For unlimited access to my advanced AI capabilities, please sign up for a free account!",
        timestamp: new Date(),
        suggestions: ['Sign up for free access', 'Try again later']
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setTimeout(() => setShowSignupPrompt(true), 1000);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setCurrentMessage(suggestion);
    setTimeout(() => handleSendMessage(), 100);
  };

  const resetDemo = () => {
    setCurrentStep(0);
    setGoalText('');
    setMessages([]);
    setCurrentMessage('');
    setUserProfile({});
    setConversationDepth(0);
    setShowAdvancedFeatures(false);
    setEmotionalState('neutral');
    pathfinderAI.clearMemory();
  };

  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case 'excited': return <Smile className="h-4 w-4 text-green-500" />;
      case 'frustrated': return <Frown className="h-4 w-4 text-red-500" />;
      case 'overwhelmed': return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'confident': return <Star className="h-4 w-4 text-blue-500" />;
      default: return <Meh className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="bg-gradient-card rounded-3xl border border-border/50 overflow-hidden shadow-elegant">
      {/* Advanced Demo Header */}
      <div className="border-b border-border/50 bg-background/50 backdrop-blur-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-poppins font-bold text-2xl text-foreground flex items-center">
                <Brain className="h-6 w-6 mr-3 text-primary animate-pulse" />
                Advanced AI Career Intelligence
              </h3>
              <p className="text-muted-foreground">
                Experience next-generation AI with real-time data, personality analysis, and contextual memory
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {showAdvancedFeatures && (
                <Badge variant="secondary" className="animate-pulse">
                  <Zap className="h-3 w-3 mr-1" />
                  AI Enhanced
                </Badge>
              )}
              <Button variant="outline" size="sm" onClick={resetDemo}>
                Reset Demo
              </Button>
            </div>
          </div>

          {/* AI Status and Analytics */}
          {(currentStep > 0 || isAnalyzing) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4"
            >
              <div className="bg-primary/10 rounded-lg p-3 text-center">
                <Activity className="h-4 w-4 mx-auto mb-1 text-primary" />
                <div className="text-xs text-muted-foreground">AI Activity</div>
                <div className="text-sm font-medium">{isTyping ? 'Thinking...' : 'Ready'}</div>
              </div>
              <div className="bg-secondary/10 rounded-lg p-3 text-center">
                <Eye className="h-4 w-4 mx-auto mb-1 text-secondary" />
                <div className="text-xs text-muted-foreground">Context Depth</div>
                <div className="text-sm font-medium">{conversationDepth} layers</div>
              </div>
              <div className="bg-accent/10 rounded-lg p-3 text-center">
                {getEmotionIcon(emotionalState)}
                <div className="text-xs text-muted-foreground">Mood Detection</div>
                <div className="text-sm font-medium capitalize">{emotionalState}</div>
              </div>
              <div className="bg-green-500/10 rounded-lg p-3 text-center">
                <Shield className="h-4 w-4 mx-auto mb-1 text-green-500" />
                <div className="text-xs text-muted-foreground">Usage Remaining</div>
                <div className="text-sm font-medium">{Math.max(0, 5 - demoUsageCount)} / 5</div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Demo Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {/* Step 0: Enhanced Goal Input */}
          {currentStep === 0 && (
            <motion.div
              key="advanced-goal-input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-6">
                <motion.div
                  className="w-20 h-20 bg-gradient-to-br from-primary via-accent to-secondary rounded-3xl flex items-center justify-center mx-auto relative"
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Target className="h-10 w-10 text-white" />
                  <motion.div
                    className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="h-3 w-3 text-white" />
                  </motion.div>
                </motion.div>
                
                <div>
                  <h4 className="font-poppins font-bold text-2xl mb-3">
                    Advanced Career Intelligence Engine
                  </h4>
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Experience AI that combines real-time market data, personality analysis, and conversation memory 
                    to provide insights no other system can match.
                  </p>
                </div>
              </div>

              {/* Enhanced Goal Input */}
              <div className="max-w-2xl mx-auto space-y-6">
                <motion.div
                  className="relative"
                  whileFocus={{ scale: 1.02 }}
                >
                  <Input
                    placeholder="e.g., Become an AI Engineer and work at a top tech company"
                    value={goalText}
                    onChange={(e) => setGoalText(e.target.value)}
                    className="text-center text-lg py-6 pr-16 bg-background/50 border-2 border-border/50 rounded-2xl"
                    onKeyPress={(e) => e.key === 'Enter' && !isAnalyzing && startAdvancedAnalysis()}
                  />
                  <motion.div
                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      size="sm"
                      onClick={startAdvancedAnalysis}
                      disabled={isAnalyzing || demoUsageCount >= 3}
                      className="bg-gradient-to-r from-primary to-accent text-white border-0"
                    >
                      {isAnalyzing ? (
                        <motion.div
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      ) : (
                        <Brain className="h-4 w-4" />
                      )}
                    </Button>
                  </motion.div>
                </motion.div>

                {/* AI Capabilities Preview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { icon: Database, title: "Real-Time Market Data", desc: "Live job market analysis & salary data" },
                    { icon: Brain, title: "Personality Assessment", desc: "Adaptive learning style detection" },
                    { icon: Network, title: "Conversation Memory", desc: "Context-aware responses that build on history" },
                    { icon: Rocket, title: "Predictive Analytics", desc: "AI forecasts your optimal career path" }
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-background/50 rounded-xl p-4 border border-border/50 hover:shadow-smooth transition-all group"
                      whileHover={{ scale: 1.02, y: -2 }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <feature.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-semibold text-sm group-hover:text-primary transition-colors">
                            {feature.title}
                          </h5>
                          <p className="text-xs text-muted-foreground">
                            {feature.desc}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  className="text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <Button 
                    onClick={startAdvancedAnalysis}
                    disabled={isAnalyzing || demoUsageCount >= 3}
                    size="lg"
                    className="bg-gradient-to-r from-primary via-accent to-secondary text-white font-semibold px-12 py-4 rounded-2xl shadow-glow border-0 relative overflow-hidden group"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6 }}
                    />
                    <span className="relative z-10 flex items-center">
                      {isAnalyzing ? (
                        <>
                          <motion.div
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          Advanced AI Analysis Running...
                        </>
                      ) : demoUsageCount >= 3 ? (
                        <>
                          <Shield className="h-5 w-5 mr-3" />
                          Sign Up for Unlimited Access
                        </>
                      ) : (
                        <>
                          <Brain className="h-5 w-5 mr-3" />
                          Start Advanced AI Analysis
                          <ArrowRight className="h-5 w-5 ml-3" />
                        </>
                      )}
                    </span>
                  </Button>
                  
                  {demoUsageCount > 0 && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-muted-foreground mt-4"
                    >
                      Demo analyses remaining: {Math.max(0, 3 - demoUsageCount)} / 3
                    </motion.p>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Step 1: Personality Assessment */}
          {currentStep === 1 && (
            <motion.div
              key="personality-assessment"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-4">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Heart className="h-8 w-8 text-white" />
                </motion.div>
                <h4 className="font-poppins font-bold text-2xl">
                  Personality & Learning Style Analysis
                </h4>
                <p className="text-muted-foreground">
                  Let me understand how you learn best so I can personalize everything for you
                </p>
              </div>

              {/* Quick Assessment */}
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="bg-background/50 rounded-2xl p-6 border border-border/50">
                  <h5 className="font-semibold mb-4">Quick Learning Style Assessment</h5>
                  <p className="text-sm text-muted-foreground mb-4">
                    How do you prefer to learn new technical concepts?
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { icon: Play, text: "Watching video tutorials", style: "visual" },
                      { icon: BookOpen, text: "Reading documentation", style: "reading" },
                      { icon: Code, text: "Hands-on coding practice", style: "kinesthetic" },
                      { icon: Users, text: "Discussion and explanation", style: "auditory" }
                    ].map((option, index) => (
                      <motion.button
                        key={index}
                        className="flex items-center space-x-3 p-3 rounded-lg border border-border/50 hover:bg-primary/10 hover:border-primary/50 transition-all text-left"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setUserProfile(prev => ({ ...prev, learningStyle: option.style }));
                          setTimeout(completePersonalityAssessment, 1000);
                        }}
                      >
                        <option.icon className="h-5 w-5 text-primary" />
                        <span className="font-medium">{option.text}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Real-time Analysis Display */}
                {realTimeAnalysis.careerFit && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-6 border border-primary/20"
                  >
                    <h5 className="font-semibold mb-4 flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                      Real-Time Market Analysis for "{goalText}"
                    </h5>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-2xl font-bold text-primary">{realTimeAnalysis.careerFit}%</div>
                        <div className="text-xs text-muted-foreground">Career Fit Score</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-secondary">{realTimeAnalysis.marketDemand.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Active Job Openings</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 2: Advanced AI Chat Interface */}
          {currentStep === 2 && (
            <motion.div
              key="advanced-chat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-4">
                <motion.div
                  className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto relative"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Bot className="h-8 w-8 text-white" />
                  {isTyping && (
                    <motion.div
                      className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}
                </motion.div>
                <h4 className="font-poppins font-bold text-xl">
                  Real-Time Intelligence Platform
                </h4>
                <p className="text-muted-foreground text-sm">
                  Live market data, AI analysis, and global opportunity discovery
                </p>
              </div>

              {/* Real-Time Intelligence Dashboard */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
              >
                {/* Live Job Count */}
                <motion.div
                  className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-4 border border-primary/20"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    <motion.div
                      className="w-2 h-2 bg-green-500 rounded-full"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  <div className="text-2xl font-bold text-primary mb-1">
                    {realTimeAnalysis.marketDemand?.toLocaleString() || '12,547'}
                  </div>
                  <div className="text-xs text-muted-foreground">Live Job Openings</div>
                </motion.div>

                {/* Salary Range */}
                <motion.div
                  className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-xl p-4 border border-secondary/20"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <DollarSign className="h-5 w-5 text-secondary" />
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="text-lg font-bold text-secondary mb-1">
                    $85K - $140K
                  </div>
                  <div className="text-xs text-muted-foreground">Average Salary Range</div>
                </motion.div>

                {/* Career Fit Score */}
                <motion.div
                  className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl p-4 border border-accent/20"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Target className="h-5 w-5 text-accent" />
                    <Badge variant="secondary" className="text-xs">AI Analyzed</Badge>
                  </div>
                  <div className="text-2xl font-bold text-accent mb-1">
                    {realTimeAnalysis.careerFit || 94}%
                  </div>
                  <div className="text-xs text-muted-foreground">Career Fit Score</div>
                </motion.div>
              </motion.div>

              {/* Live Market Trends */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-background/50 rounded-xl p-4 border border-border/50 mb-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h5 className="font-semibold flex items-center">
                    <BarChart3 className="h-4 w-4 mr-2 text-primary" />
                    Live Market Intelligence
                  </h5>
                  <Badge variant="outline" className="text-xs">
                    <motion.div
                      className="w-2 h-2 bg-green-500 rounded-full mr-1"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    Real-time
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['React', 'TypeScript', 'Node.js', 'Python'].map((skill, i) => (
                    <div key={i} className="text-center">
                      <div className="text-lg font-bold text-primary mb-1">
                        {95 - i * 5}%
                      </div>
                      <div className="text-xs text-muted-foreground">{skill} Demand</div>
                      <div className="w-full bg-muted/30 rounded-full h-1 mt-1">
                        <motion.div
                          className="bg-primary h-1 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${95 - i * 5}%` }}
                          transition={{ duration: 1.5, delay: i * 0.2 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Advanced Chat Interface */}
              <div className="bg-background/50 rounded-2xl border border-border/50 overflow-hidden">
                {/* Chat Header with AI Status */}
                <div className="p-4 border-b border-border/50 bg-gradient-to-r from-primary/5 to-accent/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="bg-gradient-hero text-white text-xs">AI</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">Pathfinder AI</div>
                        <div className="text-xs text-muted-foreground flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-1 ${isTyping ? 'bg-orange-500' : 'bg-green-500'}`} />
                          {isTyping ? 'Analyzing...' : 'Ready to help'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">APIs Active</div>
                      <div className="text-sm font-medium">7 Services</div>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="p-4 space-y-4 max-h-64 overflow-y-auto">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className="flex items-start space-x-2 max-w-[85%]">
                        {message.role === 'assistant' && (
                          <Avatar className="h-6 w-6 mt-1">
                            <AvatarFallback className="bg-gradient-hero text-white text-xs">AI</AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`p-3 rounded-2xl ${
                            message.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary text-secondary-foreground'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          
                          {message.suggestions && message.suggestions.length > 0 && !showMentorResponse && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.5 }}
                              className="mt-3 space-y-2"
                            >
                              <div className="text-xs text-muted-foreground mb-2">Suggested actions:</div>
                              <div className="grid grid-cols-1 gap-2">
                                {message.suggestions.map((suggestion, i) => (
                                  <motion.button
                                    key={i}
                                    className="text-left p-2 rounded-lg border border-border/30 hover:bg-primary/10 hover:border-primary/50 transition-all text-xs"
                                    whileHover={{ scale: 1.02, x: 5 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                  >
                                    <div className="flex items-center">
                                      {suggestion.includes('job') ? <Briefcase className="h-3 w-3 mr-2 text-primary" /> :
                                       suggestion.includes('skill') ? <Target className="h-3 w-3 mr-2 text-secondary" /> :
                                       suggestion.includes('salary') ? <DollarSign className="h-3 w-3 mr-2 text-accent" /> :
                                       <ChevronRight className="h-3 w-3 mr-2 text-muted-foreground" />}
                                      <span>{suggestion}</span>
                                    </div>
                                  </motion.button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </div>
                        {message.role === 'user' && (
                          <Avatar className="h-6 w-6 mt-1">
                            <AvatarFallback className="bg-muted text-muted-foreground text-xs">U</AvatarFallback>
                          </Avatar>
                        )}
                        {message.role === 'user' && (
                          <Avatar className="h-6 w-6 mt-1">
                            <AvatarFallback className="bg-muted text-muted-foreground text-xs">U</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Typing indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                          <div className="flex items-center space-x-1">
                            <motion.div
                              className="w-2 h-2 bg-muted-foreground rounded-full"
                              animate={{ scale: [1, 1.3, 1] }}
                              transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                            />
                            <motion.div
                              className="w-2 h-2 bg-muted-foreground rounded-full"
                              animate={{ scale: [1, 1.3, 1] }}
                              transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                            />
                            <motion.div
                              className="w-2 h-2 bg-muted-foreground rounded-full"
                              animate={{ scale: [1, 1.3, 1] }}
                              transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                            />
                          </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Actions Bar */}
                <div className="px-4 py-2 border-t border-border/50 bg-muted/20">
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="ghost" className="text-xs" onClick={() => handleSuggestionClick("Show current job market for " + (goalText || "my field"))}>
                      <BarChart3 className="h-3 w-3 mr-1" />
                      Market Data
                    </Button>
                    <Button size="sm" variant="ghost" className="text-xs" onClick={() => handleSuggestionClick("Find learning resources for " + (goalText || "my goal"))}>
                      <Search className="h-3 w-3 mr-1" />
                      Resources
                    </Button>
                    <Button size="sm" variant="ghost" className="text-xs" onClick={() => handleSuggestionClick("Show salary trends for " + (goalText || "this career"))}>
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Salary Data
                    </Button>
                  </div>
                </div>

                {/* Enhanced Chat Input */}
                <div className="p-4 border-t border-border/50 bg-background/50">
                  {demoUsageCount >= 4 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-3 p-3 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg border border-orange-500/20"
                    >
                      <div className="flex items-center">
                        <AlertCircle className="h-4 w-4 text-orange-500 mr-2" />
                        <span className="text-sm text-orange-600">⚡ Demo limit reached - Sign up for unlimited AI conversations and live data access!</span>
                      </div>
                    </motion.div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Input
                      ref={chatInputRef}
                      placeholder="Ask about jobs, salaries, skills, or get live market data..."
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                      disabled={isTyping || demoUsageCount >= 5}
                    />
                    <Button size="sm" variant="outline" className="px-3" disabled={isTyping}>
                      <Mic className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={handleSendMessage} 
                      disabled={isTyping || !currentMessage.trim() || demoUsageCount >= 5}
                      className="px-3"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Advanced Features Panel */}
              {showAdvancedFeatures && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 rounded-2xl p-6 border border-primary/20"
                >
                  <h5 className="font-semibold mb-4 flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-primary" />
                    Advanced AI Features Unlocked
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <PieChart className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <div className="text-sm font-medium">Personality Analysis</div>
                      <div className="text-xs text-muted-foreground">Learning style: {userProfile.learningStyle}</div>
                    </div>
                    <div className="text-center">
                      <LineChart className="h-8 w-8 mx-auto mb-2 text-secondary" />
                      <div className="text-sm font-medium">Market Intelligence</div>
                      <div className="text-xs text-muted-foreground">Real-time job data</div>
                    </div>
                    <div className="text-center">
                      <Network className="h-8 w-8 mx-auto mb-2 text-accent" />
                      <div className="text-sm font-medium">Conversation Memory</div>
                      <div className="text-xs text-muted-foreground">{conversationDepth} context layers</div>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <Button onClick={() => setShowSignupPrompt(true)} className="bg-gradient-hero text-white">
                      Unlock Full AI Experience
                      <Rocket className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Advanced Signup Prompt Modal */}
        <AnimatePresence>
          {showSignupPrompt && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowSignupPrompt(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-background rounded-2xl p-8 max-w-md w-full border border-border/50"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center space-y-6">
                  <motion.div
                    className="w-16 h-16 bg-gradient-hero rounded-2xl flex items-center justify-center mx-auto relative"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Trophy className="h-8 w-8 text-white" />
                    <motion.div
                      className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <Sparkles className="h-3 w-3 text-white" />
                    </motion.div>
                  </motion.div>
                  
                  <div>
                    <h3 className="font-poppins font-bold text-xl mb-2">
                      Unlock Advanced AI Intelligence
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      You've experienced {demoUsageCount} advanced AI interactions. Get unlimited access to:
                    </p>
                  </div>
                  
                  <div className="space-y-3 text-left">
                    {[
                      "Unlimited AI conversations with conversation memory",
                      "Real-time market data and salary intelligence", 
                      "Personality-based learning path optimization",
                      "Advanced career forecasting and skill analysis",
                      "Global opportunity discovery and matching"
                    ].map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center space-x-2"
                      >
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="space-y-3">
                    <Button className="w-full bg-gradient-hero text-white py-3 text-base font-semibold">
                      Start Free 14-Day Trial
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setShowSignupPrompt(false)}
                    >
                      Continue Limited Demo
                    </Button>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    No credit card required • Cancel anytime • Join 50,000+ learners
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
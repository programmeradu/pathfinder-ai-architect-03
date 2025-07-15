import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Search, 
  MessageSquare, 
  Target, 
  ArrowRight, 
  Play,
  CheckCircle,
  Clock,
  Users,
  TrendingUp,
  Book,
  Video,
  FileText,
  Github,
  Mic,
  Send,
  Sparkles,
  BarChart3,
  Map,
  Zap,
  Award,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const demoSteps = [
  { id: 'goal', title: 'Set Your Goal', icon: Target },
  { id: 'analysis', title: 'AI Analysis', icon: Brain },
  { id: 'curriculum', title: 'Smart Curriculum', icon: Map },
  { id: 'mentorship', title: 'AI Mentorship', icon: MessageSquare }
];

const skillNodes = [
  { id: 'html', name: 'HTML/CSS', level: 'Foundation', progress: 100, x: 20, y: 80 },
  { id: 'js', name: 'JavaScript', level: 'Core', progress: 85, x: 45, y: 60 },
  { id: 'react', name: 'React', level: 'Core', progress: 70, x: 70, y: 40 },
  { id: 'node', name: 'Node.js', level: 'Advanced', progress: 45, x: 85, y: 20 },
  { id: 'deploy', name: 'Deployment', level: 'Advanced', progress: 20, x: 95, y: 60 }
];

const resources = [
  {
    type: 'video',
    title: 'Modern React Development',
    source: 'FreeCodeCamp',
    duration: '4.5 hours',
    rating: 4.8,
    icon: Video
  },
  {
    type: 'article',
    title: 'JavaScript ES6+ Deep Dive',
    source: 'MDN Web Docs',
    duration: '45 min read',
    rating: 4.9,
    icon: FileText
  },
  {
    type: 'project',
    title: 'Build a Full-Stack App',
    source: 'GitHub',
    duration: '3 weeks',
    rating: 4.7,
    icon: Github
  }
];

const chatMessages = [
  {
    role: 'user',
    content: "I'm struggling with React hooks. Can you help?"
  },
  {
    role: 'ai',
    content: "Absolutely! Based on your current progress, I see you're 70% through React fundamentals. Hooks can be tricky at first. Let me break down useState and useEffect with examples specific to your learning path.",
    suggestions: ['Show Hook Examples', 'Practice Exercise', 'Video Tutorial']
  }
];

export function InteractiveDemo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [goalText, setGoalText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSkillGraph, setShowSkillGraph] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [typedGoal, setTypedGoal] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [showMentorResponse, setShowMentorResponse] = useState(false);

  const typewriterRef = useRef<NodeJS.Timeout>();

  const exampleGoals = [
    "Become a Full-Stack Developer",
    "Transition to Data Science",
    "Master Machine Learning",
    "Start a Tech Career"
  ];

  useEffect(() => {
    if (currentStep === 0 && goalText) {
      // Typewriter effect
      let i = 0;
      const targetText = goalText;
      setTypedGoal('');
      
      const typeWriter = () => {
        if (i < targetText.length) {
          setTypedGoal(targetText.substring(0, i + 1));
          i++;
          typewriterRef.current = setTimeout(typeWriter, 50);
        }
      };
      typeWriter();
    }

    return () => {
      if (typewriterRef.current) {
        clearTimeout(typewriterRef.current);
      }
    };
  }, [goalText, currentStep]);

  const handleGoalSubmit = () => {
    if (!goalText) {
      setGoalText("Become a Full-Stack Developer");
    }
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setCurrentStep(1);
      setTimeout(() => setShowSkillGraph(true), 500);
    }, 2000);
  };

  const progressToNextStep = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      if (currentStep === 1) {
        setTimeout(() => setShowResources(true), 500);
      } else if (currentStep === 2) {
        setTimeout(() => setShowChat(true), 500);
      }
    }
  };

  const handleChatSubmit = () => {
    if (chatInput.trim()) {
      setChatInput('');
      setTimeout(() => setShowMentorResponse(true), 500);
    }
  };

  return (
    <div className="bg-gradient-card rounded-3xl border border-border/50 overflow-hidden shadow-elegant">
      {/* Demo Header */}
      <div className="border-b border-border/50 bg-background/50 backdrop-blur-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-poppins font-bold text-2xl text-foreground">
                Experience Pathfinder
              </h3>
              <p className="text-muted-foreground">
                Interactive demo of your AI career co-pilot
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setCurrentStep(0);
                setGoalText('');
                setShowSkillGraph(false);
                setShowResources(false);
                setShowChat(false);
                setShowMentorResponse(false);
              }}
            >
              Reset Demo
            </Button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center space-x-2">
            {demoSteps.map((step, index) => (
              <React.Fragment key={step.id}>
                <motion.div
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-all duration-300 ${
                    index <= currentStep 
                      ? 'bg-primary text-primary-foreground border-primary' 
                      : 'bg-secondary text-secondary-foreground border-border'
                  }`}
                  initial={{ scale: 0.9, opacity: 0.5 }}
                  animate={{ 
                    scale: index === currentStep ? 1.05 : 1,
                    opacity: index <= currentStep ? 1 : 0.5
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <step.icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{step.title}</span>
                  {index <= currentStep && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </motion.div>
                  )}
                </motion.div>
                {index < demoSteps.length - 1 && (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Demo Content */}
      <div className="p-8">
        <AnimatePresence mode="wait">
          {/* Step 1: Goal Input */}
          {currentStep === 0 && (
            <motion.div
              key="goal-input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center space-y-4">
                <motion.div
                  className="w-16 h-16 bg-gradient-hero rounded-2xl flex items-center justify-center mx-auto"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Target className="h-8 w-8 text-white" />
                </motion.div>
                <h4 className="font-poppins font-semibold text-xl">
                  What's your career goal?
                </h4>
                <p className="text-muted-foreground">
                  Tell us your dream job, and we'll create your personalized learning path
                </p>
              </div>

              <div className="max-w-md mx-auto space-y-4">
                <Input
                  placeholder="e.g., Become a Full-Stack Developer"
                  value={goalText}
                  onChange={(e) => setGoalText(e.target.value)}
                  className="text-center text-lg py-6"
                  onKeyPress={(e) => e.key === 'Enter' && handleGoalSubmit()}
                />
                
                <div className="flex flex-wrap gap-2 justify-center">
                  {exampleGoals.map((goal) => (
                    <Button
                      key={goal}
                      variant="outline"
                      size="sm"
                      onClick={() => setGoalText(goal)}
                      className="text-xs"
                    >
                      {goal}
                    </Button>
                  ))}
                </div>

                <Button 
                  onClick={handleGoalSubmit}
                  className="w-full bg-gradient-hero text-white py-6"
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <motion.div
                      className="flex items-center space-x-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <motion.div
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <span>Analyzing your goal...</span>
                    </motion.div>
                  ) : (
                    <>
                      Create My Learning Path
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>

                {typedGoal && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                  >
                    <div className="text-sm text-muted-foreground">Your goal:</div>
                    <div className="font-medium text-primary">{typedGoal}</div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 2: Skill Graph Analysis */}
          {currentStep === 1 && (
            <motion.div
              key="skill-analysis"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center space-y-4">
                <motion.div
                  className="w-16 h-16 bg-gradient-accent rounded-2xl flex items-center justify-center mx-auto"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Brain className="h-8 w-8 text-white" />
                </motion.div>
                <h4 className="font-poppins font-semibold text-xl">
                  AI Skill Graph Generation
                </h4>
                <p className="text-muted-foreground">
                  Our AI has analyzed "{goalText || "Full-Stack Developer"}" and created your personalized skill dependency map
                </p>
              </div>

              <AnimatePresence>
                {showSkillGraph && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="relative bg-gradient-card rounded-2xl p-6 border border-border/50"
                  >
                    <div className="text-sm font-medium mb-4 flex items-center">
                      <Map className="h-4 w-4 mr-2 text-primary" />
                      Your Learning Roadmap
                    </div>
                    
                    <div className="relative h-64 overflow-hidden">
                      {/* Skill Nodes */}
                      {skillNodes.map((skill, index) => (
                        <motion.div
                          key={skill.id}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.2 }}
                          className="absolute"
                          style={{ 
                            left: `${skill.x}%`, 
                            top: `${skill.y}%`,
                            transform: 'translate(-50%, -50%)'
                          }}
                        >
                          <motion.div
                            className={`relative px-3 py-2 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                              skill.progress === 100 
                                ? 'bg-primary text-primary-foreground border-primary' 
                                : skill.progress > 50 
                                ? 'bg-accent text-accent-foreground border-accent'
                                : 'bg-secondary text-secondary-foreground border-border'
                            }`}
                            whileHover={{ scale: 1.1, z: 10 }}
                          >
                            <div className="text-xs font-medium">{skill.name}</div>
                            <div className="text-xs opacity-80">{skill.level}</div>
                            <div className="mt-1 h-1 bg-background/20 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-background/40 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${skill.progress}%` }}
                                transition={{ delay: index * 0.2 + 0.5, duration: 0.8 }}
                              />
                            </div>
                          </motion.div>
                        </motion.div>
                      ))}

                      {/* Connection Lines */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        {skillNodes.slice(0, -1).map((skill, index) => {
                          const nextSkill = skillNodes[index + 1];
                          return (
                            <motion.line
                              key={`line-${skill.id}`}
                              x1={`${skill.x}%`}
                              y1={`${skill.y}%`}
                              x2={`${nextSkill.x}%`}
                              y2={`${nextSkill.y}%`}
                              stroke="hsl(var(--muted-foreground))"
                              strokeWidth="2"
                              strokeDasharray="4 4"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ delay: index * 0.3 + 1, duration: 0.5 }}
                            />
                          );
                        })}
                      </svg>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                      <span>5 core skills identified</span>
                      <span>Estimated timeline: 6-8 months</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="text-center">
                <Button onClick={progressToNextStep} className="bg-gradient-hero text-white">
                  Generate My Curriculum
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Smart Curriculum */}
          {currentStep === 2 && (
            <motion.div
              key="curriculum"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center space-y-4">
                <motion.div
                  className="w-16 h-16 bg-gradient-secondary rounded-2xl flex items-center justify-center mx-auto"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                >
                  <Book className="h-8 w-8 text-white" />
                </motion.div>
                <h4 className="font-poppins font-semibold text-xl">
                  Curated Learning Resources
                </h4>
                <p className="text-muted-foreground">
                  World-class content from across the internet, ranked and organized for your success
                </p>
              </div>

              <AnimatePresence>
                {showResources && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    {resources.map((resource, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2 }}
                        className="bg-background/50 rounded-xl p-4 border border-border/50 hover:shadow-smooth transition-all duration-300 cursor-pointer group"
                      >
                        <div className="flex items-start space-x-4">
                          <motion.div
                            className="w-10 h-10 bg-gradient-hero rounded-lg flex items-center justify-center"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                          >
                            <resource.icon className="h-5 w-5 text-white" />
                          </motion.div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium text-foreground group-hover:text-primary transition-colors">
                                {resource.title}
                              </h5>
                              <Badge variant="secondary" className="text-xs">
                                {resource.type}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span>{resource.source}</span>
                              <span className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {resource.duration}
                              </span>
                              <span className="flex items-center">
                                <Award className="h-3 w-3 mr-1" />
                                {resource.rating}/5
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="text-center text-sm text-muted-foreground"
                    >
                      + 47 more resources curated for your learning path
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="text-center">
                <Button onClick={progressToNextStep} className="bg-gradient-hero text-white">
                  Meet Your AI Mentor
                  <MessageSquare className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 4: AI Mentorship */}
          {currentStep === 3 && (
            <motion.div
              key="mentorship"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center space-y-4">
                <motion.div
                  className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <MessageSquare className="h-8 w-8 text-white" />
                </motion.div>
                <h4 className="font-poppins font-semibold text-xl">
                  Your Personal AI Mentor
                </h4>
                <p className="text-muted-foreground">
                  Get instant help, motivation, and guidance throughout your journey
                </p>
              </div>

              <AnimatePresence>
                {showChat && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-background/50 rounded-xl border border-border/50 overflow-hidden"
                  >
                    {/* Chat Header */}
                    <div className="p-4 border-b border-border/50 bg-gradient-to-r from-primary/5 to-accent/5">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback className="bg-gradient-hero text-white">AI</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">Pathfinder AI</div>
                          <div className="text-xs text-muted-foreground flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                            Online • Ready to help
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="p-4 space-y-4 max-h-64 overflow-y-auto">
                      {chatMessages.map((message, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.3 }}
                          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] p-3 rounded-xl ${
                              message.role === 'user'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-secondary text-secondary-foreground'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            {message.suggestions && showMentorResponse && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1 }}
                                className="mt-3 space-y-2"
                              >
                                {message.suggestions.map((suggestion, i) => (
                                  <Button
                                    key={i}
                                    variant="outline"
                                    size="sm"
                                    className="w-full text-xs"
                                  >
                                    {suggestion}
                                  </Button>
                                ))}
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 border-t border-border/50 bg-background/50">
                      <div className="flex items-center space-x-2">
                        <Input
                          placeholder="Ask about your learning path..."
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
                          className="flex-1"
                        />
                        <Button size="sm" variant="outline" className="px-3">
                          <Mic className="h-4 w-4" />
                        </Button>
                        <Button size="sm" onClick={handleChatSubmit} className="px-3">
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-center space-y-4"
              >
                <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-4 w-4" />
                    <span>Progress Tracking</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>Community Support</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Sparkles className="h-4 w-4" />
                    <span>Adaptive Learning</span>
                  </div>
                </div>
                
                <Button className="bg-gradient-hero text-white px-8">
                  Start Your Journey
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
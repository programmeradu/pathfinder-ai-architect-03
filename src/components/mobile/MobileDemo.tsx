import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Search, Target, ArrowRight, CheckCircle,
  Globe, GraduationCap, Building, Briefcase, Play, ChevronRight, RotateCcw, Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const mobileOpportunities = [
  {
    type: 'university',
    title: 'MIT CS Program',
    location: 'Boston, USA',
    description: 'Top AI specialization with research opportunities',
    cost: '$58k/year',
    icon: GraduationCap,
    match: 95,
    color: 'from-blue-500 to-purple-600',
    rating: 4.9,
    duration: '4 years',
    nextStep: 'Apply by Dec 15'
  },
  {
    type: 'bootcamp',
    title: 'Full-Stack Bootcamp',
    location: 'Multiple Cities',
    description: '12-week intensive with job guarantee',
    cost: '$15k',
    icon: Building,
    match: 88,
    color: 'from-green-500 to-teal-600',
    rating: 4.7,
    duration: '12 weeks',
    nextStep: 'Start Jan 8th'
  },
  {
    type: 'job',
    title: 'Junior Dev - Google',
    location: 'San Francisco',
    description: 'Entry level with mentorship program',
    salary: '$130k-180k',
    icon: Briefcase,
    match: 82,
    color: 'from-orange-500 to-red-600',
    rating: 4.8,
    duration: 'Full-time',
    nextStep: 'Apply now'
  },
  {
    type: 'remote',
    title: 'Remote Frontend Role',
    location: 'Global Remote',
    description: 'Work from anywhere with top startups',
    salary: '$95k-140k',
    icon: Globe,
    match: 91,
    color: 'from-purple-500 to-pink-600',
    rating: 4.6,
    duration: 'Full-time',
    nextStep: 'Skills test'
  }
];

const mobilePaths = [
  {
    title: "Academic Path",
    description: "Top universities worldwide",
    opportunities: 12,
    icon: GraduationCap,
    color: "from-blue-500 to-purple-600"
  },
  {
    title: "Fast-Track",
    description: "Bootcamps & certifications",
    opportunities: 28,
    icon: Building,
    color: "from-green-500 to-emerald-600"
  },
  {
    title: "Global Jobs",
    description: "International opportunities",
    opportunities: 45,
    icon: Globe,
    color: "from-orange-500 to-red-600"
  }
];

export function MobileDemo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [goalText, setGoalText] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const [demoUsageCount, setDemoUsageCount] = useState(0);

  const startSearch = () => {
    if (!goalText) {
      setGoalText("Full-Stack Developer");
    }
    
    // Check usage limit for demo
    if (demoUsageCount >= 2) {
      setShowSignupPrompt(true);
      return;
    }
    
    setIsSearching(true);
    setCurrentStep(1);
    setSearchProgress(0);
    setDemoUsageCount(prev => prev + 1);
    
    // Real AI search simulation with progress
    const interval = setInterval(() => {
      setSearchProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSearching(false);
          setCurrentStep(2);
          return 100;
        }
        return prev + 20;
      });
    }, 600);
  };

  const proceedToOpportunities = () => {
    // Check usage limit before proceeding
    if (demoUsageCount >= 2) {
      setShowSignupPrompt(true);
      return;
    }
    setCurrentStep(3);
    setDemoUsageCount(prev => prev + 1);
  };

  const resetDemo = () => {
    setCurrentStep(0);
    setGoalText('');
    setIsSearching(false);
    setSearchProgress(0);
  };

  return (
    <div className="bg-gradient-card rounded-2xl border border-border/50 overflow-hidden shadow-lg">
      {/* Mobile Demo Header */}
      <div className="border-b border-border/50 bg-background/50 backdrop-blur-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-poppins font-bold text-lg text-foreground flex items-center">
              <Target className="h-5 w-5 mr-2 text-primary" />
              Career Demo
            </h3>
            <p className="text-muted-foreground text-sm">
              Experience global opportunity discovery
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={resetDemo}
            className="text-xs px-2 py-1"
          >
            <RotateCcw className="h-3 w-3" />
          </Button>
        </div>

        {/* Mobile Progress */}
        {(isSearching || currentStep > 1) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{Math.round(searchProgress)}%</span>
            </div>
            <Progress value={searchProgress} className="h-1.5" />
          </motion.div>
        )}
      </div>

      {/* Mobile Demo Content */}
      <div className="p-4">
        <AnimatePresence mode="wait">
          {/* Step 0: Goal Input */}
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
                  className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Target className="h-8 w-8 text-white" />
                </motion.div>
                
                <div>
                  <h4 className="font-poppins font-bold text-lg mb-2">
                    Discover Global Pathways
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Enter your career goal and watch AI find worldwide opportunities
                  </p>
                </div>
              </div>

              {/* Mobile Goal Input */}
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    placeholder="e.g., Become a Doctor, Start a Restaurant, Teach Abroad"
                    value={goalText}
                    onChange={(e) => setGoalText(e.target.value)}
                    className="text-center py-3 pr-12 bg-background/50 rounded-xl"
                    onKeyPress={(e) => e.key === 'Enter' && !isSearching && startSearch()}
                  />
                  <motion.div
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      size="sm"
                    onClick={startSearch}
                      disabled={isSearching || demoUsageCount >= 2}
                      className="bg-gradient-to-r from-primary to-accent text-white border-0 px-2 py-1"
                    >
                      <Search className="h-3 w-3" />
                    </Button>
                  </motion.div>
                </div>

                {/* Mobile Path Preview */}
                <div className="space-y-3">
                  {mobilePaths.map((path, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-background/50 rounded-lg p-3 border border-border/50"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 bg-gradient-to-br ${path.color} rounded-lg flex items-center justify-center`}>
                          <path.icon className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-semibold text-sm">{path.title}</h5>
                          <p className="text-xs text-muted-foreground">{path.description}</p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {path.opportunities}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <Button 
                  onClick={startSearch}
                  disabled={isSearching || demoUsageCount >= 2}
                  className="w-full bg-gradient-to-r from-primary to-accent text-white font-semibold py-3 rounded-xl"
                >
                  {isSearching ? (
                    <>
                      <motion.div
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Searching...
                    </>
                ) : demoUsageCount >= 2 ? (
                    <>
                      Sign Up for Full Access
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Start AI Global Search
                    </>
                  )}
                </Button>
                
                {demoUsageCount > 0 && demoUsageCount < 2 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center"
                  >
                    <div className="text-xs text-muted-foreground">
                      Demo uses remaining: {2 - demoUsageCount}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 1: Searching */}
          {currentStep === 1 && (
            <motion.div
              key="searching"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center space-y-4">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Search className="h-8 w-8 text-white" />
                </motion.div>
                
                <div>
                  <h4 className="font-poppins font-bold text-lg mb-2">
                    Scanning Global Networks
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    AI analyzing opportunities for "{goalText || "Full-Stack Developer"}"
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Learning Paths */}
          {currentStep === 2 && (
            <motion.div
              key="learning-paths"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center space-y-4">
                <motion.div
                  className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <GraduationCap className="h-7 w-7 text-white" />
                </motion.div>
                <div>
                  <h4 className="font-poppins font-bold text-lg">Learning Paths Found</h4>
                  <p className="text-muted-foreground text-sm">
                    Choose your approach for "{goalText || "Full-Stack Developer"}"
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {mobilePaths.map((path, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-background/50 rounded-xl p-4 border border-border/50 cursor-pointer hover:shadow-smooth transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 bg-gradient-to-br ${path.color} rounded-lg flex items-center justify-center`}>
                        <path.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold">{path.title}</h5>
                        <p className="text-xs text-muted-foreground">{path.description}</p>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {path.opportunities} opportunities
                        </Badge>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </motion.div>
                ))}
              </div>

              <Button 
                onClick={proceedToOpportunities}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 rounded-xl"
              >
                View Career Opportunities
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </motion.div>
          )}

          {/* Step 3: Opportunities */}
          {currentStep === 3 && (
            <motion.div
              key="opportunities"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center space-y-4">
                <motion.div
                  className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mx-auto"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Briefcase className="h-7 w-7 text-white" />
                </motion.div>
                <div>
                  <h4 className="font-poppins font-bold text-lg">Global Opportunities</h4>
                  <p className="text-muted-foreground text-sm">
                    Best paths for "{goalText || "Full-Stack Developer"}"
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {mobileOpportunities.map((opportunity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-background/50 rounded-xl p-4 border border-border/50"
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 bg-gradient-to-br ${opportunity.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <opportunity.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h5 className="font-semibold text-sm truncate">{opportunity.title}</h5>
                          <Badge variant="secondary" className="text-xs ml-2">
                            {opportunity.match}% match
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">{opportunity.location}</p>
                        <p className="text-xs text-muted-foreground mb-2">{opportunity.description}</p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-primary">
                              {opportunity.cost || opportunity.salary}
                            </span>
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 text-yellow-500 fill-current" />
                              <span className="text-xs font-medium">{opportunity.rating}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Duration: {opportunity.duration}</span>
                            <span className="text-accent font-medium">{opportunity.nextStep}</span>
                          </div>
                          <Button size="sm" variant="outline" className="text-xs px-2 py-1 w-full mt-2">
                            Learn More
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={resetDemo}
                  variant="outline"
                  className="flex-1 py-3 rounded-xl"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button 
                  className="flex-1 bg-gradient-to-r from-primary to-accent text-white py-3 rounded-xl"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Mobile Signup Prompt Modal */}
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
                className="bg-background rounded-2xl p-6 max-w-sm w-full border border-border/50"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center space-y-6">
                  <motion.div
                    className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center mx-auto"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Star className="h-7 w-7 text-white" />
                  </motion.div>
                  
                  <div>
                    <h3 className="font-poppins font-bold text-lg mb-2">
                      Unlock Full AI Experience
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      You've used {demoUsageCount} demo searches. Get unlimited AI-powered career guidance and global opportunity discovery.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <Button className="w-full bg-gradient-to-r from-primary to-accent text-white py-3 rounded-xl">
                      Start Free Trial
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full rounded-xl"
                      onClick={() => setShowSignupPrompt(false)}
                    >
                      Demo Later
                    </Button>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    No credit card • 7-day trial
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
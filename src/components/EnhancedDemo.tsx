import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Search, MessageSquare, Target, ArrowRight, CheckCircle,
  Globe, GraduationCap, Building, Briefcase, Plane, Radar,
  MapPin, DollarSign, Calendar, ExternalLink, Compass,
  Database, Network, Satellite, Route, TrendingUp, Award,
  Sparkles, BarChart3, Clock, Users, Play, ChevronRight, RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const globalOpportunities = [
  {
    type: 'university',
    title: 'MIT Computer Science',
    location: 'Boston, USA',
    description: 'Top-ranked CS program with AI specialization',
    cost: '$58,000/year',
    icon: GraduationCap,
    match: 95,
    color: 'from-blue-500 to-purple-600'
  },
  {
    type: 'bootcamp',
    title: 'General Assembly Software Engineering',
    location: 'Multiple Cities',
    description: '12-week intensive full-stack program',
    cost: '$15,000',
    icon: Building,
    match: 88,
    color: 'from-green-500 to-teal-600'
  },
  {
    type: 'job',
    title: 'Junior Developer - Google',
    location: 'San Francisco, USA',
    description: 'Entry-level position with mentorship',
    salary: '$130,000 - $180,000',
    icon: Briefcase,
    match: 82,
    color: 'from-orange-500 to-red-600'
  },
  {
    type: 'fellowship',
    title: 'Tech Fellowship - Berlin',
    location: 'Berlin, Germany',
    description: '6-month paid program with visa support',
    stipend: '€2,500/month',
    icon: Plane,
    match: 91,
    color: 'from-purple-500 to-pink-600'
  },
  {
    type: 'internship',
    title: 'Microsoft Internship Program',
    location: 'Seattle, USA',
    description: 'Summer internship with full-time potential',
    salary: '$8,000/month',
    icon: Building,
    match: 86,
    color: 'from-indigo-500 to-blue-600'
  },
  {
    type: 'remote',
    title: 'Remote Full-Stack Developer',
    location: 'Global Remote',
    description: 'Work from anywhere with international team',
    salary: '$90,000 - $120,000',
    icon: Globe,
    match: 78,
    color: 'from-cyan-500 to-blue-600'
  }
];

const searchStages = [
  { id: 'scanning', title: 'Scanning Global Networks', icon: Radar, delay: 800 },
  { id: 'academic', title: 'Analyzing Academic Pathways', icon: GraduationCap, delay: 1200 },
  { id: 'vocational', title: 'Finding Training Programs', icon: Building, delay: 1000 },
  { id: 'careers', title: 'Matching Career Opportunities', icon: Briefcase, delay: 1500 },
  { id: 'global', title: 'Discovering Global Pathways', icon: Globe, delay: 900 },
  { id: 'relocation', title: 'Immigration & Relocation Support', icon: Plane, delay: 1100 },
  { id: 'complete', title: 'Analysis Complete', icon: CheckCircle, delay: 600 }
];

const careerPaths = [
  {
    title: "Academic Excellence Path",
    description: "Top universities & research programs worldwide",
    opportunities: 12,
    icon: GraduationCap,
    color: "from-blue-500 to-purple-600"
  },
  {
    title: "Industry Fast-Track",
    description: "Bootcamps, certifications & direct industry entry",
    opportunities: 28,
    icon: Building,
    color: "from-green-500 to-emerald-600"
  },
  {
    title: "Global Opportunities",
    description: "International jobs, fellowships & relocations",
    opportunities: 45,
    icon: Globe,
    color: "from-orange-500 to-red-600"
  },
  {
    title: "Remote Career Builder",
    description: "Location-independent career development",
    opportunities: 34,
    icon: Network,
    color: "from-purple-500 to-pink-600"
  }
];

export function EnhancedDemo() {
  const [currentStage, setCurrentStage] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [goalText, setGoalText] = useState('');
  const [showOpportunities, setShowOpportunities] = useState(false);
  const [selectedPath, setSelectedPath] = useState<number | null>(null);
  const [searchProgress, setSearchProgress] = useState(0);

  const startGlobalSearch = () => {
    if (!goalText) {
      setGoalText("Become a Full-Stack Developer");
    }
    
    setIsSearching(true);
    setCurrentStage(0);
    setSearchProgress(0);
    
    // Simulate progressive search stages
    searchStages.forEach((stage, index) => {
      setTimeout(() => {
        setCurrentStage(index);
        setSearchProgress(((index + 1) / searchStages.length) * 100);
        
        if (index === searchStages.length - 1) {
          setIsSearching(false);
          setShowOpportunities(true);
        }
      }, searchStages.slice(0, index + 1).reduce((acc, s) => acc + s.delay, 0));
    });
  };

  const resetDemo = () => {
    setCurrentStage(0);
    setIsSearching(false);
    setGoalText('');
    setShowOpportunities(false);
    setSelectedPath(null);
    setSearchProgress(0);
  };

  return (
    <div className="bg-gradient-card rounded-3xl border border-border/50 overflow-hidden shadow-elegant">
      {/* Demo Header */}
      <div className="border-b border-border/50 bg-background/50 backdrop-blur-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-poppins font-bold text-2xl text-foreground flex items-center">
                <Compass className="h-6 w-6 mr-3 text-primary" />
                Global Opportunity Engine Demo
              </h3>
              <p className="text-muted-foreground">
                Experience how Pathfinder discovers worldwide opportunities for your career
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={resetDemo}
            >
              Reset Demo
            </Button>
          </div>

          {/* Search Progress */}
          {(isSearching || showOpportunities) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Global Search Progress</span>
                <span className="font-medium">{Math.round(searchProgress)}%</span>
              </div>
              <Progress value={searchProgress} className="h-2" />
              
              {isSearching && currentStage < searchStages.length && (
                <motion.div
                  key={currentStage}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center space-x-3 text-sm"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    {React.createElement(searchStages[currentStage].icon, { className: "h-4 w-4 text-primary" })}
                  </motion.div>
                  <span className="font-medium">{searchStages[currentStage].title}</span>
                  <motion.div
                    className="flex space-x-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-1 h-1 bg-primary rounded-full"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ 
                          duration: 1.5, 
                          repeat: Infinity, 
                          delay: i * 0.2 
                        }}
                      />
                    ))}
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Demo Content */}
      <div className="p-8">
        <AnimatePresence mode="wait">
          {!showOpportunities ? (
            <motion.div
              key="goal-input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Goal Input Section */}
              <div className="text-center space-y-6">
                <motion.div
                  className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center mx-auto"
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Target className="h-10 w-10 text-white" />
                </motion.div>
                
                <div>
                  <h4 className="font-poppins font-bold text-2xl mb-3">
                    Discover Your Global Career Pathways
                  </h4>
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Enter your career goal and watch our AI scan the entire world for opportunities - 
                    from top universities to dream jobs, from training programs to relocation pathways.
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
                    placeholder="e.g., Become a Full-Stack Developer and work in Silicon Valley"
                    value={goalText}
                    onChange={(e) => setGoalText(e.target.value)}
                    className="text-center text-lg py-6 pr-16 bg-background/50 border-2 border-border/50 rounded-2xl"
                    onKeyPress={(e) => e.key === 'Enter' && !isSearching && startGlobalSearch()}
                  />
                  <motion.div
                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      size="sm"
                      onClick={startGlobalSearch}
                      disabled={isSearching}
                      className="bg-gradient-to-r from-primary to-accent text-white border-0"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Career Path Preview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {careerPaths.map((path, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-background/50 rounded-xl p-4 border border-border/50 hover:shadow-smooth transition-all cursor-pointer group"
                      whileHover={{ scale: 1.02, y: -2 }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-10 h-10 bg-gradient-to-br ${path.color} rounded-lg flex items-center justify-center`}>
                          <path.icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-semibold text-sm group-hover:text-primary transition-colors">
                            {path.title}
                          </h5>
                          <p className="text-xs text-muted-foreground mb-2">
                            {path.description}
                          </p>
                          <Badge variant="secondary" className="text-xs">
                            {path.opportunities} opportunities
                          </Badge>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  className="text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button 
                    onClick={startGlobalSearch}
                    disabled={isSearching}
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
                      {isSearching ? (
                        <>
                          <motion.div
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          Scanning Global Opportunities...
                        </>
                      ) : (
                        <>
                          <Radar className="h-5 w-5 mr-3" />
                          Start Global Search
                          <ArrowRight className="h-5 w-5 ml-3" />
                        </>
                      )}
                    </span>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            /* Global Opportunities Results */
            <motion.div
              key="opportunities"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="text-center space-y-4">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <CheckCircle className="h-8 w-8 text-white" />
                </motion.div>
                <h4 className="font-poppins font-bold text-2xl">
                  Global Opportunities Discovered
                </h4>
                <p className="text-muted-foreground">
                  Found {globalOpportunities.length} perfect matches for "{goalText || "Full-Stack Developer"}" across the world
                </p>
              </div>

              {/* Opportunities Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {globalOpportunities.map((opportunity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-background/50 rounded-2xl p-6 border border-border/50 hover:shadow-glow transition-all duration-500 cursor-pointer group relative overflow-hidden"
                    whileHover={{ scale: 1.02, y: -5 }}
                  >
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${opportunity.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
                    
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${opportunity.color} rounded-xl flex items-center justify-center`}>
                          <opportunity.icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary" className="text-xs mb-2">
                            {opportunity.match}% match
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            {opportunity.type}
                          </div>
                        </div>
                      </div>
                      
                      <h5 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                        {opportunity.title}
                      </h5>
                      
                      <div className="flex items-center text-sm text-muted-foreground mb-3">
                        <MapPin className="h-4 w-4 mr-1" />
                        {opportunity.location}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4">
                        {opportunity.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm font-medium">
                          <DollarSign className="h-4 w-4 mr-1 text-green-500" />
                          {opportunity.cost || opportunity.salary || opportunity.stipend}
                        </div>
                        <Button variant="outline" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-center space-y-4"
              >
                <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-primary to-accent text-white px-8"
                  >
                    <Sparkles className="h-5 w-5 mr-2" />
                    Create My Complete Path
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={resetDemo}
                  >
                    Try Another Goal
                  </Button>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  This demo shows just a fraction of what Pathfinder can discover for your career
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
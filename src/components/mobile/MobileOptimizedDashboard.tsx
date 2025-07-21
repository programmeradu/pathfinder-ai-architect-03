/**
 * Mobile-Optimized Dashboard Component
 * Fully responsive dashboard optimized for mobile devices
 */

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  TrendingUp, 
  Briefcase, 
  Target,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Activity,
  Zap,
  Globe,
  Users
} from 'lucide-react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { useBreakpoint } from '@/contexts/ThemeContext';
import { useGlobalStore } from '@/store/globalStore';

interface SwipeableCard {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  content: React.ReactNode;
  color: string;
}

export const MobileOptimizedDashboard: React.FC = () => {
  const { isMobile, isTablet } = useBreakpoint();
  const user = useGlobalStore((state) => state.user);
  const isAnalyzing = useGlobalStore((state) => state.isAnalyzing);
  const analysisProgress = useGlobalStore((state) => state.analysisProgress);
  
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const constraintsRef = useRef(null);

  const swipeableCards: SwipeableCard[] = [
    {
      id: 'ai-processing',
      title: 'AI Processing',
      icon: Brain,
      color: 'from-purple-500 to-indigo-600',
      content: (
        <div className="space-y-4">
          {isAnalyzing ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-white">Analyzing...</span>
                <span className="font-mono text-white">{Math.round(analysisProgress)}%</span>
              </div>
              <Progress value={analysisProgress} className="bg-white/20" />
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/10 p-3 rounded-lg text-center">
                  <Zap className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-xs">Processing</span>
                </div>
                <div className="bg-white/10 p-3 rounded-lg text-center">
                  <Activity className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-xs">Active</span>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <Brain className="w-12 h-12 mx-auto mb-3 opacity-80" />
              <h3 className="text-lg font-semibold mb-2 text-white">Ready for Analysis</h3>
              <Button variant="secondary" size="sm">
                Start Analysis
              </Button>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'market-trends',
      title: 'Market Trends',
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-600',
      content: (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-white font-medium">Hot Skills Today</span>
            <Badge variant="secondary" className="bg-white/20 text-white">
              Live
            </Badge>
          </div>
          <div className="space-y-2">
            {[
              { skill: 'AI/ML', change: '+15%', trending: true },
              { skill: 'React', change: '+12%', trending: true },
              { skill: 'Python', change: '+8%', trending: false },
            ].map((item) => (
              <div key={item.skill} className="flex justify-between items-center bg-white/10 p-2 rounded">
                <span className="text-white text-sm">{item.skill}</span>
                <div className="flex items-center text-green-300">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  <span className="text-xs">{item.change}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'opportunities',
      title: 'New Opportunities',
      icon: Briefcase,
      color: 'from-green-500 to-emerald-600',
      content: (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-white font-medium">Latest Jobs</span>
            <Badge variant="secondary" className="bg-white/20 text-white">
              247 New
            </Badge>
          </div>
          <div className="space-y-2">
            {[
              { title: 'Senior AI Engineer', company: 'TechCorp', match: '95%' },
              { title: 'ML Researcher', company: 'DataLab', match: '88%' },
              { title: 'Full Stack Dev', company: 'StartupX', match: '82%' },
            ].map((job) => (
              <div key={job.title} className="bg-white/10 p-3 rounded">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-white font-medium text-sm">{job.title}</h4>
                    <p className="text-white/80 text-xs">{job.company}</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                    {job.match}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'goals',
      title: 'Career Goals',
      icon: Target,
      color: 'from-orange-500 to-red-600',
      content: (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-white font-medium">Progress</span>
            <Badge variant="secondary" className="bg-white/20 text-white">
              3 Active
            </Badge>
          </div>
          <div className="space-y-3">
            {[
              { goal: 'Learn Machine Learning', progress: 75 },
              { goal: 'Get Senior Role', progress: 45 },
              { goal: 'Build Portfolio', progress: 90 },
            ].map((item) => (
              <div key={item.goal} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-white text-sm">{item.goal}</span>
                  <span className="text-white/80 text-xs">{item.progress}%</span>
                </div>
                <Progress value={item.progress} className="bg-white/20 h-2" />
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  const handleSwipe = (event: any, info: PanInfo) => {
    const swipeThreshold = 50;
    
    if (info.offset.x > swipeThreshold && currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    } else if (info.offset.x < -swipeThreshold && currentCardIndex < swipeableCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const nextCard = () => {
    if (currentCardIndex < swipeableCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  if (!isMobile && !isTablet) {
    // Return desktop version for larger screens
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {swipeableCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.id} className={`border-0 shadow-lg bg-gradient-to-r ${card.color} text-white`}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <Icon className="w-5 h-5 mr-2" />
                  {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {card.content}
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  }

  return (
    <div className="mobile-dashboard">
      
      {/* Mobile Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!
            </h1>
            <p className="text-sm text-gray-600">Your career dashboard</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white border-b border-gray-200 p-4"
          >
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" size="sm" className="justify-start">
                <Globe className="w-4 h-4 mr-2" />
                Global Search
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                <Users className="w-4 h-4 mr-2" />
                Network
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                <Target className="w-4 h-4 mr-2" />
                Set Goals
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                <Activity className="w-4 h-4 mr-2" />
                Analytics
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Swipeable Cards Container */}
      <div className="p-4">
        <div className="relative overflow-hidden" ref={constraintsRef}>
          <motion.div
            className="flex"
            animate={{ x: -currentCardIndex * (window.innerWidth - 32) }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {swipeableCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.id}
                  className="flex-shrink-0 w-full pr-4"
                  drag="x"
                  dragConstraints={constraintsRef}
                  onDragEnd={handleSwipe}
                  whileDrag={{ scale: 0.95 }}
                >
                  <Card className={`border-0 shadow-xl bg-gradient-to-r ${card.color} text-white h-80`}>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center justify-between text-lg">
                        <div className="flex items-center">
                          <Icon className="w-6 h-6 mr-3" />
                          {card.title}
                        </div>
                        <div className="flex space-x-1">
                          {swipeableCards.map((_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-full ${
                                i === index ? 'bg-white' : 'bg-white/40'
                              }`}
                            />
                          ))}
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {card.content}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-between items-center mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={prevCard}
            disabled={currentCardIndex === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>

          <div className="flex space-x-2">
            {swipeableCards.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentCardIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentCardIndex ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={nextCard}
            disabled={currentCardIndex === swipeableCards.length - 1}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button className="h-16 flex-col bg-gradient-to-r from-blue-500 to-purple-600">
              <Brain className="w-6 h-6 mb-1" />
              <span className="text-xs">Start Analysis</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <TrendingUp className="w-6 h-6 mb-1" />
              <span className="text-xs">View Trends</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <Briefcase className="w-6 h-6 mb-1" />
              <span className="text-xs">Find Jobs</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <Target className="w-6 h-6 mb-1" />
              <span className="text-xs">Set Goals</span>
            </Button>
          </div>
        </div>

        {/* Mobile-specific insights */}
        <div className="mt-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Today's Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-sm">3 new job matches found</span>
                </div>
                <div className="flex items-center p-3 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm">React skills in high demand</span>
                </div>
                <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  <span className="text-sm">Profile completion: 85%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

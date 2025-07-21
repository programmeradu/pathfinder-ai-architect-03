/**
 * Mobile Dashboard - Beautiful Mobile-First Experience
 * Touch-optimized dashboard with swipeable cards and mobile interactions
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Globe, 
  Users,
  Zap,
  ChevronRight,
  Plus,
  Bell,
  Search,
  Menu,
  MoreHorizontal
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useGlobalStore } from '@/store/globalStore';
import { cn } from '@/lib/utils';

interface DashboardCard {
  id: string;
  title: string;
  subtitle: string;
  value: string;
  change: number;
  icon: React.ComponentType<any>;
  color: string;
  action?: string;
}

interface MobileDashboardProps {
  className?: string;
}

const dashboardCards: DashboardCard[] = [
  {
    id: 'ai-analysis',
    title: 'AI Career Analysis',
    subtitle: 'Your personalized insights',
    value: '94% Match',
    change: 12,
    icon: Brain,
    color: 'from-purple-500 to-pink-500',
    action: 'View Details'
  },
  {
    id: 'market-trends',
    title: 'Market Trends',
    subtitle: 'Real-time intelligence',
    value: '+23% Growth',
    change: 8,
    icon: TrendingUp,
    color: 'from-green-500 to-emerald-500',
    action: 'Explore'
  },
  {
    id: 'skill-gaps',
    title: 'Skill Opportunities',
    subtitle: 'Areas to improve',
    value: '3 Skills',
    change: -5,
    icon: Target,
    color: 'from-blue-500 to-cyan-500',
    action: 'Learn More'
  },
  {
    id: 'global-ops',
    title: 'Global Opportunities',
    subtitle: 'Worldwide positions',
    value: '1.2K Jobs',
    change: 15,
    icon: Globe,
    color: 'from-orange-500 to-red-500',
    action: 'Browse'
  }
];

const quickActions = [
  { id: 'start-analysis', label: 'Start Analysis', icon: Brain, color: 'bg-purple-500' },
  { id: 'browse-jobs', label: 'Browse Jobs', icon: Search, color: 'bg-blue-500' },
  { id: 'skill-test', label: 'Skill Test', icon: Target, color: 'bg-green-500' },
  { id: 'network', label: 'Network', icon: Users, color: 'bg-orange-500' },
];

export const MobileDashboard: React.FC<MobileDashboardProps> = ({ className }) => {
  const { user } = useGlobalStore();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const constraintsRef = useRef(null);

  const x = useMotionValue(0);
  const background = useTransform(
    x,
    [-100, 0, 100],
    ['#ef4444', '#ffffff', '#10b981']
  );

  const handleCardSwipe = (event: any, info: PanInfo) => {
    const threshold = 50;
    
    if (info.offset.x > threshold && currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
    } else if (info.offset.x < -threshold && currentCardIndex < dashboardCards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    }
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className={cn("min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50", className)}>
      {/* Mobile Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/20 px-4 py-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="p-2">
              <Menu className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-bold text-lg text-gray-900">
                {greeting()}, {user?.name?.split(' ')[0] || 'User'}!
              </h1>
              <p className="text-xs text-gray-600">Ready to explore your career?</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="p-2 relative">
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 bg-red-500 text-white text-xs">
                3
              </Badge>
            </Button>
            <Avatar className="w-8 h-8">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs">
                {user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="px-4 py-6 space-y-6">
        {/* AI Status Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white overflow-hidden">
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
                  >
                    <Brain className="w-5 h-5" />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold">AI Analysis Ready</h3>
                    <p className="text-white/80 text-sm">Tap to start your career analysis</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-white/80" />
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="text-2xl font-bold">94%</div>
                  <div className="text-white/80 text-sm">Profile Complete</div>
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-bold">5</div>
                  <div className="text-white/80 text-sm">Skills Analyzed</div>
                </div>
              </div>

              {/* Floating particles */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white/30 rounded-full"
                    animate={{
                      x: [0, 50, 0],
                      y: [0, -30, 0],
                      opacity: [0.3, 0.8, 0.3],
                    }}
                    transition={{
                      duration: 3 + i,
                      repeat: Infinity,
                      delay: i * 0.5,
                    }}
                    style={{
                      left: `${20 + i * 12}%`,
                      top: `${30 + i * 8}%`,
                    }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Swipeable Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Your Insights</h2>
            <div className="flex space-x-1">
              {dashboardCards.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    index === currentCardIndex ? "bg-indigo-500" : "bg-gray-300"
                  )}
                />
              ))}
            </div>
          </div>

          <div className="relative h-48 overflow-hidden" ref={constraintsRef}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentCardIndex}
                drag="x"
                dragConstraints={constraintsRef}
                dragElastic={0.2}
                onDragEnd={handleCardSwipe}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute inset-0"
              >
                <Card className="h-full border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6 h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${dashboardCards[currentCardIndex].color} flex items-center justify-center`}>
                          <dashboardCards[currentCardIndex].icon className="w-6 h-6 text-white" />
                        </div>
                        <Badge className={cn(
                          "text-xs",
                          dashboardCards[currentCardIndex].change > 0 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                        )}>
                          {dashboardCards[currentCardIndex].change > 0 ? '+' : ''}{dashboardCards[currentCardIndex].change}%
                        </Badge>
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {dashboardCards[currentCardIndex].title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {dashboardCards[currentCardIndex].subtitle}
                      </p>
                      <div className="text-2xl font-bold text-gray-900">
                        {dashboardCards[currentCardIndex].value}
                      </div>
                    </div>
                    
                    {dashboardCards[currentCardIndex].action && (
                      <Button 
                        size="sm" 
                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                      >
                        {dashboardCards[currentCardIndex].action}
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowQuickActions(!showQuickActions)}
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>

          <motion.div
            layout
            className="grid grid-cols-2 gap-3"
          >
            <AnimatePresence>
              {quickActions.slice(0, showQuickActions ? quickActions.length : 4).map((action, index) => (
                <motion.div
                  key={action.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-4 text-center">
                      <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                        <action.icon className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-medium text-gray-900 text-sm">{action.label}</h4>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
          
          <div className="space-y-3">
            {[
              { action: 'Completed skill assessment', time: '2 hours ago', icon: Target },
              { action: 'New job matches found', time: '4 hours ago', icon: Zap },
              { action: 'Profile updated', time: '1 day ago', icon: Users },
            ].map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center space-x-3 p-3 rounded-lg bg-white/60 backdrop-blur-sm"
              >
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <activity.icon className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-600">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Floating Action Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
        className="fixed bottom-6 right-6"
      >
        <Button
          size="lg"
          className="w-14 h-14 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </motion.div>
    </div>
  );
};

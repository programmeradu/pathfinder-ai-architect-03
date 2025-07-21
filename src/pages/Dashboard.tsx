/**
 * Dashboard Page - Beautiful AI-Powered Career Intelligence
 * World-class UI/UX with sophisticated animations and real-time data
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Brain,
  TrendingUp,
  Users,
  Globe,
  Zap,
  Activity,
  BarChart3,
  Target,
  Sparkles,
  ArrowRight,
  Star,
  Clock,
  Award,
  Compass,
  Lightbulb,
  Rocket
} from 'lucide-react';
import { useGlobalStore } from '@/store/globalStore';
import { AIProcessingPanel } from '@/components/ai/AIProcessingPanel';
import { RealTimeDataFeed } from '@/components/dashboard/RealTimeDataFeed';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export const Dashboard: React.FC = () => {
  const user = useGlobalStore((state) => state.user);
  const isAnalyzing = useGlobalStore((state) => state.isAnalyzing);
  const analysisProgress = useGlobalStore((state) => state.analysisProgress);
  const modelStatus = useGlobalStore((state) => state.modelStatus);
  const setAnalyzing = useGlobalStore((state) => state.setAnalyzing);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const hour = currentTime.getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, [currentTime]);

  const handleStartAnalysis = () => {
    setAnalyzing(true);
    // Simulate analysis process
    setTimeout(() => setAnalyzing(false), 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Beautiful Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center"
              >
                <Brain className="w-6 h-6 text-white" />
              </motion.div>

              <div>
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent"
                >
                  {greeting}{user?.name ? `, ${user.name.split(' ')[0]}` : ''}! ✨
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-600 mt-1 font-medium"
                >
                  Your AI-powered career intelligence awaits
                </motion.p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              >
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 px-3 py-1">
                  <Activity className="w-3 h-3 mr-1" />
                  AI Systems Online
                </Badge>
              </motion.div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              >
                <Button
                  onClick={handleStartAnalysis}
                  disabled={isAnalyzing}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isAnalyzing ? (
                    <>
                      <LoadingSpinner size="sm" color="white" />
                      <span className="ml-2">Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Start AI Analysis
                    </>
                  )}
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column - AI Processing & Analytics */}
          <div className="lg:col-span-2 space-y-8">

            {/* AI Processing Panel */}
            <motion.div variants={itemVariants}>
              <AIProcessingPanel />
            </motion.div>

            {/* Real-time Market Intelligence */}
            <motion.div variants={itemVariants}>
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-500">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-xl font-bold">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mr-3"
                    >
                      <Activity className="w-4 h-4 text-white" />
                    </motion.div>
                    Live Market Intelligence
                    <Badge className="ml-2 bg-red-500 text-white animate-pulse">LIVE</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RealTimeDataFeed />
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions Grid */}
            <motion.div variants={itemVariants}>
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Rocket className="w-5 h-5 mr-2 text-indigo-600" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { icon: Target, label: 'Set Goals', color: 'from-blue-500 to-cyan-500' },
                      { icon: BarChart3, label: 'Skill Analysis', color: 'from-purple-500 to-pink-500' },
                      { icon: Globe, label: 'Global Search', color: 'from-green-500 to-teal-500' },
                      { icon: Users, label: 'Network', color: 'from-orange-500 to-red-500' },
                    ].map((action, index) => (
                      <motion.div
                        key={action.label}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="cursor-pointer"
                      >
                        <Button
                          variant="outline"
                          className="h-24 w-full flex-col border-2 border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 transition-all duration-300"
                        >
                          <div className={`w-8 h-8 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center mb-2`}>
                            <action.icon className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-xs font-medium text-gray-700">{action.label}</span>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Career Insights */}
            <motion.div variants={itemVariants}>
              <Card className="border-0 shadow-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Lightbulb className="w-6 h-6 mr-3" />
                    AI-Powered Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        title: "Skill Gap Opportunity",
                        description: "Learning React Native could increase your market value by 23%",
                        icon: TrendingUp,
                        color: "bg-yellow-500/20",
                      },
                      {
                        title: "Market Trend Alert",
                        description: "AI/ML roles in your area increased 45% this quarter",
                        icon: Activity,
                        color: "bg-green-500/20",
                      },
                      {
                        title: "Perfect Match Found",
                        description: "5 new positions match your profile with 95% compatibility",
                        icon: Star,
                        color: "bg-blue-500/20",
                      },
                    ].map((insight, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + index * 0.2 }}
                        className={`p-4 rounded-lg ${insight.color} border border-white/20`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                            <insight.icon className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-white mb-1">{insight.title}</h4>
                            <p className="text-white/90 text-sm">{insight.description}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

            {/* Real-time Data Feed */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-green-600" />
                  Real-time Market Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-green-800">
                        Hot Skills Today
                      </span>
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>AI/ML Engineering</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          +15%
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Cloud Architecture</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          +12%
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-800">
                        Global Opportunities
                      </span>
                      <Globe className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Remote Positions</span>
                        <span className="font-semibold text-blue-800">2,847</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>International</span>
                        <span className="font-semibold text-blue-800">1,203</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex-col">
                    <Target className="w-6 h-6 mb-2" />
                    <span className="text-xs">Career Goals</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <BarChart3 className="w-6 h-6 mb-2" />
                    <span className="text-xs">Skill Analysis</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Globe className="w-6 h-6 mb-2" />
                    <span className="text-xs">Global Search</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Users className="w-6 h-6 mb-2" />
                    <span className="text-xs">Network</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Status & Progress */}
          <div className="space-y-8">

            {/* AI Models Status */}
            <motion.div variants={itemVariants}>
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Brain className="w-5 h-5 mr-2 text-indigo-600" />
                    AI Models Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: 'Career DNA', status: 'active', accuracy: 94, color: 'from-green-500 to-emerald-600' },
                      { name: 'Skill Demand', status: 'active', accuracy: 91, color: 'from-blue-500 to-cyan-600' },
                      { name: 'Opportunity Oracle', status: 'training', accuracy: 89, color: 'from-yellow-500 to-orange-600' },
                      { name: 'Culture Match', status: 'active', accuracy: 87, color: 'from-purple-500 to-pink-600' },
                    ].map((model, index) => (
                      <motion.div
                        key={model.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${model.color}`} />
                            <span className="font-semibold text-gray-900">{model.name}</span>
                          </div>
                          <Badge
                            className={
                              model.status === 'active'
                                ? 'bg-green-100 text-green-800 border-green-200'
                                : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                            }
                          >
                            {model.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Accuracy</span>
                          <span className="font-bold text-gray-900">{model.accuracy}%</span>
                        </div>
                        <Progress value={model.accuracy} className="mt-2 h-2" />
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Your Progress */}
            <motion.div variants={itemVariants}>
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Award className="w-5 h-5 mr-2 text-purple-600" />
                    Your Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {[
                      { label: 'Profile Completion', value: 85, color: 'from-green-500 to-emerald-600' },
                      { label: 'Skill Assessment', value: 72, color: 'from-blue-500 to-cyan-600' },
                      { label: 'Goal Achievement', value: 45, color: 'from-purple-500 to-pink-600' },
                    ].map((metric, index) => (
                      <motion.div
                        key={metric.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                          <span className="text-sm font-bold text-gray-900">{metric.value}%</span>
                        </div>
                        <div className="relative">
                          <Progress value={metric.value} className="h-3" />
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${metric.value}%` }}
                            transition={{ delay: 1 + index * 0.1, duration: 1, ease: "easeOut" }}
                            className={`absolute top-0 left-0 h-3 bg-gradient-to-r ${metric.color} rounded-full`}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Time & Weather Widget */}
            <motion.div variants={itemVariants}>
              <Card className="border-0 shadow-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                <CardContent className="p-6">
                  <div className="text-center">
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <Clock className="w-8 h-8 mx-auto mb-3 text-white/90" />
                    </motion.div>
                    <div className="text-2xl font-bold mb-1">
                      {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="text-white/80 text-sm">
                      {currentTime.toLocaleDateString([], {
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Next Steps */}
            <motion.div variants={itemVariants}>
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Compass className="w-5 h-5 mr-2 text-indigo-600" />
                    Next Steps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { task: 'Complete skill assessment', priority: 'high' },
                      { task: 'Update resume with AI suggestions', priority: 'medium' },
                      { task: 'Explore 3 recommended career paths', priority: 'low' },
                    ].map((step, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ x: 4 }}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                      >
                        <div className={`w-2 h-2 rounded-full ${
                          step.priority === 'high' ? 'bg-red-500' :
                          step.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`} />
                        <span className="text-sm text-gray-700 flex-1">{step.task}</span>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Floating Action Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
        className="fixed bottom-8 right-8"
      >
        <Button
          size="lg"
          className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-2xl hover:shadow-3xl transition-all duration-300"
        >
          <Sparkles className="w-6 h-6 text-white" />
        </Button>
      </motion.div>
    </div>
  );
};

export default Dashboard;

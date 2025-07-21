/**
 * Analytics Dashboard - Beautiful Data Insights
 * Comprehensive analytics with interactive charts and performance metrics
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye,
  Clock,
  Target,
  Zap,
  Calendar,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EnhancedSelect } from '@/components/ui/EnhancedSelect';
import { SkillDemandChart } from '@/components/charts/SkillDemandChart';
import { SalaryTrendsChart } from '@/components/charts/SalaryTrendsChart';
import { cn } from '@/lib/utils';

interface AnalyticsMetric {
  id: string;
  title: string;
  value: string;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: React.ComponentType<any>;
  color: string;
  description: string;
}

interface AnalyticsDashboardProps {
  className?: string;
}

const analyticsMetrics: AnalyticsMetric[] = [
  {
    id: 'profile-views',
    title: 'Profile Views',
    value: '2.4K',
    change: 12.5,
    changeType: 'increase',
    icon: Eye,
    color: 'from-blue-500 to-cyan-500',
    description: 'Profile views this month'
  },
  {
    id: 'job-applications',
    title: 'Applications Sent',
    value: '47',
    change: 8.3,
    changeType: 'increase',
    icon: Target,
    color: 'from-green-500 to-emerald-500',
    description: 'Job applications this month'
  },
  {
    id: 'skill-assessments',
    title: 'Skills Verified',
    value: '12',
    change: 15.7,
    changeType: 'increase',
    icon: Zap,
    color: 'from-purple-500 to-pink-500',
    description: 'Skills completed this month'
  },
  {
    id: 'response-rate',
    title: 'Response Rate',
    value: '23%',
    change: 5.2,
    changeType: 'increase',
    icon: TrendingUp,
    color: 'from-orange-500 to-red-500',
    description: 'Employer response rate'
  }
];

const timeRangeOptions = [
  { value: '7d', label: 'Last 7 days', description: 'Past week' },
  { value: '30d', label: 'Last 30 days', description: 'Past month' },
  { value: '90d', label: 'Last 90 days', description: 'Past quarter' },
  { value: '1y', label: 'Last year', description: 'Past 12 months' },
];

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ className }) => {
  const [timeRange, setTimeRange] = useState('30d');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [metrics, setMetrics] = useState(analyticsMetrics);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        change: metric.change + (Math.random() - 0.5) * 10,
      })));
      setIsRefreshing(false);
    }, 1500);
  };

  const formatChange = (change: number, type: 'increase' | 'decrease') => {
    const sign = type === 'increase' ? '+' : '-';
    return `${sign}${Math.abs(change).toFixed(1)}%`;
  };

  return (
    <div className={cn("space-y-8", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Analytics Dashboard
          </h2>
          <p className="text-gray-600 mt-1">Track your career progress and performance metrics</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <EnhancedSelect
            options={timeRangeOptions}
            value={timeRange}
            onChange={(value) => setTimeRange(value as string)}
            size="sm"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn("w-4 h-4 mr-2", isRefreshing && "animate-spin")} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${metric.color} flex items-center justify-center`}>
                    <metric.icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge className={cn(
                    "text-xs",
                    metric.changeType === 'increase' 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  )}>
                    {formatChange(metric.change, metric.changeType)}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900">{metric.title}</h3>
                  <div className="text-3xl font-bold text-gray-900">{metric.value}</div>
                  <p className="text-sm text-gray-600">{metric.description}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Profile Performance */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                Profile Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Profile Strength */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Profile Strength</span>
                    <span className="text-sm font-bold text-gray-900">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <motion.div 
                      className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: '85%' }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Complete your skills section to reach 100%</p>
                </div>

                {/* Visibility Score */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Visibility Score</span>
                    <span className="text-sm font-bold text-gray-900">92%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <motion.div 
                      className="bg-gradient-to-r from-blue-500 to-cyan-600 h-3 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: '92%' }}
                      transition={{ duration: 1, delay: 0.7 }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Your profile appears in top search results</p>
                </div>

                {/* Engagement Rate */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Engagement Rate</span>
                    <span className="text-sm font-bold text-gray-900">78%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <motion.div 
                      className="bg-gradient-to-r from-purple-500 to-pink-600 h-3 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: '78%' }}
                      transition={{ duration: 1, delay: 0.9 }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">High interaction rate with your content</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Application Funnel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2 text-green-600" />
                Application Funnel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { stage: 'Applications Sent', count: 47, percentage: 100, color: 'bg-blue-500' },
                  { stage: 'Profile Views', count: 32, percentage: 68, color: 'bg-green-500' },
                  { stage: 'Initial Responses', count: 18, percentage: 38, color: 'bg-yellow-500' },
                  { stage: 'Interviews Scheduled', count: 8, percentage: 17, color: 'bg-orange-500' },
                  { stage: 'Final Rounds', count: 3, percentage: 6, color: 'bg-red-500' },
                ].map((stage, index) => (
                  <motion.div
                    key={stage.stage}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{stage.stage}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-gray-900">{stage.count}</span>
                        <span className="text-xs text-gray-500">({stage.percentage}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div 
                        className={`${stage.color} h-2 rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${stage.percentage}%` }}
                        transition={{ duration: 0.8, delay: 0.8 + index * 0.1 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Market Intelligence Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <SkillDemandChart height={300} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <SalaryTrendsChart height={300} />
        </motion.div>
      </div>

      {/* Activity Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-purple-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  action: 'Applied to Senior React Developer at TechCorp',
                  time: '2 hours ago',
                  type: 'application',
                  status: 'pending'
                },
                {
                  action: 'Completed TypeScript skill assessment',
                  time: '1 day ago',
                  type: 'skill',
                  status: 'completed'
                },
                {
                  action: 'Profile viewed by Google recruiter',
                  time: '2 days ago',
                  type: 'view',
                  status: 'viewed'
                },
                {
                  action: 'Updated portfolio with new project',
                  time: '3 days ago',
                  type: 'update',
                  status: 'completed'
                },
                {
                  action: 'Received interview invitation from Startup Inc',
                  time: '5 days ago',
                  type: 'interview',
                  status: 'scheduled'
                },
              ].map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className={cn(
                    "w-3 h-3 rounded-full",
                    activity.type === 'application' && "bg-blue-500",
                    activity.type === 'skill' && "bg-green-500",
                    activity.type === 'view' && "bg-purple-500",
                    activity.type === 'update' && "bg-orange-500",
                    activity.type === 'interview' && "bg-red-500"
                  )} />
                  
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-xs",
                      activity.status === 'completed' && "border-green-200 text-green-700",
                      activity.status === 'pending' && "border-yellow-200 text-yellow-700",
                      activity.status === 'viewed' && "border-blue-200 text-blue-700",
                      activity.status === 'scheduled' && "border-purple-200 text-purple-700"
                    )}
                  >
                    {activity.status}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Insights and Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="border-0 shadow-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <CardHeader>
            <CardTitle className="text-white">AI-Powered Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold mb-2">Performance Trend</h4>
                <p className="text-white/90 text-sm">
                  Your application response rate has improved by 23% this month. Keep up the great work!
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold mb-2">Optimization Tip</h4>
                <p className="text-white/90 text-sm">
                  Adding React Native to your skills could increase your job matches by 40%
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold mb-2">Market Opportunity</h4>
                <p className="text-white/90 text-sm">
                  Senior React positions in your area have increased by 35% this quarter
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

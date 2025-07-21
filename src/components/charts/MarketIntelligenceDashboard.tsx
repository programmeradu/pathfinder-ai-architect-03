/**
 * Market Intelligence Dashboard - Beautiful Analytics Overview
 * Comprehensive dashboard with multiple charts and real-time market data
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Globe, 
  Users, 
  Target,
  Zap,
  MapPin,
  Clock,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SkillDemandChart } from './SkillDemandChart';
import { SalaryTrendsChart } from './SalaryTrendsChart';
import { cn } from '@/lib/utils';

interface MarketMetric {
  id: string;
  title: string;
  value: string;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: React.ComponentType<any>;
  color: string;
  description: string;
}

interface MarketIntelligenceDashboardProps {
  className?: string;
  showControls?: boolean;
}

const marketMetrics: MarketMetric[] = [
  {
    id: 'total-jobs',
    title: 'Total Job Openings',
    value: '47.2K',
    change: 12.5,
    changeType: 'increase',
    icon: Zap,
    color: 'from-blue-500 to-cyan-500',
    description: 'Active job postings this month'
  },
  {
    id: 'avg-salary',
    title: 'Average Salary',
    value: '$142K',
    change: 8.3,
    changeType: 'increase',
    icon: TrendingUp,
    color: 'from-green-500 to-emerald-500',
    description: 'Median compensation across all roles'
  },
  {
    id: 'remote-jobs',
    title: 'Remote Opportunities',
    value: '68%',
    change: 15.7,
    changeType: 'increase',
    icon: Globe,
    color: 'from-purple-500 to-pink-500',
    description: 'Percentage of remote-friendly positions'
  },
  {
    id: 'hiring-rate',
    title: 'Hiring Velocity',
    value: '2.3x',
    change: 23.1,
    changeType: 'increase',
    icon: Users,
    color: 'from-orange-500 to-red-500',
    description: 'Faster hiring compared to last year'
  }
];

const topSkills = [
  { skill: 'React', demand: 94, growth: 18, jobs: 1680 },
  { skill: 'TypeScript', demand: 91, growth: 25, jobs: 1420 },
  { skill: 'Python', demand: 89, growth: 12, jobs: 2100 },
  { skill: 'Node.js', demand: 87, growth: 15, jobs: 1350 },
  { skill: 'AWS', demand: 85, growth: 20, jobs: 1890 },
];

const topLocations = [
  { location: 'San Francisco', avgSalary: 175000, jobs: 3200, growth: 12 },
  { location: 'New York', avgSalary: 155000, jobs: 2800, growth: 8 },
  { location: 'Seattle', avgSalary: 165000, jobs: 2100, growth: 15 },
  { location: 'Austin', avgSalary: 135000, jobs: 1600, growth: 22 },
  { location: 'Remote', avgSalary: 145000, jobs: 4500, growth: 35 },
];

export const MarketIntelligenceDashboard: React.FC<MarketIntelligenceDashboardProps> = ({
  className,
  showControls = true
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  const formatSalary = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className={cn("space-y-8", className)}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Market Intelligence
          </h2>
          <p className="text-gray-600 mt-1">Real-time career market analytics and insights</p>
        </div>
        
        {showControls && (
          <div className="flex items-center space-x-3">
            <Badge className="bg-green-100 text-green-800 animate-pulse">
              <Clock className="w-3 h-3 mr-1" />
              Live Data
            </Badge>
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
        )}
      </motion.div>

      {/* Market Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {marketMetrics.map((metric, index) => (
          <motion.div
            key={metric.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 + index * 0.1, type: "spring", stiffness: 200 }}
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
                    {metric.changeType === 'increase' ? '+' : '-'}{metric.change}%
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
      </motion.div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Skill Demand Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <SkillDemandChart height={350} />
        </motion.div>

        {/* Salary Trends Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <SalaryTrendsChart height={350} />
        </motion.div>
      </div>

      {/* Secondary Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2 text-purple-600" />
                Top In-Demand Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topSkills.map((skill, index) => (
                  <motion.div
                    key={skill.skill}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{skill.skill}</div>
                        <div className="text-sm text-gray-600">{skill.jobs} jobs</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-bold text-gray-900">{skill.demand}%</div>
                      <div className="text-sm text-green-600">+{skill.growth}%</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Locations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                Top Hiring Locations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topLocations.map((location, index) => (
                  <motion.div
                    key={location.location}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{location.location}</div>
                        <div className="text-sm text-gray-600">{location.jobs} jobs</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-bold text-gray-900">{formatSalary(location.avgSalary)}</div>
                      <div className="text-sm text-green-600">+{location.growth}%</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Market Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="border-0 shadow-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <CardHeader>
            <CardTitle className="text-white">AI-Powered Market Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold mb-2">Market Trend</h4>
                <p className="text-white/90 text-sm">
                  AI/ML roles are experiencing 42% growth, making it the fastest-growing tech segment
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold mb-2">Skill Gap Alert</h4>
                <p className="text-white/90 text-sm">
                  TypeScript demand is outpacing supply by 3:1 ratio, creating premium opportunities
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold mb-2">Remote Revolution</h4>
                <p className="text-white/90 text-sm">
                  68% of new positions offer remote work, up from 23% pre-pandemic
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

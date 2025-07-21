/**
 * Skill Demand Chart - Beautiful Real-time Skill Trends
 * Interactive chart showing skill demand over time with stunning animations
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  Legend,
  ReferenceLine
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Filter,
  Download,
  Maximize2,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EnhancedSelect } from '@/components/ui/EnhancedSelect';
import { cn } from '@/lib/utils';

interface SkillData {
  date: string;
  skill: string;
  demand: number;
  growth: number;
  salaryImpact: number;
  jobCount: number;
}

interface SkillDemandChartProps {
  className?: string;
  height?: number;
  showControls?: boolean;
  autoRefresh?: boolean;
  variant?: 'line' | 'area' | 'combined';
}

const mockSkillData: SkillData[] = [
  { date: '2024-01', skill: 'React', demand: 85, growth: 12, salaryImpact: 15, jobCount: 1250 },
  { date: '2024-02', skill: 'React', demand: 88, growth: 15, salaryImpact: 18, jobCount: 1340 },
  { date: '2024-03', skill: 'React', demand: 92, growth: 18, salaryImpact: 22, jobCount: 1480 },
  { date: '2024-04', skill: 'React', demand: 89, growth: 16, salaryImpact: 20, jobCount: 1420 },
  { date: '2024-05', skill: 'React', demand: 94, growth: 20, salaryImpact: 25, jobCount: 1580 },
  { date: '2024-06', skill: 'React', demand: 97, growth: 23, salaryImpact: 28, jobCount: 1680 },
  
  { date: '2024-01', skill: 'TypeScript', demand: 78, growth: 25, salaryImpact: 20, jobCount: 980 },
  { date: '2024-02', skill: 'TypeScript', demand: 82, growth: 28, salaryImpact: 24, jobCount: 1080 },
  { date: '2024-03', skill: 'TypeScript', demand: 87, growth: 32, salaryImpact: 28, jobCount: 1200 },
  { date: '2024-04', skill: 'TypeScript', demand: 91, growth: 35, salaryImpact: 32, jobCount: 1320 },
  { date: '2024-05', skill: 'TypeScript', demand: 95, growth: 38, salaryImpact: 35, jobCount: 1450 },
  { date: '2024-06', skill: 'TypeScript', demand: 98, growth: 42, salaryImpact: 38, jobCount: 1580 },

  { date: '2024-01', skill: 'Python', demand: 92, growth: 8, salaryImpact: 12, jobCount: 2100 },
  { date: '2024-02', skill: 'Python', demand: 93, growth: 9, salaryImpact: 14, jobCount: 2180 },
  { date: '2024-03', skill: 'Python', demand: 95, growth: 10, salaryImpact: 16, jobCount: 2280 },
  { date: '2024-04', skill: 'Python', demand: 94, growth: 9, salaryImpact: 15, jobCount: 2250 },
  { date: '2024-05', skill: 'Python', demand: 96, growth: 11, salaryImpact: 18, jobCount: 2350 },
  { date: '2024-06', skill: 'Python', demand: 98, growth: 13, salaryImpact: 20, jobCount: 2450 },
];

const skillColors = {
  React: '#61DAFB',
  TypeScript: '#3178C6',
  Python: '#3776AB',
  JavaScript: '#F7DF1E',
  'Node.js': '#339933',
};

export const SkillDemandChart: React.FC<SkillDemandChartProps> = ({
  className,
  height = 400,
  showControls = true,
  autoRefresh = true,
  variant = 'area'
}) => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['React', 'TypeScript', 'Python']);
  const [timeRange, setTimeRange] = useState('6m');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [data, setData] = useState(mockSkillData);

  const skillOptions = [
    { value: 'React', label: 'React', description: 'Frontend framework' },
    { value: 'TypeScript', label: 'TypeScript', description: 'Type-safe JavaScript' },
    { value: 'Python', label: 'Python', description: 'Programming language' },
    { value: 'JavaScript', label: 'JavaScript', description: 'Programming language' },
    { value: 'Node.js', label: 'Node.js', description: 'Backend runtime' },
  ];

  const timeRangeOptions = [
    { value: '1m', label: '1 Month', description: 'Last 30 days' },
    { value: '3m', label: '3 Months', description: 'Last 90 days' },
    { value: '6m', label: '6 Months', description: 'Last 180 days' },
    { value: '1y', label: '1 Year', description: 'Last 365 days' },
  ];

  // Filter data based on selected skills
  const filteredData = data.filter(item => selectedSkills.includes(item.skill));

  // Group data by date for chart
  const chartData = filteredData.reduce((acc, item) => {
    const existingDate = acc.find(d => d.date === item.date);
    if (existingDate) {
      existingDate[item.skill] = item.demand;
      existingDate[`${item.skill}_growth`] = item.growth;
    } else {
      acc.push({
        date: item.date,
        [item.skill]: item.demand,
        [`${item.skill}_growth`]: item.growth,
      });
    }
    return acc;
  }, [] as any[]);

  // Auto-refresh data
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setIsRefreshing(true);
      // Simulate data refresh
      setTimeout(() => {
        setData(prev => prev.map(item => ({
          ...item,
          demand: Math.max(0, Math.min(100, item.demand + (Math.random() - 0.5) * 4)),
          growth: Math.max(-50, Math.min(50, item.growth + (Math.random() - 0.5) * 6)),
        })));
        setIsRefreshing(false);
      }, 1000);
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setData(prev => prev.map(item => ({
        ...item,
        demand: Math.max(0, Math.min(100, item.demand + (Math.random() - 0.5) * 4)),
        growth: Math.max(-50, Math.min(50, item.growth + (Math.random() - 0.5) * 6)),
      })));
      setIsRefreshing(false);
    }, 1000);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-gray-200"
        >
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center space-x-2 mb-1">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-700">{entry.dataKey}:</span>
              <span className="font-semibold text-gray-900">{entry.value}%</span>
            </div>
          ))}
        </motion.div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const ChartComponent = variant === 'line' ? LineChart : AreaChart;
    
    return (
      <ResponsiveContainer width="100%" height={height}>
        <ChartComponent data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            stroke="#6b7280"
            fontSize={12}
            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short' })}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          {selectedSkills.map((skill, index) => {
            const color = skillColors[skill as keyof typeof skillColors] || `hsl(${index * 60}, 70%, 50%)`;
            
            if (variant === 'line') {
              return (
                <Line
                  key={skill}
                  type="monotone"
                  dataKey={skill}
                  stroke={color}
                  strokeWidth={3}
                  dot={{ fill: color, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
                />
              );
            } else {
              return (
                <Area
                  key={skill}
                  type="monotone"
                  dataKey={skill}
                  stackId="1"
                  stroke={color}
                  fill={color}
                  fillOpacity={0.3}
                />
              );
            }
          })}
          
          <ReferenceLine y={80} stroke="#ef4444" strokeDasharray="5 5" label="High Demand" />
        </ChartComponent>
      </ResponsiveContainer>
    );
  };

  return (
    <Card className={cn("border-0 shadow-xl bg-white/80 backdrop-blur-sm", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ rotate: isRefreshing ? 360 : 0 }}
              transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0, ease: "linear" }}
              className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center"
            >
              <TrendingUp className="w-4 h-4 text-white" />
            </motion.div>
            <div>
              <CardTitle className="text-xl font-bold">Skill Demand Trends</CardTitle>
              <p className="text-sm text-gray-600">Real-time market intelligence</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge className="bg-green-100 text-green-800 animate-pulse">
              LIVE
            </Badge>
            {showControls && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center gap-4 mt-4"
          >
            <div className="flex-1 min-w-48">
              <EnhancedSelect
                options={skillOptions}
                value={selectedSkills}
                onChange={(value) => setSelectedSkills(value as string[])}
                placeholder="Select skills..."
                multiple
                searchable
                size="sm"
              />
            </div>
            
            <div className="min-w-32">
              <EnhancedSelect
                options={timeRangeOptions}
                value={timeRange}
                onChange={(value) => setTimeRange(value as string)}
                size="sm"
              />
            </div>
          </motion.div>
        )}
      </CardHeader>

      <CardContent>
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedSkills.join('-')}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderChart()}
          </motion.div>
        </AnimatePresence>

        {/* Skill Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200"
        >
          {selectedSkills.slice(0, 3).map((skill, index) => {
            const skillData = data.filter(d => d.skill === skill);
            const latestData = skillData[skillData.length - 1];
            const previousData = skillData[skillData.length - 2];
            const trend = latestData && previousData ? latestData.demand - previousData.demand : 0;
            
            return (
              <motion.div
                key={skill}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1, type: "spring" }}
                className="text-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: skillColors[skill as keyof typeof skillColors] }}
                  />
                  <span className="font-semibold text-gray-900">{skill}</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {latestData?.demand || 0}%
                </div>
                <div className={cn(
                  "flex items-center justify-center space-x-1 text-sm",
                  trend > 0 ? "text-green-600" : trend < 0 ? "text-red-600" : "text-gray-600"
                )}>
                  {trend > 0 ? <TrendingUp className="w-3 h-3" /> : 
                   trend < 0 ? <TrendingDown className="w-3 h-3" /> : 
                   <Zap className="w-3 h-3" />}
                  <span>{trend > 0 ? '+' : ''}{trend.toFixed(1)}%</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </CardContent>
    </Card>
  );
};

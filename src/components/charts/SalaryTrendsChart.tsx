/**
 * Salary Trends Chart - Beautiful Salary Analytics
 * Interactive chart showing salary trends across roles and locations with animations
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine
} from 'recharts';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  MapPin,
  Users,
  Briefcase,
  Target,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EnhancedSelect } from '@/components/ui/EnhancedSelect';
import { cn } from '@/lib/utils';

interface SalaryData {
  period: string;
  role: string;
  location: string;
  minSalary: number;
  maxSalary: number;
  avgSalary: number;
  growth: number;
  jobCount: number;
  experience: string;
}

interface SalaryTrendsChartProps {
  className?: string;
  height?: number;
  showControls?: boolean;
  variant?: 'bar' | 'line' | 'combined';
}

const mockSalaryData: SalaryData[] = [
  // Senior Frontend Developer
  { period: '2024-01', role: 'Senior Frontend Developer', location: 'San Francisco', minSalary: 140000, maxSalary: 180000, avgSalary: 160000, growth: 8, jobCount: 245, experience: 'Senior' },
  { period: '2024-02', role: 'Senior Frontend Developer', location: 'San Francisco', minSalary: 142000, maxSalary: 185000, avgSalary: 163500, growth: 10, jobCount: 268, experience: 'Senior' },
  { period: '2024-03', role: 'Senior Frontend Developer', location: 'San Francisco', minSalary: 145000, maxSalary: 190000, avgSalary: 167500, growth: 12, jobCount: 289, experience: 'Senior' },
  { period: '2024-04', role: 'Senior Frontend Developer', location: 'San Francisco', minSalary: 148000, maxSalary: 195000, avgSalary: 171500, growth: 15, jobCount: 312, experience: 'Senior' },
  { period: '2024-05', role: 'Senior Frontend Developer', location: 'San Francisco', minSalary: 150000, maxSalary: 200000, avgSalary: 175000, growth: 18, jobCount: 334, experience: 'Senior' },
  { period: '2024-06', role: 'Senior Frontend Developer', location: 'San Francisco', minSalary: 152000, maxSalary: 205000, avgSalary: 178500, growth: 20, jobCount: 356, experience: 'Senior' },

  // Full Stack Developer
  { period: '2024-01', role: 'Full Stack Developer', location: 'New York', minSalary: 120000, maxSalary: 160000, avgSalary: 140000, growth: 6, jobCount: 189, experience: 'Mid' },
  { period: '2024-02', role: 'Full Stack Developer', location: 'New York', minSalary: 122000, maxSalary: 165000, avgSalary: 143500, growth: 8, jobCount: 201, experience: 'Mid' },
  { period: '2024-03', role: 'Full Stack Developer', location: 'New York', minSalary: 125000, maxSalary: 170000, avgSalary: 147500, growth: 10, jobCount: 215, experience: 'Mid' },
  { period: '2024-04', role: 'Full Stack Developer', location: 'New York', minSalary: 127000, maxSalary: 175000, avgSalary: 151000, growth: 12, jobCount: 228, experience: 'Mid' },
  { period: '2024-05', role: 'Full Stack Developer', location: 'New York', minSalary: 130000, maxSalary: 180000, avgSalary: 155000, growth: 15, jobCount: 242, experience: 'Mid' },
  { period: '2024-06', role: 'Full Stack Developer', location: 'New York', minSalary: 132000, maxSalary: 185000, avgSalary: 158500, growth: 17, jobCount: 256, experience: 'Mid' },

  // AI/ML Engineer
  { period: '2024-01', role: 'AI/ML Engineer', location: 'Seattle', minSalary: 160000, maxSalary: 220000, avgSalary: 190000, growth: 25, jobCount: 156, experience: 'Senior' },
  { period: '2024-02', role: 'AI/ML Engineer', location: 'Seattle', minSalary: 165000, maxSalary: 230000, avgSalary: 197500, growth: 28, jobCount: 172, experience: 'Senior' },
  { period: '2024-03', role: 'AI/ML Engineer', location: 'Seattle', minSalary: 170000, maxSalary: 240000, avgSalary: 205000, growth: 32, jobCount: 189, experience: 'Senior' },
  { period: '2024-04', role: 'AI/ML Engineer', location: 'Seattle', minSalary: 175000, maxSalary: 250000, avgSalary: 212500, growth: 35, jobCount: 206, experience: 'Senior' },
  { period: '2024-05', role: 'AI/ML Engineer', location: 'Seattle', minSalary: 180000, maxSalary: 260000, avgSalary: 220000, growth: 38, jobCount: 224, experience: 'Senior' },
  { period: '2024-06', role: 'AI/ML Engineer', location: 'Seattle', minSalary: 185000, maxSalary: 270000, avgSalary: 227500, growth: 42, jobCount: 242, experience: 'Senior' },
];

const roleColors = {
  'Senior Frontend Developer': '#3B82F6',
  'Full Stack Developer': '#10B981',
  'AI/ML Engineer': '#8B5CF6',
  'Backend Developer': '#F59E0B',
  'DevOps Engineer': '#EF4444',
};

export const SalaryTrendsChart: React.FC<SalaryTrendsChartProps> = ({
  className,
  height = 400,
  showControls = true,
  variant = 'combined'
}) => {
  const [selectedRoles, setSelectedRoles] = useState<string[]>(['Senior Frontend Developer', 'AI/ML Engineer']);
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedExperience, setSelectedExperience] = useState('all');
  const [data, setData] = useState(mockSalaryData);

  const roleOptions = [
    { value: 'Senior Frontend Developer', label: 'Senior Frontend Developer', description: 'React, Vue, Angular' },
    { value: 'Full Stack Developer', label: 'Full Stack Developer', description: 'Frontend + Backend' },
    { value: 'AI/ML Engineer', label: 'AI/ML Engineer', description: 'Machine Learning' },
    { value: 'Backend Developer', label: 'Backend Developer', description: 'Server-side development' },
    { value: 'DevOps Engineer', label: 'DevOps Engineer', description: 'Infrastructure & deployment' },
  ];

  const locationOptions = [
    { value: 'all', label: 'All Locations', description: 'Global average' },
    { value: 'San Francisco', label: 'San Francisco', description: 'Bay Area, CA' },
    { value: 'New York', label: 'New York', description: 'NYC, NY' },
    { value: 'Seattle', label: 'Seattle', description: 'Seattle, WA' },
    { value: 'Austin', label: 'Austin', description: 'Austin, TX' },
  ];

  const experienceOptions = [
    { value: 'all', label: 'All Levels', description: 'All experience levels' },
    { value: 'Junior', label: 'Junior', description: '0-2 years' },
    { value: 'Mid', label: 'Mid-level', description: '3-5 years' },
    { value: 'Senior', label: 'Senior', description: '6+ years' },
  ];

  // Filter and process data
  const filteredData = data.filter(item => {
    const roleMatch = selectedRoles.includes(item.role);
    const locationMatch = selectedLocation === 'all' || item.location === selectedLocation;
    const experienceMatch = selectedExperience === 'all' || item.experience === selectedExperience;
    return roleMatch && locationMatch && experienceMatch;
  });

  // Group data by period for chart
  const chartData = filteredData.reduce((acc, item) => {
    const existingPeriod = acc.find(d => d.period === item.period);
    if (existingPeriod) {
      existingPeriod[`${item.role}_avg`] = item.avgSalary;
      existingPeriod[`${item.role}_growth`] = item.growth;
      existingPeriod[`${item.role}_jobs`] = item.jobCount;
    } else {
      acc.push({
        period: item.period,
        [`${item.role}_avg`]: item.avgSalary,
        [`${item.role}_growth`]: item.growth,
        [`${item.role}_jobs`]: item.jobCount,
      });
    }
    return acc;
  }, [] as any[]);

  const formatSalary = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-gray-200 min-w-64"
        >
          <p className="font-semibold text-gray-900 mb-3">
            {new Date(label).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
          {payload.map((entry: any, index: number) => {
            const role = entry.dataKey.replace('_avg', '').replace('_growth', '').replace('_jobs', '');
            const type = entry.dataKey.includes('_avg') ? 'salary' : 
                        entry.dataKey.includes('_growth') ? 'growth' : 'jobs';
            
            if (type === 'salary') {
              return (
                <div key={index} className="mb-2">
                  <div className="flex items-center space-x-2 mb-1">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="font-medium text-gray-900">{role}</span>
                  </div>
                  <div className="ml-5 text-sm text-gray-600">
                    Average: <span className="font-semibold text-gray-900">{formatSalary(entry.value)}</span>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </motion.div>
      );
    }
    return null;
  };

  return (
    <Card className={cn("border-0 shadow-xl bg-white/80 backdrop-blur-sm", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center"
            >
              <DollarSign className="w-4 h-4 text-white" />
            </motion.div>
            <div>
              <CardTitle className="text-xl font-bold">Salary Trends</CardTitle>
              <p className="text-sm text-gray-600">Market compensation analysis</p>
            </div>
          </div>
          
          <Badge className="bg-blue-100 text-blue-800">
            <TrendingUp className="w-3 h-3 mr-1" />
            Market Data
          </Badge>
        </div>

        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4"
          >
            <EnhancedSelect
              options={roleOptions}
              value={selectedRoles}
              onChange={(value) => setSelectedRoles(value as string[])}
              placeholder="Select roles..."
              multiple
              searchable
              size="sm"
            />
            
            <EnhancedSelect
              options={locationOptions}
              value={selectedLocation}
              onChange={(value) => setSelectedLocation(value as string)}
              size="sm"
            />

            <EnhancedSelect
              options={experienceOptions}
              value={selectedExperience}
              onChange={(value) => setSelectedExperience(value as string)}
              size="sm"
            />
          </motion.div>
        )}
      </CardHeader>

      <CardContent>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedRoles.join('-')}-${selectedLocation}-${selectedExperience}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ResponsiveContainer width="100%" height={height}>
              <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="period" 
                  stroke="#6b7280"
                  fontSize={12}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short' })}
                />
                <YAxis 
                  yAxisId="salary"
                  stroke="#6b7280"
                  fontSize={12}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                />
                <YAxis 
                  yAxisId="growth"
                  orientation="right"
                  stroke="#6b7280"
                  fontSize={12}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                
                {selectedRoles.map((role, index) => {
                  const color = roleColors[role as keyof typeof roleColors] || `hsl(${index * 60}, 70%, 50%)`;
                  
                  return (
                    <React.Fragment key={role}>
                      <Bar
                        yAxisId="salary"
                        dataKey={`${role}_avg`}
                        fill={color}
                        fillOpacity={0.8}
                        name={`${role} (Avg Salary)`}
                        radius={[4, 4, 0, 0]}
                      />
                      <Line
                        yAxisId="growth"
                        type="monotone"
                        dataKey={`${role}_growth`}
                        stroke={color}
                        strokeWidth={2}
                        dot={{ fill: color, strokeWidth: 2, r: 3 }}
                        name={`${role} (Growth %)`}
                      />
                    </React.Fragment>
                  );
                })}
                
                <ReferenceLine yAxisId="salary" y={150000} stroke="#ef4444" strokeDasharray="5 5" label="Market Average" />
              </ComposedChart>
            </ResponsiveContainer>
          </motion.div>
        </AnimatePresence>

        {/* Salary Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200"
        >
          {selectedRoles.slice(0, 2).map((role, index) => {
            const roleData = filteredData.filter(d => d.role === role);
            const latestData = roleData[roleData.length - 1];
            const previousData = roleData[roleData.length - 2];
            const salaryGrowth = latestData && previousData ? 
              ((latestData.avgSalary - previousData.avgSalary) / previousData.avgSalary) * 100 : 0;
            
            return (
              <React.Fragment key={role}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1, type: "spring" }}
                  className="text-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-gray-900 text-sm">Avg Salary</span>
                  </div>
                  <div className="text-xl font-bold text-gray-900 mb-1">
                    {formatSalary(latestData?.avgSalary || 0)}
                  </div>
                  <div className={cn(
                    "flex items-center justify-center space-x-1 text-xs",
                    salaryGrowth > 0 ? "text-green-600" : "text-red-600"
                  )}>
                    {salaryGrowth > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span>{salaryGrowth > 0 ? '+' : ''}{salaryGrowth.toFixed(1)}%</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                  className="text-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold text-gray-900 text-sm">Job Count</span>
                  </div>
                  <div className="text-xl font-bold text-gray-900 mb-1">
                    {latestData?.jobCount || 0}
                  </div>
                  <div className="text-xs text-gray-600">
                    Available positions
                  </div>
                </motion.div>
              </React.Fragment>
            );
          })}
        </motion.div>
      </CardContent>
    </Card>
  );
};

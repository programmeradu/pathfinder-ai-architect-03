/**
 * Real-time Data Feed Component
 * Live market data streaming and job opportunity feeds
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Briefcase, 
  MapPin,
  DollarSign,
  Clock,
  Wifi,
  WifiOff,
  Zap,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGlobalStore } from '@/store/globalStore';
import { realTimeDataService } from '@/services/realTimeDataService';
import type { JobOpportunity, MarketTrend, SkillDemandData } from '@/types';

export const RealTimeDataFeed: React.FC = () => {
  const realTimeData = useGlobalStore((state) => state.realTimeData);
  const updateRealTimeData = useGlobalStore((state) => state.updateRealTimeData);
  
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [recentUpdates, setRecentUpdates] = useState<Array<{
    id: string;
    type: 'market' | 'job' | 'skill';
    title: string;
    description: string;
    timestamp: Date;
    data: any;
  }>>([]);

  useEffect(() => {
    // Initialize real-time connection
    const initializeConnection = async () => {
      try {
        setConnectionStatus('connecting');
        await realTimeDataService.connect();
        setConnectionStatus('connected');
      } catch (error) {
        setConnectionStatus('error');
      }
    };

    initializeConnection();

    // Subscribe to real-time updates
    const unsubscribeMarket = realTimeDataService.subscribe('market_update', (data: MarketTrend[]) => {
      addRecentUpdate('market', 'Market Update', `${data.length} industry trends updated`, data);
    });

    const unsubscribeJobs = realTimeDataService.subscribe('job_opportunity', (data: JobOpportunity) => {
      addRecentUpdate('job', 'New Job Opportunity', `${data.title} at ${data.company}`, data);
    });

    const unsubscribeSkills = realTimeDataService.subscribe('skill_demand', (data: SkillDemandData[]) => {
      addRecentUpdate('skill', 'Skill Demand Update', `${data.length} skills updated`, data);
    });

    // Monitor connection status
    const statusInterval = setInterval(() => {
      setConnectionStatus(realTimeDataService.getConnectionStatus());
    }, 5000);

    return () => {
      unsubscribeMarket();
      unsubscribeJobs();
      unsubscribeSkills();
      clearInterval(statusInterval);
    };
  }, []);

  const addRecentUpdate = (type: 'market' | 'job' | 'skill', title: string, description: string, data: any) => {
    const update = {
      id: `update-${Date.now()}-${Math.random()}`,
      type,
      title,
      description,
      timestamp: new Date(),
      data,
    };

    setRecentUpdates(prev => [update, ...prev.slice(0, 19)]); // Keep last 20 updates
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'text-green-600';
      case 'connecting':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Wifi className="w-4 h-4" />;
      case 'connecting':
        return <Activity className="w-4 h-4 animate-pulse" />;
      default:
        return <WifiOff className="w-4 h-4" />;
    }
  };

  const getUpdateIcon = (type: 'market' | 'job' | 'skill') => {
    switch (type) {
      case 'market':
        return <TrendingUp className="w-4 h-4 text-blue-600" />;
      case 'job':
        return <Briefcase className="w-4 h-4 text-green-600" />;
      case 'skill':
        return <Zap className="w-4 h-4 text-purple-600" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div className="space-y-6">
      
      {/* Connection Status */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center">
              <Activity className="w-5 h-5 mr-2 text-green-600" />
              Real-time Market Intelligence
            </div>
            <div className={`flex items-center space-x-2 ${getConnectionStatusColor()}`}>
              {getConnectionIcon()}
              <span className="text-sm font-medium capitalize">{connectionStatus}</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Market Trends */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                  <span className="font-medium text-blue-800">Market Trends</span>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Live
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>AI/ML Engineering</span>
                  <div className="flex items-center text-green-600">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +15%
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Cloud Architecture</span>
                  <div className="flex items-center text-green-600">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +12%
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Data Science</span>
                  <div className="flex items-center text-red-600">
                    <TrendingDown className="w-3 h-3 mr-1" />
                    -3%
                  </div>
                </div>
              </div>
            </div>

            {/* Job Opportunities */}
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Briefcase className="w-5 h-5 mr-2 text-green-600" />
                  <span className="font-medium text-green-800">New Opportunities</span>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {realTimeData?.jobOpportunities?.length || 0}
                </Badge>
              </div>
              <div className="space-y-2">
                {realTimeData?.jobOpportunities?.slice(0, 3).map((job) => (
                  <div key={job.id} className="text-sm">
                    <div className="font-medium truncate">{job.title}</div>
                    <div className="text-gray-600 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {job.company}
                    </div>
                  </div>
                )) || (
                  <div className="text-sm text-gray-500">Loading opportunities...</div>
                )}
              </div>
            </div>

            {/* Skill Demand */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-purple-600" />
                  <span className="font-medium text-purple-800">Hot Skills</span>
                </div>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  Trending
                </Badge>
              </div>
              <div className="space-y-2">
                {realTimeData?.skillDemand?.slice(0, 3).map((skill) => (
                  <div key={skill.skill} className="flex justify-between text-sm">
                    <span>{skill.skill}</span>
                    <div className="flex items-center text-purple-600">
                      <span className="font-semibold">{Math.round(skill.demand)}</span>
                      {skill.trending && <TrendingUp className="w-3 h-3 ml-1" />}
                    </div>
                  </div>
                )) || (
                  <div className="text-sm text-gray-500">Loading skill data...</div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Updates Feed */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Globe className="w-5 h-5 mr-2 text-blue-600" />
              Live Updates Feed
            </div>
            <Button variant="outline" size="sm">
              <Clock className="w-4 h-4 mr-2" />
              Last updated: {realTimeData?.lastUpdated ? formatTimeAgo(realTimeData.lastUpdated) : 'Never'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-80">
            <AnimatePresence>
              {recentUpdates.length > 0 ? (
                <div className="space-y-3">
                  {recentUpdates.map((update) => (
                    <motion.div
                      key={update.id}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="mt-1">
                            {getUpdateIcon(update.type)}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{update.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{update.description}</p>
                            {update.type === 'job' && update.data && (
                              <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                                <div className="flex items-center">
                                  <DollarSign className="w-3 h-3 mr-1" />
                                  ${update.data.salary?.min?.toLocaleString()} - ${update.data.salary?.max?.toLocaleString()}
                                </div>
                                <div className="flex items-center">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {update.data.location}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {formatTimeAgo(update.timestamp)}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Waiting for real-time updates...</p>
                  <p className="text-sm mt-1">
                    {connectionStatus === 'connected' 
                      ? 'Connected and monitoring market data' 
                      : 'Establishing connection...'}
                  </p>
                </div>
              )}
            </AnimatePresence>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

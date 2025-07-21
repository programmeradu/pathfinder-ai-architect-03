/**
 * Real-Time Data Feed - Beautiful Live Data Streaming
 * WebSocket-powered real-time market data and job opportunity feeds
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  MapPin,
  DollarSign,
  Clock,
  Users,
  Briefcase,
  Wifi,
  WifiOff,
  Pause,
  Play,
  Settings
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGlobalStore } from '@/store/globalStore';
import { cn } from '@/lib/utils';

interface MarketUpdate {
  id: string;
  type: 'skill_demand' | 'salary_change' | 'job_posting' | 'market_trend';
  title: string;
  description: string;
  value: number;
  change: number;
  timestamp: Date;
  location?: string;
  skills?: string[];
  urgent?: boolean;
}

interface RealTimeDataFeedProps {
  className?: string;
  maxItems?: number;
  autoScroll?: boolean;
  showControls?: boolean;
}

export const RealTimeDataFeed: React.FC<RealTimeDataFeedProps> = ({
  className,
  maxItems = 50,
  autoScroll = true,
  showControls = true
}) => {
  const [updates, setUpdates] = useState<MarketUpdate[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);
  const feedRef = useRef<HTMLDivElement>(null);
  const { addNotification } = useGlobalStore();

  // Mock WebSocket URL - replace with actual WebSocket endpoint
  const WS_URL = process.env.NODE_ENV === 'development' 
    ? 'ws://localhost:8080/realtime' 
    : 'wss://api.pathfinder-ai.com/realtime';

  // Connect to WebSocket
  const connectWebSocket = () => {
    try {
      wsRef.current = new WebSocket(WS_URL);

      wsRef.current.onopen = () => {
        setIsConnected(true);
        setConnectionAttempts(0);
        console.log('WebSocket connected');
        
        addNotification({
          type: 'success',
          title: 'Real-time Feed Connected',
          message: 'Now receiving live market updates',
        });
      };

      wsRef.current.onmessage = (event) => {
        if (isPaused) return;

        try {
          const data = JSON.parse(event.data);
          const update: MarketUpdate = {
            ...data,
            id: `update_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date(data.timestamp || Date.now()),
          };

          setUpdates(prev => {
            const newUpdates = [update, ...prev];
            return newUpdates.slice(0, maxItems);
          });

          // Auto-scroll to top if enabled
          if (autoScroll && feedRef.current) {
            feedRef.current.scrollTop = 0;
          }

          // Show urgent notifications
          if (update.urgent) {
            addNotification({
              type: 'warning',
              title: 'Urgent Market Update',
              message: update.title,
            });
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      wsRef.current.onclose = () => {
        setIsConnected(false);
        console.log('WebSocket disconnected');
        
        // Attempt to reconnect
        if (connectionAttempts < 5) {
          setTimeout(() => {
            setConnectionAttempts(prev => prev + 1);
            connectWebSocket();
          }, Math.pow(2, connectionAttempts) * 1000); // Exponential backoff
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setIsConnected(false);
    }
  };

  // Disconnect WebSocket
  const disconnectWebSocket = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  };

  // Mock data generator for development
  const generateMockUpdate = (): MarketUpdate => {
    const types: MarketUpdate['type'][] = ['skill_demand', 'salary_change', 'job_posting', 'market_trend'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    const mockData = {
      skill_demand: {
        title: 'React Demand Surge',
        description: 'React developer demand increased by 15% in the last hour',
        value: 85 + Math.random() * 15,
        change: 5 + Math.random() * 15,
      },
      salary_change: {
        title: 'AI Engineer Salaries Rising',
        description: 'Average AI engineer salary increased in San Francisco',
        value: 180000 + Math.random() * 50000,
        change: 5000 + Math.random() * 15000,
      },
      job_posting: {
        title: 'New Senior Developer Position',
        description: 'Tech startup posted high-paying remote position',
        value: 150000 + Math.random() * 100000,
        change: 0,
      },
      market_trend: {
        title: 'Remote Work Trend',
        description: 'Remote job postings increased by 8% this week',
        value: 68 + Math.random() * 10,
        change: 3 + Math.random() * 10,
      },
    };

    const data = mockData[type];
    
    return {
      id: `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      title: data.title,
      description: data.description,
      value: data.value,
      change: data.change,
      timestamp: new Date(),
      location: ['San Francisco', 'New York', 'Seattle', 'Austin', 'Remote'][Math.floor(Math.random() * 5)],
      skills: ['React', 'TypeScript', 'Python', 'Node.js', 'AWS'][Math.floor(Math.random() * 5)],
      urgent: Math.random() > 0.9,
    };
  };

  // Start mock data generation in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const interval = setInterval(() => {
        if (!isPaused && isConnected) {
          const mockUpdate = generateMockUpdate();
          setUpdates(prev => {
            const newUpdates = [mockUpdate, ...prev];
            return newUpdates.slice(0, maxItems);
          });
        }
      }, 3000 + Math.random() * 5000); // Random interval between 3-8 seconds

      return () => clearInterval(interval);
    }
  }, [isPaused, isConnected, maxItems]);

  // Initialize WebSocket connection
  useEffect(() => {
    connectWebSocket();
    return () => disconnectWebSocket();
  }, []);

  const getUpdateIcon = (type: MarketUpdate['type']) => {
    switch (type) {
      case 'skill_demand':
        return <TrendingUp className="w-4 h-4" />;
      case 'salary_change':
        return <DollarSign className="w-4 h-4" />;
      case 'job_posting':
        return <Briefcase className="w-4 h-4" />;
      case 'market_trend':
        return <Activity className="w-4 h-4" />;
      default:
        return <Zap className="w-4 h-4" />;
    }
  };

  const getUpdateColor = (type: MarketUpdate['type']) => {
    switch (type) {
      case 'skill_demand':
        return 'from-blue-500 to-cyan-500';
      case 'salary_change':
        return 'from-green-500 to-emerald-500';
      case 'job_posting':
        return 'from-purple-500 to-pink-500';
      case 'market_trend':
        return 'from-orange-500 to-red-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const formatValue = (type: MarketUpdate['type'], value: number) => {
    switch (type) {
      case 'salary_change':
      case 'job_posting':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value);
      case 'skill_demand':
      case 'market_trend':
        return `${value.toFixed(1)}%`;
      default:
        return value.toFixed(0);
    }
  };

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  };

  return (
    <Card className={cn("border-0 shadow-xl bg-white/80 backdrop-blur-sm", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ 
                scale: isConnected ? [1, 1.1, 1] : 1,
                rotate: isConnected ? 360 : 0 
              }}
              transition={{ 
                scale: { duration: 2, repeat: Infinity },
                rotate: { duration: 20, repeat: Infinity, ease: "linear" }
              }}
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isConnected ? 'bg-green-500' : 'bg-red-500'
              }`}
            >
              {isConnected ? (
                <Wifi className="w-4 h-4 text-white" />
              ) : (
                <WifiOff className="w-4 h-4 text-white" />
              )}
            </motion.div>
            <div>
              <CardTitle className="text-xl font-bold">Live Market Feed</CardTitle>
              <p className="text-sm text-gray-600">
                {isConnected ? 'Connected' : 'Disconnected'} • {updates.length} updates
              </p>
            </div>
          </div>
          
          {showControls && (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPaused(!isPaused)}
              >
                {isPaused ? (
                  <Play className="w-4 h-4" />
                ) : (
                  <Pause className="w-4 h-4" />
                )}
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div 
          ref={feedRef}
          className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        >
          <AnimatePresence>
            {updates.map((update, index) => (
              <motion.div
                key={update.id}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={cn(
                  "p-4 rounded-lg border transition-all duration-300 hover:shadow-md",
                  update.urgent ? "border-red-200 bg-red-50" : "border-gray-200 bg-white"
                )}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${getUpdateColor(update.type)} flex items-center justify-center text-white`}>
                    {getUpdateIcon(update.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {update.title}
                      </h4>
                      <div className="flex items-center space-x-2">
                        {update.change !== 0 && (
                          <Badge 
                            className={cn(
                              "text-xs",
                              update.change > 0 
                                ? "bg-green-100 text-green-800" 
                                : "bg-red-100 text-red-800"
                            )}
                          >
                            {update.change > 0 ? (
                              <TrendingUp className="w-3 h-3 mr-1" />
                            ) : (
                              <TrendingDown className="w-3 h-3 mr-1" />
                            )}
                            {formatChange(update.change)}
                          </Badge>
                        )}
                        <span className="text-lg font-bold text-gray-900">
                          {formatValue(update.type, update.value)}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{update.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-3">
                        {update.location && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{update.location}</span>
                          </div>
                        )}
                        {update.skills && (
                          <Badge variant="outline" className="text-xs">
                            {update.skills}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{update.timestamp.toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {updates.length === 0 && (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">Waiting for live updates...</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

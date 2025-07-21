/**
 * Data Flow Visualization Component
 * Shows real-time data flow through the AI processing pipeline
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Database, 
  Brain, 
  TrendingUp, 
  Users, 
  Globe,
  ArrowRight,
  Zap,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DataNode {
  id: string;
  name: string;
  type: 'source' | 'processor' | 'model' | 'output';
  status: 'idle' | 'active' | 'processing' | 'complete';
  icon: React.ComponentType<any>;
  description: string;
  throughput?: number;
  latency?: number;
}

interface DataFlow {
  from: string;
  to: string;
  active: boolean;
  dataType: string;
  volume: number;
}

export const DataFlowVisualization: React.FC = () => {
  const [nodes] = useState<DataNode[]>([
    {
      id: 'user_profile',
      name: 'User Profile',
      type: 'source',
      status: 'active',
      icon: Users,
      description: 'Personal and professional information',
      throughput: 1.2,
    },
    {
      id: 'market_data',
      name: 'Market Data',
      type: 'source',
      status: 'active',
      icon: TrendingUp,
      description: 'Real-time job market information',
      throughput: 15.8,
    },
    {
      id: 'external_apis',
      name: 'External APIs',
      type: 'source',
      status: 'processing',
      icon: Globe,
      description: 'LinkedIn, GitHub, industry data',
      throughput: 8.4,
    },
    {
      id: 'data_processor',
      name: 'Data Processor',
      type: 'processor',
      status: 'processing',
      icon: Database,
      description: 'Cleans and normalizes data',
      latency: 45,
    },
    {
      id: 'career_dna',
      name: 'Career DNA',
      type: 'model',
      status: 'processing',
      icon: Brain,
      description: 'Personality-career matching',
      latency: 120,
    },
    {
      id: 'skill_analyzer',
      name: 'Skill Analyzer',
      type: 'model',
      status: 'active',
      icon: Zap,
      description: 'Skill gap analysis',
      latency: 89,
    },
    {
      id: 'opportunity_oracle',
      name: 'Opportunity Oracle',
      type: 'model',
      status: 'idle',
      icon: TrendingUp,
      description: 'Opportunity prediction',
      latency: 156,
    },
    {
      id: 'recommendations',
      name: 'Recommendations',
      type: 'output',
      status: 'complete',
      icon: Activity,
      description: 'Personalized career guidance',
    },
  ]);

  const [flows] = useState<DataFlow[]>([
    { from: 'user_profile', to: 'data_processor', active: true, dataType: 'Profile Data', volume: 1.2 },
    { from: 'market_data', to: 'data_processor', active: true, dataType: 'Market Data', volume: 15.8 },
    { from: 'external_apis', to: 'data_processor', active: true, dataType: 'External Data', volume: 8.4 },
    { from: 'data_processor', to: 'career_dna', active: true, dataType: 'Processed Data', volume: 5.2 },
    { from: 'data_processor', to: 'skill_analyzer', active: true, dataType: 'Skill Data', volume: 3.1 },
    { from: 'data_processor', to: 'opportunity_oracle', active: false, dataType: 'Market Data', volume: 7.8 },
    { from: 'career_dna', to: 'recommendations', active: true, dataType: 'DNA Results', volume: 2.1 },
    { from: 'skill_analyzer', to: 'recommendations', active: true, dataType: 'Skill Analysis', volume: 1.8 },
    { from: 'opportunity_oracle', to: 'recommendations', active: false, dataType: 'Opportunities', volume: 4.2 },
  ]);

  const [animatingFlows, setAnimatingFlows] = useState<Set<string>>(new Set());

  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly animate some flows
      const activeFlows = flows.filter(f => f.active);
      const randomFlow = activeFlows[Math.floor(Math.random() * activeFlows.length)];
      if (randomFlow) {
        const flowId = `${randomFlow.from}-${randomFlow.to}`;
        setAnimatingFlows(prev => new Set([...prev, flowId]));
        
        setTimeout(() => {
          setAnimatingFlows(prev => {
            const newSet = new Set(prev);
            newSet.delete(flowId);
            return newSet;
          });
        }, 2000);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [flows]);

  const getNodeColor = (status: DataNode['status'], type: DataNode['type']) => {
    const baseColors = {
      source: 'from-blue-400 to-blue-600',
      processor: 'from-purple-400 to-purple-600',
      model: 'from-green-400 to-green-600',
      output: 'from-orange-400 to-orange-600',
    };

    const statusOpacity = {
      idle: 'opacity-50',
      active: 'opacity-100',
      processing: 'opacity-100 animate-pulse',
      complete: 'opacity-100',
    };

    return `bg-gradient-to-br ${baseColors[type]} ${statusOpacity[status]}`;
  };

  const getStatusBadge = (status: DataNode['status']) => {
    const colors = {
      idle: 'bg-gray-100 text-gray-800',
      active: 'bg-green-100 text-green-800',
      processing: 'bg-blue-100 text-blue-800',
      complete: 'bg-purple-100 text-purple-800',
    };

    return colors[status];
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="w-5 h-5 mr-2 text-blue-600" />
          Real-time Data Flow
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          
          {/* Data Sources Row */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-600 mb-4">Data Sources</h3>
            <div className="grid grid-cols-3 gap-4">
              {nodes.filter(n => n.type === 'source').map((node) => {
                const Icon = node.icon;
                return (
                  <motion.div
                    key={node.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative"
                  >
                    <div className={`p-4 rounded-lg text-white ${getNodeColor(node.status, node.type)}`}>
                      <div className="flex items-center justify-between mb-2">
                        <Icon className="w-5 h-5" />
                        <Badge className={getStatusBadge(node.status)}>
                          {node.status}
                        </Badge>
                      </div>
                      <h4 className="font-medium text-sm">{node.name}</h4>
                      <p className="text-xs opacity-90 mt-1">{node.description}</p>
                      {node.throughput && (
                        <div className="text-xs mt-2 opacity-75">
                          {node.throughput} MB/s
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Flow Arrows */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-2">
              <ArrowRight className="w-6 h-6 text-gray-400" />
              <span className="text-sm text-gray-600">Data Flow</span>
              <ArrowRight className="w-6 h-6 text-gray-400" />
            </div>
          </div>

          {/* Data Processor */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-600 mb-4">Processing Layer</h3>
            <div className="flex justify-center">
              {nodes.filter(n => n.type === 'processor').map((node) => {
                const Icon = node.icon;
                return (
                  <motion.div
                    key={node.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative"
                  >
                    <div className={`p-6 rounded-lg text-white ${getNodeColor(node.status, node.type)}`}>
                      <div className="flex items-center justify-between mb-3">
                        <Icon className="w-6 h-6" />
                        <Badge className={getStatusBadge(node.status)}>
                          {node.status}
                        </Badge>
                      </div>
                      <h4 className="font-medium">{node.name}</h4>
                      <p className="text-sm opacity-90 mt-1">{node.description}</p>
                      {node.latency && (
                        <div className="text-sm mt-2 opacity-75">
                          Latency: {node.latency}ms
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Flow Arrows */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-2">
              <ArrowRight className="w-6 h-6 text-gray-400" />
              <span className="text-sm text-gray-600">ML Processing</span>
              <ArrowRight className="w-6 h-6 text-gray-400" />
            </div>
          </div>

          {/* ML Models Row */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-600 mb-4">ML Models</h3>
            <div className="grid grid-cols-3 gap-4">
              {nodes.filter(n => n.type === 'model').map((node) => {
                const Icon = node.icon;
                return (
                  <motion.div
                    key={node.id}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative"
                  >
                    <div className={`p-4 rounded-lg text-white ${getNodeColor(node.status, node.type)}`}>
                      <div className="flex items-center justify-between mb-2">
                        <Icon className="w-5 h-5" />
                        <Badge className={getStatusBadge(node.status)}>
                          {node.status}
                        </Badge>
                      </div>
                      <h4 className="font-medium text-sm">{node.name}</h4>
                      <p className="text-xs opacity-90 mt-1">{node.description}</p>
                      {node.latency && (
                        <div className="text-xs mt-2 opacity-75">
                          {node.latency}ms avg
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Flow Arrows */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-2">
              <ArrowRight className="w-6 h-6 text-gray-400" />
              <span className="text-sm text-gray-600">Results</span>
              <ArrowRight className="w-6 h-6 text-gray-400" />
            </div>
          </div>

          {/* Output */}
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-4">Output</h3>
            <div className="flex justify-center">
              {nodes.filter(n => n.type === 'output').map((node) => {
                const Icon = node.icon;
                return (
                  <motion.div
                    key={node.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative"
                  >
                    <div className={`p-6 rounded-lg text-white ${getNodeColor(node.status, node.type)}`}>
                      <div className="flex items-center justify-between mb-3">
                        <Icon className="w-6 h-6" />
                        <Badge className={getStatusBadge(node.status)}>
                          {node.status}
                        </Badge>
                      </div>
                      <h4 className="font-medium">{node.name}</h4>
                      <p className="text-sm opacity-90 mt-1">{node.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Animated Data Particles */}
          <AnimatePresence>
            {Array.from(animatingFlows).map((flowId) => (
              <motion.div
                key={flowId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
              >
                <motion.div
                  initial={{ x: 0, y: 0 }}
                  animate={{ x: 100, y: 50 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                  className="w-2 h-2 bg-blue-500 rounded-full"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Flow Statistics */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-4">Flow Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">25.4</div>
              <div className="text-xs text-gray-600">MB/s Total Throughput</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">118</div>
              <div className="text-xs text-gray-600">ms Avg Latency</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">3</div>
              <div className="text-xs text-gray-600">Active Models</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">99.2%</div>
              <div className="text-xs text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

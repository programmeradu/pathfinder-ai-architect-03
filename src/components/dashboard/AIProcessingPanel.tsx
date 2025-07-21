import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Cpu,
  Database,
  Globe,
  Zap,
  Activity,
  TrendingUp,
  Users,
  Target,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface AIModel {
  id: string;
  name: string;
  status: 'active' | 'processing' | 'idle' | 'error';
  progress: number;
  lastUpdate: string;
  description: string;
  icon: React.ReactNode;
}

interface ProcessingTask {
  id: string;
  name: string;
  progress: number;
  status: 'running' | 'completed' | 'queued';
  estimatedTime: string;
}

export const AIProcessingPanel = () => {
  const [models, setModels] = useState<AIModel[]>([
    {
      id: 'career-dna',
      name: 'CareerDNA Analyzer',
      status: 'active',
      progress: 85,
      lastUpdate: '2 minutes ago',
      description: 'Analyzing personality-career compatibility',
      icon: <Brain className="h-4 w-4" />
    },
    {
      id: 'opportunity-oracle',
      name: 'OpportunityOracle',
      status: 'processing',
      progress: 60,
      lastUpdate: '30 seconds ago',
      description: 'Scanning global job markets',
      icon: <Globe className="h-4 w-4" />
    },
    {
      id: 'skill-graph',
      name: 'SkillGraph Engine',
      status: 'active',
      progress: 92,
      lastUpdate: '1 minute ago',
      description: 'Mapping skill relationships and gaps',
      icon: <Target className="h-4 w-4" />
    },
    {
      id: 'culture-match',
      name: 'CultureMatch AI',
      status: 'idle',
      progress: 100,
      lastUpdate: '5 minutes ago',
      description: 'Evaluating company culture fit',
      icon: <Users className="h-4 w-4" />
    },
    {
      id: 'career-simulator',
      name: 'Career Simulator',
      status: 'processing',
      progress: 45,
      lastUpdate: '1 minute ago',
      description: 'Simulating career trajectory outcomes',
      icon: <TrendingUp className="h-4 w-4" />
    }
  ]);

  const [currentTasks, setCurrentTasks] = useState<ProcessingTask[]>([
    {
      id: '1',
      name: 'Resume Analysis',
      progress: 75,
      status: 'running',
      estimatedTime: '2 min'
    },
    {
      id: '2',
      name: 'Market Research',
      progress: 100,
      status: 'completed',
      estimatedTime: 'Complete'
    },
    {
      id: '3',
      name: 'Skill Gap Analysis',
      progress: 0,
      status: 'queued',
      estimatedTime: '5 min'
    }
  ]);

  const [systemMetrics, setSystemMetrics] = useState({
    cpuUsage: 68,
    memoryUsage: 45,
    apiCalls: 1247,
    accuracy: 94.2
  });

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setModels(prev => prev.map(model => ({
        ...model,
        progress: model.status === 'processing' 
          ? Math.min(100, model.progress + Math.random() * 5)
          : model.progress,
        lastUpdate: model.status === 'active' || model.status === 'processing'
          ? 'Just now'
          : model.lastUpdate
      })));

      setCurrentTasks(prev => prev.map(task => ({
        ...task,
        progress: task.status === 'running'
          ? Math.min(100, task.progress + Math.random() * 10)
          : task.progress
      })));

      setSystemMetrics(prev => ({
        ...prev,
        cpuUsage: Math.round(Math.max(30, Math.min(90, prev.cpuUsage + (Math.random() - 0.5) * 10))),
        memoryUsage: Math.round(Math.max(20, Math.min(80, prev.memoryUsage + (Math.random() - 0.5) * 8))),
        apiCalls: prev.apiCalls + Math.floor(Math.random() * 5),
        accuracy: Math.round(Math.max(85, Math.min(99, prev.accuracy + (Math.random() - 0.5) * 2)) * 10) / 10
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'idle': return 'text-gray-600 bg-gray-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-3 w-3" />;
      case 'processing': return <Clock className="h-3 w-3 animate-spin" />;
      case 'idle': return <Clock className="h-3 w-3" />;
      case 'error': return <AlertCircle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Cpu className="h-5 w-5 mr-2 text-primary" />
            AI Processing Center
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* System Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-primary">{systemMetrics.cpuUsage}%</div>
                <div className="text-xs text-muted-foreground">CPU Usage</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-secondary">{systemMetrics.memoryUsage}%</div>
                <div className="text-xs text-muted-foreground">Memory</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-accent">{systemMetrics.apiCalls.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">API Calls</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{systemMetrics.accuracy}%</div>
                <div className="text-xs text-muted-foreground">Accuracy</div>
              </div>
            </div>

            {/* AI Models Status */}
            <div>
              <h4 className="font-medium mb-3 flex items-center">
                <Brain className="h-4 w-4 mr-2" />
                AI Models Status
              </h4>
              <div className="space-y-3">
                {models.map((model) => (
                  <motion.div
                    key={model.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-primary">
                        {model.icon}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{model.name}</div>
                        <div className="text-xs text-muted-foreground">{model.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="text-sm font-medium">{model.progress}%</div>
                        <div className="text-xs text-muted-foreground">{model.lastUpdate}</div>
                      </div>
                      <Badge className={getStatusColor(model.status)}>
                        {getStatusIcon(model.status)}
                        <span className="ml-1 capitalize">{model.status}</span>
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Current Processing Tasks */}
            <div>
              <h4 className="font-medium mb-3 flex items-center">
                <Activity className="h-4 w-4 mr-2" />
                Current Tasks
              </h4>
              <div className="space-y-3">
                {currentTasks.map((task) => (
                  <div key={task.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{task.name}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">{task.estimatedTime}</span>
                        <Badge 
                          variant={task.status === 'completed' ? 'default' : 'secondary'}
                          className={
                            task.status === 'completed' 
                              ? 'bg-green-100 text-green-800'
                              : task.status === 'running'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }
                        >
                          {task.status}
                        </Badge>
                      </div>
                    </div>
                    <Progress 
                      value={task.progress} 
                      className={`h-2 ${
                        task.status === 'completed' ? 'bg-green-100' : ''
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Data Flow Visualization */}
            <div>
              <h4 className="font-medium mb-3 flex items-center">
                <Database className="h-4 w-4 mr-2" />
                Data Flow
              </h4>
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                      <Database className="h-6 w-6 text-blue-600" />
                    </div>
                    <span className="text-xs text-center">Data Sources</span>
                  </div>
                  
                  <motion.div 
                    className="flex-1 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-4"
                    animate={{ 
                      background: [
                        'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)',
                        'linear-gradient(90deg, #8b5cf6 0%, #3b82f6 100%)',
                        'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)'
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                      <Brain className="h-6 w-6 text-purple-600" />
                    </div>
                    <span className="text-xs text-center">AI Processing</span>
                  </div>
                  
                  <motion.div 
                    className="flex-1 h-0.5 bg-gradient-to-r from-purple-500 to-green-500 mx-4"
                    animate={{ 
                      background: [
                        'linear-gradient(90deg, #8b5cf6 0%, #10b981 100%)',
                        'linear-gradient(90deg, #10b981 0%, #8b5cf6 100%)',
                        'linear-gradient(90deg, #8b5cf6 0%, #10b981 100%)'
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  />
                  
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                      <Zap className="h-6 w-6 text-green-600" />
                    </div>
                    <span className="text-xs text-center">Insights</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
/**
 * AI Processing Panel Component
 * Shows users how AI models process their data with real-time visualization
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Zap, 
  Activity, 
  TrendingUp, 
  Database,
  Network,
  CheckCircle,
  AlertCircle,
  Clock,
  BarChart3
} from 'lucide-react';
import { useGlobalStore } from '@/store/globalStore';
import { motion, AnimatePresence } from 'framer-motion';

interface ProcessingStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  duration?: number;
  icon: React.ComponentType<any>;
}

interface ModelActivity {
  modelName: string;
  status: 'idle' | 'processing' | 'training' | 'error';
  confidence: number;
  lastUpdate: Date;
  processingTime: number;
}

export const AIProcessingPanel: React.FC = () => {
  const isAnalyzing = useGlobalStore((state) => state.isAnalyzing);
  const analysisProgress = useGlobalStore((state) => state.analysisProgress);
  const modelStatus = useGlobalStore((state) => state.modelStatus);
  const setAnalyzing = useGlobalStore((state) => state.setAnalyzing);
  const setAnalysisProgress = useGlobalStore((state) => state.setAnalysisProgress);

  const [currentStep, setCurrentStep] = useState(0);
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([
    {
      id: 'data_collection',
      name: 'Data Collection',
      description: 'Gathering your profile and market data',
      status: 'pending',
      progress: 0,
      icon: Database,
    },
    {
      id: 'skill_analysis',
      name: 'Skill Analysis',
      description: 'Analyzing your skills and experience',
      status: 'pending',
      progress: 0,
      icon: TrendingUp,
    },
    {
      id: 'market_matching',
      name: 'Market Matching',
      description: 'Matching with current opportunities',
      status: 'pending',
      progress: 0,
      icon: Network,
    },
    {
      id: 'ai_processing',
      name: 'AI Processing',
      description: 'Running ML models for predictions',
      status: 'pending',
      progress: 0,
      icon: Brain,
    },
    {
      id: 'result_generation',
      name: 'Result Generation',
      description: 'Generating personalized recommendations',
      status: 'pending',
      progress: 0,
      icon: BarChart3,
    },
  ]);

  const [modelActivities] = useState<ModelActivity[]>([
    {
      modelName: 'Career DNA',
      status: 'processing',
      confidence: 94,
      lastUpdate: new Date(),
      processingTime: 1250,
    },
    {
      modelName: 'Skill Demand',
      status: 'processing',
      confidence: 91,
      lastUpdate: new Date(),
      processingTime: 890,
    },
    {
      modelName: 'Opportunity Oracle',
      status: 'idle',
      confidence: 89,
      lastUpdate: new Date(),
      processingTime: 0,
    },
    {
      modelName: 'Culture Match',
      status: 'processing',
      confidence: 87,
      lastUpdate: new Date(),
      processingTime: 2100,
    },
  ]);

  // Simulate processing when analysis starts
  useEffect(() => {
    if (isAnalyzing) {
      simulateProcessing();
    }
  }, [isAnalyzing]);

  const simulateProcessing = async () => {
    const steps = [...processingSteps];
    
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      
      // Update step to processing
      steps[i].status = 'processing';
      setProcessingSteps([...steps]);
      
      // Simulate progress
      for (let progress = 0; progress <= 100; progress += 10) {
        steps[i].progress = progress;
        setProcessingSteps([...steps]);
        setAnalysisProgress((i * 100 + progress) / steps.length);
        
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      // Mark as completed
      steps[i].status = 'completed';
      steps[i].duration = Math.random() * 2000 + 500; // Random duration
      setProcessingSteps([...steps]);
    }
    
    setAnalyzing(false);
  };

  const startAnalysis = () => {
    // Reset steps
    const resetSteps = processingSteps.map(step => ({
      ...step,
      status: 'pending' as const,
      progress: 0,
      duration: undefined,
    }));
    setProcessingSteps(resetSteps);
    setCurrentStep(0);
    setAnalysisProgress(0);
    setAnalyzing(true);
  };

  const getStatusIcon = (status: ProcessingStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'processing':
        return <Activity className="w-4 h-4 text-blue-600 animate-pulse" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getModelStatusColor = (status: ModelActivity['status']) => {
    switch (status) {
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'training':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Main Processing Status */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 text-white overflow-hidden">
        <CardHeader className="relative">
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative z-10">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <motion.div
                  animate={{
                    rotate: isAnalyzing ? 360 : 0,
                    scale: isAnalyzing ? [1, 1.1, 1] : 1
                  }}
                  transition={{
                    rotate: { duration: 2, repeat: isAnalyzing ? Infinity : 0, ease: "linear" },
                    scale: { duration: 1.5, repeat: isAnalyzing ? Infinity : 0 }
                  }}
                  className="mr-3"
                >
                  <Brain className="w-8 h-8" />
                </motion.div>
                <div>
                  <div className="text-2xl font-bold">AI Processing Center</div>
                  <div className="text-white/80 text-sm font-normal">Advanced career intelligence</div>
                </div>
              </div>
              <Badge className="bg-white/20 text-white border-white/30 animate-pulse">
                {isAnalyzing ? 'ACTIVE' : 'READY'}
              </Badge>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="absolute inset-0 bg-black/5" />
          <div className="relative z-10">
            {isAnalyzing ? (
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Overall Progress</span>
                    <span className="font-mono text-xl">{Math.round(analysisProgress)}%</span>
                  </div>
                  <div className="relative">
                    <Progress value={analysisProgress} className="h-3 bg-white/20" />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent h-3 rounded-full"
                      animate={{ x: [-100, 300] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                  </div>
                </div>

                <div className="text-center">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-lg font-medium mb-2"
                  >
                    Step {currentStep + 1} of {processingSteps.length}
                  </motion.div>
                  <div className="text-white/90">
                    {processingSteps[currentStep]?.name}
                  </div>
                </div>

                {/* AI Metrics */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
                  {[
                    { label: 'Models Active', value: '5', icon: Brain },
                    { label: 'Data Points', value: '2.3K', icon: Database },
                    { label: 'Accuracy', value: '94%', icon: BarChart3 },
                  ].map((metric, index) => (
                    <motion.div
                      key={metric.label}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                      className="text-center"
                    >
                      <metric.icon className="w-6 h-6 mx-auto mb-2 text-white/80" />
                      <div className="text-lg font-bold">{metric.value}</div>
                      <div className="text-xs text-white/70">{metric.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mb-6"
                >
                  <Brain className="w-20 h-20 mx-auto text-white/80" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-3">Ready for Deep Analysis</h3>
                <p className="text-white/90 mb-6 max-w-md mx-auto">
                  Unleash the power of AI to discover hidden career opportunities and optimize your professional path
                </p>
                <Button
                  onClick={startAnalysis}
                  size="lg"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Begin AI Analysis
                </Button>
              </motion.div>
            )}
          </div>

          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white/10 rounded-full"
                animate={{
                  x: [0, 100, 0],
                  y: [0, -50, 0],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 3 + i,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
                style={{
                  left: `${10 + i * 15}%`,
                  top: `${20 + i * 10}%`,
                }}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Processing Steps Visualization */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-600" />
            Processing Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {processingSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep && isAnalyzing;
              
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    isActive 
                      ? 'border-blue-200 bg-blue-50' 
                      : step.status === 'completed'
                        ? 'border-green-200 bg-green-50'
                        : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full mr-3 ${
                        isActive 
                          ? 'bg-blue-100' 
                          : step.status === 'completed'
                            ? 'bg-green-100'
                            : 'bg-gray-100'
                      }`}>
                        <Icon className={`w-4 h-4 ${
                          isActive 
                            ? 'text-blue-600' 
                            : step.status === 'completed'
                              ? 'text-green-600'
                              : 'text-gray-600'
                        }`} />
                      </div>
                      <div>
                        <h4 className="font-medium">{step.name}</h4>
                        <p className="text-sm text-gray-600">{step.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {step.duration && (
                        <span className="text-xs text-gray-500">
                          {Math.round(step.duration)}ms
                        </span>
                      )}
                      {getStatusIcon(step.status)}
                    </div>
                  </div>
                  
                  {step.status === 'processing' && (
                    <Progress value={step.progress} className="h-2" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Model Activity Monitor */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Network className="w-5 h-5 mr-2 text-purple-600" />
            ML Model Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modelActivities.map((model) => (
              <motion.div
                key={model.modelName}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{model.modelName}</h4>
                  <Badge className={getModelStatusColor(model.status)}>
                    {model.status}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Confidence</span>
                    <span className="font-semibold">{model.confidence}%</span>
                  </div>
                  <Progress value={model.confidence} className="h-2" />
                  
                  {model.status === 'processing' && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Processing time</span>
                      <span>{model.processingTime}ms</span>
                    </div>
                  )}
                </div>
                
                {model.status === 'processing' && (
                  <div className="mt-3 flex items-center text-sm text-blue-600">
                    <Activity className="w-3 h-3 mr-1 animate-pulse" />
                    Active
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Flow Visualization */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
            Data Flow
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="flex items-center justify-between">
              {['Input Data', 'Processing', 'ML Models', 'Results'].map((stage, index) => (
                <div key={stage} className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isAnalyzing && index <= currentStep 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="text-sm mt-2 text-center">{stage}</span>
                  
                  {index < 3 && (
                    <div className="absolute top-6 w-full h-0.5 bg-gray-200">
                      <AnimatePresence>
                        {isAnalyzing && index < currentStep && (
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            className="h-full bg-blue-500"
                          />
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

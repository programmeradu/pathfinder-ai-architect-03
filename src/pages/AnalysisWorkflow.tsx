/**
 * Analysis Workflow Page
 * Interactive career analysis workflow with step-by-step guidance
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  CheckCircle, 
  Clock, 
  ArrowRight,
  FileText,
  Users,
  Target,
  TrendingUp
} from 'lucide-react';

const AnalysisWorkflow: React.FC = () => {
  const currentStep = 2;
  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const steps = [
    {
      id: 1,
      title: 'Profile Setup',
      description: 'Complete your professional profile',
      status: 'completed',
      icon: FileText,
    },
    {
      id: 2,
      title: 'Skills Assessment',
      description: 'Evaluate your current skills and experience',
      status: 'current',
      icon: Target,
    },
    {
      id: 3,
      title: 'Market Analysis',
      description: 'Analyze current market opportunities',
      status: 'pending',
      icon: TrendingUp,
    },
    {
      id: 4,
      title: 'AI Processing',
      description: 'Let our AI analyze your career potential',
      status: 'pending',
      icon: Brain,
    },
    {
      id: 5,
      title: 'Results & Recommendations',
      description: 'Review your personalized career roadmap',
      status: 'pending',
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Career Analysis Workflow
            </h1>
            <p className="text-gray-600">
              Follow our guided process to discover your perfect career path
            </p>
            <div className="mt-4">
              <Progress value={progress} className="w-full max-w-md mx-auto" />
              <p className="text-sm text-gray-500 mt-2">
                Step {currentStep} of {totalSteps} - {Math.round(progress)}% Complete
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Steps Overview */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = step.status === 'completed';
              const isCurrent = step.status === 'current';
              
              return (
                <div key={step.id} className="relative">
                  <Card className={`border-2 transition-all duration-200 ${
                    isCompleted 
                      ? 'border-green-200 bg-green-50' 
                      : isCurrent 
                        ? 'border-blue-200 bg-blue-50 shadow-lg' 
                        : 'border-gray-200 bg-gray-50'
                  }`}>
                    <CardContent className="p-4 text-center">
                      <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                        isCompleted 
                          ? 'bg-green-100 text-green-600' 
                          : isCurrent 
                            ? 'bg-blue-100 text-blue-600' 
                            : 'bg-gray-100 text-gray-400'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : (
                          <Icon className="w-6 h-6" />
                        )}
                      </div>
                      <h3 className="font-semibold text-sm mb-1">{step.title}</h3>
                      <p className="text-xs text-gray-600">{step.description}</p>
                      {isCurrent && (
                        <Badge className="mt-2 bg-blue-100 text-blue-800">
                          Current
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                  
                  {/* Arrow between steps */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Step Content */}
        <Card className="border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center text-xl">
              <Target className="w-6 h-6 mr-3" />
              Skills Assessment
            </CardTitle>
            <p className="text-blue-100">
              Help us understand your current skills and experience level
            </p>
          </CardHeader>
          <CardContent className="p-8">
            
            {/* Skills Assessment Form */}
            <div className="space-y-6">
              
              {/* Technical Skills */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Technical Skills</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    'JavaScript/TypeScript',
                    'React/Vue/Angular',
                    'Node.js/Python',
                    'Database Management',
                    'Cloud Platforms',
                    'DevOps/CI-CD',
                  ].map((skill) => (
                    <div key={skill} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{skill}</span>
                        <Badge variant="outline">Intermediate</Badge>
                      </div>
                      <Progress value={65} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Beginner</span>
                        <span>Expert</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Soft Skills */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Professional Skills</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    'Leadership',
                    'Communication',
                    'Problem Solving',
                    'Project Management',
                    'Team Collaboration',
                    'Strategic Thinking',
                  ].map((skill) => (
                    <div key={skill} className="p-3 bg-gray-50 rounded-lg text-center">
                      <div className="font-medium text-sm mb-2">{skill}</div>
                      <div className="flex justify-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <div
                            key={star}
                            className={`w-4 h-4 rounded-full ${
                              star <= 3 ? 'bg-yellow-400' : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Experience & Background</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <label className="block text-sm font-medium mb-2">
                        Years of Experience
                      </label>
                      <select className="w-full p-2 border border-gray-300 rounded-md">
                        <option>0-1 years</option>
                        <option>2-3 years</option>
                        <option>4-6 years</option>
                        <option>7-10 years</option>
                        <option>10+ years</option>
                      </select>
                    </div>
                    
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <label className="block text-sm font-medium mb-2">
                        Current Role Level
                      </label>
                      <select className="w-full p-2 border border-gray-300 rounded-md">
                        <option>Entry Level</option>
                        <option>Mid Level</option>
                        <option>Senior Level</option>
                        <option>Lead/Principal</option>
                        <option>Management</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <label className="block text-sm font-medium mb-2">
                        Industry Focus
                      </label>
                      <select className="w-full p-2 border border-gray-300 rounded-md">
                        <option>Technology</option>
                        <option>Finance</option>
                        <option>Healthcare</option>
                        <option>Education</option>
                        <option>Other</option>
                      </select>
                    </div>
                    
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <label className="block text-sm font-medium mb-2">
                        Team Size Managed
                      </label>
                      <select className="w-full p-2 border border-gray-300 rounded-md">
                        <option>Individual Contributor</option>
                        <option>2-5 people</option>
                        <option>6-10 people</option>
                        <option>11-20 people</option>
                        <option>20+ people</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <Button variant="outline">
                <Clock className="w-4 h-4 mr-2" />
                Save Progress
              </Button>
              
              <div className="space-x-3">
                <Button variant="outline">
                  Previous Step
                </Button>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600">
                  Continue to Market Analysis
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalysisWorkflow;

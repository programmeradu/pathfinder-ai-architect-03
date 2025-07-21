/**
 * Life Path Explorer Page
 * Interactive exploration of different life and career paths
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Compass, 
  GraduationCap, 
  Briefcase, 
  Globe, 
  Heart,
  TrendingUp,
  DollarSign,
  Clock,
  Users,
  MapPin
} from 'lucide-react';

const LifePathExplorer: React.FC = () => {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  const lifePaths = [
    {
      id: 'college',
      title: 'Traditional College Path',
      icon: GraduationCap,
      description: 'Four-year degree with comprehensive education',
      timeframe: '4-6 years',
      cost: '$40,000 - $200,000',
      outcomes: ['Bachelor\'s Degree', 'Network Building', 'Research Experience'],
      pros: ['Comprehensive education', 'Strong alumni network', 'Research opportunities'],
      cons: ['High cost', 'Time commitment', 'Theoretical focus'],
      successRate: 85,
      salaryRange: '$45,000 - $120,000',
    },
    {
      id: 'trade',
      title: 'Trade School & Apprenticeship',
      icon: Briefcase,
      description: 'Specialized technical training and hands-on experience',
      timeframe: '6 months - 2 years',
      cost: '$3,000 - $30,000',
      outcomes: ['Professional Certification', 'Immediate Employment', 'Practical Skills'],
      pros: ['Lower cost', 'Quick entry to workforce', 'High demand skills'],
      cons: ['Limited advancement', 'Physical demands', 'Economic sensitivity'],
      successRate: 92,
      salaryRange: '$35,000 - $85,000',
    },
    {
      id: 'bootcamp',
      title: 'Coding Bootcamp & Tech',
      icon: TrendingUp,
      description: 'Intensive technology training for rapid career change',
      timeframe: '3-12 months',
      cost: '$10,000 - $25,000',
      outcomes: ['Technical Certification', 'Portfolio Projects', 'Job Placement'],
      pros: ['Fast track to tech', 'High ROI', 'Industry connections'],
      cons: ['Intensive pace', 'Limited depth', 'Market saturation'],
      successRate: 78,
      salaryRange: '$50,000 - $150,000',
    },
    {
      id: 'entrepreneurship',
      title: 'Entrepreneurship & Startup',
      icon: TrendingUp,
      description: 'Start your own business or join early-stage startup',
      timeframe: '1-5 years to profitability',
      cost: '$5,000 - $100,000+',
      outcomes: ['Business Ownership', 'Leadership Experience', 'Financial Independence'],
      pros: ['Unlimited potential', 'Creative freedom', 'Equity building'],
      cons: ['High risk', 'Uncertain income', 'Long hours'],
      successRate: 45,
      salaryRange: '$0 - $1,000,000+',
    },
    {
      id: 'international',
      title: 'International Experience',
      icon: Globe,
      description: 'Work or study abroad for global perspective',
      timeframe: '1-4 years',
      cost: '$15,000 - $80,000',
      outcomes: ['Cultural Fluency', 'Global Network', 'Language Skills'],
      pros: ['Cultural exposure', 'Language skills', 'Global perspective'],
      cons: ['Visa challenges', 'Distance from family', 'Cultural adjustment'],
      successRate: 88,
      salaryRange: '$30,000 - $120,000',
    },
    {
      id: 'military',
      title: 'Military Service',
      icon: Users,
      description: 'Serve your country while gaining valuable skills',
      timeframe: '2-20+ years',
      cost: 'Paid training + benefits',
      outcomes: ['Leadership Training', 'Technical Skills', 'Veteran Benefits'],
      pros: ['Paid training', 'Leadership development', 'Veteran benefits'],
      cons: ['Deployment risks', 'Rigid structure', 'Limited location choice'],
      successRate: 95,
      salaryRange: '$25,000 - $100,000+',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center">
              <Compass className="w-8 h-8 mr-3 text-blue-600" />
              Life Path Explorer
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover and compare different life paths to find the one that aligns with your goals, 
              values, and circumstances. Each path offers unique opportunities and challenges.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Path Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {lifePaths.map((path) => {
            const Icon = path.icon;
            const isSelected = selectedPath === path.id;
            
            return (
              <Card 
                key={path.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''
                }`}
                onClick={() => setSelectedPath(path.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Icon className={`w-8 h-8 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
                    <Badge 
                      variant={isSelected ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {path.successRate}% Success Rate
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{path.title}</CardTitle>
                  <p className="text-sm text-gray-600">{path.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Clock className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{path.timeframe}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{path.cost}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <TrendingUp className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{path.salaryRange}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Detailed Path Analysis */}
        {selectedPath && (
          <Card className="border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <CardTitle className="text-2xl">
                {lifePaths.find(p => p.id === selectedPath)?.title} - Detailed Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {(() => {
                const path = lifePaths.find(p => p.id === selectedPath);
                if (!path) return null;

                return (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Left Column - Overview */}
                    <div className="space-y-6">
                      
                      {/* Key Metrics */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Key Metrics</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-green-50 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                              {path.successRate}%
                            </div>
                            <div className="text-sm text-green-800">Success Rate</div>
                          </div>
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="text-lg font-bold text-blue-600">
                              {path.timeframe}
                            </div>
                            <div className="text-sm text-blue-800">Time Investment</div>
                          </div>
                        </div>
                      </div>

                      {/* Expected Outcomes */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Expected Outcomes</h3>
                        <div className="space-y-2">
                          {path.outcomes.map((outcome, index) => (
                            <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                              <span className="text-sm">{outcome}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Financial Projection */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Financial Projection</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Initial Investment</span>
                            <span className="font-semibold">{path.cost}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Expected Salary Range</span>
                            <span className="font-semibold">{path.salaryRange}</span>
                          </div>
                          <div className="pt-2 border-t">
                            <div className="text-sm text-gray-600">
                              ROI Timeline: 2-5 years depending on career progression
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Pros & Cons */}
                    <div className="space-y-6">
                      
                      {/* Advantages */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4 text-green-700">
                          Advantages
                        </h3>
                        <div className="space-y-2">
                          {path.pros.map((pro, index) => (
                            <div key={index} className="flex items-start p-3 bg-green-50 rounded-lg">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></div>
                              <span className="text-sm text-green-800">{pro}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Challenges */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4 text-red-700">
                          Challenges & Considerations
                        </h3>
                        <div className="space-y-2">
                          {path.cons.map((con, index) => (
                            <div key={index} className="flex items-start p-3 bg-red-50 rounded-lg">
                              <div className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2"></div>
                              <span className="text-sm text-red-800">{con}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Compatibility Score */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Your Compatibility</h3>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Skills Match</span>
                              <span>78%</span>
                            </div>
                            <Progress value={78} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Financial Fit</span>
                              <span>65%</span>
                            </div>
                            <Progress value={65} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Lifestyle Match</span>
                              <span>82%</span>
                            </div>
                            <Progress value={82} className="h-2" />
                          </div>
                          <div className="pt-2 border-t">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold">Overall Compatibility</span>
                              <Badge className="bg-blue-100 text-blue-800">75%</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Action Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                <Button variant="outline">
                  <Heart className="w-4 h-4 mr-2" />
                  Save to Favorites
                </Button>
                
                <div className="space-x-3">
                  <Button variant="outline">
                    Compare Paths
                  </Button>
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600">
                    Start This Path
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LifePathExplorer;

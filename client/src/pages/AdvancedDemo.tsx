import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Search, Target, Zap, TrendingUp, Users, Globe, ChevronRight } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export default function AdvancedDemo() {
  const [activeDemo, setActiveDemo] = useState('forecasting');
  const [inputData, setInputData] = useState({
    skills: '',
    targetRole: '',
    industry: '',
    companyName: '',
    query: ''
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Career Forecasting Demo
  const forecastingMutation = useMutation({
    mutationFn: async (data: { userSkills: string[], preferences: any }) => {
      return await apiRequest('/api/ml/predict-opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Career Forecast Complete",
        description: `Found ${data.opportunities?.length || 0} opportunities`,
      });
    },
    onError: (error) => {
      toast({
        title: "Forecast Failed",
        description: "Unable to generate career forecast",
        variant: "destructive",
      });
    }
  });

  // Intelligence Scraping Demo
  const intelligenceMutation = useMutation({
    mutationFn: async (data: { query: string, domains?: string[], depth?: number }) => {
      return await apiRequest('/api/intelligence/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Intelligence Gathered",
        description: `Analyzed ${data.intelligence?.sources?.length || 0} sources`,
      });
    },
    onError: (error) => {
      toast({
        title: "Intelligence Failed",
        description: "Unable to gather intelligence",
        variant: "destructive",
      });
    }
  });

  // Market Intelligence Demo
  const marketMutation = useMutation({
    mutationFn: async (data: { industry: string, region?: string }) => {
      return await apiRequest('/api/intelligence/market-intel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Market Analysis Complete",
        description: `Generated comprehensive market intelligence`,
      });
    },
    onError: (error) => {
      toast({
        title: "Market Analysis Failed",
        description: "Unable to analyze market",
        variant: "destructive",
      });
    }
  });

  // Company Intelligence Demo
  const companyMutation = useMutation({
    mutationFn: async (data: { companyName: string }) => {
      return await apiRequest('/api/intelligence/company-intel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Company Intelligence Complete",
        description: `Analyzed ${data.companyIntel?.company_name || 'target company'}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Company Analysis Failed",
        description: "Unable to analyze company",
        variant: "destructive",
      });
    }
  });

  const handleCareerForecast = () => {
    const skills = inputData.skills.split(',').map(s => s.trim()).filter(Boolean);
    forecastingMutation.mutate({
      userSkills: skills,
      preferences: {
        location: 'Global',
        experienceLevel: 'Intermediate',
        industry: 'Technology',
        learningStyle: 'Mixed'
      }
    });
  };

  const handleIntelligenceScrape = () => {
    intelligenceMutation.mutate({
      query: inputData.query,
      domains: [],
      depth: 2
    });
  };

  const handleMarketAnalysis = () => {
    marketMutation.mutate({
      industry: inputData.industry,
      region: 'global'
    });
  };

  const handleCompanyAnalysis = () => {
    companyMutation.mutate({
      companyName: inputData.companyName
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Advanced AI Features Demo
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the power of Pathfinder's advanced ML models and killer API capabilities
          </p>
        </motion.div>

        {/* Demo Tabs */}
        <Tabs value={activeDemo} onValueChange={setActiveDemo} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="forecasting" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Career Forecasting
            </TabsTrigger>
            <TabsTrigger value="intelligence" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Intelligence Scraping
            </TabsTrigger>
            <TabsTrigger value="market" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Market Analysis
            </TabsTrigger>
            <TabsTrigger value="company" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Company Intel
            </TabsTrigger>
          </TabsList>

          {/* Career Forecasting Demo */}
          <TabsContent value="forecasting" className="space-y-6">
            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-400" />
                  AI Career Forecasting
                </CardTitle>
                <CardDescription>
                  Advanced ML models predict career opportunities based on skills and market trends
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="skills">Your Skills (comma-separated)</Label>
                  <Input
                    id="skills"
                    placeholder="python, machine learning, react, javascript"
                    value={inputData.skills}
                    onChange={(e) => setInputData({...inputData, skills: e.target.value})}
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
                <Button 
                  onClick={handleCareerForecast}
                  disabled={forecastingMutation.isPending}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  {forecastingMutation.isPending ? 'Forecasting...' : 'Generate Career Forecast'}
                </Button>
                
                {forecastingMutation.data && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-slate-700/50 rounded-lg"
                  >
                    <h3 className="font-semibold mb-2">Forecast Results:</h3>
                    <div className="space-y-2">
                      {forecastingMutation.data.opportunities?.map((opp: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-slate-600/30 rounded">
                          <div>
                            <div className="font-medium">{opp.title}</div>
                            <div className="text-sm text-gray-400">{opp.company} • {opp.location}</div>
                          </div>
                          <div className="text-right">
                            <Badge variant="secondary">{Math.round(opp.matchScore * 100)}% Match</Badge>
                            <div className="text-sm text-gray-400">${opp.salaryRange?.[0]?.toLocaleString()} - ${opp.salaryRange?.[1]?.toLocaleString()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Intelligence Scraping Demo */}
          <TabsContent value="intelligence" className="space-y-6">
            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-purple-400" />
                  Killer Intelligence Scraping
                </CardTitle>
                <CardDescription>
                  Multi-modal web scraping with advanced AI analysis and synthesis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="query">Intelligence Query</Label>
                  <Input
                    id="query"
                    placeholder="artificial intelligence job market trends 2024"
                    value={inputData.query}
                    onChange={(e) => setInputData({...inputData, query: e.target.value})}
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
                <Button 
                  onClick={handleIntelligenceScrape}
                  disabled={intelligenceMutation.isPending}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  {intelligenceMutation.isPending ? 'Gathering Intelligence...' : 'Gather Intelligence'}
                </Button>
                
                {intelligenceMutation.data && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-slate-700/50 rounded-lg"
                  >
                    <h3 className="font-semibold mb-2">Intelligence Report:</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-purple-400">Synthesis:</h4>
                        <p className="text-sm text-gray-300">{intelligenceMutation.data.intelligence?.synthesis}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-purple-400">Key Insights:</h4>
                        <ul className="text-sm text-gray-300 space-y-1">
                          {intelligenceMutation.data.intelligence?.insights?.map((insight: string, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <ChevronRight className="h-3 w-3 mt-1 text-purple-400" />
                              {insight}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-purple-400">Recommendations:</h4>
                        <ul className="text-sm text-gray-300 space-y-1">
                          {intelligenceMutation.data.intelligence?.recommendations?.map((rec: string, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <Target className="h-3 w-3 mt-1 text-pink-400" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-600">
                        <Zap className="h-4 w-4 text-yellow-400" />
                        <span className="text-sm">Confidence: {intelligenceMutation.data.intelligence?.confidence}%</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Market Analysis Demo */}
          <TabsContent value="market" className="space-y-6">
            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-400" />
                  Real-time Market Intelligence
                </CardTitle>
                <CardDescription>
                  Comprehensive market analysis with trend forecasting and competitive landscape
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    placeholder="artificial intelligence, fintech, healthcare"
                    value={inputData.industry}
                    onChange={(e) => setInputData({...inputData, industry: e.target.value})}
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
                <Button 
                  onClick={handleMarketAnalysis}
                  disabled={marketMutation.isPending}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  {marketMutation.isPending ? 'Analyzing Market...' : 'Analyze Market'}
                </Button>
                
                {marketMutation.data && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-slate-700/50 rounded-lg"
                  >
                    <h3 className="font-semibold mb-2">Market Analysis:</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="text-sm text-gray-400">Market Size</div>
                        <div className="text-lg font-medium">{marketMutation.data.marketIntel?.market_size || 'Analyzing...'}</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm text-gray-400">Growth Rate</div>
                        <div className="text-lg font-medium text-green-400">{marketMutation.data.marketIntel?.growth_rate || 'Analyzing...'}</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm text-gray-400">Region</div>
                        <div className="text-lg font-medium">{marketMutation.data.marketIntel?.region || 'Global'}</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm text-gray-400">Last Updated</div>
                        <div className="text-lg font-medium">{new Date(marketMutation.data.marketIntel?.last_updated).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Company Intelligence Demo */}
          <TabsContent value="company" className="space-y-6">
            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-400" />
                  Company Intelligence
                </CardTitle>
                <CardDescription>
                  Deep company analysis including culture, technology stack, and hiring trends
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="company">Company Name</Label>
                  <Input
                    id="company"
                    placeholder="Google, Microsoft, OpenAI, Meta"
                    value={inputData.companyName}
                    onChange={(e) => setInputData({...inputData, companyName: e.target.value})}
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
                <Button 
                  onClick={handleCompanyAnalysis}
                  disabled={companyMutation.isPending}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  {companyMutation.isPending ? 'Analyzing Company...' : 'Analyze Company'}
                </Button>
                
                {companyMutation.data && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-slate-700/50 rounded-lg"
                  >
                    <h3 className="font-semibold mb-2">Company Analysis:</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-purple-400">Overview:</h4>
                        <p className="text-sm text-gray-300">{companyMutation.data.companyIntel?.overview || 'Comprehensive analysis in progress...'}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-purple-400">Industry:</h4>
                          <p className="text-sm text-gray-300">{companyMutation.data.companyIntel?.industry || 'Technology'}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-purple-400">Size:</h4>
                          <p className="text-sm text-gray-300">{companyMutation.data.companyIntel?.size || 'Large Enterprise'}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-purple-400">Headquarters:</h4>
                          <p className="text-sm text-gray-300">{companyMutation.data.companyIntel?.headquarters || 'Global'}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-purple-400">Market Position:</h4>
                          <p className="text-sm text-gray-300">{companyMutation.data.companyIntel?.market_position || 'Market Leader'}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Feature Highlights */}
        <motion.div
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card className="bg-slate-800/50 border-purple-500/20">
            <CardContent className="p-6 text-center">
              <Brain className="h-12 w-12 mx-auto mb-4 text-purple-400" />
              <h3 className="font-semibold mb-2">Advanced ML Models</h3>
              <p className="text-sm text-gray-400">Trained on millions of career data points with continuous learning</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-purple-500/20">
            <CardContent className="p-6 text-center">
              <Globe className="h-12 w-12 mx-auto mb-4 text-purple-400" />
              <h3 className="font-semibold mb-2">Global Intelligence</h3>
              <p className="text-sm text-gray-400">Real-time market data from 195 countries and territories</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-purple-500/20">
            <CardContent className="p-6 text-center">
              <Zap className="h-12 w-12 mx-auto mb-4 text-purple-400" />
              <h3 className="font-semibold mb-2">Lightning Fast</h3>
              <p className="text-sm text-gray-400">Sub-second response times with distributed computing</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
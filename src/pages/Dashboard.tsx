import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Brain, 
  Upload, 
  MessageCircle, 
  BarChart3, 
  Globe, 
  Target,
  Sparkles,
  FileText,
  Image,
  Mic,
  TrendingUp,
  Users,
  Award,
  Map,
  Clock,
  Zap,
  ChevronRight,
  Play,
  Pause,
  Download,
  Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AIChat } from "@/components/dashboard/AIChat";
import { FileProcessor } from "@/components/dashboard/FileProcessor";
import { CareerAnalyzer } from "@/components/dashboard/CareerAnalyzer";
import { SkillAssessment } from "@/components/dashboard/SkillAssessment";
import { PathwayVisualizer } from "@/components/dashboard/PathwayVisualizer";
import { GlobalOpportunities } from "@/components/dashboard/GlobalOpportunities";
import { RealTimeData } from "@/components/dashboard/RealTimeData";
import { AIProcessingPanel } from "@/components/dashboard/AIProcessingPanel";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Simulate initial analysis progress
    const timer = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header 
        className="border-b border-border/50 bg-background/95 backdrop-blur-xl sticky top-0 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary via-accent to-secondary rounded-xl flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-xl">Pathfinder AI</h1>
                  <p className="text-sm text-muted-foreground">Career Intelligence Dashboard</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                AI Active
              </Badge>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share Progress
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-6 py-8">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-8"
        >
          {/* Welcome Section */}
          <motion.div variants={fadeInUp}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Welcome back!</h2>
                <p className="text-muted-foreground">Your AI career assistant is analyzing new opportunities for you.</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">{analysisProgress}%</div>
                <div className="text-sm text-muted-foreground">Analysis Complete</div>
              </div>
            </div>
            <Progress value={analysisProgress} className="h-2" />
          </motion.div>

          {/* Quick Stats */}
          <motion.div variants={fadeInUp}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Career Score</p>
                      <p className="text-2xl font-bold text-primary">92/100</p>
                    </div>
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Skills Mastered</p>
                      <p className="text-2xl font-bold text-secondary">24</p>
                    </div>
                    <Award className="h-8 w-8 text-secondary" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Opportunities</p>
                      <p className="text-2xl font-bold text-accent">1,247</p>
                    </div>
                    <Globe className="h-8 w-8 text-accent" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Success Rate</p>
                      <p className="text-2xl font-bold text-green-600">95%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Main Dashboard Tabs */}
          <motion.div variants={fadeInUp}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-7 bg-muted/50">
                <TabsTrigger value="overview" className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Overview</span>
                </TabsTrigger>
                <TabsTrigger value="chat" className="flex items-center space-x-2">
                  <MessageCircle className="h-4 w-4" />
                  <span>AI Chat</span>
                </TabsTrigger>
                <TabsTrigger value="files" className="flex items-center space-x-2">
                  <Upload className="h-4 w-4" />
                  <span>Files</span>
                </TabsTrigger>
                <TabsTrigger value="analysis" className="flex items-center space-x-2">
                  <Brain className="h-4 w-4" />
                  <span>Analysis</span>
                </TabsTrigger>
                <TabsTrigger value="skills" className="flex items-center space-x-2">
                  <Target className="h-4 w-4" />
                  <span>Skills</span>
                </TabsTrigger>
                <TabsTrigger value="pathways" className="flex items-center space-x-2">
                  <Map className="h-4 w-4" />
                  <span>Pathways</span>
                </TabsTrigger>
                <TabsTrigger value="global" className="flex items-center space-x-2">
                  <Globe className="h-4 w-4" />
                  <span>Global</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <AIProcessingPanel />
                    <RealTimeData />
                  </div>
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Sparkles className="h-5 w-5 mr-2 text-primary" />
                          Quick Actions
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button className="w-full justify-start" variant="outline">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Resume
                        </Button>
                        <Button className="w-full justify-start" variant="outline">
                          <FileText className="h-4 w-4 mr-2" />
                          Analyze Job Description
                        </Button>
                        <Button className="w-full justify-start" variant="outline">
                          <Image className="h-4 w-4 mr-2" />
                          Process Certificate
                        </Button>
                        <Button className="w-full justify-start" variant="outline">
                          <Mic className="h-4 w-4 mr-2" />
                          Voice Assessment
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Clock className="h-5 w-5 mr-2 text-secondary" />
                          Recent Activity
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">Resume analyzed</p>
                            <p className="text-xs text-muted-foreground">2 minutes ago</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">Skills assessment completed</p>
                            <p className="text-xs text-muted-foreground">1 hour ago</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-purple-500 rounded-full" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">Career path updated</p>
                            <p className="text-xs text-muted-foreground">3 hours ago</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="chat">
                <AIChat />
              </TabsContent>

              <TabsContent value="files">
                <FileProcessor />
              </TabsContent>

              <TabsContent value="analysis">
                <CareerAnalyzer />
              </TabsContent>

              <TabsContent value="skills">
                <SkillAssessment />
              </TabsContent>

              <TabsContent value="pathways">
                <PathwayVisualizer />
              </TabsContent>

              <TabsContent value="global">
                <GlobalOpportunities />
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
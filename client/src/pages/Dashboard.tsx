import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Target, 
  BookOpen, 
  Award,
  ArrowRight,
  Clock,
  Play,
  CheckCircle
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface DashboardData {
  user: any;
  activePath: any;
  nextSteps: any[];
  recentAchievements: any[];
  weeklyAnalytics: any[];
}

export default function Dashboard() {
  const { user } = useAuth();
  
  const { data: dashboardData, isLoading } = useQuery<DashboardData>({
    queryKey: ['/api/dashboard'],
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back!</h1>
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const { activePath, nextSteps, recentAchievements, weeklyAnalytics } = dashboardData || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {user?.firstName || user?.username}!
          </h1>
          <p className="text-muted-foreground">
            Here's your learning progress and what's next on your journey.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Path</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activePath?.title || "No active path"}
            </div>
            <p className="text-xs text-muted-foreground">
              {activePath?.progress || 0}% complete
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {weeklyAnalytics?.reduce((acc, day) => acc + (day.resourcesCompleted || 0), 0) || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Resources completed this week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Streak</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {weeklyAnalytics?.[0]?.streakDays || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Days in a row
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {recentAchievements?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Recent milestones
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Up Next Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Up Next
            </CardTitle>
          </CardHeader>
          <CardContent>
            {nextSteps && nextSteps.length > 0 ? (
              <div className="space-y-4">
                {nextSteps.slice(0, 3).map((step, index) => (
                  <div key={step.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-medium">Step {step.stepOrder}</h3>
                        <p className="text-sm text-muted-foreground">
                          {step.resource?.title || "Learning resource"}
                        </p>
                      </div>
                    </div>
                    <Button size="sm">
                      Start Learning
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No active learning path</h3>
                <p className="text-muted-foreground mb-4">
                  Start your journey by creating your first career roadmap
                </p>
                <Button>Create Path</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentAchievements && recentAchievements.length > 0 ? (
              <div className="space-y-3">
                {recentAchievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{achievement.title}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {achievement.description}
                      </p>
                      <Badge variant="outline" className="mt-1">
                        {achievement.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <Award className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Complete learning steps to earn achievements
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      {activePath && (
        <Card>
          <CardHeader>
            <CardTitle>Current Path: {activePath.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-muted-foreground">
                  {activePath.progress}% complete
                </span>
              </div>
              <Progress value={activePath.progress} className="h-2" />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Target: {activePath.targetRole}</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {activePath.estimatedDuration} weeks
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
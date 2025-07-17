import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Map, 
  Plus, 
  CheckCircle, 
  Clock, 
  Target,
  BookOpen,
  ArrowRight
} from "lucide-react";

interface CareerPath {
  id: number;
  title: string;
  description: string;
  targetRole: string;
  progress: number;
  estimatedDuration: number;
  difficulty: string;
  isActive: boolean;
  skills: string[];
}

export default function Roadmap() {
  const { data: careerPaths, isLoading } = useQuery<CareerPath[]>({
    queryKey: ['/api/career-paths'],
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Your Learning Roadmap</h1>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-3 bg-muted rounded w-full"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const activePath = careerPaths?.find(path => path.isActive);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Your Learning Roadmap</h1>
          <p className="text-muted-foreground">
            Track your progress and explore your career paths
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create New Path
        </Button>
      </div>

      {/* Active Path */}
      {activePath && (
        <Card className="border-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  {activePath.title}
                  <Badge variant="secondary">Active</Badge>
                </CardTitle>
                <p className="text-muted-foreground mt-1">
                  {activePath.description}
                </p>
              </div>
              <Badge variant="outline" className="capitalize">
                {activePath.difficulty}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-muted-foreground">
                  {activePath.progress}% complete
                </span>
              </div>
              <Progress value={activePath.progress} className="h-2" />
              
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {activePath.estimatedDuration} weeks
                </span>
                <span>Target: {activePath.targetRole}</span>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {activePath.skills.slice(0, 5).map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {activePath.skills.length > 5 && (
                  <Badge variant="outline" className="text-xs">
                    +{activePath.skills.length - 5} more
                  </Badge>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button className="flex-1">
                  Continue Learning
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <Button variant="outline">
                  View Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Paths */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {careerPaths?.map((path) => (
          <Card key={path.id} className={path.isActive ? "border-primary" : ""}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{path.title}</CardTitle>
                <div className="flex items-center gap-2">
                  {path.isActive && <Badge variant="secondary">Active</Badge>}
                  <Badge variant="outline" className="capitalize">
                    {path.difficulty}
                  </Badge>
                </div>
              </div>
              <p className="text-muted-foreground text-sm">
                {path.description}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Progress</span>
                  <span className="text-muted-foreground">
                    {path.progress}%
                  </span>
                </div>
                <Progress value={path.progress} className="h-1" />
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {path.estimatedDuration} weeks
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    {path.skills.length} skills
                  </span>
                </div>
                
                <Button variant="outline" className="w-full">
                  View Path
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {(!careerPaths || careerPaths.length === 0) && (
        <div className="text-center py-12">
          <Map className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No career paths yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first learning roadmap to start your journey
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Path
          </Button>
        </div>
      )}
    </div>
  );
}
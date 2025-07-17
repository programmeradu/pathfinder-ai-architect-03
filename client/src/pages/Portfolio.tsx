import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Plus, 
  ExternalLink, 
  Github, 
  Star,
  Award,
  Code,
  Globe,
  Calendar
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface PortfolioProject {
  id: number;
  title: string;
  description: string;
  githubUrl?: string;
  liveUrl?: string;
  technologies: string[];
  skillsProven: string[];
  aiEvaluation?: {
    score: number;
    strengths: string[];
    improvements: string[];
    skillsValidated: string[];
  };
  verificationStatus: string;
  featured: boolean;
  createdAt: string;
}

export default function Portfolio() {
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    githubUrl: "",
    liveUrl: "",
    technologies: [] as string[],
    skillsProven: [] as string[]
  });
  const queryClient = useQueryClient();

  const { data: projects, isLoading } = useQuery<PortfolioProject[]>({
    queryKey: ['/api/portfolio'],
  });

  const addProjectMutation = useMutation({
    mutationFn: async (projectData: typeof newProject) => {
      return await apiRequest('/api/portfolio', {
        method: 'POST',
        body: projectData
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/portfolio'] });
      setIsAddingProject(false);
      setNewProject({
        title: "",
        description: "",
        githubUrl: "",
        liveUrl: "",
        technologies: [],
        skillsProven: []
      });
    }
  });

  const handleAddProject = async () => {
    if (!newProject.title || !newProject.description) return;
    await addProjectMutation.mutateAsync(newProject);
  };

  const handleTechChange = (value: string) => {
    const techs = value.split(',').map(t => t.trim()).filter(t => t);
    setNewProject({ ...newProject, technologies: techs });
  };

  const handleSkillsChange = (value: string) => {
    const skills = value.split(',').map(s => s.trim()).filter(s => s);
    setNewProject({ ...newProject, skillsProven: skills });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Portfolio</h1>
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Portfolio</h1>
          <p className="text-muted-foreground">
            Showcase your projects and get AI-powered skill verification
          </p>
        </div>
        <Dialog open={isAddingProject} onOpenChange={setIsAddingProject}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  placeholder="My Awesome Project"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="Describe what your project does and what problems it solves..."
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="githubUrl">GitHub URL</Label>
                  <Input
                    id="githubUrl"
                    value={newProject.githubUrl}
                    onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                    placeholder="https://github.com/user/repo"
                  />
                </div>
                <div>
                  <Label htmlFor="liveUrl">Live URL</Label>
                  <Input
                    id="liveUrl"
                    value={newProject.liveUrl}
                    onChange={(e) => setNewProject({ ...newProject, liveUrl: e.target.value })}
                    placeholder="https://myproject.com"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="technologies">Technologies Used</Label>
                <Input
                  id="technologies"
                  onChange={(e) => handleTechChange(e.target.value)}
                  placeholder="React, Node.js, PostgreSQL (comma-separated)"
                />
              </div>
              
              <div>
                <Label htmlFor="skillsProven">Skills Demonstrated</Label>
                <Input
                  id="skillsProven"
                  onChange={(e) => handleSkillsChange(e.target.value)}
                  placeholder="Frontend Development, API Design, Database Management (comma-separated)"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddingProject(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddProject}
                  disabled={addProjectMutation.isPending}
                >
                  {addProjectMutation.isPending ? "Adding..." : "Add Project"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects?.map((project) => (
          <Card key={project.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {project.title}
                </CardTitle>
                <div className="flex items-center gap-1">
                  {project.featured && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                  <Badge variant={
                    project.verificationStatus === 'verified' ? 'default' :
                    project.verificationStatus === 'pending' ? 'secondary' : 'outline'
                  }>
                    {project.verificationStatus}
                  </Badge>
                </div>
              </div>
              <p className="text-muted-foreground text-sm line-clamp-2">
                {project.description}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Technologies */}
                <div>
                  <p className="text-sm font-medium mb-2">Technologies</p>
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.slice(0, 3).map((tech, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {project.technologies.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.technologies.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <p className="text-sm font-medium mb-2">Skills Demonstrated</p>
                  <div className="flex flex-wrap gap-1">
                    {project.skillsProven.slice(0, 2).map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {project.skillsProven.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{project.skillsProven.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* AI Evaluation */}
                {project.aiEvaluation && (
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">AI Evaluation</span>
                      <div className="flex items-center gap-1">
                        <Award className="h-3 w-3" />
                        <span className="text-sm">{project.aiEvaluation.score}/100</span>
                      </div>
                    </div>
                    {project.aiEvaluation.strengths.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        <strong>Strengths:</strong> {project.aiEvaluation.strengths.join(', ')}
                      </p>
                    )}
                  </div>
                )}

                {/* Links */}
                <div className="flex gap-2">
                  {project.githubUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="h-3 w-3 mr-1" />
                        Code
                      </a>
                    </Button>
                  )}
                  {project.liveUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-3 w-3 mr-1" />
                        Live
                      </a>
                    </Button>
                  )}
                </div>

                {/* Date */}
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {new Date(project.createdAt).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {(!projects || projects.length === 0) && (
        <div className="text-center py-12">
          <Code className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No projects yet</h3>
          <p className="text-muted-foreground mb-4">
            Add your first project to showcase your skills and get AI-powered verification
          </p>
          <Button onClick={() => setIsAddingProject(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Project
          </Button>
        </div>
      )}
    </div>
  );
}
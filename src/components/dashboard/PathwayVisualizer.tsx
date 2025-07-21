import { useState } from "react";
import { motion } from "framer-motion";
import { Map, ArrowRight, Clock, Star, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PathwayStep {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: number;
  completed: boolean;
}

interface Pathway {
  id: string;
  title: string;
  description: string;
  totalDuration: string;
  steps: PathwayStep[];
  successRate: number;
}

export const PathwayVisualizer = () => {
  const [pathways] = useState<Pathway[]>([
    {
      id: "1",
      title: "Senior Developer Track",
      description: "Progress to senior technical leadership roles",
      totalDuration: "2-3 years",
      successRate: 85,
      steps: [
        {
          id: "1",
          title: "Master Advanced Frameworks",
          description: "Deep dive into React, Node.js, and cloud technologies",
          duration: "6 months",
          difficulty: 7,
          completed: true
        },
        {
          id: "2",
          title: "Lead Technical Projects",
          description: "Take ownership of complex technical initiatives",
          duration: "12 months",
          difficulty: 8,
          completed: false
        },
        {
          id: "3",
          title: "Mentor Junior Developers",
          description: "Build leadership skills through mentoring",
          duration: "6 months",
          difficulty: 6,
          completed: false
        }
      ]
    },
    {
      id: "2",
      title: "Product Management Transition",
      description: "Transition from technical to product leadership",
      totalDuration: "18 months",
      successRate: 78,
      steps: [
        {
          id: "1",
          title: "Product Management Certification",
          description: "Complete PM certification program",
          duration: "3 months",
          difficulty: 5,
          completed: false
        },
        {
          id: "2",
          title: "Cross-functional Experience",
          description: "Work closely with design and business teams",
          duration: "9 months",
          difficulty: 7,
          completed: false
        },
        {
          id: "3",
          title: "Product Launch",
          description: "Lead a successful product launch",
          duration: "6 months",
          difficulty: 9,
          completed: false
        }
      ]
    }
  ]);

  return (
    <div className="space-y-6">
      {pathways.map((pathway, index) => (
        <motion.div
          key={pathway.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Map className="h-5 w-5 mr-2 text-primary" />
                  {pathway.title}
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{pathway.totalDuration}</Badge>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {pathway.successRate}% success rate
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">{pathway.description}</p>
              
              <div className="space-y-4">
                {pathway.steps.map((step, stepIndex) => (
                  <motion.div
                    key={step.id}
                    className={`flex items-start space-x-4 p-4 rounded-lg border ${
                      step.completed ? 'bg-green-50 border-green-200' : 'bg-muted/30'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: stepIndex * 0.1 }}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.completed 
                        ? 'bg-green-500 text-white' 
                        : 'bg-primary text-white'
                    }`}>
                      {step.completed ? (
                        <Star className="h-4 w-4" />
                      ) : (
                        <span className="text-sm font-medium">{stepIndex + 1}</span>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{step.title}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {step.duration}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <Target className="h-3 w-3 mr-1" />
                            Level {step.difficulty}/10
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                    
                    {stepIndex < pathway.steps.length - 1 && (
                      <ArrowRight className="h-4 w-4 text-muted-foreground mt-2" />
                    )}
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button variant="outline">
                  Start Pathway
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
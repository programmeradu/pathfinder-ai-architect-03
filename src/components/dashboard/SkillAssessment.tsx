import { useState } from "react";
import { motion } from "framer-motion";
import { Target, Brain, CheckCircle, AlertCircle, TrendingUp, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface Skill {
  name: string;
  level: number;
  category: string;
  inDemand: boolean;
  growth: number;
}

export const SkillAssessment = () => {
  const [skills] = useState<Skill[]>([
    { name: "JavaScript", level: 85, category: "Technical", inDemand: true, growth: 12 },
    { name: "React", level: 90, category: "Technical", inDemand: true, growth: 18 },
    { name: "Python", level: 75, category: "Technical", inDemand: true, growth: 25 },
    { name: "Leadership", level: 70, category: "Soft Skills", inDemand: true, growth: 8 },
    { name: "Communication", level: 88, category: "Soft Skills", inDemand: true, growth: 5 },
    { name: "Project Management", level: 65, category: "Management", inDemand: true, growth: 15 }
  ]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2 text-primary" />
            Skill Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{skill.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {skill.category}
                    </Badge>
                    {skill.inDemand && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        In Demand
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">+{skill.growth}%</span>
                    <span className="font-medium">{skill.level}%</span>
                  </div>
                </div>
                <Progress value={skill.level} className="h-2" />
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
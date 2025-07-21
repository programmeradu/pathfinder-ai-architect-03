import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Globe, Users, Briefcase, DollarSign, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MarketData {
  jobPostings: number;
  salaryTrend: number;
  demandIncrease: number;
  topSkills: string[];
  hotLocations: Array<{ city: string; growth: number }>;
  emergingRoles: Array<{ title: string; growth: number }>;
}

export const RealTimeData = () => {
  const [marketData, setMarketData] = useState<MarketData>({
    jobPostings: 45672,
    salaryTrend: 8.5,
    demandIncrease: 12.3,
    topSkills: ["Python", "React", "AWS", "Machine Learning", "Product Management"],
    hotLocations: [
      { city: "San Francisco", growth: 15.2 },
      { city: "Austin", growth: 22.1 },
      { city: "Seattle", growth: 18.7 },
      { city: "New York", growth: 11.4 }
    ],
    emergingRoles: [
      { title: "AI Product Manager", growth: 45.2 },
      { title: "Cloud Architect", growth: 38.7 },
      { title: "Data Scientist", growth: 32.1 },
      { title: "DevOps Engineer", growth: 28.9 }
    ]
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(prev => ({
        ...prev,
        jobPostings: prev.jobPostings + Math.floor(Math.random() * 10),
        salaryTrend: Math.max(0, prev.salaryTrend + (Math.random() - 0.5) * 0.5),
        demandIncrease: Math.max(0, prev.demandIncrease + (Math.random() - 0.5) * 0.3)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
          Real-Time Market Data
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div 
              className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Briefcase className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{marketData.jobPostings.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Active Job Postings</div>
            </motion.div>
            
            <motion.div 
              className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">+{marketData.salaryTrend.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Salary Growth</div>
            </motion.div>
            
            <motion.div 
              className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            >
              <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">+{marketData.demandIncrease.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Demand Increase</div>
            </motion.div>
          </div>

          {/* Top Skills */}
          <div>
            <h4 className="font-medium mb-3 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Trending Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {marketData.topSkills.map((skill, index) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    {skill}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Hot Locations */}
          <div>
            <h4 className="font-medium mb-3 flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Growing Markets
            </h4>
            <div className="space-y-2">
              {marketData.hotLocations.map((location, index) => (
                <div key={location.city} className="flex items-center justify-between">
                  <span className="text-sm">{location.city}</span>
                  <Badge variant="outline" className="text-green-600">
                    +{location.growth}%
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Emerging Roles */}
          <div>
            <h4 className="font-medium mb-3 flex items-center">
              <Globe className="h-4 w-4 mr-2" />
              Emerging Roles
            </h4>
            <div className="space-y-2">
              {marketData.emergingRoles.map((role, index) => (
                <div key={role.title} className="flex items-center justify-between">
                  <span className="text-sm">{role.title}</span>
                  <Badge variant="outline" className="text-blue-600">
                    +{role.growth}%
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
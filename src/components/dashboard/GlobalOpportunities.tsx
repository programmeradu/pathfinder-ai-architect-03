import { useState } from "react";
import { motion } from "framer-motion";
import { Globe, MapPin, TrendingUp, DollarSign, Users, Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface GlobalOpportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  country: string;
  salary: string;
  visaSupport: boolean;
  remote: boolean;
  match: number;
  growth: number;
}

export const GlobalOpportunities = () => {
  const [opportunities] = useState<GlobalOpportunity[]>([
    {
      id: "1",
      title: "Senior Software Engineer",
      company: "TechCorp Europe",
      location: "Berlin, Germany",
      country: "Germany",
      salary: "€85k - €120k",
      visaSupport: true,
      remote: true,
      match: 92,
      growth: 15
    },
    {
      id: "2",
      title: "Product Manager",
      company: "Innovation Labs",
      location: "Toronto, Canada",
      country: "Canada",
      salary: "CAD $110k - $140k",
      visaSupport: true,
      remote: false,
      match: 88,
      growth: 22
    },
    {
      id: "3",
      title: "Data Scientist",
      company: "AI Solutions",
      location: "Singapore",
      country: "Singapore",
      salary: "SGD $95k - $130k",
      visaSupport: true,
      remote: true,
      match: 85,
      growth: 28
    }
  ]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="h-5 w-5 mr-2 text-primary" />
            Global Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {opportunities.map((opp, index) => (
              <motion.div
                key={opp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{opp.title}</h3>
                    <p className="text-muted-foreground">{opp.company}</p>
                    
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-muted-foreground mr-1" />
                        <span className="text-sm">{opp.location}</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-muted-foreground mr-1" />
                        <span className="text-sm">{opp.salary}</span>
                      </div>
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-600">+{opp.growth}%</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-3">
                      {opp.visaSupport && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          Visa Support
                        </Badge>
                      )}
                      {opp.remote && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Remote OK
                        </Badge>
                      )}
                      <Badge variant="outline">
                        {opp.match}% match
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{opp.match}%</div>
                    <div className="text-sm text-muted-foreground">Match</div>
                    <Button size="sm" className="mt-2">
                      Apply Now
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
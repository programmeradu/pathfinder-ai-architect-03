/**
 * Career Simulator Page
 * Interactive career simulation tool
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Settings, BarChart3 } from 'lucide-react';

const CareerSimulator: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Career Simulator</h1>
          <p className="text-gray-600">Simulate different career decisions and see projected outcomes</p>
        </div>
        
        <Card className="border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            <CardTitle className="flex items-center">
              <Play className="w-6 h-6 mr-3" />
              Career Simulation Engine
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="text-center py-12">
              <BarChart3 className="w-24 h-24 mx-auto mb-6 text-gray-400" />
              <h3 className="text-xl font-semibold mb-4">Coming Soon</h3>
              <p className="text-gray-600 mb-6">
                Our advanced career simulation engine is currently in development. 
                This will allow you to model different career decisions and see their projected outcomes.
              </p>
              <div className="space-x-4">
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Configure Simulation
                </Button>
                <Button>
                  <Play className="w-4 h-4 mr-2" />
                  Run Simulation
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CareerSimulator;

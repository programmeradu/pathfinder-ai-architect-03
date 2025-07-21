/**
 * Global Opportunities Page
 * Discover worldwide career opportunities
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, Search, MapPin } from 'lucide-react';

const GlobalOpportunities: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Global Opportunities</h1>
          <p className="text-gray-600">Discover career opportunities around the world</p>
        </div>
        
        <Card className="border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-teal-600 text-white">
            <CardTitle className="flex items-center">
              <Globe className="w-6 h-6 mr-3" />
              Worldwide Career Explorer
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="text-center py-12">
              <MapPin className="w-24 h-24 mx-auto mb-6 text-gray-400" />
              <h3 className="text-xl font-semibold mb-4">Coming Soon</h3>
              <p className="text-gray-600 mb-6">
                Our global opportunities platform is being developed to help you discover 
                career opportunities worldwide, including visa requirements and relocation support.
              </p>
              <div className="space-x-4">
                <Button variant="outline">
                  <Search className="w-4 h-4 mr-2" />
                  Search Opportunities
                </Button>
                <Button>
                  <Globe className="w-4 h-4 mr-2" />
                  Explore Countries
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GlobalOpportunities;

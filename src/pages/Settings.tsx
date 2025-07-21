/**
 * Settings Page
 * Application settings and preferences
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings as SettingsIcon, Save, RefreshCw } from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Settings</h1>
          <p className="text-gray-600">Configure your application preferences</p>
        </div>
        
        <Card className="border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-slate-500 to-gray-600 text-white">
            <CardTitle className="flex items-center">
              <SettingsIcon className="w-6 h-6 mr-3" />
              Application Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="text-center py-12">
              <SettingsIcon className="w-24 h-24 mx-auto mb-6 text-gray-400" />
              <h3 className="text-xl font-semibold mb-4">Settings Coming Soon</h3>
              <p className="text-gray-600 mb-6">
                Comprehensive settings panel is being developed to give you full control 
                over your application experience and preferences.
              </p>
              <div className="space-x-4">
                <Button variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset to Defaults
                </Button>
                <Button>
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;

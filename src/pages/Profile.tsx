/**
 * Profile Page
 * User profile management
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Edit, Save } from 'lucide-react';

const Profile: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Profile</h1>
          <p className="text-gray-600">Manage your profile and preferences</p>
        </div>
        
        <Card className="border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-gray-500 to-blue-600 text-white">
            <CardTitle className="flex items-center">
              <User className="w-6 h-6 mr-3" />
              Profile Management
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="text-center py-12">
              <User className="w-24 h-24 mx-auto mb-6 text-gray-400" />
              <h3 className="text-xl font-semibold mb-4">Profile Coming Soon</h3>
              <p className="text-gray-600 mb-6">
                Comprehensive profile management features are being developed to help you 
                manage your career information and preferences.
              </p>
              <div className="space-x-4">
                <Button variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
                <Button>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;

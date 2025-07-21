/**
 * User Profile Manager Component
 * Comprehensive user profile system with career goals, skills, and preferences
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Briefcase, 
  Target, 
  Brain, 
  Settings,
  Plus,
  X,
  Edit,
  Save,
  MapPin,
  DollarSign,
  Calendar,
  Award,
  TrendingUp
} from 'lucide-react';
import { useGlobalStore } from '@/store/globalStore';
import { motion, AnimatePresence } from 'framer-motion';
import type { UserProfile, Skill, Education, Certification } from '@/types';

interface ProfileSection {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  completed: boolean;
  progress: number;
}

export const UserProfileManager: React.FC = () => {
  const user = useGlobalStore((state) => state.user);
  const updateUserProfile = useGlobalStore((state) => state.updateUserProfile);
  
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [newSkill, setNewSkill] = useState({ name: '', level: 'intermediate' as const });
  const [newGoal, setNewGoal] = useState('');

  const profileSections: ProfileSection[] = [
    {
      id: 'basic',
      title: 'Basic Information',
      icon: User,
      completed: !!(user?.name && user?.email && user?.location),
      progress: calculateBasicProgress(),
    },
    {
      id: 'career',
      title: 'Career Details',
      icon: Briefcase,
      completed: !!(user?.currentRole && user?.industry && user?.experience),
      progress: calculateCareerProgress(),
    },
    {
      id: 'goals',
      title: 'Career Goals',
      icon: Target,
      completed: !!(user?.careerGoals && user?.careerGoals.length > 0),
      progress: calculateGoalsProgress(),
    },
    {
      id: 'skills',
      title: 'Skills & Education',
      icon: Award,
      completed: !!(user?.skills && user?.skills.length > 0),
      progress: calculateSkillsProgress(),
    },
    {
      id: 'personality',
      title: 'Personality & Preferences',
      icon: Brain,
      completed: !!(user?.personality && user?.preferences),
      progress: calculatePersonalityProgress(),
    },
  ];

  function calculateBasicProgress(): number {
    if (!user) return 0;
    const fields = [user.name, user.email, user.location, user.avatar];
    const completed = fields.filter(Boolean).length;
    return (completed / fields.length) * 100;
  }

  function calculateCareerProgress(): number {
    if (!user) return 0;
    const fields = [user.currentRole, user.industry, user.experience, user.salaryRange];
    const completed = fields.filter(Boolean).length;
    return (completed / fields.length) * 100;
  }

  function calculateGoalsProgress(): number {
    if (!user?.careerGoals) return 0;
    return user.careerGoals.length > 0 ? 100 : 0;
  }

  function calculateSkillsProgress(): number {
    if (!user) return 0;
    const hasSkills = user.skills && user.skills.length > 0;
    const hasEducation = user.education && user.education.length > 0;
    const hasCertifications = user.certifications && user.certifications.length > 0;
    
    const completed = [hasSkills, hasEducation, hasCertifications].filter(Boolean).length;
    return (completed / 3) * 100;
  }

  function calculatePersonalityProgress(): number {
    if (!user) return 0;
    const hasPersonality = user.personality && Object.keys(user.personality).length > 0;
    const hasPreferences = user.preferences && Object.keys(user.preferences).length > 0;
    
    const completed = [hasPersonality, hasPreferences].filter(Boolean).length;
    return (completed / 2) * 100;
  }

  const overallProgress = profileSections.reduce((acc, section) => acc + section.progress, 0) / profileSections.length;

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const handleSave = () => {
    if (formData) {
      updateUserProfile(formData);
      setIsEditing(false);
    }
  };

  const addSkill = () => {
    if (newSkill.name.trim()) {
      const skill: Skill = {
        id: `skill-${Date.now()}`,
        name: newSkill.name,
        category: 'Technical', // Default category
        level: newSkill.level,
        verified: false,
      };

      setFormData(prev => ({
        ...prev,
        skills: [...(prev.skills || []), skill],
      }));

      setNewSkill({ name: '', level: 'intermediate' });
    }
  };

  const removeSkill = (skillId: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills?.filter(skill => skill.id !== skillId) || [],
    }));
  };

  const addGoal = () => {
    if (newGoal.trim()) {
      setFormData(prev => ({
        ...prev,
        careerGoals: [...(prev.careerGoals || []), newGoal],
      }));
      setNewGoal('');
    }
  };

  const removeGoal = (index: number) => {
    setFormData(prev => ({
      ...prev,
      careerGoals: prev.careerGoals?.filter((_, i) => i !== index) || [],
    }));
  };

  return (
    <div className="space-y-6">
      
      {/* Profile Overview */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <User className="w-6 h-6 mr-3" />
              Profile Completion
            </div>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              {isEditing ? <Save className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Overall Progress</span>
              <span className="font-mono text-lg">{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="bg-white/20" />
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
              {profileSections.map((section) => {
                const Icon = section.icon;
                return (
                  <div key={section.id} className="text-center">
                    <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${
                      section.completed ? 'bg-green-100 text-green-600' : 'bg-white/20 text-white'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="text-sm font-medium">{section.title}</div>
                    <div className="text-xs opacity-75">{Math.round(section.progress)}%</div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Details */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              {profileSections.map((section) => {
                const Icon = section.icon;
                return (
                  <TabsTrigger key={section.id} value={section.id} className="flex items-center">
                    <Icon className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">{section.title}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic" className="p-6">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      disabled={!isEditing}
                      className="mt-1"
                      placeholder="City, State/Country"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="workStyle">Work Style Preference</Label>
                    <select
                      id="workStyle"
                      value={formData.workStyle || 'flexible'}
                      onChange={(e) => setFormData(prev => ({ ...prev, workStyle: e.target.value as any }))}
                      disabled={!isEditing}
                      className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="remote">Remote</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="onsite">On-site</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Career Details Tab */}
            <TabsContent value="career" className="p-6">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Career Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="currentRole">Current Role</Label>
                    <Input
                      id="currentRole"
                      value={formData.currentRole || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, currentRole: e.target.value }))}
                      disabled={!isEditing}
                      className="mt-1"
                      placeholder="e.g., Senior Software Engineer"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      id="industry"
                      value={formData.industry || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                      disabled={!isEditing}
                      className="mt-1"
                      placeholder="e.g., Technology, Finance, Healthcare"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Input
                      id="experience"
                      type="number"
                      value={formData.experience || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, experience: parseInt(e.target.value) }))}
                      disabled={!isEditing}
                      className="mt-1"
                      min="0"
                      max="50"
                    />
                  </div>
                  
                  <div>
                    <Label>Salary Range (USD)</Label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={formData.salaryRange?.min || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          salaryRange: {
                            ...prev.salaryRange,
                            min: parseInt(e.target.value),
                            max: prev.salaryRange?.max || 0,
                            currency: 'USD',
                          }
                        }))}
                        disabled={!isEditing}
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        value={formData.salaryRange?.max || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          salaryRange: {
                            ...prev.salaryRange,
                            min: prev.salaryRange?.min || 0,
                            max: parseInt(e.target.value),
                            currency: 'USD',
                          }
                        }))}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Career Goals Tab */}
            <TabsContent value="goals" className="p-6">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Career Goals</h3>
                
                {isEditing && (
                  <div className="flex space-x-2">
                    <Input
                      value={newGoal}
                      onChange={(e) => setNewGoal(e.target.value)}
                      placeholder="Add a career goal..."
                      onKeyPress={(e) => e.key === 'Enter' && addGoal()}
                    />
                    <Button onClick={addGoal}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                )}
                
                <div className="space-y-3">
                  <AnimatePresence>
                    {formData.careerGoals?.map((goal, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center">
                          <Target className="w-4 h-4 mr-3 text-blue-600" />
                          <span>{goal}</span>
                        </div>
                        {isEditing && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeGoal(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </motion.div>
                    )) || (
                      <div className="text-center py-8 text-gray-500">
                        <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No career goals set yet</p>
                        {isEditing && <p className="text-sm">Add your first goal above</p>}
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </TabsContent>

            {/* Skills & Education Tab */}
            <TabsContent value="skills" className="p-6">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Skills & Education</h3>
                
                {/* Skills Section */}
                <div>
                  <h4 className="font-medium mb-3">Technical Skills</h4>
                  
                  {isEditing && (
                    <div className="flex space-x-2 mb-4">
                      <Input
                        value={newSkill.name}
                        onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Skill name..."
                        className="flex-1"
                      />
                      <select
                        value={newSkill.level}
                        onChange={(e) => setNewSkill(prev => ({ ...prev, level: e.target.value as any }))}
                        className="p-2 border border-gray-300 rounded-md"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="expert">Expert</option>
                      </select>
                      <Button onClick={addSkill}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-2">
                    <AnimatePresence>
                      {formData.skills?.map((skill) => (
                        <motion.div
                          key={skill.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                        >
                          <Badge 
                            variant="secondary" 
                            className="flex items-center space-x-2 py-1 px-3"
                          >
                            <span>{skill.name}</span>
                            <span className="text-xs opacity-75">({skill.level})</span>
                            {isEditing && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 ml-2"
                                onClick={() => removeSkill(skill.id)}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            )}
                          </Badge>
                        </motion.div>
                      )) || null}
                    </AnimatePresence>
                  </div>
                  
                  {(!formData.skills || formData.skills.length === 0) && (
                    <div className="text-center py-8 text-gray-500">
                      <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No skills added yet</p>
                      {isEditing && <p className="text-sm">Add your first skill above</p>}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Personality & Preferences Tab */}
            <TabsContent value="personality" className="p-6">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Personality & Preferences</h3>
                
                <div className="text-center py-8 text-gray-500">
                  <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Personality assessment coming soon</p>
                  <p className="text-sm">Complete our comprehensive personality assessment to get better career matches</p>
                  <Button className="mt-4" disabled>
                    Take Assessment
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Save Button */}
      {isEditing && (
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
};

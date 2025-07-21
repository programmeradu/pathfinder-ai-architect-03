/**
 * Onboarding Flow - Beautiful User Onboarding Experience
 * Multi-step onboarding with progress tracking and personalized setup
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  User, 
  Target, 
  MapPin,
  Briefcase,
  GraduationCap,
  Star,
  Zap,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EnhancedInput } from '@/components/ui/EnhancedInput';
import { EnhancedSelect } from '@/components/ui/EnhancedSelect';
import { EnhancedTextarea } from '@/components/ui/EnhancedTextarea';
import { useGlobalStore } from '@/store/globalStore';
import { cn } from '@/lib/utils';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  component: React.ComponentType<any>;
}

interface OnboardingFlowProps {
  className?: string;
  onComplete: () => void;
}

const steps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Pathfinder AI',
    description: 'Let\'s get you started on your career journey',
    icon: Sparkles,
    component: WelcomeStep,
  },
  {
    id: 'profile',
    title: 'Tell us about yourself',
    description: 'Basic information to personalize your experience',
    icon: User,
    component: ProfileStep,
  },
  {
    id: 'experience',
    title: 'Your experience',
    description: 'Current role and professional background',
    icon: Briefcase,
    component: ExperienceStep,
  },
  {
    id: 'skills',
    title: 'Your skills',
    description: 'What technologies and skills do you know?',
    icon: Star,
    component: SkillsStep,
  },
  {
    id: 'goals',
    title: 'Your goals',
    description: 'What do you want to achieve in your career?',
    icon: Target,
    component: GoalsStep,
  },
  {
    id: 'preferences',
    title: 'Job preferences',
    description: 'Location, salary, and work preferences',
    icon: MapPin,
    component: PreferencesStep,
  },
  {
    id: 'complete',
    title: 'You\'re all set!',
    description: 'Welcome to your personalized career journey',
    icon: Zap,
    component: CompleteStep,
  },
];

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  className,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const { setUser } = useGlobalStore();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    // Save user data and complete onboarding
    setUser({
      id: '1',
      name: formData.name,
      email: formData.email,
      title: formData.title,
      location: formData.location,
      bio: formData.bio,
      skills: formData.skills || [],
      goals: formData.goals || [],
      preferences: formData.preferences || {},
      onboardingCompleted: true,
    });
    
    onComplete();
  };

  const updateFormData = (data: Record<string, any>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const progress = ((currentStep + 1) / steps.length) * 100;
  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className={cn("min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50", className)}>
      <div className="container mx-auto px-4 py-8">
        {/* Progress Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Getting Started</h1>
              <p className="text-gray-600 mt-1">
                Step {currentStep + 1} of {steps.length}
              </p>
            </div>
            <Badge className="bg-indigo-100 text-indigo-800">
              {Math.round(progress)}% Complete
            </Badge>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
            <motion.div
              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Step Indicators */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={cn(
                  "flex flex-col items-center space-y-2",
                  index <= currentStep ? "text-indigo-600" : "text-gray-400"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                    index < currentStep
                      ? "bg-indigo-600 text-white"
                      : index === currentStep
                      ? "bg-indigo-100 text-indigo-600 border-2 border-indigo-600"
                      : "bg-gray-200 text-gray-400"
                  )}
                >
                  {index < currentStep ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <span className="text-xs font-medium hidden sm:block">
                  {step.title.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <steps[currentStep].icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {steps[currentStep].title}
                  </CardTitle>
                  <p className="text-gray-600 mt-2">
                    {steps[currentStep].description}
                  </p>
                </CardHeader>

                <CardContent>
                  <CurrentStepComponent
                    formData={formData}
                    updateFormData={updateFormData}
                    onNext={handleNext}
                    onPrevious={handlePrevious}
                    isFirst={currentStep === 0}
                    isLast={currentStep === steps.length - 1}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// Individual step components
function WelcomeStep({ onNext }: any) {
  return (
    <div className="text-center space-y-6">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">
          Your AI-powered career companion
        </h3>
        <p className="text-gray-600">
          Pathfinder AI helps you discover opportunities, develop skills, and advance your career 
          with personalized insights and recommendations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
        {[
          { icon: Target, title: 'Personalized Guidance', desc: 'AI-powered career recommendations' },
          { icon: Star, title: 'Skill Development', desc: 'Learn what matters for your goals' },
          { icon: Zap, title: 'Real-time Insights', desc: 'Stay ahead of market trends' },
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="p-4 rounded-lg bg-gray-50 text-center"
          >
            <feature.icon className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
            <p className="text-sm text-gray-600">{feature.desc}</p>
          </motion.div>
        ))}
      </div>

      <Button onClick={onNext} size="lg" className="w-full">
        Get Started
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
    </div>
  );
}

function ProfileStep({ formData, updateFormData, onNext, onPrevious }: any) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <EnhancedInput
          label="Full Name"
          placeholder="Enter your full name"
          value={formData.name || ''}
          onChange={(e) => updateFormData({ name: e.target.value })}
        />
        <EnhancedInput
          label="Email"
          type="email"
          placeholder="your@email.com"
          value={formData.email || ''}
          onChange={(e) => updateFormData({ email: e.target.value })}
        />
      </div>

      <EnhancedInput
        label="Current Title"
        placeholder="e.g., Software Engineer, Product Manager"
        value={formData.title || ''}
        onChange={(e) => updateFormData({ title: e.target.value })}
      />

      <EnhancedInput
        label="Location"
        placeholder="City, Country"
        value={formData.location || ''}
        onChange={(e) => updateFormData({ location: e.target.value })}
      />

      <EnhancedTextarea
        label="Bio (Optional)"
        placeholder="Tell us a bit about yourself..."
        value={formData.bio || ''}
        onChange={(e) => updateFormData({ bio: e.target.value })}
        maxLength={300}
        showCharCount
      />

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button onClick={onNext} disabled={!formData.name || !formData.email}>
          Next
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

function ExperienceStep({ formData, updateFormData, onNext, onPrevious }: any) {
  const experienceLevels = [
    { value: 'entry', label: 'Entry Level', description: '0-2 years' },
    { value: 'mid', label: 'Mid Level', description: '3-5 years' },
    { value: 'senior', label: 'Senior Level', description: '6-10 years' },
    { value: 'lead', label: 'Lead/Principal', description: '10+ years' },
  ];

  return (
    <div className="space-y-6">
      <EnhancedSelect
        label="Experience Level"
        options={experienceLevels}
        value={formData.experienceLevel || ''}
        onChange={(value) => updateFormData({ experienceLevel: value })}
        placeholder="Select your experience level"
      />

      <EnhancedInput
        label="Current Company (Optional)"
        placeholder="Company name"
        value={formData.company || ''}
        onChange={(e) => updateFormData({ company: e.target.value })}
      />

      <EnhancedTextarea
        label="Brief description of your current role"
        placeholder="What do you do in your current position?"
        value={formData.roleDescription || ''}
        onChange={(e) => updateFormData({ roleDescription: e.target.value })}
        maxLength={500}
        showCharCount
      />

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button onClick={onNext} disabled={!formData.experienceLevel}>
          Next
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

function SkillsStep({ formData, updateFormData, onNext, onPrevious }: any) {
  const [selectedSkills, setSelectedSkills] = useState<string[]>(formData.skills || []);

  const skillCategories = {
    'Programming Languages': ['JavaScript', 'Python', 'Java', 'TypeScript', 'C++', 'Go', 'Rust'],
    'Frontend': ['React', 'Vue.js', 'Angular', 'HTML/CSS', 'Tailwind CSS'],
    'Backend': ['Node.js', 'Express', 'Django', 'Spring Boot', 'FastAPI'],
    'Databases': ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Elasticsearch'],
    'Cloud & DevOps': ['AWS', 'Azure', 'Docker', 'Kubernetes', 'CI/CD'],
    'Other': ['Git', 'Agile', 'Project Management', 'Data Analysis'],
  };

  const toggleSkill = (skill: string) => {
    const updated = selectedSkills.includes(skill)
      ? selectedSkills.filter(s => s !== skill)
      : [...selectedSkills, skill];
    
    setSelectedSkills(updated);
    updateFormData({ skills: updated });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <p className="text-gray-600">
          Select the skills you have experience with. You can always add more later.
        </p>
      </div>

      <div className="space-y-6">
        {Object.entries(skillCategories).map(([category, skills]) => (
          <div key={category}>
            <h4 className="font-semibold text-gray-900 mb-3">{category}</h4>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    selectedSkills.includes(skill)
                      ? "bg-indigo-100 text-indigo-700 border-2 border-indigo-300"
                      : "bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200"
                  )}
                >
                  {skill}
                  {selectedSkills.includes(skill) && (
                    <Check className="w-4 h-4 ml-1 inline" />
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button onClick={onNext} disabled={selectedSkills.length === 0}>
          Next
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

function GoalsStep({ formData, updateFormData, onNext, onPrevious }: any) {
  const [selectedGoals, setSelectedGoals] = useState<string[]>(formData.goals || []);

  const careerGoals = [
    'Get promoted to senior role',
    'Switch to a new technology stack',
    'Transition to management',
    'Start my own company',
    'Work at a FAANG company',
    'Increase my salary by 20%+',
    'Work remotely',
    'Learn machine learning/AI',
    'Become a technical lead',
    'Improve work-life balance',
  ];

  const toggleGoal = (goal: string) => {
    const updated = selectedGoals.includes(goal)
      ? selectedGoals.filter(g => g !== goal)
      : [...selectedGoals, goal];
    
    setSelectedGoals(updated);
    updateFormData({ goals: updated });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <p className="text-gray-600">
          What are your main career goals? Select all that apply.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {careerGoals.map((goal) => (
          <button
            key={goal}
            onClick={() => toggleGoal(goal)}
            className={cn(
              "p-4 rounded-lg text-left transition-all duration-200 border-2",
              selectedGoals.includes(goal)
                ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                : "bg-white border-gray-200 hover:border-gray-300 text-gray-700"
            )}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{goal}</span>
              {selectedGoals.includes(goal) && (
                <Check className="w-5 h-5 text-indigo-600" />
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button onClick={onNext} disabled={selectedGoals.length === 0}>
          Next
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

function PreferencesStep({ formData, updateFormData, onNext, onPrevious }: any) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <EnhancedSelect
          label="Work Type"
          options={[
            { value: 'remote', label: 'Remote', description: 'Work from anywhere' },
            { value: 'hybrid', label: 'Hybrid', description: 'Mix of remote and office' },
            { value: 'onsite', label: 'On-site', description: 'Office-based work' },
          ]}
          value={formData.workType || ''}
          onChange={(value) => updateFormData({ workType: value })}
        />

        <EnhancedSelect
          label="Job Type"
          options={[
            { value: 'fulltime', label: 'Full-time', description: 'Permanent position' },
            { value: 'contract', label: 'Contract', description: 'Fixed-term contract' },
            { value: 'freelance', label: 'Freelance', description: 'Project-based work' },
          ]}
          value={formData.jobType || ''}
          onChange={(value) => updateFormData({ jobType: value })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <EnhancedInput
          label="Minimum Salary (Optional)"
          type="number"
          placeholder="e.g., 80000"
          value={formData.minSalary || ''}
          onChange={(e) => updateFormData({ minSalary: e.target.value })}
        />

        <EnhancedInput
          label="Preferred Location"
          placeholder="e.g., San Francisco, Remote"
          value={formData.preferredLocation || ''}
          onChange={(e) => updateFormData({ preferredLocation: e.target.value })}
        />
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button onClick={onNext}>
          Next
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

function CompleteStep({ onNext }: any) {
  return (
    <div className="text-center space-y-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto"
      >
        <Check className="w-10 h-10 text-green-600" />
      </motion.div>

      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome to Pathfinder AI!
        </h3>
        <p className="text-gray-600">
          Your profile is complete. We're now analyzing your information to provide 
          personalized career recommendations.
        </p>
      </div>

      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-3">What's next?</h4>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <ChevronRight className="w-4 h-4 text-indigo-600" />
            <span>AI analysis of your profile and market opportunities</span>
          </div>
          <div className="flex items-center space-x-2">
            <ChevronRight className="w-4 h-4 text-indigo-600" />
            <span>Personalized job recommendations</span>
          </div>
          <div className="flex items-center space-x-2">
            <ChevronRight className="w-4 h-4 text-indigo-600" />
            <span>Skill development suggestions</span>
          </div>
          <div className="flex items-center space-x-2">
            <ChevronRight className="w-4 h-4 text-indigo-600" />
            <span>Real-time market insights</span>
          </div>
        </div>
      </div>

      <Button onClick={onNext} size="lg" className="w-full">
        Enter Pathfinder AI
        <Sparkles className="w-5 h-5 ml-2" />
      </Button>
    </div>
  );
}

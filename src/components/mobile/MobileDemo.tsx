import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { SignupModal } from '../SignupModal';
import { 
  Search,
  MapPin,
  Clock,
  Star,
  ArrowRight,
  Globe,
  GraduationCap,
  Briefcase,
  Award,
  Users,
  Laptop,
  Sparkles,
  Target,
  TrendingUp
} from 'lucide-react';

interface Opportunity {
  title: string;
  company: string;
  location: string;
  time: string;
  pay: string;
  description: string;
  tags: string[];
  progress: number;
  qualifications: string[];
  responsibilities: string[];
  perks: string[];
  insights: string[];
  matches: number;
}

export const MobileDemo = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Opportunity[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [demoUsageCount, setDemoUsageCount] = useState(0);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const handleSearch = () => {
    setIsSearching(true);
    setSearchProgress(0);
    setShowResults(false);
    setSearchResults([]);

    const interval = setInterval(() => {
      setSearchProgress((prevProgress) => {
        const newProgress = prevProgress + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsSearching(false);
            setShowResults(true);
            setDemoUsageCount(demoUsageCount + 1);

            if (demoUsageCount >= 2) {
              setShowSignupPrompt(true);
            }
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 200);

    // Mock search results
    setTimeout(() => {
      clearInterval(interval);
      setIsSearching(false);
      setShowResults(true);
      setSearchResults([
        {
          title: 'Software Engineer',
          company: 'Google',
          location: 'Mountain View, CA',
          time: 'Full-time',
          pay: '$160,000 - $200,000',
          description: 'Join our team to build innovative software solutions.',
          tags: ['Engineering', 'Full-time', 'Mid-Level'],
          progress: 75,
          qualifications: ['Bachelor\'s degree', '5+ years experience'],
          responsibilities: ['Develop software', 'Write tests', 'Collaborate with team'],
          perks: ['Free food', 'Gym membership', 'Unlimited vacation'],
          insights: ['Great culture', 'Innovative projects', 'Room for growth'],
          matches: 95,
        },
        {
          title: 'Data Scientist',
          company: 'Facebook',
          location: 'Menlo Park, CA',
          time: 'Full-time',
          pay: '$150,000 - $190,000',
          description: 'Help us make data-driven decisions.',
          tags: ['Data Science', 'Full-time', 'Senior-Level'],
          progress: 88,
          qualifications: ['Master\'s degree', '3+ years experience'],
          responsibilities: ['Analyze data', 'Build models', 'Present findings'],
          perks: ['Free food', 'Gym membership', 'Unlimited vacation'],
          insights: ['Great culture', 'Innovative projects', 'Room for growth'],
          matches: 89,
        },
      ]);
      setDemoUsageCount(demoUsageCount + 1);
      if (demoUsageCount >= 2) {
        setShowSignupPrompt(true);
      }
    }, 2000);
  };

  return (
    <Card className="w-full max-w-md mx-auto p-4 rounded-lg shadow-md bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          <Search className="mr-2 h-5 w-5 inline-block" />
          Opportunity Search
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-2">
            <Input
              type="search"
              placeholder="Enter your desired job or career path..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button onClick={handleSearch} disabled={isSearching} className="bg-blue-500 text-white font-bold">
              {isSearching ? 'Searching...' : 'Find Opportunities'}
            </Button>
          </div>

          {isSearching && (
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Searching for opportunities...</p>
              <Progress value={searchProgress} />
            </div>
          )}

          {showResults && searchResults.length === 0 && (
            <div className="text-center">
              <p className="text-sm text-gray-500">No opportunities found. Try a different search.</p>
            </div>
          )}

          {showResults && searchResults.length > 0 && (
            <div className="space-y-4">
              {searchResults.map((opportunity, index) => (
                <Card key={index} className="bg-gray-100">
                  <CardHeader>
                    <CardTitle className="text-black">{opportunity.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-gray-700">
                    <div className="mb-2">
                      <Briefcase className="mr-2 h-4 w-4 inline-block" />
                      {opportunity.company}
                    </div>
                    <div className="mb-2">
                      <MapPin className="mr-2 h-4 w-4 inline-block" />
                      {opportunity.location}
                    </div>
                    <div className="mb-2">
                      <Clock className="mr-2 h-4 w-4 inline-block" />
                      {opportunity.time}
                    </div>
                    <div className="mb-2">
                      <Badge className="mr-2">{opportunity.tags.join(', ')}</Badge>
                    </div>
                    <div className="mb-2">
                      <TrendingUp className="mr-2 h-4 w-4 inline-block" />
                      Match: {opportunity.matches}%
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {showSignupPrompt && (
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-4">
                Enjoying the demo? Sign up for full access to personalized career paths, advanced search filters,
                and more!
              </p>
              <Button 
              onClick={() => setShowSignupModal(true)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Get Full Access
            </Button>
            </div>
          )}
        </div>
      </CardContent>

      <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        source="demo"
      />
    </Card>
  );
};
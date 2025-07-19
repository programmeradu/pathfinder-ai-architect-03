import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, FileText, CheckCircle, AlertCircle, X, Brain,
  User, Award, Calendar, Briefcase, TrendingUp, Zap,
  Loader2, FileCheck, Sparkles, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface AnalyzedProfile {
  technicalSkills: string[];
  softSkills: string[];
  yearsExperience: number;
  jobTitles: string[];
  education: string[];
  industries: string[];
  careerLevel: string;
  strengthAreas: string[];
}

interface ResumeUploadProps {
  onProfileAnalyzed: (profile: AnalyzedProfile) => void;
  onAnalysisStart: () => void;
  isProcessing?: boolean;
}

export function ResumeUpload({ onProfileAnalyzed, onAnalysisStart, isProcessing = false }: ResumeUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [uploadMethod, setUploadMethod] = useState<'file' | 'linkedin'>('file');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [analysisStage, setAnalysisStage] = useState('');
  const [analyzedProfile, setAnalyzedProfile] = useState<AnalyzedProfile | null>(null);
  const [error, setError] = useState('');

  const analyzeResume = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    setError('');
    onAnalysisStart();

    try {
      // Simulate file upload progress
      const uploadInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(uploadInterval);
            return 100;
          }
          return prev + 20;
        });
      }, 300);

      // Wait for upload to complete
      await new Promise(resolve => setTimeout(resolve, 1500));

      // AI Analysis stages
      const stages = [
        'Extracting text content...',
        'Identifying skills and experience...',
        'Analyzing career progression...',
        'Mapping to industry standards...',
        'Generating career profile...'
      ];

      for (let i = 0; i < stages.length; i++) {
        setAnalysisStage(stages[i]);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Simulate AI analysis result based on filename/content
      const mockProfile: AnalyzedProfile = {
        technicalSkills: file.name.toLowerCase().includes('senior') 
          ? ['Python', 'React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker', 'TypeScript']
          : ['JavaScript', 'HTML/CSS', 'React', 'Git', 'SQL'],
        softSkills: ['Problem Solving', 'Team Collaboration', 'Communication', 'Project Management'],
        yearsExperience: file.name.toLowerCase().includes('senior') ? 5 : 2,
        jobTitles: file.name.toLowerCase().includes('senior') 
          ? ['Senior Software Developer', 'Software Developer', 'Junior Developer']
          : ['Software Developer', 'Intern'],
        education: ['Computer Science Degree', 'Various Certifications'],
        industries: ['Technology', 'Software Development'],
        careerLevel: file.name.toLowerCase().includes('senior') ? 'Senior' : 'Mid-level',
        strengthAreas: ['Full-Stack Development', 'Problem Solving', 'Technical Leadership']
      };

      setAnalyzedProfile(mockProfile);
      setIsUploading(false);
      onProfileAnalyzed(mockProfile);

    } catch (error) {
      console.error('Resume analysis error:', error);
      setError('Failed to analyze resume. Please try again.');
      setIsUploading(false);
    }
  };

  const analyzeLinkedIn = async (url: string) => {
    setIsUploading(true);
    setError('');
    onAnalysisStart();

    try {
      setAnalysisStage('Analyzing LinkedIn profile...');
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock LinkedIn analysis
      const mockProfile: AnalyzedProfile = {
        technicalSkills: ['Business Strategy', 'Project Management', 'Data Analysis', 'Leadership'],
        softSkills: ['Strategic Thinking', 'Team Leadership', 'Communication', 'Negotiation'],
        yearsExperience: 7,
        jobTitles: ['Business Manager', 'Project Coordinator', 'Business Analyst'],
        education: ['MBA', 'Business Administration'],
        industries: ['Consulting', 'Business Services'],
        careerLevel: 'Senior',
        strengthAreas: ['Strategic Planning', 'Team Management', 'Business Development']
      };

      setAnalyzedProfile(mockProfile);
      setIsUploading(false);
      onProfileAnalyzed(mockProfile);

    } catch (error) {
      console.error('LinkedIn analysis error:', error);
      setError('Failed to analyze LinkedIn profile. Please try again.');
      setIsUploading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      analyzeResume(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  return (
    <div className="space-y-6">
      {/* Upload Method Selector */}
      <div className="flex items-center justify-center space-x-4">
        <Button
          variant={uploadMethod === 'file' ? 'default' : 'outline'}
          onClick={() => setUploadMethod('file')}
          className="px-6"
        >
          <FileText className="h-4 w-4 mr-2" />
          Upload Resume
        </Button>
        <Button
          variant={uploadMethod === 'linkedin' ? 'default' : 'outline'}
          onClick={() => setUploadMethod('linkedin')}
          className="px-6"
        >
          <User className="h-4 w-4 mr-2" />
          LinkedIn Profile
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {uploadMethod === 'file' && (
          <motion.div
            key="file-upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* File Upload Area */}
            <motion.div
              {...getRootProps()}
              className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
                isDragActive 
                  ? 'border-primary bg-primary/5 scale-105' 
                  : 'border-border/50 hover:border-primary/50 hover:bg-primary/5'
              } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
              whileHover={{ scale: isUploading ? 1 : 1.02 }}
              whileTap={{ scale: isUploading ? 1 : 0.98 }}
            >
              <input {...getInputProps()} />
              
              <motion.div
                className="space-y-4"
                animate={{ y: isDragActive ? -5 : 0 }}
              >
                {isUploading ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Brain className="h-8 w-8 text-primary" />
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto"
                    animate={{ 
                      rotate: isDragActive ? [0, 5, -5, 0] : 0,
                      scale: isDragActive ? 1.1 : 1
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <Upload className="h-8 w-8 text-white" />
                  </motion.div>
                )}

                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    {isUploading ? 'Analyzing Your Career Profile' : 
                     isDragActive ? 'Drop your resume here' : 'Upload Your Resume'}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {isUploading ? 'Our AI is understanding your unique background...' :
                     'PDF, DOC, DOCX, or TXT files up to 10MB'}
                  </p>
                </div>

                {uploadedFile && !isUploading && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center justify-center space-x-2 text-sm text-primary"
                  >
                    <FileCheck className="h-4 w-4" />
                    <span>{uploadedFile.name}</span>
                  </motion.div>
                )}
              </motion.div>

              {/* Upload Progress */}
              {isUploading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 space-y-3"
                >
                  <Progress value={uploadProgress} className="h-2" />
                  <div className="text-sm text-muted-foreground">
                    {analysisStage || 'Processing...'}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}

        {uploadMethod === 'linkedin' && (
          <motion.div
            key="linkedin-input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* LinkedIn URL Input */}
            <div className="space-y-4">
              <div className="text-center">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <User className="h-8 w-8 text-white" />
                </motion.div>
                <h3 className="font-semibold text-lg mb-2">Analyze LinkedIn Profile</h3>
                <p className="text-muted-foreground text-sm">
                  Paste your LinkedIn profile URL for instant analysis
                </p>
              </div>

              <div className="flex space-x-2">
                <Input
                  placeholder="https://linkedin.com/in/yourprofile"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className="flex-1"
                  disabled={isUploading}
                />
                <Button
                  onClick={() => analyzeLinkedIn(linkedinUrl)}
                  disabled={!linkedinUrl || isUploading}
                  className="px-6"
                >
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {isUploading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center space-y-3"
                >
                  <div className="text-sm text-muted-foreground">
                    {analysisStage}
                  </div>
                  <Progress value={75} className="h-2" />
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 text-red-500 bg-red-50 dark:bg-red-950/20 p-3 rounded-lg"
        >
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setError('')}
            className="ml-auto"
          >
            <X className="h-3 w-3" />
          </Button>
        </motion.div>
      )}

      {/* Analysis Results */}
      {analyzedProfile && !isUploading && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 rounded-2xl p-6 border border-primary/20"
        >
          <div className="flex items-center space-x-3 mb-6">
            <motion.div
              className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <CheckCircle className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <h3 className="font-poppins font-bold text-lg text-foreground">
                Career Profile Analyzed
              </h3>
              <p className="text-muted-foreground text-sm">
                AI has mapped your unique background and strengths
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Skills Analysis */}
            <Card className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Award className="h-4 w-4 text-primary" />
                  <h4 className="font-semibold text-sm">Core Skills</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analyzedProfile.technicalSkills.slice(0, 6).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {analyzedProfile.technicalSkills.length > 6 && (
                    <Badge variant="outline" className="text-xs">
                      +{analyzedProfile.technicalSkills.length - 6} more
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Experience Level */}
            <Card className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Calendar className="h-4 w-4 text-secondary" />
                  <h4 className="font-semibold text-sm">Experience</h4>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-secondary">
                    {analyzedProfile.yearsExperience} years
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {analyzedProfile.careerLevel} level professional
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Career Progression */}
            <Card className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-accent" />
                  <h4 className="font-semibold text-sm">Career Path</h4>
                </div>
                <div className="space-y-1">
                  {analyzedProfile.jobTitles.slice(0, 3).map((title, index) => (
                    <div key={index} className="text-sm text-muted-foreground">
                      {title}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Strength Areas */}
            <Card className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h4 className="font-semibold text-sm">Strengths</h4>
                </div>
                <div className="space-y-1">
                  {analyzedProfile.strengthAreas.map((strength, index) => (
                    <div key={index} className="text-sm text-muted-foreground">
                      • {strength}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-center"
          >
            <div className="inline-flex items-center bg-gradient-to-r from-primary/10 to-accent/10 rounded-full px-4 py-2 border border-primary/20">
              <Zap className="h-4 w-4 mr-2 text-primary" />
              <span className="text-sm font-medium">
                Ready to generate your personalized career path
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
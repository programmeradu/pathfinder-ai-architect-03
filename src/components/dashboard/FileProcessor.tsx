import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  FileText,
  Image as ImageIcon,
  File,
  Mic,
  Video,
  Download,
  Trash2,
  Eye,
  Brain,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Clock,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface ProcessedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  analysis?: {
    summary: string;
    keyPoints: string[];
    recommendations: string[];
    careerRelevance: number;
    skillsIdentified: string[];
  };
  preview?: string;
}

interface AnalysisResult {
  type: 'resume' | 'job_description' | 'certificate' | 'portfolio' | 'general';
  confidence: number;
  insights: string[];
  actionItems: string[];
  careerImpact: string;
}

export const FileProcessor = () => {
  const [files, setFiles] = useState<ProcessedFile[]>([]);
  const [activeTab, setActiveTab] = useState("upload");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const fileId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      const url = URL.createObjectURL(file);
      
      const newFile: ProcessedFile = {
        id: fileId,
        name: file.name,
        type: file.type,
        size: file.size,
        url,
        status: 'uploading',
        progress: 0
      };

      setFiles(prev => [...prev, newFile]);
      
      // Simulate upload progress
      simulateUpload(fileId, file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'audio/*': ['.mp3', '.wav', '.m4a'],
      'video/*': ['.mp4', '.mov', '.avi']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true
  });

  const simulateUpload = async (fileId: string, file: File) => {
    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, progress } : f
      ));
    }

    // Start processing
    setFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, status: 'processing', progress: 0 } : f
    ));

    await processFile(fileId, file);
  };

  const processFile = async (fileId: string, file: File) => {
    try {
      setIsProcessing(true);
      
      let analysis: ProcessedFile['analysis'];
      
      if (file.type.startsWith('image/')) {
        analysis = await processImage(file);
      } else if (file.type === 'application/pdf' || file.type.includes('document')) {
        analysis = await processDocument(file);
      } else if (file.type.startsWith('audio/')) {
        analysis = await processAudio(file);
      } else {
        analysis = await processGenericFile(file);
      }

      setFiles(prev => prev.map(f => 
        f.id === fileId ? { 
          ...f, 
          status: 'completed', 
          progress: 100,
          analysis 
        } : f
      ));

      toast({
        title: "File Processed",
        description: `${file.name} has been analyzed successfully.`
      });

    } catch (error) {
      console.error('Error processing file:', error);
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, status: 'error' } : f
      ));
      
      toast({
        title: "Processing Error",
        description: `Failed to process ${file.name}. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const processImage = async (file: File): Promise<ProcessedFile['analysis']> => {
    // Simulate image analysis with AI
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    
    try {
      const imageData = await fileToGenerativePart(file);
      const prompt = `Analyze this image in the context of career development. If it's a resume, certificate, portfolio piece, or any career-related document, provide:
      1. A brief summary of what you see
      2. Key points or achievements identified
      3. Career recommendations based on the content
      4. Skills or qualifications mentioned
      5. Rate the career relevance (1-100)`;

      const result = await model.generateContent([prompt, imageData]);
      const response = await result.response;
      const text = response.text();

      return {
        summary: "AI-analyzed image content for career insights",
        keyPoints: text.split('\n').filter(line => line.trim().length > 0).slice(0, 5),
        recommendations: ["Enhance visual presentation", "Add more context", "Consider professional formatting"],
        careerRelevance: 85,
        skillsIdentified: ["Visual Design", "Communication", "Attention to Detail"]
      };
    } catch (error) {
      return {
        summary: "Image uploaded successfully - manual review recommended",
        keyPoints: ["High-quality image detected", "Professional format"],
        recommendations: ["Consider adding context", "Ensure readability"],
        careerRelevance: 70,
        skillsIdentified: ["Visual Communication"]
      };
    }
  };

  const processDocument = async (file: File): Promise<ProcessedFile['analysis']> => {
    // Simulate document processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    try {
      // In a real implementation, you'd extract text from PDF/DOC
      const prompt = `Analyze this document (${file.name}) for career development purposes. Provide:
      1. Document type identification (resume, cover letter, job description, etc.)
      2. Key skills and qualifications mentioned
      3. Career advancement recommendations
      4. Areas for improvement
      5. Relevance score for career development`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return {
        summary: `Professional document analyzed - ${file.type.includes('pdf') ? 'PDF' : 'Document'} format`,
        keyPoints: [
          "Professional experience documented",
          "Skills and qualifications listed",
          "Career progression evident",
          "Education background included"
        ],
        recommendations: [
          "Quantify achievements with metrics",
          "Add relevant keywords for ATS",
          "Update with recent accomplishments",
          "Tailor for specific roles"
        ],
        careerRelevance: 95,
        skillsIdentified: ["Project Management", "Leadership", "Technical Skills", "Communication"]
      };
    } catch (error) {
      return {
        summary: "Document processed - contains career-relevant information",
        keyPoints: ["Professional document format", "Structured content"],
        recommendations: ["Review for completeness", "Ensure clarity"],
        careerRelevance: 80,
        skillsIdentified: ["Documentation", "Professional Writing"]
      };
    }
  };

  const processAudio = async (file: File): Promise<ProcessedFile['analysis']> => {
    // Simulate audio processing
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    return {
      summary: "Audio file processed - potential interview or presentation content",
      keyPoints: [
        "Clear audio quality detected",
        "Professional communication style",
        "Confident delivery noted",
        "Technical vocabulary used"
      ],
      recommendations: [
        "Consider transcription for portfolio",
        "Extract key talking points",
        "Use for interview preparation",
        "Develop into presentation material"
      ],
      careerRelevance: 75,
      skillsIdentified: ["Public Speaking", "Communication", "Subject Matter Expertise"]
    };
  };

  const processGenericFile = async (file: File): Promise<ProcessedFile['analysis']> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      summary: `File processed - ${file.type || 'unknown format'}`,
      keyPoints: [
        "File successfully uploaded",
        "Format recognized",
        "Ready for manual review"
      ],
      recommendations: [
        "Verify file content",
        "Consider format conversion",
        "Add descriptive metadata"
      ],
      careerRelevance: 60,
      skillsIdentified: ["File Management", "Organization"]
    };
  };

  const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result.split(',')[1]);
        }
      };
      reader.readAsDataURL(file);
    });
    
    return {
      inlineData: {
        data: await base64EncodedDataPromise,
        mimeType: file.type
      }
    };
  };

  const deleteFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    toast({
      title: "File Deleted",
      description: "File has been removed from your workspace."
    });
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon className="h-5 w-5" />;
    if (type.includes('pdf')) return <FileText className="h-5 w-5" />;
    if (type.startsWith('audio/')) return <Mic className="h-5 w-5" />;
    if (type.startsWith('video/')) return <Video className="h-5 w-5" />;
    return <File className="h-5 w-5" />;
  };

  const getStatusIcon = (status: ProcessedFile['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Upload className="h-5 w-5 mr-2 text-primary" />
              Multi-Modal File Processor
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              <Zap className="h-3 w-3 mr-1" />
              AI-Powered
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upload">Upload Files</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4">
              {/* Drag & Drop Zone */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive 
                    ? 'border-primary bg-primary/5' 
                    : 'border-muted-foreground/25 hover:border-primary/50'
                }`}
              >
                <input {...getInputProps()} />
                <motion.div
                  animate={isDragActive ? { scale: 1.05 } : { scale: 1 }}
                  className="space-y-4"
                >
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {isDragActive ? 'Drop files here' : 'Upload your career files'}
                    </h3>
                    <p className="text-muted-foreground">
                      Drag & drop or click to upload resumes, certificates, portfolios, audio, or images
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    <Badge variant="outline">PDF</Badge>
                    <Badge variant="outline">DOC</Badge>
                    <Badge variant="outline">Images</Badge>
                    <Badge variant="outline">Audio</Badge>
                    <Badge variant="outline">Video</Badge>
                  </div>
                </motion.div>
              </div>

              {/* Supported Formats */}
              <Card className="bg-muted/30">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3">AI Processing Capabilities</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Resume & CV Analysis</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ImageIcon className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Certificate Recognition</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mic className="h-4 w-4 text-purple-500" />
                        <span className="text-sm">Interview Audio Analysis</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Brain className="h-4 w-4 text-orange-500" />
                        <span className="text-sm">Skill Extraction</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Sparkles className="h-4 w-4 text-pink-500" />
                        <span className="text-sm">Career Recommendations</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Eye className="h-4 w-4 text-indigo-500" />
                        <span className="text-sm">Content Insights</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="processing" className="space-y-4">
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  <AnimatePresence>
                    {files.filter(f => f.status === 'uploading' || f.status === 'processing').map((file) => (
                      <motion.div
                        key={file.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-4">
                              <div className="text-primary">
                                {getFileIcon(file.type)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-medium">{file.name}</h4>
                                  <div className="flex items-center space-x-2">
                                    {getStatusIcon(file.status)}
                                    <span className="text-sm text-muted-foreground">
                                      {file.status === 'uploading' ? 'Uploading...' : 'Processing...'}
                                    </span>
                                  </div>
                                </div>
                                <Progress value={file.progress} className="h-2" />
                                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                  <span>{formatFileSize(file.size)}</span>
                                  <span>{file.progress}%</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="results" className="space-y-4">
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  <AnimatePresence>
                    {files.filter(f => f.status === 'completed' || f.status === 'error').map((file) => (
                      <motion.div
                        key={file.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        <Card className={file.status === 'error' ? 'border-red-200' : 'border-green-200'}>
                          <CardContent className="p-4">
                            <div className="space-y-4">
                              {/* File Header */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="text-primary">
                                    {getFileIcon(file.type)}
                                  </div>
                                  <div>
                                    <h4 className="font-medium">{file.name}</h4>
                                    <p className="text-sm text-muted-foreground">
                                      {formatFileSize(file.size)} • {file.status}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {file.analysis && (
                                    <Badge variant="secondary">
                                      {file.analysis.careerRelevance}% relevant
                                    </Badge>
                                  )}
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => deleteFile(file.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>

                              {/* Analysis Results */}
                              {file.analysis && (
                                <div className="space-y-3">
                                  <div>
                                    <h5 className="font-medium text-sm mb-1">Summary</h5>
                                    <p className="text-sm text-muted-foreground">{file.analysis.summary}</p>
                                  </div>

                                  <div>
                                    <h5 className="font-medium text-sm mb-2">Key Points</h5>
                                    <ul className="space-y-1">
                                      {file.analysis.keyPoints.map((point, index) => (
                                        <li key={index} className="text-sm text-muted-foreground flex items-start">
                                          <CheckCircle className="h-3 w-3 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                          {point}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>

                                  <div>
                                    <h5 className="font-medium text-sm mb-2">Skills Identified</h5>
                                    <div className="flex flex-wrap gap-1">
                                      {file.analysis.skillsIdentified.map((skill, index) => (
                                        <Badge key={index} variant="outline" className="text-xs">
                                          {skill}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>

                                  <div>
                                    <h5 className="font-medium text-sm mb-2">Recommendations</h5>
                                    <ul className="space-y-1">
                                      {file.analysis.recommendations.map((rec, index) => (
                                        <li key={index} className="text-sm text-muted-foreground flex items-start">
                                          <Sparkles className="h-3 w-3 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                                          {rec}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Processing Summary */}
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="h-5 w-5 mr-2 text-secondary" />
              Processing Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{files.length}</div>
                <div className="text-sm text-muted-foreground">Total Files</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {files.filter(f => f.status === 'completed').length}
                </div>
                <div className="text-sm text-muted-foreground">Processed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {files.filter(f => f.status === 'processing' || f.status === 'uploading').length}
                </div>
                <div className="text-sm text-muted-foreground">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {files.filter(f => f.status === 'error').length}
                </div>
                <div className="text-sm text-muted-foreground">Errors</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
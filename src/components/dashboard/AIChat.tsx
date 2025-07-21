import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Mic, 
  MicOff, 
  Bot, 
  User, 
  Sparkles, 
  Brain,
  FileText,
  Image as ImageIcon,
  Download,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  context?: string;
  attachments?: Array<{
    type: 'file' | 'image' | 'audio';
    name: string;
    url: string;
  }>;
}

interface ConversationMemory {
  userProfile: {
    name?: string;
    currentRole?: string;
    goals?: string[];
    skills?: string[];
    experience?: string;
  };
  conversationContext: string[];
  preferences: {
    communicationStyle: 'formal' | 'casual' | 'technical';
    focusAreas: string[];
  };
}

export const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm your AI Career Pathfinder. I remember our previous conversations and I'm here to help you navigate your career journey. What would you like to explore today?",
      timestamp: new Date(),
      context: "greeting"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [conversationMemory, setConversationMemory] = useState<ConversationMemory>({
    userProfile: {},
    conversationContext: [],
    preferences: {
      communicationStyle: 'casual',
      focusAreas: []
    }
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const updateConversationMemory = (userMessage: string, aiResponse: string) => {
    setConversationMemory(prev => ({
      ...prev,
      conversationContext: [
        ...prev.conversationContext.slice(-10), // Keep last 10 exchanges
        `User: ${userMessage}`,
        `AI: ${aiResponse}`
      ]
    }));
  };

  const generateContextualPrompt = (userMessage: string) => {
    const { userProfile, conversationContext, preferences } = conversationMemory;
    
    return `You are an advanced AI Career Pathfinder with deep expertise in career development, education, and global opportunities. You have a warm, encouraging personality and maintain context across conversations.

CONVERSATION MEMORY:
${conversationContext.length > 0 ? conversationContext.join('\n') : 'This is the start of our conversation.'}

USER PROFILE:
- Current Role: ${userProfile.currentRole || 'Not specified'}
- Goals: ${userProfile.goals?.join(', ') || 'Not specified'}
- Skills: ${userProfile.skills?.join(', ') || 'Not specified'}
- Experience: ${userProfile.experience || 'Not specified'}

COMMUNICATION STYLE: ${preferences.communicationStyle}
FOCUS AREAS: ${preferences.focusAreas.join(', ') || 'General career guidance'}

CURRENT USER MESSAGE: "${userMessage}"

Please respond with:
1. Acknowledge any relevant context from our previous conversation
2. Provide specific, actionable career guidance
3. Ask follow-up questions to better understand their needs
4. Suggest concrete next steps or resources
5. Maintain your encouraging, expert personality

Keep responses conversational but informative, and always reference relevant context from our conversation history when applicable.`;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = generateContextualPrompt(inputValue);
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const aiResponse = response.text();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
        context: "contextual_response"
      };

      setMessages(prev => [...prev, aiMessage]);
      updateConversationMemory(inputValue, aiResponse);

    } catch (error) {
      console.error('Error generating AI response:', error);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in this browser.",
        variant: "destructive"
      });
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast({
        title: "Error",
        description: "Speech recognition failed. Please try again.",
        variant: "destructive"
      });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied",
      description: "Message copied to clipboard"
    });
  };

  const regenerateResponse = async (messageId: string) => {
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1) return;

    const userMessage = messages[messageIndex - 1];
    if (!userMessage || userMessage.type !== 'user') return;

    setIsLoading(true);
    
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = generateContextualPrompt(userMessage.content);
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const aiResponse = response.text();

      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, content: aiResponse, timestamp: new Date() }
          : msg
      ));

    } catch (error) {
      console.error('Error regenerating response:', error);
      toast({
        title: "Error",
        description: "Failed to regenerate response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Brain className="h-5 w-5 mr-2 text-primary" />
              AI Career Pathfinder
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                Context Aware
              </Badge>
              <Badge variant="outline">
                {messages.length - 1} messages
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Chat Messages */}
            <ScrollArea className="h-96 w-full border rounded-lg p-4">
              <div className="space-y-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                        <div className={`flex items-start space-x-2 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            message.type === 'user' 
                              ? 'bg-primary text-white' 
                              : 'bg-gradient-to-br from-purple-500 to-blue-500 text-white'
                          }`}>
                            {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                          </div>
                          <div className={`rounded-lg p-3 ${
                            message.type === 'user'
                              ? 'bg-primary text-white'
                              : 'bg-muted'
                          }`}>
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            <div className="flex items-center justify-between mt-2">
                              <p className={`text-xs ${
                                message.type === 'user' ? 'text-white/70' : 'text-muted-foreground'
                              }`}>
                                {message.timestamp.toLocaleTimeString()}
                              </p>
                              {message.type === 'ai' && (
                                <div className="flex items-center space-x-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyMessage(message.content)}
                                    className="h-6 w-6 p-0"
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => regenerateResponse(message.id)}
                                    className="h-6 w-6 p-0"
                                  >
                                    <RotateCcw className="h-3 w-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-start space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white flex items-center justify-center">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="bg-muted rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                          </div>
                          <span className="text-sm text-muted-foreground">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="space-y-3">
              <div className="flex space-x-2">
                <Textarea
                  placeholder="Ask me about your career path, skills, opportunities, or upload files for analysis..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="flex-1 min-h-[60px] resize-none"
                  disabled={isLoading}
                />
                <div className="flex flex-col space-y-2">
                  <Button
                    onClick={handleVoiceInput}
                    variant="outline"
                    size="sm"
                    disabled={isLoading}
                    className={isListening ? 'bg-red-100 text-red-600' : ''}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    size="sm"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInputValue("Analyze my career progression and suggest next steps")}
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  Career Analysis
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInputValue("What skills should I learn for my target role?")}
                >
                  <Brain className="h-3 w-3 mr-1" />
                  Skill Gaps
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInputValue("Show me global opportunities in my field")}
                >
                  <FileText className="h-3 w-3 mr-1" />
                  Opportunities
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conversation Context Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2 text-secondary" />
            Conversation Memory
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium mb-2">Your Profile</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>Role: {conversationMemory.userProfile.currentRole || 'Not specified'}</p>
                <p>Goals: {conversationMemory.userProfile.goals?.length || 0} identified</p>
                <p>Skills: {conversationMemory.userProfile.skills?.length || 0} tracked</p>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Context</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>Messages: {conversationMemory.conversationContext.length}</p>
                <p>Style: {conversationMemory.preferences.communicationStyle}</p>
                <p>Focus: {conversationMemory.preferences.focusAreas.length} areas</p>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">AI Capabilities</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>✓ Context awareness</p>
                <p>✓ File processing</p>
                <p>✓ Voice input</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
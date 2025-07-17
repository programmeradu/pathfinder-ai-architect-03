import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { SignupModal } from './SignupModal';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  Sparkles,
  ArrowRight,
  Clock
} from 'lucide-react';

interface Message {
  content: string;
  isUser: boolean;
  timestamp: string;
}

export const InteractiveDemo = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [demoUsageCount, setDemoUsageCount] = useState(0);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    const newMessage: Message = {
      content: inputValue,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInputValue('');
    setDemoUsageCount(prevCount => prevCount + 1);

    // Trigger signup prompt after 3 messages
    if (demoUsageCount >= 2) {
      setShowSignupPrompt(true);
    }

    const aiResponse = await simulateAIResponse(inputValue);
    const newAiMessage: Message = {
      content: aiResponse,
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prevMessages => [...prevMessages, newAiMessage]);
  };

  const simulateAIResponse = async (input: string) => {
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          conversationHistory: messages.map(msg => ({
            role: msg.isUser ? 'user' : 'assistant',
            content: msg.content
          }))
        })
      });

      if (!response.ok) {
        throw new Error('AI service unavailable');
      }

      const data = await response.json();
      setIsTyping(false);

      if (data.success) {
        return data.response;
      } else {
        throw new Error(data.error || 'AI response failed');
      }
    } catch (error) {
      setIsTyping(false);
      console.error('AI Error:', error);

      // Fallback responses for demo
      const fallbackResponses = [
        "I can help you create a personalized learning path for that goal. Let me analyze the current market trends and skill requirements...",
        "Based on your interest, I recommend starting with foundational skills in that area. Here's what I suggest...",
        "That's an excellent career choice! I'll help you map out a comprehensive learning journey with global opportunities...",
        "I've identified several pathways for your goal. Let me show you the most effective route based on current industry demands..."
      ];

      return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    }
  };

  return (
    <Card className="w-[90%] md:w-[75%] lg:w-[60%] mx-auto mt-10 rounded-lg shadow-md overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <CardTitle className="text-lg font-semibold flex items-center">
          <MessageSquare className="mr-2 h-5 w-5 text-blue-500" /> Pathfinder AI Demo
        </CardTitle>
        <Badge variant="secondary" className="uppercase text-xs">Beta</Badge>
      </CardHeader>
      <CardContent className="p-4">
        
        <div className="mb-4 h-[400px] overflow-y-auto p-2">
          {messages.map((message, index) => (
            <div key={index} className={`mb-2 flex items-start ${message.isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`rounded-lg p-3 text-sm break-words ${message.isUser ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                {message.content}
                <div className="text-xs text-gray-500 mt-1 text-right"><Clock className="inline-block mr-1 h-3 w-3" />{message.timestamp}</div>
              </div>
              <div className={`ml-2 mr-2 w-8 h-8 rounded-full flex items-center justify-center ${message.isUser ? 'bg-blue-500 text-white' : 'bg-gray-500 text-white'}`}>
                {message.isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="mb-2 flex items-start justify-start">
              <div className="rounded-lg p-3 text-sm bg-gray-100 text-gray-800">
                Thinking... <Sparkles className="inline-block ml-1 h-4 w-4 animate-pulse" />
                <div className="text-xs text-gray-500 mt-1 text-right"><Clock className="inline-block mr-1 h-3 w-3" />{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
              <div className="ml-2 w-8 h-8 rounded-full flex items-center justify-center bg-gray-500 text-white">
                <Bot className="h-4 w-4" />
              </div>
            </div>
          )}
        </div>

        
        <div className="flex items-center">
          <Input
            type="text"
            placeholder="Enter your goal or question..."
            value={inputValue}
            onChange={handleInputChange}
            className="rounded-l-md border-r-0"
          />
          <Button 
            onClick={handleSendMessage}
            className="rounded-l-none bg-blue-500 text-white hover:bg-blue-600"
          >
            Send <Send className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Signup Prompt */}
        {showSignupPrompt && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-700">
              Enjoying the demo? Sign up to unlock unlimited access and personalized features!
            </p>
            <Button 
              onClick={() => setShowSignupModal(true)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Get Full Access <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
</div>

      <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        source="demo"
      />
    </Card>
  );
};
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Brain, 
  MessageCircle, 
  Plus,
  Mic,
  MicOff,
  User,
  Bot
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: number;
  title: string;
  messages: Message[];
  isActive: boolean;
  updatedAt: string;
}

export default function AIMentor() {
  const [currentMessage, setCurrentMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data: conversations, isLoading } = useQuery<Conversation[]>({
    queryKey: ['/api/conversations'],
  });

  const sendMessageMutation = useMutation({
    mutationFn: async ({ message, conversationId }: { message: string; conversationId?: number }) => {
      if (conversationId) {
        // Update existing conversation
        const conversation = conversations?.find(c => c.id === conversationId);
        const updatedMessages = [
          ...(conversation?.messages || []),
          { role: 'user' as const, content: message, timestamp: new Date() }
        ];
        
        await apiRequest(`/api/conversations/${conversationId}`, {
          method: 'PATCH',
          body: { messages: updatedMessages }
        });
        
        // Send to AI
        const aiResponse = await apiRequest('/api/chat', {
          method: 'POST',
          body: { 
            message,
            conversationHistory: updatedMessages.map(m => ({ role: m.role, content: m.content }))
          }
        });
        
        // Update conversation with AI response
        const finalMessages = [
          ...updatedMessages,
          { role: 'assistant' as const, content: aiResponse.response, timestamp: new Date() }
        ];
        
        return await apiRequest(`/api/conversations/${conversationId}`, {
          method: 'PATCH',
          body: { messages: finalMessages }
        });
      } else {
        // Create new conversation
        const newConversation = await apiRequest('/api/conversations', {
          method: 'POST',
          body: {
            title: message.slice(0, 50) + (message.length > 50 ? '...' : ''),
            messages: [{ role: 'user', content: message, timestamp: new Date() }]
          }
        });
        
        // Send to AI
        const aiResponse = await apiRequest('/api/chat', {
          method: 'POST',
          body: { 
            message,
            conversationHistory: [{ role: 'user', content: message }]
          }
        });
        
        // Update conversation with AI response
        const finalMessages = [
          { role: 'user' as const, content: message, timestamp: new Date() },
          { role: 'assistant' as const, content: aiResponse.response, timestamp: new Date() }
        ];
        
        const updatedConversation = await apiRequest(`/api/conversations/${newConversation.id}`, {
          method: 'PATCH',
          body: { messages: finalMessages }
        });
        
        setActiveConversationId(newConversation.id);
        return updatedConversation;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/conversations'] });
      setCurrentMessage("");
    }
  });

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;
    
    await sendMessageMutation.mutateAsync({
      message: currentMessage,
      conversationId: activeConversationId || undefined
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const activeConversation = conversations?.find(c => c.id === activeConversationId);

  return (
    <div className="h-full flex">
      {/* Sidebar - Conversations */}
      <div className="w-80 border-r bg-muted/30 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Conversations</h2>
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => setActiveConversationId(null)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-2">
          {conversations?.map((conversation) => (
            <Card 
              key={conversation.id}
              className={`cursor-pointer transition-colors ${
                activeConversationId === conversation.id 
                  ? 'border-primary bg-primary/10' 
                  : 'hover:bg-muted/50'
              }`}
              onClick={() => setActiveConversationId(conversation.id)}
            >
              <CardContent className="p-3">
                <div className="flex items-start gap-2">
                  <MessageCircle className="h-4 w-4 text-muted-foreground mt-1" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {conversation.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {conversation.messages.length} messages
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b p-4">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">AI Mentor</h1>
            <Badge variant="secondary">PathfinderAI</Badge>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            Your personal career guidance assistant
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeConversation?.messages.length ? (
            <div className="space-y-4">
              {activeConversation.messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  <div className={`flex-1 ${
                    message.role === 'user' ? 'text-right' : ''
                  }`}>
                    <div className={`inline-block max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}>
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {activeConversationId ? 'No messages yet' : 'Start a conversation'}
                </h3>
                <p className="text-muted-foreground">
                  Ask me anything about your career path, skills, or learning goals!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Ask your AI mentor anything..."
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={sendMessageMutation.isPending}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsListening(!isListening)}
              disabled={sendMessageMutation.isPending}
            >
              {isListening ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={!currentMessage.trim() || sendMessageMutation.isPending}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
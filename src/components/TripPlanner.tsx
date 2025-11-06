import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, MapPin, Send, Mic, Plus, User, X } from 'lucide-react';
import { invokeLLM } from '@/integrations/core';
import { useToast } from '@/hooks/use-toast';

interface TripPlannerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TripPlanner({ isOpen, onClose }: TripPlannerProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState([
    {
      type: 'ai',
      content: "Namaste! 🙏 I'm your AI travel assistant for incredible India. I can help you plan amazing trips across our beautiful country - from the snow-capped Himalayas to the tropical beaches of Kerala, from the royal palaces of Rajasthan to the spiritual ghats of Varanasi. What kind of Indian adventure are you dreaming of?"
    }
  ]);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!query.trim()) return;

    const userMessage = query;
    setQuery('');
    setConversation(prev => [...prev, { type: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await invokeLLM({
        prompt: `You are SAFAR AI, an expert Indian travel assistant. The user asked: "${userMessage}". 
        
        Provide helpful, detailed travel advice about India. Include specific destinations, cultural insights, practical tips, and personalized recommendations. Be enthusiastic about India's diversity - mention specific places, festivals, foods, and experiences. 
        
        If they're asking about planning a trip, ask relevant follow-up questions about:
        - Which regions of India interest them (North, South, East, West, Northeast, Central)
        - What type of experience they want (cultural, adventure, spiritual, beach, mountains, heritage)
        - Duration and budget
        - Time of year for travel
        - Group size and travel style
        
        Keep responses conversational, informative, and inspiring. Use emojis occasionally to make it friendly.`,
        add_context_from_internet: true
      });

      setConversation(prev => [...prev, { type: 'ai', content: response }]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-orange-500 to-orange-600">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">SAFAR AI Assistant</h3>
                <p className="text-xs text-white/80">Your India Travel Expert</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Trip Planning Header */}
          <div className="p-4 bg-orange-50 border-b">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">Planning Your First Trip to India</h4>
              <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                Create a trip
              </Button>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>India</span>
              </div>
              <span>When</span>
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>2 travelers</span>
              </div>
              <span>Budget</span>
            </div>
          </div>

          {/* Conversation */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Where to today?</h3>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mb-4">
                <User className="w-4 h-4 bg-orange-100 rounded-full p-0.5" />
                <span>Start planning a trip to India.</span>
              </div>
            </div>

            {conversation.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.type === 'ai' && (
                    <div className="flex items-center space-x-2 mb-2">
                      <Sparkles className="w-4 h-4 text-orange-500" />
                      <span className="text-xs font-medium text-orange-600">SAFAR AI</span>
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-orange-500 animate-spin" />
                    <span className="text-sm text-gray-600">SAFAR AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <Textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask anything about traveling in India..."
                  className="resize-none pr-20"
                  rows={2}
                />
                <div className="absolute right-2 bottom-2 flex items-center space-x-1">
                  <Button size="sm" variant="ghost" className="p-1">
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="p-1">
                    <Mic className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSendMessage}
                    disabled={!query.trim() || isLoading}
                    className="p-1 bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              SAFAR AI can make mistakes. Check important info.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
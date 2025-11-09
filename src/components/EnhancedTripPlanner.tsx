import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Send, MapPin, Calendar, Users, Loader2 } from 'lucide-react';
import { invokeLLM } from '@/integrations/core';
import { useToast } from '@/hooks/use-toast';

interface EnhancedTripPlannerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function EnhancedTripPlanner({ isOpen, onClose }: EnhancedTripPlannerProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m SAFAR AI, your personal travel assistant for India. I can help you plan trips, suggest destinations, find the best time to visit, and answer any travel questions. What would you like to know?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const quickQuestions = [
    'Best places to visit in Rajasthan',
    'Plan a 5-day Kerala trip',
    'Budget-friendly destinations in India',
    'Best time to visit Goa',
  ];

  const handleSend = async (question?: string) => {
    const userMessage = question || input.trim();
    if (!userMessage) return;

    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const response = await invokeLLM({
        prompt: `You are SAFAR AI, a helpful travel assistant specializing in Indian destinations. 
        
User question: ${userMessage}

Provide a helpful, friendly, and detailed response about Indian travel. Include specific recommendations, tips, and practical information. Keep the tone conversational and enthusiastic.`,
        add_context_from_internet: true,
      });

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: response as string },
      ]);
    } catch (err) {
      console.error('Error getting AI response:', err);
      toast({
        title: 'Connection Error',
        description: 'Unable to get response. Please check your connection and try again.',
        variant: 'destructive',
      });
      
      // Fallback response
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I apologize, but I\'m having trouble connecting right now. Here are some general tips: India offers diverse destinations from beaches in Goa to mountains in Himachal Pradesh. The best time to visit most places is October to March. Would you like specific recommendations for any region?',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden p-0">
        <DialogHeader className="p-6 pb-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold">SAFAR AI Assistant</DialogTitle>
              <p className="text-sm text-white/90">Your personal travel guide for India</p>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col h-[calc(80vh-140px)]">
          {/* Messages */}
          <div className="flex-1 overflow-auto p-6 space-y-4">
            {messages.map((message, idx) => (
              <div
                key={idx}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <span className="text-xs font-semibold text-purple-600">SAFAR AI</span>
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                </div>
              </div>
            )}
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="px-6 pb-4">
              <p className="text-sm text-gray-600 mb-3">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((question, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="cursor-pointer hover:bg-orange-50 hover:border-orange-500 transition-colors"
                    onClick={() => handleSend(question)}
                  >
                    {question}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-6 pt-0 border-t">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !loading && handleSend()}
                placeholder="Ask me anything about traveling in India..."
                disabled={loading}
                className="flex-1"
              />
              <Button
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                className="bg-purple-500 hover:bg-purple-600"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
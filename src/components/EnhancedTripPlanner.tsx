import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X, Send, Sparkles, Loader2 } from 'lucide-react';
import { invokeLLM } from '@/integrations/core';
import { useToast } from '@/hooks/use-toast';

interface EnhancedTripPlannerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EnhancedTripPlanner({ isOpen, onClose }: EnhancedTripPlannerProps) {
  const [messages, setMessages] = useState<any[]>([
    {
      role: 'assistant',
      content: 'Namaste! 🙏 I\'m your SAFAR AI travel assistant. I can help you plan trips across India, suggest destinations, find the best routes, and create personalized itineraries. What would you like to explore today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await invokeLLM({
        prompt: `You are SAFAR AI, an expert Indian travel assistant. User asked: "${input}"
        
Provide helpful, detailed travel advice about India. Include specific recommendations, practical tips, and cultural insights. Be friendly and enthusiastic!`,
        add_context_from_internet: true
      });

      const assistantMessage = {
        role: 'assistant',
        content: typeof response === 'string' ? response : JSON.stringify(response, null, 2)
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.log('AI unavailable, providing basic response:', error);
      const fallbackResponse = {
        role: 'assistant',
        content: `I'd love to help you with that! Here are some general tips:

• India offers diverse experiences from beaches to mountains
• Best time to visit most places: October to March
• Always try local cuisine - it's amazing!
• Respect local customs and dress modestly at religious sites
• Book trains and hotels in advance during peak season

What specific destination or type of experience are you interested in?`
      };
      setMessages(prev => [...prev, fallbackResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="fixed inset-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-orange-500 to-orange-600">
            <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-6 h-6" />
              <span>SAFAR AI Assistant</span>
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
                </div>
              </div>
            )}
          </div>

          <div className="border-t p-4 bg-gray-50">
            <div className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask me anything about traveling in India..."
                className="flex-1"
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="bg-orange-500 hover:bg-orange-600"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
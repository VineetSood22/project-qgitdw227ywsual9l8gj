import { useState } from 'react';
import { X, Send, Sparkles, Loader2, WifiOff, MapPin, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { invokeLLM } from '@/integrations/core';
import { useToast } from '@/hooks/use-toast';

interface EnhancedTripPlannerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function EnhancedTripPlanner({ isOpen, onClose }: EnhancedTripPlannerProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Namaste! 🙏 I\'m SAFAR AI, your personal travel assistant for exploring incredible India! Ask me anything about destinations, itineraries, budgets, or travel tips. How can I help plan your perfect journey?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const { toast } = useToast();

  const quickQuestions = [
    { icon: MapPin, text: 'Best places to visit in Rajasthan', query: 'What are the best places to visit in Rajasthan for a 7-day trip?' },
    { icon: Calendar, text: 'Plan a Kerala backwaters trip', query: 'Help me plan a 5-day Kerala backwaters trip with houseboat experience' },
    { icon: Users, text: 'Family trip to Goa', query: 'Suggest a family-friendly 4-day itinerary for Goa with kids' },
  ];

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setIsOffline(false);

    try {
      const response = await invokeLLM({
        prompt: `You are SAFAR AI, a friendly and knowledgeable travel assistant specializing in Indian tourism. 
        
User question: ${input}

Provide helpful, detailed, and practical travel advice. Include:
- Specific destination recommendations
- Estimated costs in INR
- Best time to visit
- Travel tips and local insights
- Cultural etiquette when relevant

Keep responses conversational, enthusiastic, and informative. Use emojis sparingly for warmth.`,
        add_context_from_internet: true,
      });

      const assistantMessage: Message = {
        role: 'assistant',
        content: typeof response === 'string' ? response : JSON.stringify(response, null, 2),
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.log('AI service unavailable, providing offline response:', error);
      setIsOffline(true);

      const offlineResponse = generateOfflineResponse(input);
      const assistantMessage: Message = {
        role: 'assistant',
        content: offlineResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      toast({
        title: "Offline Mode",
        description: "AI assistant is working with limited functionality",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateOfflineResponse = (query: string) => {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('rajasthan')) {
      return `🏰 Rajasthan is a magnificent destination! Here are some highlights:\n\n**Must-Visit Cities:**\n• Jaipur (Pink City) - Amber Fort, City Palace\n• Udaipur (City of Lakes) - Lake Pichola, City Palace\n• Jaisalmer (Golden City) - Desert safari, Jaisalmer Fort\n• Jodhpur (Blue City) - Mehrangarh Fort\n\n**Best Time:** October to March\n**Budget:** ₹15,000-30,000 per person for 7 days\n\n**Travel Tips:**\n• Book desert safari in advance\n• Try authentic Rajasthani thali\n• Respect local customs at temples\n• Stay hydrated in desert areas\n\nNote: I'm currently in offline mode. For more detailed and personalized recommendations, please try again when connected to the internet.`;
    }

    if (lowerQuery.includes('kerala') || lowerQuery.includes('backwater')) {
      return `🌴 Kerala Backwaters - A Serene Experience!\n\n**Highlights:**\n• Alleppey houseboat stay (1-2 nights)\n• Kumarakom Bird Sanctuary\n• Vembanad Lake cruise\n• Traditional Kerala cuisine\n• Ayurvedic spa treatments\n\n**Best Time:** November to February\n**Budget:** ₹20,000-40,000 per person for 5 days\n\n**Travel Tips:**\n• Book houseboats 2-3 months in advance\n• Try Kerala sadya (traditional meal)\n• Carry mosquito repellent\n• Respect local fishing communities\n\nNote: I'm currently in offline mode. For real-time availability and bookings, please connect to the internet.`;
    }

    if (lowerQuery.includes('goa')) {
      return `🏖️ Goa - Perfect for Families!\n\n**Family-Friendly Activities:**\n• Beach time at Calangute, Baga\n• Water sports at Candolim\n• Dudhsagar Waterfalls trip\n• Spice plantation tour\n• Old Goa churches visit\n\n**Best Time:** November to February\n**Budget:** ₹25,000-45,000 for family of 4 (4 days)\n\n**Family Tips:**\n• Stay in North Goa for better facilities\n• Book beach shacks for lunch\n• Try Goan fish curry\n• Rent a car for convenience\n\nNote: I'm currently in offline mode. Connect to internet for personalized recommendations based on your family's preferences.`;
    }

    return `Thank you for your question! 🙏\n\nI'm currently in offline mode with limited information. However, I can still help with:\n\n• General travel tips for India\n• Popular destinations overview\n• Budget planning basics\n• Packing suggestions\n\nFor detailed, personalized recommendations with real-time information, please connect to the internet and ask again.\n\nIn the meantime, feel free to explore the "Dream Your Trip" feature to create custom itineraries!`;
  };

  const handleQuickQuestion = (query: string) => {
    setInput(query);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="fixed inset-4 bg-white rounded-2xl shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-purple-500 to-pink-500">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-6 h-6" />
              <span>SAFAR AI Assistant</span>
            </h2>
            {isOffline && (
              <Badge variant="secondary" className="mt-2 bg-yellow-500 text-white">
                <WifiOff className="w-3 h-3 mr-1" />
                Limited Offline Mode
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-4 max-w-3xl mx-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <Card
                  className={`max-w-[80%] ${
                    message.role === 'user'
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100'
                  }`}
                >
                  <CardContent className="p-4">
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
                      {message.timestamp.toLocaleTimeString('en-IN', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <Card className="bg-gray-100">
                  <CardContent className="p-4 flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>SAFAR AI is thinking...</span>
                  </CardContent>
                </Card>
              </div>
            )}

            {messages.length === 1 && (
              <div className="space-y-3 mt-6">
                <p className="text-sm text-gray-600 font-medium">Quick Questions:</p>
                {quickQuestions.map((q, index) => {
                  const Icon = q.icon;
                  return (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start text-left h-auto py-3"
                      onClick={() => handleQuickQuestion(q.query)}
                    >
                      <Icon className="w-4 h-4 mr-3 flex-shrink-0" />
                      <span>{q.text}</span>
                    </Button>
                  );
                })}
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t p-4 bg-gray-50">
          <div className="max-w-3xl mx-auto flex space-x-2">
            <Input
              placeholder="Ask me anything about traveling in India..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-purple-500 hover:bg-purple-600"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
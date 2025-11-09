import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Send, Loader2, AlertCircle } from 'lucide-react';
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
  const [connectionError, setConnectionError] = useState(false);
  const { toast } = useToast();

  const quickQuestions = [
    'Best places to visit in Rajasthan',
    'Plan a 5-day Kerala trip',
    'Budget-friendly destinations in India',
    'Best time to visit Goa',
  ];

  // Fallback responses for common questions
  const getFallbackResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('rajasthan')) {
      return 'Rajasthan is a magnificent destination! Top places include:\n\n• Jaipur - The Pink City with Amber Fort and City Palace\n• Udaipur - City of Lakes with stunning palaces\n• Jaisalmer - Golden city with desert safaris\n• Jodhpur - The Blue City with Mehrangarh Fort\n\nBest time: October to March\nDuration: 7-10 days recommended\nBudget: ₹40,000-80,000 per person';
    }
    
    if (lowerQuestion.includes('kerala')) {
      return 'Kerala is perfect for a relaxing getaway! 5-day itinerary:\n\nDay 1-2: Munnar (tea plantations, hill stations)\nDay 3: Thekkady (wildlife sanctuary)\nDay 4-5: Alleppey (backwater houseboat stay)\n\nBest time: September to March\nBudget: ₹30,000-50,000 per person\nDon\'t miss: Kerala cuisine, Ayurvedic massage';
    }
    
    if (lowerQuestion.includes('budget') || lowerQuestion.includes('cheap')) {
      return 'Budget-friendly destinations in India:\n\n• Rishikesh - Yoga, rafting (₹15,000-25,000)\n• Gokarna - Beaches, temples (₹20,000-30,000)\n• Mcleodganj - Mountains, culture (₹18,000-28,000)\n• Hampi - Historical ruins (₹20,000-35,000)\n• Pondicherry - French charm (₹25,000-40,000)\n\nTips: Travel off-season, use public transport, stay in hostels';
    }
    
    if (lowerQuestion.includes('goa')) {
      return 'Goa is India\'s beach paradise!\n\nBest time: November to February (pleasant weather)\nAvoid: June to September (monsoon)\n\nNorth Goa: Parties, nightlife, water sports\nSouth Goa: Peaceful beaches, luxury resorts\n\nDuration: 4-7 days\nBudget: ₹25,000-60,000 per person\nMust-try: Seafood, beach shacks, sunset cruises';
    }
    
    return 'I\'d love to help you with that! India offers incredible diversity - from the Himalayas in the north to beaches in the south, from deserts in Rajasthan to backwaters in Kerala.\n\nCould you tell me more about:\n• Your preferred type of destination (beach, mountains, heritage, adventure)?\n• Duration of your trip?\n• Budget range?\n• Time of year you\'re planning to travel?\n\nThis will help me give you personalized recommendations!';
  };

  const handleSend = async (question?: string) => {
    const userMessage = question || input.trim();
    if (!userMessage) return;

    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setLoading(true);
    setConnectionError(false);

    try {
      // Try to use AI
      const { invokeLLM } = await import('@/integrations/core');
      
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
      setConnectionError(true);
      
      // Use fallback response
      const fallbackResponse = getFallbackResponse(userMessage);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: fallbackResponse,
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
          {/* Connection Warning */}
          {connectionError && (
            <div className="mx-6 mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-yellow-800">
                Working in offline mode. Responses are based on general knowledge.
              </p>
            </div>
          )}

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
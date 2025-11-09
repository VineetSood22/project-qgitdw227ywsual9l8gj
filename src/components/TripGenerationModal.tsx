import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Loader2, CheckCircle2, MapPin, Calendar, Plane, Hotel, Utensils, Camera } from 'lucide-react';
import { invokeLLM } from '@/integrations/core';
import { Trip } from '@/entities';
import { useToast } from '@/hooks/use-toast';

interface TripGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripData: any;
  onComplete: (generatedTrip: any) => void;
}

const generationSteps = [
  { icon: MapPin, label: 'Analyzing destinations', duration: 2000 },
  { icon: Calendar, label: 'Creating itinerary', duration: 3000 },
  { icon: Plane, label: 'Planning routes', duration: 2000 },
  { icon: Hotel, label: 'Finding accommodations', duration: 2500 },
  { icon: Utensils, label: 'Discovering local cuisine', duration: 2000 },
  { icon: Camera, label: 'Adding must-see attractions', duration: 2500 }
];

export function TripGenerationModal({ isOpen, onClose, tripData, onComplete }: TripGenerationModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(true);
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && tripData) {
      generateTrip();
    }
  }, [isOpen, tripData]);

  useEffect(() => {
    if (isGenerating && currentStep < generationSteps.length) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, generationSteps[currentStep].duration);
      return () => clearTimeout(timer);
    }
  }, [currentStep, isGenerating]);

  const generateTrip = async () => {
    setIsGenerating(true);
    setCurrentStep(0);

    try {
      const placesText = tripData.additional_locations?.join(', ') || tripData.destination;
      
      const response = await invokeLLM({
        prompt: `Create a detailed ${tripData.duration} trip itinerary for ${tripData.travelers} travelers visiting ${placesText} in ${tripData.destination}, India. 
        
Starting from: ${tripData.from_location}
Budget: ${tripData.budget}
Transport: ${tripData.transport_mode}

Provide:
1. Day-by-day itinerary with morning, afternoon, evening activities
2. Recommended hotels/stays for each location
3. Local food recommendations
4. Travel tips and best routes
5. Estimated costs breakdown
6. Packing suggestions
7. Cultural etiquette tips

Make it detailed, practical, and exciting!`,
        add_context_from_internet: true
      });

      const savedTrip = await Trip.create({
        ...tripData,
        ai_suggestions: typeof response === 'string' ? response : JSON.stringify(response, null, 2)
      });

      setGeneratedPlan(savedTrip);
      setIsGenerating(false);

      setTimeout(() => {
        onComplete(savedTrip);
      }, 1500);

    } catch (error) {
      console.log('AI generation failed, creating basic plan:', error);
      
      const basicPlan = generateBasicPlan(tripData);
      
      try {
        const savedTrip = await Trip.create({
          ...tripData,
          ai_suggestions: basicPlan
        });
        setGeneratedPlan(savedTrip);
      } catch (dbError) {
        console.log('Database save failed, using local data:', dbError);
        setGeneratedPlan({
          ...tripData,
          id: Date.now().toString(),
          ai_suggestions: basicPlan
        });
      }

      setIsGenerating(false);
      setTimeout(() => {
        onComplete(generatedPlan || { ...tripData, ai_suggestions: basicPlan });
      }, 1500);
    }
  };

  const generateBasicPlan = (data: any) => {
    const places = data.additional_locations || [data.destination];
    const daysMatch = data.duration.match(/\d+/);
    const days = daysMatch ? parseInt(daysMatch[0]) : 5;

    let plan = `🌟 ${data.destination} Trip Plan - ${data.duration}\n\n`;
    plan += `📍 Destinations: ${places.join(', ')}\n`;
    plan += `👥 Travelers: ${data.travelers}\n`;
    plan += `💰 Budget: ${data.budget}\n`;
    plan += `🚗 Transport: ${data.transport_mode}\n\n`;
    plan += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    for (let i = 0; i < Math.min(days, places.length * 2); i++) {
      const placeIndex = Math.floor(i / 2);
      const place = places[placeIndex] || data.destination;
      
      plan += `📅 Day ${i + 1}: ${place}\n\n`;
      plan += `Morning (9:00 AM - 12:00 PM):\n`;
      plan += `• Visit main attractions and landmarks\n`;
      plan += `• Explore local markets\n\n`;
      plan += `Afternoon (12:00 PM - 5:00 PM):\n`;
      plan += `• Lunch at local restaurant\n`;
      plan += `• Continue sightseeing\n`;
      plan += `• Photography and shopping\n\n`;
      plan += `Evening (5:00 PM - 9:00 PM):\n`;
      plan += `• Sunset viewing point\n`;
      plan += `• Dinner at recommended restaurant\n`;
      plan += `• Local cultural experience\n\n`;
      plan += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    }

    plan += `💡 Travel Tips:\n`;
    plan += `• Book accommodations in advance\n`;
    plan += `• Carry valid ID proof\n`;
    plan += `• Try local cuisine\n`;
    plan += `• Respect local customs\n`;
    plan += `• Keep emergency contacts handy\n\n`;

    plan += `🎒 Packing Essentials:\n`;
    plan += `• Comfortable walking shoes\n`;
    plan += `• Light clothing\n`;
    plan += `• Sunscreen and sunglasses\n`;
    plan += `• Camera and chargers\n`;
    plan += `• First aid kit\n`;

    return plan;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              {isGenerating ? (
                <Loader2 className="w-16 h-16 text-orange-500 animate-spin" />
              ) : (
                <CheckCircle2 className="w-16 h-16 text-green-500" />
              )}
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-2">
                {isGenerating ? 'Creating Your Dream Trip...' : 'Trip Plan Ready!'}
              </h2>
              <p className="text-gray-600">
                {isGenerating 
                  ? 'Our AI is crafting the perfect itinerary for you'
                  : 'Your personalized trip plan is ready to explore'
                }
              </p>
            </div>

            <div className="space-y-3">
              {generationSteps.map((step, index) => {
                const Icon = step.icon;
                const isComplete = index < currentStep;
                const isCurrent = index === currentStep;

                return (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                      isComplete
                        ? 'bg-green-50 border border-green-200'
                        : isCurrent
                        ? 'bg-orange-50 border border-orange-200'
                        : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        isComplete
                          ? 'text-green-600'
                          : isCurrent
                          ? 'text-orange-600'
                          : 'text-gray-400'
                      }`}
                    />
                    <span
                      className={`flex-1 text-left ${
                        isComplete
                          ? 'text-green-900 font-medium'
                          : isCurrent
                          ? 'text-orange-900 font-medium'
                          : 'text-gray-600'
                      }`}
                    >
                      {step.label}
                    </span>
                    {isComplete && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                    {isCurrent && <Loader2 className="w-5 h-5 text-orange-600 animate-spin" />}
                  </div>
                );
              })}
            </div>

            {!isGenerating && (
              <div className="pt-4">
                <p className="text-sm text-gray-600 mb-4">
                  Opening your trip details...
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
import { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Sparkles, MapPin, Calendar, Utensils, Camera, CheckCircle } from 'lucide-react';
import { invokeLLM } from '@/integrations/core';
import { Trip } from '@/entities';

interface TripGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripData: any;
  onComplete: (trip: any) => void;
}

export function TripGenerationModal({ isOpen, onClose, tripData, onComplete }: TripGenerationModalProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [generatedTrip, setGeneratedTrip] = useState<any>(null);

  const steps = [
    { icon: MapPin, text: 'Analyzing destination...', progress: 20 },
    { icon: Calendar, text: 'Creating itinerary...', progress: 40 },
    { icon: Utensils, text: 'Finding best restaurants...', progress: 60 },
    { icon: Camera, text: 'Selecting attractions...', progress: 80 },
    { icon: CheckCircle, text: 'Finalizing your trip...', progress: 100 },
  ];

  useEffect(() => {
    if (isOpen && tripData) {
      generateTrip();
    }
  }, [isOpen, tripData]);

  const generateTrip = async () => {
    try {
      for (const step of steps) {
        setCurrentStep(step.text);
        setProgress(step.progress);
        await new Promise((resolve) => setTimeout(resolve, 800));
      }

      // Generate AI suggestions
      try {
        const prompt = `Create a detailed travel itinerary for a trip to ${tripData.destination} for ${tripData.duration} with ${tripData.travelers} travelers. 
        
Interests: ${tripData.interests?.join(', ') || 'General sightseeing'}
Budget: ${tripData.budget || 'Moderate'}
Additional locations: ${tripData.additional_locations?.join(', ') || 'None'}

Provide a comprehensive day-by-day plan with activities, dining suggestions, and travel tips.`;

        const aiSuggestions = await invokeLLM({
          prompt,
          add_context_from_internet: true,
        });

        const updatedTrip = {
          ...tripData,
          ai_suggestions: aiSuggestions as string,
        };

        // Update in database if it has an ID
        if (tripData.id) {
          await Trip.update(tripData.id, { ai_suggestions: aiSuggestions as string });
        }

        setGeneratedTrip(updatedTrip);
        setTimeout(() => {
          onComplete(updatedTrip);
        }, 500);
      } catch (err) {
        console.error('Error generating AI suggestions:', err);
        // Continue without AI suggestions
        setGeneratedTrip(tripData);
        setTimeout(() => {
          onComplete(tripData);
        }, 500);
      }
    } catch (err) {
      console.error('Error in trip generation:', err);
      onComplete(tripData);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <div className="text-center py-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center animate-pulse">
            <Sparkles className="w-10 h-10 text-white" />
          </div>

          <h3 className="text-2xl font-bold mb-2">Creating Your Perfect Trip</h3>
          <p className="text-gray-600 mb-8">SAFAR AI is planning your journey...</p>

          <div className="space-y-6">
            <Progress value={progress} className="h-2" />

            <div className="space-y-3">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isActive = currentStep === step.text;
                const isComplete = progress > step.progress;

                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-orange-50 border-2 border-orange-500'
                        : isComplete
                        ? 'bg-green-50'
                        : 'bg-gray-50'
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        isActive
                          ? 'text-orange-600'
                          : isComplete
                          ? 'text-green-600'
                          : 'text-gray-400'
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        isActive
                          ? 'text-orange-900'
                          : isComplete
                          ? 'text-green-900'
                          : 'text-gray-600'
                      }`}
                    >
                      {step.text}
                    </span>
                    {isComplete && <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
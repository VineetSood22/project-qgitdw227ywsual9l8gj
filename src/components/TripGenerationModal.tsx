import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TripGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripData: any;
  onComplete: (trip: any) => void;
}

export function TripGenerationModal({
  isOpen,
  onClose,
  tripData,
  onComplete,
}: TripGenerationModalProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('Initializing...');
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  useEffect(() => {
    if (isOpen && tripData) {
      generateTrip();
    }
  }, [isOpen, tripData]);

  const generateFallbackTrip = () => {
    console.log('Using offline fallback trip generation');
    setIsOfflineMode(true);
    
    const steps = [
      { progress: 20, step: 'Analyzing your preferences...' },
      { progress: 40, step: 'Finding best routes...' },
      { progress: 60, step: 'Selecting accommodations...' },
      { progress: 80, step: 'Planning activities...' },
      { progress: 100, step: 'Finalizing your itinerary...' },
    ];

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < steps.length) {
        setProgress(steps[currentIndex].progress);
        setCurrentStep(steps[currentIndex].step);
        currentIndex++;
      } else {
        clearInterval(interval);
        
        // Create a basic trip plan
        const fallbackTrip = {
          ...tripData,
          ai_suggestions: generateOfflineSuggestions(tripData),
          itinerary: generateOfflineItinerary(tripData),
          accommodations: generateOfflineAccommodations(tripData),
          weather: generateOfflineWeather(tripData),
          packing_list: generateOfflinePackingList(tripData),
          transport: generateOfflineTransport(tripData),
          budget_breakdown: generateOfflineBudget(tripData),
          crowd_info: generateOfflineCrowdInfo(tripData),
          cuisine: generateOfflineCuisine(tripData),
        };

        setIsComplete(true);
        setTimeout(() => {
          onComplete(fallbackTrip);
        }, 1000);
      }
    }, 800);

    return () => clearInterval(interval);
  };

  const generateTrip = async () => {
    try {
      setProgress(0);
      setCurrentStep('Initializing...');
      setError(null);
      setIsOfflineMode(false);

      // Try to use AI
      try {
        const { invokeLLM } = await import('@/integrations/core');
        
        setProgress(20);
        setCurrentStep('Analyzing your preferences...');

        const prompt = `Create a detailed travel itinerary for a trip to ${tripData.destination} in India.
        
Trip Details:
- Duration: ${tripData.duration}
- Travelers: ${tripData.travelers}
- Budget: ${tripData.budget}
- Transport: ${tripData.transport_mode || 'flexible'}
- Additional places: ${tripData.additional_locations?.join(', ') || 'none'}

Provide a comprehensive travel plan including daily itinerary, accommodation suggestions, weather info, packing list, and local cuisine recommendations.`;

        const response = await invokeLLM({
          prompt,
          add_context_from_internet: true,
        });

        setProgress(100);
        setCurrentStep('Finalizing your itinerary...');
        setIsComplete(true);

        const completedTrip = {
          ...tripData,
          ai_suggestions: response as string,
        };

        setTimeout(() => {
          onComplete(completedTrip);
        }, 1000);
      } catch (aiError) {
        console.error('Error generating AI suggestions:', aiError);
        // Fallback to offline mode
        generateFallbackTrip();
      }
    } catch (err) {
      console.error('Error in trip generation:', err);
      setError('Unable to generate trip. Please try again.');
    }
  };

  const generateOfflineSuggestions = (data: any) => {
    return `🌟 Your ${data.duration} Adventure to ${data.destination}

Perfect for ${data.travelers} traveler${data.travelers > 1 ? 's' : ''} with a budget of ${data.budget}.

This destination offers incredible experiences including cultural heritage, natural beauty, and local cuisine. Your trip will be customized based on your preferences and travel style.`;
  };

  const generateOfflineItinerary = (data: any) => {
    const days = parseInt(data.duration) || 5;
    const itinerary = [];
    
    for (let i = 1; i <= Math.min(days, 7); i++) {
      itinerary.push({
        day: i,
        title: `Day ${i} - Exploring ${data.destination}`,
        activities: [
          { time: '9:00 AM', activity: 'Morning sightseeing', location: data.destination },
          { time: '1:00 PM', activity: 'Local cuisine lunch', location: 'Local restaurant' },
          { time: '3:00 PM', activity: 'Afternoon exploration', location: 'Popular attractions' },
          { time: '7:00 PM', activity: 'Evening leisure', location: 'Hotel/Resort' },
        ],
      });
    }
    
    return itinerary;
  };

  const generateOfflineAccommodations = (data: any) => {
    return [
      {
        name: 'Heritage Hotel',
        type: 'Hotel',
        price: '₹3,000 - ₹5,000/night',
        rating: 4.5,
        amenities: ['WiFi', 'Restaurant', 'Pool', 'Parking'],
      },
      {
        name: 'Boutique Resort',
        type: 'Resort',
        price: '₹5,000 - ₹8,000/night',
        rating: 4.7,
        amenities: ['WiFi', 'Spa', 'Restaurant', 'Pool', 'Gym'],
      },
    ];
  };

  const generateOfflineWeather = (data: any) => {
    return {
      current: 'Pleasant weather expected',
      temperature: '20-30°C',
      conditions: 'Mostly sunny with occasional clouds',
      best_time: 'October to March',
    };
  };

  const generateOfflinePackingList = (data: any) => {
    return {
      essentials: ['Comfortable walking shoes', 'Sunscreen', 'Hat/Cap', 'Water bottle', 'Camera'],
      clothing: ['Light cotton clothes', 'Jacket for evenings', 'Comfortable pants', 'Sunglasses'],
      documents: ['ID proof', 'Hotel bookings', 'Travel insurance', 'Emergency contacts'],
    };
  };

  const generateOfflineTransport = (data: any) => {
    return {
      mode: data.transport_mode || 'Train/Flight',
      local: 'Taxi, Auto-rickshaw, Local buses available',
      tips: 'Book transport in advance during peak season',
    };
  };

  const generateOfflineBudget = (data: any) => {
    const total = parseInt(data.custom_budget) || 50000;
    return {
      accommodation: Math.round(total * 0.35),
      food: Math.round(total * 0.25),
      transport: Math.round(total * 0.20),
      activities: Math.round(total * 0.15),
      miscellaneous: Math.round(total * 0.05),
    };
  };

  const generateOfflineCrowdInfo = (data: any) => {
    return {
      peak_season: 'October to March',
      crowd_level: 'Moderate',
      tips: 'Book accommodations in advance, visit popular spots early morning',
    };
  };

  const generateOfflineCuisine = (data: any) => {
    return {
      must_try: ['Local street food', 'Regional specialties', 'Traditional thali'],
      restaurants: ['Local eateries', 'Popular restaurants', 'Street food markets'],
    };
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {isComplete ? 'Trip Ready!' : 'Creating Your Perfect Trip'}
          </DialogTitle>
        </DialogHeader>

        <div className="py-8">
          {error ? (
            <div className="text-center space-y-4">
              <AlertCircle className="w-16 h-16 mx-auto text-red-500" />
              <p className="text-red-600">{error}</p>
              <Button onClick={generateTrip} className="bg-orange-500 hover:bg-orange-600">
                Try Again
              </Button>
            </div>
          ) : isComplete ? (
            <div className="text-center space-y-4">
              <CheckCircle2 className="w-16 h-16 mx-auto text-green-500" />
              <p className="text-lg font-semibold">Your trip is ready!</p>
              {isOfflineMode && (
                <p className="text-xs text-gray-500">
                  Generated in offline mode with sample data
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-center">
                <div className="relative">
                  <Sparkles className="w-16 h-16 text-orange-500 animate-pulse" />
                  <Loader2 className="w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin text-orange-600" />
                </div>
              </div>

              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-center text-sm text-gray-600">{currentStep}</p>
              </div>

              {isOfflineMode && (
                <p className="text-xs text-center text-blue-600">
                  Working in offline mode...
                </p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Loader2, CheckCircle2, AlertCircle, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
        
        // Create a comprehensive trip plan
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

      // Try to use AI with timeout
      try {
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 8000)
        );

        const aiPromise = (async () => {
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

          return await invokeLLM({
            prompt,
            add_context_from_internet: true,
          });
        })();

        const response = await Promise.race([aiPromise, timeoutPromise]);

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
      } catch (aiError: any) {
        console.log('AI generation unavailable, using offline mode:', aiError.message);
        // Automatically fallback to offline mode without showing error
        generateFallbackTrip();
      }
    } catch (err) {
      console.error('Error in trip generation:', err);
      // Fallback to offline mode
      generateFallbackTrip();
    }
  };

  const generateOfflineSuggestions = (data: any) => {
    return `🌟 Your ${data.duration} Adventure to ${data.destination}

Perfect for ${data.travelers} traveler${data.travelers > 1 ? 's' : ''} with a budget of ${data.budget}.

${data.destination} is a wonderful destination that offers incredible experiences including cultural heritage, natural beauty, and authentic local cuisine. Your trip will be customized based on your preferences and travel style.

Key Highlights:
• Explore iconic landmarks and hidden gems
• Experience authentic local culture and traditions
• Enjoy delicious regional cuisine
• Comfortable accommodations within your budget
• Flexible itinerary based on your interests

${data.additional_locations && data.additional_locations.length > 0 ? `\nAdditional Stops: ${data.additional_locations.join(', ')}` : ''}

This itinerary is designed to give you the perfect balance of sightseeing, relaxation, and cultural immersion.`;
  };

  const generateOfflineItinerary = (data: any) => {
    const days = parseInt(data.duration) || 5;
    const itinerary = [];
    
    const activities = [
      { time: '9:00 AM', activity: 'Morning sightseeing tour', location: 'Historic landmarks' },
      { time: '12:00 PM', activity: 'Local cuisine lunch', location: 'Recommended restaurant' },
      { time: '2:00 PM', activity: 'Cultural exploration', location: 'Museums & galleries' },
      { time: '5:00 PM', activity: 'Sunset viewing', location: 'Scenic viewpoint' },
      { time: '7:00 PM', activity: 'Dinner & leisure', location: 'Local market area' },
    ];

    const dayThemes = [
      'Arrival & City Orientation',
      'Heritage & Culture',
      'Nature & Adventure',
      'Local Markets & Shopping',
      'Relaxation & Leisure',
      'Hidden Gems Exploration',
      'Departure & Last Moments',
    ];
    
    for (let i = 1; i <= Math.min(days, 7); i++) {
      itinerary.push({
        day: i,
        title: `Day ${i} - ${dayThemes[i - 1] || 'Exploring ' + data.destination}`,
        activities: activities.map(act => ({
          ...act,
          location: i === 1 ? data.destination : act.location,
        })),
      });
    }
    
    return itinerary;
  };

  const generateOfflineAccommodations = (data: any) => {
    const budgetLevel = data.budget?.toLowerCase() || '';
    const isLuxury = budgetLevel.includes('75000') || budgetLevel.includes('100000');
    const isMid = budgetLevel.includes('50000') || budgetLevel.includes('75000');
    
    return [
      {
        name: isLuxury ? 'Luxury Heritage Hotel' : isMid ? 'Boutique Hotel' : 'Comfortable Hotel',
        type: 'Hotel',
        price: isLuxury ? '₹8,000 - ₹12,000/night' : isMid ? '₹3,000 - ₹5,000/night' : '₹1,500 - ₹2,500/night',
        rating: isLuxury ? 4.8 : isMid ? 4.5 : 4.2,
        amenities: isLuxury 
          ? ['WiFi', 'Spa', 'Fine Dining', 'Pool', 'Gym', 'Concierge']
          : isMid
          ? ['WiFi', 'Restaurant', 'Pool', 'Parking', 'Room Service']
          : ['WiFi', 'Restaurant', 'Parking', 'Clean Rooms'],
      },
      {
        name: isLuxury ? 'Premium Resort' : isMid ? 'Comfortable Resort' : 'Budget-Friendly Stay',
        type: isLuxury ? 'Resort' : isMid ? 'Resort' : 'Guesthouse',
        price: isLuxury ? '₹10,000 - ₹15,000/night' : isMid ? '₹4,000 - ₹6,000/night' : '₹1,000 - ₹2,000/night',
        rating: isLuxury ? 4.9 : isMid ? 4.6 : 4.3,
        amenities: isLuxury
          ? ['WiFi', 'Spa', 'Multiple Restaurants', 'Pool', 'Gym', 'Activities', 'Butler Service']
          : isMid
          ? ['WiFi', 'Restaurant', 'Pool', 'Activities', 'Garden']
          : ['WiFi', 'Breakfast', 'Clean Rooms', 'Friendly Staff'],
      },
    ];
  };

  const generateOfflineWeather = (data: any) => {
    return {
      current: 'Pleasant weather expected during your visit',
      temperature: '18-28°C',
      conditions: 'Mostly sunny with comfortable temperatures',
      best_time: 'October to March is ideal for visiting',
      what_to_expect: 'Clear skies during the day, cooler evenings',
    };
  };

  const generateOfflinePackingList = (data: any) => {
    return {
      essentials: [
        'Comfortable walking shoes',
        'Sunscreen (SPF 30+)',
        'Hat or cap',
        'Reusable water bottle',
        'Camera or smartphone',
        'Power bank',
        'First aid kit',
      ],
      clothing: [
        'Light cotton clothes',
        'Light jacket for evenings',
        'Comfortable pants/jeans',
        'Sunglasses',
        'Modest clothing for religious sites',
        'Swimwear (if applicable)',
      ],
      documents: [
        'Government ID proof',
        'Hotel booking confirmations',
        'Travel insurance',
        'Emergency contact numbers',
        'Copies of important documents',
      ],
    };
  };

  const generateOfflineTransport = (data: any) => {
    return {
      mode: data.transport_mode || 'Train/Flight + Local Transport',
      local: 'Taxi, auto-rickshaw, and local buses readily available',
      tips: 'Book transport in advance during peak season. Use ride-sharing apps for convenience.',
      getting_around: 'Most attractions are accessible by local transport. Consider hiring a car for day trips.',
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
      total: total,
    };
  };

  const generateOfflineCrowdInfo = (data: any) => {
    return {
      peak_season: 'October to March (higher crowds)',
      off_season: 'April to September (fewer tourists)',
      crowd_level: 'Moderate to High during peak season',
      tips: 'Visit popular attractions early morning or late afternoon. Book tickets online to skip queues.',
      best_days: 'Weekdays are generally less crowded than weekends',
    };
  };

  const generateOfflineCuisine = (data: any) => {
    return {
      must_try: [
        'Local street food specialties',
        'Regional thali (traditional platter)',
        'Famous local sweets',
        'Traditional breakfast items',
      ],
      restaurants: [
        'Popular local eateries',
        'Rooftop restaurants with views',
        'Street food markets',
        'Traditional dining experiences',
      ],
      dietary_notes: 'Vegetarian options widely available. Inform restaurants about dietary restrictions.',
    };
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            {isComplete ? 'Trip Ready!' : 'Creating Your Perfect Trip'}
            {isOfflineMode && !isComplete && (
              <Badge variant="outline" className="text-xs font-normal">
                <WifiOff className="w-3 h-3 mr-1" />
                Offline
              </Badge>
            )}
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
                <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                  Created in offline mode with curated recommendations
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
                <p className="text-xs text-center text-blue-600 bg-blue-50 p-2 rounded">
                  Working in offline mode with curated travel data...
                </p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
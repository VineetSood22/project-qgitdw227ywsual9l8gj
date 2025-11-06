import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { X, Plus, MapPin, Loader2 } from 'lucide-react';
import { Trip } from '@/entities';
import { useToast } from '@/hooks/use-toast';
import { invokeLLM } from '@/integrations/core';

interface TripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTripCreated: (tripData: any) => void;
}

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Andaman & Nicobar Islands'
];

export function TripModal({ isOpen, onClose, onTripCreated }: TripModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    state: '',
    destination: '',
    duration: '5 days',
    travelers: 2,
    budget: 'flexible',
    isRoadTrip: false,
    additionalLocations: [] as string[],
    transportMode: 'flight'
  });
  const [availablePlaces, setAvailablePlaces] = useState<string[]>([]);
  const [newLocation, setNewLocation] = useState('');
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleStateChange = async (state: string) => {
    setFormData(prev => ({ ...prev, state, destination: '' }));
    setIsLoadingPlaces(true);
    
    try {
      const response = await invokeLLM({
        prompt: `List the top 15-20 most famous tourist destinations, cities, districts, and places to visit in ${state}, India. Include popular hill stations, beaches, heritage sites, spiritual places, and adventure destinations. Return only the place names separated by commas, no descriptions.`,
        add_context_from_internet: true
      });
      
      const places = response.split(',').map((place: string) => place.trim()).filter(Boolean);
      setAvailablePlaces(places);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load places. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingPlaces(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.state || !formData.destination) {
      toast({
        title: "Missing Information",
        description: "Please fill in the trip name, state, and destination.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Generate comprehensive trip plan using AI
      const tripPlan = await invokeLLM({
        prompt: `Create a comprehensive travel plan for a ${formData.duration} trip to ${formData.destination}, ${formData.state}, India for ${formData.travelers} travelers with ${formData.budget} budget. Include:
        
        1. Day-by-day detailed itinerary with activities, timings, and recommendations
        2. Weather overview for the travel period
        3. Top 6-7 must-visit places with crowd meter information (best times to visit)
        4. Essential items to pack based on destination and season
        5. Transportation recommendations for ${formData.transportMode}
        
        Format the response as a detailed travel guide with practical information.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            itinerary: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  day: { type: "number" },
                  title: { type: "string" },
                  activities: { type: "array", items: { type: "string" } },
                  meals: { type: "string" },
                  accommodation: { type: "string" }
                }
              }
            },
            weather: {
              type: "object",
              properties: {
                overview: { type: "string" },
                temperature_range: { type: "string" },
                best_time: { type: "string" },
                what_to_expect: { type: "string" }
              }
            },
            places: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  best_time: { type: "string" },
                  crowd_level: { type: "string" },
                  duration: { type: "string" }
                }
              }
            },
            packing: {
              type: "object",
              properties: {
                essentials: { type: "array", items: { type: "string" } },
                clothing: { type: "array", items: { type: "string" } },
                accessories: { type: "array", items: { type: "string" } }
              }
            },
            transport: {
              type: "object",
              properties: {
                recommendations: { type: "string" },
                booking_tips: { type: "string" },
                local_transport: { type: "string" }
              }
            }
          }
        }
      });

      const tripRecord = await Trip.create({
        name: formData.name,
        destination: `${formData.destination}, ${formData.state}`,
        duration: formData.duration,
        travelers: formData.travelers,
        budget: formData.budget,
        is_road_trip: formData.isRoadTrip,
        additional_locations: formData.additionalLocations,
        ai_suggestions: JSON.stringify(tripPlan),
        status: 'planning'
      });

      toast({
        title: "Trip Generated Successfully!",
        description: `Your trip "${formData.name}" has been created with AI recommendations.`
      });

      onTripCreated({ ...tripRecord, ai_plan: tripPlan });
      onClose();
      
      // Reset form
      setFormData({
        name: '',
        state: '',
        destination: '',
        duration: '5 days',
        travelers: 2,
        budget: 'flexible',
        isRoadTrip: false,
        additionalLocations: [],
        transportMode: 'flight'
      });
      setAvailablePlaces([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate trip. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const addLocation = () => {
    if (newLocation && !formData.additionalLocations.includes(newLocation)) {
      setFormData(prev => ({
        ...prev,
        additionalLocations: [...prev.additionalLocations, newLocation]
      }));
      setNewLocation('');
    }
  };

  const removeLocation = (location: string) => {
    setFormData(prev => ({
      ...prev,
      additionalLocations: prev.additionalLocations.filter(loc => loc !== location)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">Create Your Indian Adventure</h2>
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isGenerating}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Loading Animation */}
        {isGenerating && (
          <div className="absolute inset-0 bg-white/95 flex items-center justify-center z-10 rounded-2xl">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Generating Your Perfect Trip</h3>
              <p className="text-gray-600">Our AI is crafting a personalized itinerary just for you...</p>
              <div className="mt-4 space-y-2 text-sm text-gray-500">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <span>Analyzing destinations</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse delay-100"></div>
                  <span>Planning activities</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse delay-200"></div>
                  <span>Finding best accommodations</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Trip Name */}
          <div>
            <Input
              placeholder="Trip Name (e.g., Himalayan Adventure)"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="text-lg"
              disabled={isGenerating}
            />
          </div>

          {/* Where */}
          <div>
            <h3 className="font-semibold mb-3">Where in India?</h3>
            <div className="space-y-3">
              {/* State Selection */}
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-orange-600" />
                </div>
                <Select value={formData.state} onValueChange={handleStateChange} disabled={isGenerating}>
                  <SelectTrigger className="border-none shadow-none">
                    <SelectValue placeholder="Select State/UT" />
                  </SelectTrigger>
                  <SelectContent>
                    {indianStates.map((state) => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Destination Selection */}
              {formData.state && (
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-green-600" />
                  </div>
                  <Select 
                    value={formData.destination} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, destination: value }))}
                    disabled={isLoadingPlaces || isGenerating}
                  >
                    <SelectTrigger className="border-none shadow-none">
                      <SelectValue placeholder={isLoadingPlaces ? "Loading places..." : "Select Destination"} />
                    </SelectTrigger>
                    <SelectContent>
                      {availablePlaces.map((place) => (
                        <SelectItem key={place} value={place}>{place}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {isLoadingPlaces && <Loader2 className="w-4 h-4 animate-spin text-orange-500" />}
                </div>
              )}

              {/* Additional Locations */}
              {formData.destination && (
                <div className="flex items-center space-x-2">
                  <Select value={newLocation} onValueChange={setNewLocation} disabled={isGenerating}>
                    <SelectTrigger>
                      <SelectValue placeholder="Add nearby places" />
                    </SelectTrigger>
                    <SelectContent>
                      {availablePlaces.filter(place => 
                        place !== formData.destination && 
                        !formData.additionalLocations.includes(place)
                      ).map((place) => (
                        <SelectItem key={place} value={place}>{place}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={addLocation} size="sm" disabled={!newLocation || isGenerating}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {/* Additional Locations List */}
              {formData.additionalLocations.map((location) => (
                <div key={location} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">{location}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLocation(location)}
                    disabled={isGenerating}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              {/* Road Trip Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Road trip?</span>
                <Switch
                  checked={formData.isRoadTrip}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isRoadTrip: checked }))}
                  disabled={isGenerating}
                />
              </div>
            </div>
          </div>

          {/* Transport Mode */}
          <div>
            <h3 className="font-semibold mb-3">Preferred Transport</h3>
            <Select 
              value={formData.transportMode} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, transportMode: value }))}
              disabled={isGenerating}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flight">Flight</SelectItem>
                <SelectItem value="train">Train</SelectItem>
                <SelectItem value="bus">Bus</SelectItem>
                <SelectItem value="car">Car/Self Drive</SelectItem>
                <SelectItem value="mixed">Mixed Transport</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* When */}
          <div>
            <h3 className="font-semibold mb-3">Duration</h3>
            <Select 
              value={formData.duration} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}
              disabled={isGenerating}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2 days">2 days</SelectItem>
                <SelectItem value="3 days">3 days</SelectItem>
                <SelectItem value="5 days">5 days</SelectItem>
                <SelectItem value="1 week">1 week</SelectItem>
                <SelectItem value="10 days">10 days</SelectItem>
                <SelectItem value="2 weeks">2 weeks</SelectItem>
                <SelectItem value="3 weeks">3 weeks</SelectItem>
                <SelectItem value="1 month">1 month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Who */}
          <div>
            <h3 className="font-semibold mb-3">Travelers</h3>
            <Select 
              value={formData.travelers.toString()} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, travelers: parseInt(value) }))}
              disabled={isGenerating}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 traveler</SelectItem>
                <SelectItem value="2">2 travelers</SelectItem>
                <SelectItem value="3">3 travelers</SelectItem>
                <SelectItem value="4">4 travelers</SelectItem>
                <SelectItem value="5">5 travelers</SelectItem>
                <SelectItem value="6">6+ travelers</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Budget */}
          <div>
            <h3 className="font-semibold mb-3">Budget per person</h3>
            <Select 
              value={formData.budget} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, budget: value }))}
              disabled={isGenerating}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="budget">Budget (₹5,000-15,000)</SelectItem>
                <SelectItem value="moderate">Moderate (₹15,000-30,000)</SelectItem>
                <SelectItem value="comfortable">Comfortable (₹30,000-60,000)</SelectItem>
                <SelectItem value="luxury">Luxury (₹60,000+)</SelectItem>
                <SelectItem value="flexible">Flexible budget</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <Button 
            onClick={handleSubmit} 
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Trip...
              </>
            ) : (
              'Generate My Trip'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
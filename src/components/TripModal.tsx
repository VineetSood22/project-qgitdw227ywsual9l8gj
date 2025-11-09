import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { X, MapPin, Calendar, Users, DollarSign, Plane, Train, Bus, Car, Sparkles, Loader2 } from 'lucide-react';
import { invokeLLM } from '@/integrations/core';
import { useToast } from '@/hooks/use-toast';

interface TripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTripCreated: (tripData: any) => void;
}

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

const transportModes = [
  { value: 'flight', label: 'Flight', icon: Plane },
  { value: 'train', label: 'Train', icon: Train },
  { value: 'bus', label: 'Bus', icon: Bus },
  { value: 'car', label: 'Car/Road Trip', icon: Car }
];

export function TripModal({ isOpen, onClose, onTripCreated }: TripModalProps) {
  const [selectedState, setSelectedState] = useState('');
  const [famousPlaces, setFamousPlaces] = useState<any[]>([]);
  const [selectedPlaces, setSelectedPlaces] = useState<string[]>([]);
  const [fromLocation, setFromLocation] = useState('');
  const [duration, setDuration] = useState('');
  const [travelers, setTravelers] = useState('2');
  const [budget, setBudget] = useState('medium');
  const [customBudget, setCustomBudget] = useState('');
  const [transportMode, setTransportMode] = useState('flight');
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (selectedState) {
      loadFamousPlaces(selectedState);
    }
  }, [selectedState]);

  const loadFamousPlaces = async (state: string) => {
    setIsLoadingPlaces(true);
    setFamousPlaces([]);
    setSelectedPlaces([]);
    
    try {
      const response = await invokeLLM({
        prompt: `List 8-10 famous tourist places in ${state}, India. For each place provide: name, type (heritage/nature/adventure/spiritual/beach/hill station), description (1 sentence), best time to visit, and why it's famous.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            places: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  type: { type: "string" },
                  description: { type: "string" },
                  best_time: { type: "string" },
                  famous_for: { type: "string" }
                }
              }
            }
          }
        }
      });
      
      setFamousPlaces(response.places || []);
      toast({
        title: "Places Loaded!",
        description: `Found ${response.places?.length || 0} amazing places in ${state}`
      });
    } catch (error) {
      console.log('Could not load places online, using fallback:', error);
      const fallbackPlaces = generateFallbackPlaces(state);
      setFamousPlaces(fallbackPlaces);
      toast({
        title: "Places Loaded",
        description: `Showing popular destinations in ${state}`,
        variant: "default"
      });
    } finally {
      setIsLoadingPlaces(false);
    }
  };

  const generateFallbackPlaces = (state: string) => {
    const placesMap: { [key: string]: any[] } = {
      'Goa': [
        { name: 'Baga Beach', type: 'Beach', description: 'Popular beach known for water sports and nightlife', best_time: 'November to February', famous_for: 'Water sports and beach parties' },
        { name: 'Old Goa Churches', type: 'Heritage', description: 'UNESCO World Heritage Portuguese churches', best_time: 'October to March', famous_for: 'Colonial architecture' },
        { name: 'Dudhsagar Falls', type: 'Nature', description: 'Majestic four-tiered waterfall', best_time: 'July to September', famous_for: 'Scenic beauty' }
      ],
      'Rajasthan': [
        { name: 'Jaipur City Palace', type: 'Heritage', description: 'Royal palace with museums and courtyards', best_time: 'October to March', famous_for: 'Rajput architecture' },
        { name: 'Jaisalmer Fort', type: 'Heritage', description: 'Living fort in the Thar Desert', best_time: 'November to February', famous_for: 'Golden sandstone architecture' },
        { name: 'Udaipur Lake Palace', type: 'Heritage', description: 'Floating palace on Lake Pichola', best_time: 'September to March', famous_for: 'Romantic setting' }
      ],
      'Kerala': [
        { name: 'Alleppey Backwaters', type: 'Nature', description: 'Network of lagoons and lakes', best_time: 'November to February', famous_for: 'Houseboat cruises' },
        { name: 'Munnar Tea Gardens', type: 'Hill Station', description: 'Sprawling tea plantations in hills', best_time: 'September to May', famous_for: 'Tea estates and cool climate' },
        { name: 'Kovalam Beach', type: 'Beach', description: 'Crescent-shaped beach with lighthouse', best_time: 'October to March', famous_for: 'Ayurvedic treatments' }
      ]
    };

    return placesMap[state] || [
      { name: `${state} Heritage Site`, type: 'Heritage', description: 'Famous historical monument', best_time: 'October to March', famous_for: 'Cultural significance' },
      { name: `${state} Natural Wonder`, type: 'Nature', description: 'Beautiful natural landscape', best_time: 'Year round', famous_for: 'Scenic beauty' },
      { name: `${state} Spiritual Center`, type: 'Spiritual', description: 'Important pilgrimage site', best_time: 'October to March', famous_for: 'Religious importance' }
    ];
  };

  const togglePlace = (placeName: string) => {
    setSelectedPlaces(prev => 
      prev.includes(placeName) 
        ? prev.filter(p => p !== placeName)
        : [...prev, placeName]
    );
  };

  const handleCreateTrip = () => {
    if (!selectedState || selectedPlaces.length === 0 || !fromLocation || !duration) {
      toast({
        title: "Missing Information",
        description: "Please select state, places, departure city, and duration",
        variant: "destructive"
      });
      return;
    }

    const tripData = {
      name: `${selectedState} Adventure`,
      destination: selectedState,
      from_location: fromLocation,
      duration,
      travelers: parseInt(travelers),
      budget,
      custom_budget: customBudget ? parseInt(customBudget) : null,
      transport_mode: transportMode,
      additional_locations: selectedPlaces,
      status: 'planning'
    };

    onTripCreated(tripData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="fixed inset-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-orange-500 to-orange-600">
            <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-6 h-6" />
              <span>Dream Your Trip</span>
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Step 1: Select State */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-orange-500" />
                    <span>Step 1: Choose Your Destination State</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={selectedState} onValueChange={setSelectedState}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a state" />
                    </SelectTrigger>
                    <SelectContent>
                      {indianStates.map(state => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Step 2: Select Famous Places */}
              {selectedState && (
                <Card>
                  <CardHeader>
                    <CardTitle>Step 2: Select Places to Visit</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoadingPlaces ? (
                      <div className="text-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto" />
                        <p className="mt-2 text-gray-600">Loading famous places in {selectedState}...</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {famousPlaces.map((place, index) => (
                          <div
                            key={index}
                            onClick={() => togglePlace(place.name)}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                              selectedPlaces.includes(place.name)
                                ? 'border-orange-500 bg-orange-50'
                                : 'border-gray-200 hover:border-orange-300'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold">{place.name}</h4>
                                <Badge variant="outline" className="mt-1">{place.type}</Badge>
                                <p className="text-sm text-gray-600 mt-2">{place.description}</p>
                                <p className="text-xs text-gray-500 mt-1">Best time: {place.best_time}</p>
                              </div>
                              <Checkbox
                                checked={selectedPlaces.includes(place.name)}
                                className="ml-2"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {selectedPlaces.length > 0 && (
                      <div className="mt-4 p-3 bg-green-50 rounded-lg">
                        <p className="text-sm font-medium text-green-900">
                          {selectedPlaces.length} place{selectedPlaces.length > 1 ? 's' : ''} selected
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Trip Details */}
              {selectedPlaces.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Step 3: Trip Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Departing From</Label>
                        <Input
                          value={fromLocation}
                          onChange={(e) => setFromLocation(e.target.value)}
                          placeholder="e.g., Mumbai, Delhi"
                        />
                      </div>
                      <div>
                        <Label>Duration</Label>
                        <Input
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                          placeholder="e.g., 5 days, 1 week"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Number of Travelers</Label>
                        <Input
                          type="number"
                          value={travelers}
                          onChange={(e) => setTravelers(e.target.value)}
                          min="1"
                        />
                      </div>
                      <div>
                        <Label>Budget Range</Label>
                        <Select value={budget} onValueChange={setBudget}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="budget">Budget (₹10k-25k)</SelectItem>
                            <SelectItem value="medium">Medium (₹25k-50k)</SelectItem>
                            <SelectItem value="luxury">Luxury (₹50k+)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>Preferred Transport Mode</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                        {transportModes.map(mode => {
                          const Icon = mode.icon;
                          return (
                            <div
                              key={mode.value}
                              onClick={() => setTransportMode(mode.value)}
                              className={`p-3 border-2 rounded-lg cursor-pointer text-center transition-all ${
                                transportMode === mode.value
                                  ? 'border-orange-500 bg-orange-50'
                                  : 'border-gray-200 hover:border-orange-300'
                              }`}
                            >
                              <Icon className="w-6 h-6 mx-auto mb-1" />
                              <p className="text-sm font-medium">{mode.label}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t p-6 bg-gray-50">
            <div className="max-w-4xl mx-auto flex justify-between items-center">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateTrip}
                disabled={!selectedState || selectedPlaces.length === 0 || !fromLocation || !duration}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Generate Trip Plan
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
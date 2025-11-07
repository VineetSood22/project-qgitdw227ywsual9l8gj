import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { X, Plus, MapPin, Loader2, DollarSign } from 'lucide-react';
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

// Fallback destinations for each state
const stateDestinations: Record<string, string[]> = {
  'Himachal Pradesh': ['Shimla', 'Manali', 'Dharamshala', 'Kullu', 'Kasol', 'Spiti Valley', 'Dalhousie', 'Mcleodganj', 'Bir Billing', 'Kasauli'],
  'Rajasthan': ['Jaipur', 'Udaipur', 'Jodhpur', 'Jaisalmer', 'Pushkar', 'Mount Abu', 'Bikaner', 'Ajmer', 'Ranthambore', 'Chittorgarh'],
  'Kerala': ['Munnar', 'Alleppey', 'Kochi', 'Wayanad', 'Thekkady', 'Kovalam', 'Varkala', 'Kumarakom', 'Vagamon', 'Athirapally'],
  'Goa': ['North Goa', 'South Goa', 'Panjim', 'Calangute', 'Baga', 'Anjuna', 'Palolem', 'Arambol', 'Candolim', 'Vagator'],
  'Uttarakhand': ['Nainital', 'Mussoorie', 'Rishikesh', 'Haridwar', 'Auli', 'Jim Corbett', 'Dehradun', 'Ranikhet', 'Almora', 'Chopta'],
  'Maharashtra': ['Mumbai', 'Pune', 'Lonavala', 'Mahabaleshwar', 'Nashik', 'Aurangabad', 'Alibaug', 'Matheran', 'Kolhapur', 'Shirdi'],
  'Karnataka': ['Bangalore', 'Mysore', 'Coorg', 'Hampi', 'Gokarna', 'Chikmagalur', 'Udupi', 'Mangalore', 'Badami', 'Kabini'],
  'Tamil Nadu': ['Chennai', 'Ooty', 'Kodaikanal', 'Madurai', 'Rameswaram', 'Kanyakumari', 'Pondicherry', 'Mahabalipuram', 'Thanjavur', 'Coimbatore'],
  'West Bengal': ['Kolkata', 'Darjeeling', 'Kalimpong', 'Sundarbans', 'Digha', 'Mandarmani', 'Shantiniketan', 'Dooars', 'Murshidabad', 'Siliguri'],
  'Jammu & Kashmir': ['Srinagar', 'Gulmarg', 'Pahalgam', 'Sonamarg', 'Leh', 'Jammu', 'Patnitop', 'Yusmarg', 'Doodhpathri', 'Aru Valley'],
  'Ladakh': ['Leh', 'Nubra Valley', 'Pangong Lake', 'Tso Moriri', 'Khardung La', 'Zanskar', 'Kargil', 'Lamayuru', 'Diskit', 'Hanle'],
  'Gujarat': ['Ahmedabad', 'Gir National Park', 'Rann of Kutch', 'Dwarka', 'Somnath', 'Vadodara', 'Saputara', 'Diu', 'Champaner', 'Statue of Unity'],
  'Andhra Pradesh': ['Visakhapatnam', 'Tirupati', 'Araku Valley', 'Vijayawada', 'Amaravati', 'Ananthagiri Hills', 'Horsley Hills', 'Nagarjuna Sagar', 'Srisailam', 'Gandikota'],
  'Telangana': ['Hyderabad', 'Warangal', 'Ramoji Film City', 'Nagarjuna Sagar', 'Khammam', 'Nizamabad', 'Medak', 'Ananthagiri Hills', 'Pochampally', 'Yadagirigutta'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Khajuraho', 'Pachmarhi', 'Ujjain', 'Gwalior', 'Orchha', 'Sanchi', 'Kanha National Park', 'Bandhavgarh'],
  'Odisha': ['Puri', 'Bhubaneswar', 'Konark', 'Chilika Lake', 'Gopalpur', 'Simlipal', 'Cuttack', 'Dhauli', 'Raghurajpur', 'Chandipur'],
  'Assam': ['Guwahati', 'Kaziranga', 'Majuli', 'Tezpur', 'Jorhat', 'Sivasagar', 'Haflong', 'Manas National Park', 'Nameri', 'Dibru-Saikhowa'],
  'Sikkim': ['Gangtok', 'Pelling', 'Lachung', 'Lachen', 'Namchi', 'Yuksom', 'Ravangla', 'Zuluk', 'Tsomgo Lake', 'Nathula Pass'],
  'Arunachal Pradesh': ['Tawang', 'Ziro', 'Bomdila', 'Itanagar', 'Namdapha', 'Dirang', 'Pasighat', 'Mechuka', 'Bhalukpong', 'Sela Pass'],
  'Meghalaya': ['Shillong', 'Cherrapunji', 'Mawlynnong', 'Dawki', 'Mawsynram', 'Nongriat', 'Elephant Falls', 'Umiam Lake', 'Laitlum Canyon', 'Krangsuri Falls'],
  'Delhi': ['India Gate', 'Red Fort', 'Qutub Minar', 'Lotus Temple', 'Akshardham', 'Humayuns Tomb', 'Chandni Chowk', 'Connaught Place', 'Hauz Khas', 'Lodhi Garden'],
  'Punjab': ['Amritsar', 'Chandigarh', 'Ludhiana', 'Patiala', 'Jalandhar', 'Anandpur Sahib', 'Kapurthala', 'Pathankot', 'Ropar', 'Bathinda'],
  'Haryana': ['Gurgaon', 'Faridabad', 'Kurukshetra', 'Panchkula', 'Ambala', 'Karnal', 'Panipat', 'Morni Hills', 'Surajkund', 'Sultanpur'],
  'Bihar': ['Patna', 'Bodh Gaya', 'Nalanda', 'Rajgir', 'Vaishali', 'Gaya', 'Muzaffarpur', 'Vikramshila', 'Sasaram', 'Madhubani'],
  'Jharkhand': ['Ranchi', 'Jamshedpur', 'Netarhat', 'Deoghar', 'Hazaribagh', 'Betla National Park', 'Parasnath', 'Dalma Wildlife Sanctuary', 'Topchanchi', 'Hundru Falls'],
  'Chhattisgarh': ['Raipur', 'Chitrakote Falls', 'Bastar', 'Jagdalpur', 'Barnawapara', 'Sirpur', 'Kanger Valley', 'Tirathgarh Falls', 'Mainpat', 'Bilaspur'],
  'Uttar Pradesh': ['Agra', 'Varanasi', 'Lucknow', 'Mathura', 'Vrindavan', 'Allahabad', 'Ayodhya', 'Nainital', 'Sarnath', 'Fatehpur Sikri'],
  'Tripura': ['Agartala', 'Udaipur', 'Neermahal', 'Sepahijala', 'Unakoti', 'Jampui Hills', 'Pilak', 'Dumboor Lake', 'Kamalasagar', 'Melaghar'],
  'Manipur': ['Imphal', 'Loktak Lake', 'Kangla Fort', 'Keibul Lamjao', 'Moreh', 'Ukhrul', 'Churachandpur', 'Dzukou Valley', 'Khonghampat', 'Sendra'],
  'Mizoram': ['Aizawl', 'Champhai', 'Lunglei', 'Serchhip', 'Reiek', 'Vantawng Falls', 'Phawngpui', 'Tamdil Lake', 'Dampa Tiger Reserve', 'Murlen'],
  'Nagaland': ['Kohima', 'Dimapur', 'Mokokchung', 'Wokha', 'Dzukou Valley', 'Khonoma', 'Mon', 'Tuophema', 'Japfu Peak', 'Longwa'],
  'Andaman & Nicobar Islands': ['Port Blair', 'Havelock Island', 'Neil Island', 'Ross Island', 'Baratang', 'Diglipur', 'Radhanagar Beach', 'Cellular Jail', 'North Bay', 'Jolly Buoy']
};

const travelInterests = [
  { id: 'adventure', label: 'Adventure Sports', icon: '🏔️' },
  { id: 'culture', label: 'Culture & Heritage', icon: '🏛️' },
  { id: 'food', label: 'Food & Cuisine', icon: '🍛' },
  { id: 'nature', label: 'Nature & Wildlife', icon: '🌿' },
  { id: 'photography', label: 'Photography', icon: '📸' },
  { id: 'spiritual', label: 'Spiritual & Wellness', icon: '🕉️' },
  { id: 'shopping', label: 'Shopping', icon: '🛍️' },
  { id: 'nightlife', label: 'Nightlife & Entertainment', icon: '🎭' },
  { id: 'beach', label: 'Beach & Water Sports', icon: '🏖️' },
  { id: 'trekking', label: 'Trekking & Hiking', icon: '🥾' }
];

export function TripModal({ isOpen, onClose, onTripCreated }: TripModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    state: '',
    destination: '',
    fromLocation: '',
    duration: '5 days',
    travelers: 2,
    budget: 'custom',
    customBudget: '',
    isRoadTrip: false,
    additionalLocations: [] as string[],
    transportMode: 'flight',
    interests: [] as string[]
  });
  const [availablePlaces, setAvailablePlaces] = useState<string[]>([]);
  const [newLocation, setNewLocation] = useState('');
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleStateChange = async (state: string) => {
    setFormData(prev => ({ ...prev, state, destination: '' }));
    setIsLoadingPlaces(true);
    
    // First, set fallback destinations immediately
    const fallbackPlaces = stateDestinations[state] || [];
    setAvailablePlaces(fallbackPlaces);
    
    // Then try to get AI-enhanced list
    try {
      const response = await invokeLLM({
        prompt: `List the top 15-20 most famous tourist destinations, cities, districts, and places to visit in ${state}, India. Include popular hill stations, beaches, heritage sites, spiritual places, and adventure destinations. Return only the place names separated by commas, no descriptions.`,
        add_context_from_internet: true
      });
      
      const places = response.split(',').map((place: string) => place.trim()).filter(Boolean);
      if (places.length > 0) {
        setAvailablePlaces(places);
      }
    } catch (error) {
      console.error('Failed to load AI places, using fallback:', error);
      // Fallback is already set, so just show a subtle message
      if (fallbackPlaces.length === 0) {
        toast({
          title: "Using default destinations",
          description: "Showing popular places in " + state,
        });
      }
    } finally {
      setIsLoadingPlaces(false);
    }
  };

  const toggleInterest = (interestId: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.state || !formData.destination || !formData.fromLocation) {
      toast({
        title: "Missing Information",
        description: "Please fill in trip name, starting location, state, and destination.",
        variant: "destructive"
      });
      return;
    }

    if (formData.budget === 'custom' && !formData.customBudget) {
      toast({
        title: "Missing Budget",
        description: "Please enter your budget amount.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      const budgetInfo = formData.budget === 'custom' 
        ? `₹${formData.customBudget} per person`
        : formData.budget;

      const interestsList = formData.interests.map(id => 
        travelInterests.find(i => i.id === id)?.label
      ).filter(Boolean).join(', ');

      // Generate comprehensive trip plan using AI
      const tripPlan = await invokeLLM({
        prompt: `Create a comprehensive travel plan for a ${formData.duration} trip from ${formData.fromLocation} to ${formData.destination}, ${formData.state}, India for ${formData.travelers} travelers with budget ${budgetInfo}. 
        
        User interests: ${interestsList || 'General sightseeing'}
        Transport mode: ${formData.transportMode}
        ${formData.isRoadTrip ? 'This is a road trip.' : ''}
        ${formData.additionalLocations.length > 0 ? `Also visiting: ${formData.additionalLocations.join(', ')}` : ''}
        
        Include:
        1. Day-by-day detailed itinerary with activities, timings, and recommendations
        2. Weather overview for the travel period
        3. Top 6-7 must-visit places with crowd meter information (best times to visit, crowd levels by time of day)
        4. Famous local cuisine and food recommendations (dishes, restaurants, street food)
        5. Things to explore based on user interests
        6. Essential items to pack based on destination and season
        7. Transportation recommendations
        8. Detailed budget breakdown
        
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
                  duration: { type: "string" },
                  crowd_by_time: {
                    type: "object",
                    properties: {
                      morning: { type: "string" },
                      afternoon: { type: "string" },
                      evening: { type: "string" }
                    }
                  }
                }
              }
            },
            cuisine: {
              type: "object",
              properties: {
                must_try_dishes: { type: "array", items: { type: "string" } },
                famous_restaurants: { type: "array", items: { 
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    specialty: { type: "string" },
                    price_range: { type: "string" }
                  }
                }},
                street_food: { type: "array", items: { type: "string" } },
                food_tips: { type: "array", items: { type: "string" } }
              }
            },
            things_to_explore: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  category: { type: "string" },
                  activities: { type: "array", items: { type: "string" } },
                  tips: { type: "string" }
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
                local_transport: { type: "string" },
                rental_options: { type: "array", items: {
                  type: "object",
                  properties: {
                    type: { type: "string" },
                    price_range: { type: "string" },
                    providers: { type: "array", items: { type: "string" } }
                  }
                }}
              }
            },
            budget_breakdown: {
              type: "object",
              properties: {
                total_budget: { type: "string" },
                per_person_budget: { type: "string" },
                breakdown: {
                  type: "object",
                  properties: {
                    accommodation: { type: "string" },
                    food: { type: "string" },
                    transport: { type: "string" },
                    activities: { type: "string" },
                    shopping: { type: "string" },
                    miscellaneous: { type: "string" }
                  }
                },
                daily_budget: { type: "string" },
                budget_tips: { type: "array", items: { type: "string" } }
              }
            }
          }
        }
      });

      const tripRecord = await Trip.create({
        name: formData.name,
        destination: `${formData.destination}, ${formData.state}`,
        from_location: formData.fromLocation,
        duration: formData.duration,
        travelers: formData.travelers,
        budget: formData.budget,
        custom_budget: formData.budget === 'custom' ? parseFloat(formData.customBudget) : null,
        is_road_trip: formData.isRoadTrip,
        transport_mode: formData.transportMode,
        interests: formData.interests,
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
        fromLocation: '',
        duration: '5 days',
        travelers: 2,
        budget: 'custom',
        customBudget: '',
        isRoadTrip: false,
        additionalLocations: [],
        transportMode: 'flight',
        interests: []
      });
      setAvailablePlaces([]);
    } catch (error) {
      console.error('Trip generation error:', error);
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
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold">Create Your Indian Adventure</h2>
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isGenerating}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Trip Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Trip Name</label>
            <Input
              placeholder="e.g., Himalayan Adventure"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              disabled={isGenerating}
            />
          </div>

          {/* From Location */}
          <div>
            <label className="block text-sm font-medium mb-2">Starting From</label>
            <Input
              placeholder="e.g., Delhi, Mumbai, Bangalore"
              value={formData.fromLocation}
              onChange={(e) => setFormData(prev => ({ ...prev, fromLocation: e.target.value }))}
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
                    disabled={isLoadingPlaces || isGenerating || availablePlaces.length === 0}
                  >
                    <SelectTrigger className="border-none shadow-none">
                      <SelectValue placeholder={isLoadingPlaces ? "Loading places..." : availablePlaces.length === 0 ? "No places available" : "Select Destination"} />
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
              {formData.destination && availablePlaces.length > 0 && (
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

          {/* Travel Interests */}
          <div>
            <h3 className="font-semibold mb-3">What interests you?</h3>
            <div className="grid grid-cols-2 gap-3">
              {travelInterests.map((interest) => (
                <div 
                  key={interest.id}
                  className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-all ${
                    formData.interests.includes(interest.id) 
                      ? 'border-orange-500 bg-orange-50' 
                      : 'hover:border-gray-300'
                  }`}
                  onClick={() => !isGenerating && toggleInterest(interest.id)}
                >
                  <Checkbox 
                    checked={formData.interests.includes(interest.id)}
                    disabled={isGenerating}
                  />
                  <span className="text-xl">{interest.icon}</span>
                  <span className="text-sm">{interest.label}</span>
                </div>
              ))}
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
                <SelectItem value="flight">✈️ Flight</SelectItem>
                <SelectItem value="train">🚂 Train</SelectItem>
                <SelectItem value="bus">🚌 Bus</SelectItem>
                <SelectItem value="car">🚗 Car</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Duration & Travelers */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Duration</label>
              <Select 
                value={formData.duration} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}
                disabled={isGenerating}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3 days">3 days</SelectItem>
                  <SelectItem value="5 days">5 days</SelectItem>
                  <SelectItem value="7 days">7 days</SelectItem>
                  <SelectItem value="10 days">10 days</SelectItem>
                  <SelectItem value="2 weeks">2 weeks</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Travelers</label>
              <Input
                type="number"
                min="1"
                value={formData.travelers}
                onChange={(e) => setFormData(prev => ({ ...prev, travelers: parseInt(e.target.value) || 1 }))}
                disabled={isGenerating}
              />
            </div>
          </div>

          {/* Budget */}
          <div>
            <h3 className="font-semibold mb-3">Budget (per person)</h3>
            <div className="space-y-3">
              <Select 
                value={formData.budget} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, budget: value }))}
                disabled={isGenerating}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="budget">💰 Budget (₹10k-20k)</SelectItem>
                  <SelectItem value="moderate">💵 Moderate (₹20k-40k)</SelectItem>
                  <SelectItem value="luxury">💎 Luxury (₹40k+)</SelectItem>
                  <SelectItem value="custom">✏️ Custom Amount</SelectItem>
                </SelectContent>
              </Select>
              
              {formData.budget === 'custom' && (
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                  <Input
                    type="number"
                    placeholder="Enter amount in ₹"
                    value={formData.customBudget}
                    onChange={(e) => setFormData(prev => ({ ...prev, customBudget: e.target.value }))}
                    disabled={isGenerating}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Generate Button */}
          <Button 
            onClick={handleSubmit} 
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Your Perfect Trip...
              </>
            ) : (
              'Generate Trip Plan'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
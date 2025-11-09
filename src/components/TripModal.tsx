import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Trip } from '@/entities';
import { invokeLLM } from '@/integrations/core';
import { MapPin, Calendar, Users, IndianRupee, Plane, Train, Car, Sparkles } from 'lucide-react';

interface TripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTripCreated: (trip: any) => void;
}

const indianCities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Kolkata', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad',
  'Jaipur', 'Lucknow', 'Chandigarh', 'Kochi', 'Goa', 'Shimla', 'Manali', 'Udaipur'
];

const popularDestinations = [
  'Goa', 'Manali', 'Shimla', 'Jaipur', 'Udaipur', 'Kerala', 'Ladakh', 'Rishikesh',
  'Varanasi', 'Darjeeling', 'Ooty', 'Andaman', 'Kashmir', 'Hampi', 'Agra'
];

const interests = [
  'Adventure', 'Beach', 'Heritage', 'Spiritual', 'Wildlife', 'Hill Stations',
  'Food & Culture', 'Photography', 'Trekking', 'Relaxation'
];

export function TripModal({ isOpen, onClose, onTripCreated }: TripModalProps) {
  const [formData, setFormData] = useState({
    destination: '',
    fromLocation: '',
    duration: '',
    travelers: '2',
    budget: 'medium',
    customBudget: '',
    transportMode: 'flight',
    selectedInterests: [] as string[],
    isRoadTrip: false
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      selectedInterests: prev.selectedInterests.includes(interest)
        ? prev.selectedInterests.filter(i => i !== interest)
        : [...prev.selectedInterests, interest]
    }));
  };

  const generateOfflinePlan = (data: typeof formData) => {
    const budgetRanges = {
      budget: '₹10,000 - ₹20,000',
      medium: '₹20,000 - ₹40,000',
      luxury: '₹40,000+'
    };

    const transportInfo = {
      flight: 'Round-trip flights included',
      train: 'Train tickets in AC class',
      bus: 'Comfortable bus travel',
      rental: 'Self-drive car rental'
    };

    return {
      name: `${data.destination} Adventure`,
      destination: data.destination,
      from_location: data.fromLocation,
      duration: data.duration,
      travelers: parseInt(data.travelers),
      budget: data.budget,
      custom_budget: data.customBudget ? parseInt(data.customBudget) : null,
      transport_mode: data.transportMode,
      interests: data.selectedInterests,
      is_road_trip: data.isRoadTrip,
      status: 'planning',
      ai_suggestions: `
🎯 **Your ${data.destination} Trip Plan**

📅 **Duration:** ${data.duration}
👥 **Travelers:** ${data.travelers} people
💰 **Budget:** ${budgetRanges[data.budget as keyof typeof budgetRanges]} per person
🚗 **Transport:** ${transportInfo[data.transportMode as keyof typeof transportInfo]}

**Day-by-Day Itinerary:**

**Day 1: Arrival & Local Exploration**
- Arrive in ${data.destination}
- Check into hotel
- Evening local market visit
- Welcome dinner at local restaurant

**Day 2: Main Attractions**
- Visit top landmarks
- Cultural experiences
- Local cuisine tasting
- Sunset viewpoint

**Day 3: Adventure & Activities**
${data.selectedInterests.length > 0 ? `- ${data.selectedInterests.join(' activities\n- ')} activities` : '- Guided tours\n- Local experiences'}
- Free time for shopping

**Day 4: Departure**
- Morning leisure
- Last-minute shopping
- Departure

**Recommended Hotels:**
- Budget: Local guesthouses (₹1,500-2,500/night)
- Mid-range: 3-star hotels (₹3,000-5,000/night)
- Luxury: 5-star resorts (₹8,000+/night)

**Must-Try Food:**
- Local specialties
- Street food tours
- Traditional restaurants

**Travel Tips:**
- Best time to visit: Check seasonal weather
- Pack according to activities
- Book accommodations in advance
- Keep emergency contacts handy

**Estimated Costs:**
- Accommodation: 30-40% of budget
- Food: 20-25% of budget
- Activities: 25-30% of budget
- Transport: 15-20% of budget

*This is a sample itinerary. Customize based on your preferences!*
      `.trim()
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.destination || !formData.fromLocation || !formData.duration) {
      toast({
        title: "Missing Information",
        description: "Please fill in destination, starting location, and duration",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Try AI generation first
      let aiSuggestions = '';
      try {
        const prompt = `Create a detailed ${formData.duration} trip itinerary for ${formData.travelers} travelers going to ${formData.destination} from ${formData.fromLocation}. 
        Budget: ${formData.budget}${formData.customBudget ? ` (₹${formData.customBudget})` : ''}
        Transport: ${formData.transportMode}
        Interests: ${formData.selectedInterests.join(', ') || 'General sightseeing'}
        
        Include:
        - Day-by-day itinerary
        - Accommodation suggestions
        - Food recommendations
        - Activities based on interests
        - Budget breakdown
        - Travel tips
        
        Format with clear headings and bullet points.`;

        const response = await invokeLLM({
          prompt,
          add_context_from_internet: true
        });

        aiSuggestions = typeof response === 'string' ? response : JSON.stringify(response);
      } catch (aiError) {
        console.log('AI generation unavailable, using smart template:', aiError);
        const offlinePlan = generateOfflinePlan(formData);
        aiSuggestions = offlinePlan.ai_suggestions;
      }

      // Create trip record
      const tripData = {
        name: `${formData.destination} Trip`,
        destination: formData.destination,
        from_location: formData.fromLocation,
        duration: formData.duration,
        travelers: parseInt(formData.travelers),
        budget: formData.budget,
        custom_budget: formData.customBudget ? parseInt(formData.customBudget) : null,
        transport_mode: formData.transportMode,
        interests: formData.selectedInterests,
        is_road_trip: formData.isRoadTrip,
        ai_suggestions: aiSuggestions,
        status: 'planning'
      };

      try {
        const savedTrip = await Trip.create(tripData);
        console.log('Trip saved to database:', savedTrip);
        onTripCreated(savedTrip);
      } catch (dbError) {
        console.log('Database unavailable, using local trip:', dbError);
        // Create a local trip object with a temporary ID
        const localTrip = {
          ...tripData,
          id: `local-${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        onTripCreated(localTrip);
      }

      toast({
        title: "Trip Created! ✈️",
        description: `Your ${formData.destination} adventure is ready to explore!`
      });

      onClose();
    } catch (error) {
      console.error('Trip creation error:', error);
      toast({
        title: "Trip Created Locally",
        description: "Your trip plan is ready! (Saved locally)",
        variant: "default"
      });

      // Still create the trip locally
      const localTrip = generateOfflinePlan(formData);
      onTripCreated({
        ...localTrip,
        id: `local-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      onClose();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="w-6 h-6 text-orange-500" />
            Plan Your Dream Trip
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Destination */}
          <div className="space-y-2">
            <Label htmlFor="destination" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Where do you want to go?
            </Label>
            <Select value={formData.destination} onValueChange={(value) => setFormData(prev => ({ ...prev, destination: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select destination" />
              </SelectTrigger>
              <SelectContent>
                {popularDestinations.map(dest => (
                  <SelectItem key={dest} value={dest}>{dest}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* From Location */}
          <div className="space-y-2">
            <Label htmlFor="fromLocation">Starting from</Label>
            <Select value={formData.fromLocation} onValueChange={(value) => setFormData(prev => ({ ...prev, fromLocation: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select your city" />
              </SelectTrigger>
              <SelectContent>
                {indianCities.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Duration & Travelers */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Duration
              </Label>
              <Select value={formData.duration} onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2-3 days">2-3 days</SelectItem>
                  <SelectItem value="4-5 days">4-5 days</SelectItem>
                  <SelectItem value="6-7 days">6-7 days</SelectItem>
                  <SelectItem value="1 week">1 week</SelectItem>
                  <SelectItem value="10 days">10 days</SelectItem>
                  <SelectItem value="2 weeks">2 weeks</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="travelers" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Travelers
              </Label>
              <Input
                id="travelers"
                type="number"
                min="1"
                max="20"
                value={formData.travelers}
                onChange={(e) => setFormData(prev => ({ ...prev, travelers: e.target.value }))}
              />
            </div>
          </div>

          {/* Budget */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <IndianRupee className="w-4 h-4" />
              Budget per person
            </Label>
            <Select value={formData.budget} onValueChange={(value) => setFormData(prev => ({ ...prev, budget: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="budget">Budget (₹10,000 - ₹20,000)</SelectItem>
                <SelectItem value="medium">Medium (₹20,000 - ₹40,000)</SelectItem>
                <SelectItem value="luxury">Luxury (₹40,000+)</SelectItem>
                <SelectItem value="custom">Custom Amount</SelectItem>
              </SelectContent>
            </Select>
            {formData.budget === 'custom' && (
              <Input
                type="number"
                placeholder="Enter your budget in ₹"
                value={formData.customBudget}
                onChange={(e) => setFormData(prev => ({ ...prev, customBudget: e.target.value }))}
                className="mt-2"
              />
            )}
          </div>

          {/* Transport Mode */}
          <div className="space-y-2">
            <Label>Preferred Transport</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'flight', label: 'Flight', icon: Plane },
                { value: 'train', label: 'Train', icon: Train },
                { value: 'bus', label: 'Bus', icon: Car },
                { value: 'rental', label: 'Rental Car', icon: Car }
              ].map(({ value, label, icon: Icon }) => (
                <Button
                  key={value}
                  type="button"
                  variant={formData.transportMode === value ? 'default' : 'outline'}
                  className="justify-start"
                  onClick={() => setFormData(prev => ({ ...prev, transportMode: value }))}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {label}
                </Button>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div className="space-y-2">
            <Label>Your Interests (select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {interests.map(interest => (
                <div key={interest} className="flex items-center space-x-2">
                  <Checkbox
                    id={interest}
                    checked={formData.selectedInterests.includes(interest)}
                    onCheckedChange={() => handleInterestToggle(interest)}
                  />
                  <label htmlFor={interest} className="text-sm cursor-pointer">
                    {interest}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Road Trip Option */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="roadTrip"
              checked={formData.isRoadTrip}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isRoadTrip: checked as boolean }))}
            />
            <label htmlFor="roadTrip" className="text-sm cursor-pointer">
              This is a road trip (explore multiple locations)
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-orange-500 hover:bg-orange-600"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Creating Your Trip...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Trip Plan
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
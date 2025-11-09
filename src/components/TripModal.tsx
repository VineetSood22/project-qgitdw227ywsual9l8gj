import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Calendar, Wallet, Car, Heart, X } from 'lucide-react';
import { indiaPlacesData } from '@/lib/india-places-data';
import { Trip } from '@/entities';
import { useToast } from '@/hooks/use-toast';

interface TripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTripCreated: (trip: any) => void;
}

export function TripModal({ isOpen, onClose, onTripCreated }: TripModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    destination: '',
    from_location: '',
    duration: '',
    travelers: 2,
    budget: '',
    custom_budget: '',
    is_road_trip: false,
    transport_mode: '',
    interests: [] as string[],
    additional_locations: [] as string[],
  });

  const [selectedState, setSelectedState] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const states = Object.keys(indiaPlacesData);
  const famousPlaces = selectedState ? indiaPlacesData[selectedState] || [] : [];

  const interestOptions = [
    'Heritage & Culture',
    'Adventure',
    'Nature & Wildlife',
    'Beaches',
    'Spiritual',
    'Food & Cuisine',
    'Photography',
    'Shopping',
  ];

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const toggleLocation = (location: string) => {
    setFormData((prev) => ({
      ...prev,
      additional_locations: prev.additional_locations.includes(location)
        ? prev.additional_locations.filter((l) => l !== location)
        : [...prev.additional_locations, location],
    }));
  };

  const handleSubmit = async () => {
    if (!formData.destination || !formData.duration || !formData.travelers) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const tripData = {
        ...formData,
        name: formData.name || `Trip to ${formData.destination}`,
        status: 'planning',
      };

      const savedTrip = await Trip.create(tripData);
      
      toast({
        title: 'Trip Created!',
        description: 'Generating your personalized itinerary...',
      });

      onTripCreated(savedTrip);
    } catch (err) {
      console.error('Error creating trip:', err);
      toast({
        title: 'Error',
        description: 'Unable to save trip. Continuing with planning...',
        variant: 'destructive',
      });
      // Continue anyway with the form data
      onTripCreated(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Plan Your Dream Trip</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Trip Name */}
          <div>
            <Label htmlFor="name">Trip Name (Optional)</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Rajasthan Heritage Tour"
            />
          </div>

          {/* State Selection */}
          <div>
            <Label>Select State *</Label>
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a state" />
              </SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Destination */}
          {selectedState && (
            <div>
              <Label>Primary Destination *</Label>
              <Select
                value={formData.destination}
                onValueChange={(value) => setFormData({ ...formData, destination: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose destination" />
                </SelectTrigger>
                <SelectContent>
                  {famousPlaces.map((place) => (
                    <SelectItem key={place} value={place}>
                      {place}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Additional Locations */}
          {selectedState && famousPlaces.length > 0 && (
            <div>
              <Label>Additional Places to Visit</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {famousPlaces
                  .filter((place) => place !== formData.destination)
                  .map((place) => (
                    <Badge
                      key={place}
                      variant={formData.additional_locations.includes(place) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => toggleLocation(place)}
                    >
                      {place}
                    </Badge>
                  ))}
              </div>
            </div>
          )}

          {/* From Location */}
          <div>
            <Label htmlFor="from">Starting From</Label>
            <Input
              id="from"
              value={formData.from_location}
              onChange={(e) => setFormData({ ...formData, from_location: e.target.value })}
              placeholder="e.g., Delhi, Mumbai"
            />
          </div>

          {/* Duration and Travelers */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">Duration *</Label>
              <Select
                value={formData.duration}
                onValueChange={(value) => setFormData({ ...formData, duration: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3 days">3 days</SelectItem>
                  <SelectItem value="5 days">5 days</SelectItem>
                  <SelectItem value="7 days">7 days</SelectItem>
                  <SelectItem value="10 days">10 days</SelectItem>
                  <SelectItem value="14 days">14 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="travelers">Number of Travelers *</Label>
              <Input
                id="travelers"
                type="number"
                min="1"
                value={formData.travelers}
                onChange={(e) => setFormData({ ...formData, travelers: parseInt(e.target.value) || 1 })}
              />
            </div>
          </div>

          {/* Budget */}
          <div>
            <Label>Budget Range</Label>
            <Select
              value={formData.budget}
              onValueChange={(value) => setFormData({ ...formData, budget: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select budget" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Budget (₹20,000 - ₹40,000)">Budget (₹20,000 - ₹40,000)</SelectItem>
                <SelectItem value="Moderate (₹40,000 - ₹75,000)">Moderate (₹40,000 - ₹75,000)</SelectItem>
                <SelectItem value="Luxury (₹75,000+)">Luxury (₹75,000+)</SelectItem>
                <SelectItem value="custom">Custom Budget</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Interests */}
          <div>
            <Label>Your Interests</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {interestOptions.map((interest) => (
                <Badge
                  key={interest}
                  variant={formData.interests.includes(interest) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleInterest(interest)}
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </div>

          {/* Road Trip */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="roadtrip"
              checked={formData.is_road_trip}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_road_trip: checked as boolean })
              }
            />
            <Label htmlFor="roadtrip" className="cursor-pointer">
              This is a road trip
            </Label>
          </div>

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600"
            size="lg"
          >
            {loading ? 'Creating Trip...' : 'Generate Trip Plan'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
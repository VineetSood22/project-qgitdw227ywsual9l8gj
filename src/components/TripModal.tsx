import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { indiaPlacesData } from '@/lib/india-places-data';

interface TripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTripCreated: (tripData: any) => void;
}

export function TripModal({ isOpen, onClose, onTripCreated }: TripModalProps) {
  const [selectedState, setSelectedState] = useState('');
  const [selectedPlaces, setSelectedPlaces] = useState<string[]>([]);
  const [fromLocation, setFromLocation] = useState('');
  const [duration, setDuration] = useState('');
  const [travelers, setTravelers] = useState('');
  const [budget, setBudget] = useState('');
  const [customBudget, setCustomBudget] = useState('');
  const [isRoadTrip, setIsRoadTrip] = useState(false);
  const [transportMode, setTransportMode] = useState('');
  const { toast } = useToast();

  const handlePlaceToggle = (placeName: string) => {
    setSelectedPlaces((prev) =>
      prev.includes(placeName)
        ? prev.filter((p) => p !== placeName)
        : [...prev, placeName]
    );
  };

  const handleSubmit = () => {
    if (!selectedState || selectedPlaces.length === 0 || !duration || !travelers) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    const tripData = {
      name: `${selectedState} Adventure`,
      destination: selectedPlaces[0],
      from_location: fromLocation,
      duration,
      travelers: parseInt(travelers),
      budget: budget === 'custom' ? `₹${customBudget}` : budget,
      custom_budget: budget === 'custom' ? parseInt(customBudget) : null,
      is_road_trip: isRoadTrip,
      transport_mode: transportMode,
      additional_locations: selectedPlaces.slice(1),
      status: 'planning',
    };

    onTripCreated(tripData);
  };

  const availablePlaces = selectedState ? indiaPlacesData[selectedState] || [] : [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Plan Your Dream Trip</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* State Selection */}
          <div>
            <Label>Select State</Label>
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a state" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(indiaPlacesData).map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Places Selection */}
          {selectedState && (
            <div>
              <Label>Select Places to Visit</Label>
              <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-3">
                {availablePlaces.map((place) => (
                  <div
                    key={place.name}
                    onClick={() => handlePlaceToggle(place.name)}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedPlaces.includes(place.name)
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <Checkbox
                        checked={selectedPlaces.includes(place.name)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{place.name}</p>
                        <p className="text-xs text-gray-500">{place.type}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedPlaces.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedPlaces.map((placeName) => (
                    <Badge
                      key={placeName}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => handlePlaceToggle(placeName)}
                    >
                      {placeName}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* From Location */}
          <div>
            <Label>Starting From (Optional)</Label>
            <Input
              value={fromLocation}
              onChange={(e) => setFromLocation(e.target.value)}
              placeholder="e.g., Delhi, Mumbai"
            />
          </div>

          {/* Duration and Travelers */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Duration</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2-3 days">2-3 days</SelectItem>
                  <SelectItem value="4-5 days">4-5 days</SelectItem>
                  <SelectItem value="6-7 days">6-7 days</SelectItem>
                  <SelectItem value="1 week">1 week</SelectItem>
                  <SelectItem value="2 weeks">2 weeks</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Number of Travelers</Label>
              <Input
                type="number"
                value={travelers}
                onChange={(e) => setTravelers(e.target.value)}
                placeholder="e.g., 2"
                min="1"
              />
            </div>
          </div>

          {/* Budget */}
          <div>
            <Label>Budget Range</Label>
            <Select value={budget} onValueChange={setBudget}>
              <SelectTrigger>
                <SelectValue placeholder="Select budget" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="₹10,000 - ₹25,000">₹10,000 - ₹25,000</SelectItem>
                <SelectItem value="₹25,000 - ₹50,000">₹25,000 - ₹50,000</SelectItem>
                <SelectItem value="₹50,000 - ₹75,000">₹50,000 - ₹75,000</SelectItem>
                <SelectItem value="₹75,000 - ₹1,00,000">₹75,000 - ₹1,00,000</SelectItem>
                <SelectItem value="custom">Custom Budget</SelectItem>
              </SelectContent>
            </Select>

            {budget === 'custom' && (
              <Input
                type="number"
                value={customBudget}
                onChange={(e) => setCustomBudget(e.target.value)}
                placeholder="Enter your budget in ₹"
                className="mt-2"
              />
            )}
          </div>

          {/* Transport Mode */}
          <div>
            <Label>Preferred Transport</Label>
            <Select value={transportMode} onValueChange={setTransportMode}>
              <SelectTrigger>
                <SelectValue placeholder="Select transport mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flight">Flight</SelectItem>
                <SelectItem value="train">Train</SelectItem>
                <SelectItem value="bus">Bus</SelectItem>
                <SelectItem value="car">Car/Self-Drive</SelectItem>
                <SelectItem value="bike">Bike</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Road Trip Option */}
          <div className="flex items-center gap-2">
            <Checkbox
              checked={isRoadTrip}
              onCheckedChange={(checked) => setIsRoadTrip(checked as boolean)}
            />
            <Label className="cursor-pointer">This is a road trip</Label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-orange-500 hover:bg-orange-600"
            >
              Generate Trip Plan
            </Button>
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
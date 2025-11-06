import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { X, Plus, MapPin } from 'lucide-react';
import { Trip } from '@/entities';
import { useToast } from '@/hooks/use-toast';

interface TripModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const indianDestinations = [
  'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad',
  'Goa', 'Kerala', 'Rajasthan', 'Kashmir', 'Himachal Pradesh', 'Uttarakhand',
  'Gujarat', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Andhra Pradesh',
  'Punjab', 'Haryana', 'Uttar Pradesh', 'Madhya Pradesh', 'Odisha',
  'West Bengal', 'Assam', 'Meghalaya', 'Manipur', 'Nagaland', 'Tripura',
  'Mizoram', 'Arunachal Pradesh', 'Sikkim', 'Jharkhand', 'Chhattisgarh'
];

export function TripModal({ isOpen, onClose }: TripModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    destination: '',
    duration: '5 days',
    travelers: 2,
    budget: 'flexible',
    isRoadTrip: false,
    additionalLocations: [] as string[]
  });
  const [newLocation, setNewLocation] = useState('');
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!formData.name || !formData.destination) {
      toast({
        title: "Missing Information",
        description: "Please fill in the trip name and destination.",
        variant: "destructive"
      });
      return;
    }

    try {
      await Trip.create({
        name: formData.name,
        destination: formData.destination,
        duration: formData.duration,
        travelers: formData.travelers,
        budget: formData.budget,
        is_road_trip: formData.isRoadTrip,
        additional_locations: formData.additionalLocations,
        status: 'planning'
      });

      toast({
        title: "Trip Created!",
        description: `Your trip "${formData.name}" has been created successfully.`
      });

      onClose();
      setFormData({
        name: '',
        destination: '',
        duration: '5 days',
        travelers: 2,
        budget: 'flexible',
        isRoadTrip: false,
        additionalLocations: []
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create trip. Please try again.",
        variant: "destructive"
      });
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
          <h2 className="text-2xl font-bold">Create trip</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Trip Name */}
          <div>
            <Input
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="text-lg"
            />
          </div>

          {/* Where */}
          <div>
            <h3 className="font-semibold mb-3">Where</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-orange-600" />
                </div>
                <Select value={formData.destination} onValueChange={(value) => setFormData(prev => ({ ...prev, destination: value }))}>
                  <SelectTrigger className="border-none shadow-none">
                    <SelectValue placeholder="Select destination in India" />
                  </SelectTrigger>
                  <SelectContent>
                    {indianDestinations.map((dest) => (
                      <SelectItem key={dest} value={dest}>{dest}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.destination && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFormData(prev => ({ ...prev, destination: '' }))}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {/* Additional Locations */}
              <div className="flex items-center space-x-2">
                <Select value={newLocation} onValueChange={setNewLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Add location" />
                  </SelectTrigger>
                  <SelectContent>
                    {indianDestinations.filter(dest => 
                      dest !== formData.destination && 
                      !formData.additionalLocations.includes(dest)
                    ).map((dest) => (
                      <SelectItem key={dest} value={dest}>{dest}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={addLocation} size="sm" disabled={!newLocation}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Additional Locations List */}
              {formData.additionalLocations.map((location) => (
                <div key={location} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">{location}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLocation(location)}
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
                />
              </div>
            </div>
          </div>

          {/* When */}
          <div>
            <h3 className="font-semibold mb-3">When</h3>
            <Select value={formData.duration} onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3 days">3 days</SelectItem>
                <SelectItem value="5 days">5 days</SelectItem>
                <SelectItem value="1 week">1 week</SelectItem>
                <SelectItem value="2 weeks">2 weeks</SelectItem>
                <SelectItem value="3 weeks">3 weeks</SelectItem>
                <SelectItem value="1 month">1 month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Who */}
          <div>
            <h3 className="font-semibold mb-3">Who</h3>
            <Select value={formData.travelers.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, travelers: parseInt(value) }))}>
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
            <h3 className="font-semibold mb-3">Budget</h3>
            <Select value={formData.budget} onValueChange={(value) => setFormData(prev => ({ ...prev, budget: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="budget">Budget (₹10,000-25,000)</SelectItem>
                <SelectItem value="moderate">Moderate (₹25,000-50,000)</SelectItem>
                <SelectItem value="comfortable">Comfortable (₹50,000-1,00,000)</SelectItem>
                <SelectItem value="luxury">Luxury (₹1,00,000+)</SelectItem>
                <SelectItem value="flexible">Flexible budget</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <Button onClick={handleSubmit} className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
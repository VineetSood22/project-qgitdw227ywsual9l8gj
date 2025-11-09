import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Users, IndianRupee, Plane, Train, Car, Sparkles, X } from 'lucide-react';

interface TripDetailsProps {
  trip: any;
  onClose: () => void;
}

export function TripDetails({ trip, onClose }: TripDetailsProps) {
  const transportIcons = {
    flight: Plane,
    train: Train,
    bus: Car,
    rental: Car
  };

  const TransportIcon = transportIcons[trip.transport_mode as keyof typeof transportIcons] || Plane;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
          <CardTitle className="text-2xl pr-10">{trip.name || `${trip.destination} Trip`}</CardTitle>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {trip.destination}
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {trip.duration}
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {trip.travelers} travelers
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <TransportIcon className="w-3 h-3" />
              {trip.transport_mode}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Trip Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Starting from</p>
              <p className="font-medium">{trip.from_location}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Budget</p>
              <p className="font-medium capitalize">
                {trip.custom_budget ? `₹${trip.custom_budget.toLocaleString()}` : trip.budget}
              </p>
            </div>
          </div>

          {/* Interests */}
          {trip.interests && trip.interests.length > 0 && (
            <div>
              <p className="text-sm text-gray-500 mb-2">Interests</p>
              <div className="flex flex-wrap gap-2">
                {trip.interests.map((interest: string, index: number) => (
                  <Badge key={index} variant="outline">{interest}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* AI Suggestions */}
          {trip.ai_suggestions && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-orange-500" />
                <h3 className="font-semibold text-lg">Your Personalized Itinerary</h3>
              </div>
              <div className="prose prose-sm max-w-none bg-gray-50 p-4 rounded-lg">
                <pre className="whitespace-pre-wrap font-sans text-sm">{trip.ai_suggestions}</pre>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" className="flex-1">
              Edit Trip
            </Button>
            <Button className="flex-1 bg-orange-500 hover:bg-orange-600">
              Book Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
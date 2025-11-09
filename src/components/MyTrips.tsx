import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, MapPin, Calendar, Users, Trash2, Eye, Loader2 } from 'lucide-react';
import { Trip } from '@/entities';
import { useToast } from '@/hooks/use-toast';

interface MyTripsProps {
  isOpen: boolean;
  onClose: () => void;
  onViewTrip: (trip: any) => void;
}

export function MyTrips({ isOpen, onClose, onViewTrip }: MyTripsProps) {
  const [trips, setTrips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      loadTrips();
    }
  }, [isOpen]);

  const loadTrips = async () => {
    setIsLoading(true);
    try {
      const allTrips = await Trip.list('-created_at', 50);
      setTrips(allTrips);
    } catch (error) {
      console.log('Could not load trips from database:', error);
      setTrips([]);
      toast({
        title: "Offline Mode",
        description: "Your trips will appear here once you create them",
        variant: "default"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTrip = async (tripId: string) => {
    try {
      await Trip.delete(tripId);
      setTrips(prev => prev.filter(t => t.id !== tripId));
      toast({
        title: "Trip Deleted",
        description: "Trip has been removed successfully"
      });
    } catch (error) {
      console.log('Could not delete trip:', error);
      toast({
        title: "Delete Failed",
        description: "Could not delete trip at this time",
        variant: "destructive"
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="fixed inset-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-orange-500 to-orange-600">
            <h2 className="text-2xl font-bold text-white">My Trips</h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {isLoading ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto" />
                <p className="mt-2 text-gray-600">Loading your trips...</p>
              </div>
            ) : trips.length === 0 ? (
              <div className="text-center py-12">
                <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Trips Yet</h3>
                <p className="text-gray-500">Start planning your dream trip!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trips.map((trip) => (
                  <Card key={trip.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="truncate">{trip.name || trip.destination}</span>
                        <Badge variant={trip.status === 'saved' ? 'default' : 'secondary'}>
                          {trip.status}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{trip.destination}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{trip.duration}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Users className="w-4 h-4" />
                          <span>{trip.travelers} travelers</span>
                        </div>
                        {trip.additional_locations && trip.additional_locations.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {trip.additional_locations.slice(0, 3).map((place: string, i: number) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {place}
                              </Badge>
                            ))}
                            {trip.additional_locations.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{trip.additional_locations.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}
                        <div className="flex space-x-2 pt-3">
                          <Button
                            size="sm"
                            onClick={() => onViewTrip(trip)}
                            className="flex-1 bg-orange-500 hover:bg-orange-600"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteTrip(trip.id)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Users, Trash2, Eye, Loader2, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trip } from '@/entities';
import { offlineStorage } from '@/lib/offline-storage';
import { useToast } from '@/hooks/use-toast';

interface MyTripsProps {
  isOpen: boolean;
  onClose: () => void;
  onViewTrip: (trip: any) => void;
}

export function MyTrips({ isOpen, onClose, onViewTrip }: MyTripsProps) {
  const [trips, setTrips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      loadTrips();
    }
  }, [isOpen]);

  const loadTrips = async () => {
    setIsLoading(true);
    try {
      const onlineTrips = await Trip.list('-created_at', 50);
      setTrips(onlineTrips);
      setIsOffline(false);
    } catch (error) {
      console.log('Backend unavailable, using offline storage:', error);
      const offlineTrips = offlineStorage.getAllTrips();
      setTrips(offlineTrips);
      setIsOffline(true);
      
      if (offlineTrips.length === 0) {
        toast({
          title: "No Trips Found",
          description: "Create your first trip to get started!",
        });
      } else {
        toast({
          title: "Offline Mode",
          description: `Showing ${offlineTrips.length} saved trip${offlineTrips.length > 1 ? 's' : ''} from local storage`,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (tripId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this trip?')) return;

    try {
      if (isOffline) {
        offlineStorage.deleteTrip(tripId);
      } else {
        await Trip.delete(tripId);
      }
      
      setTrips(trips.filter(t => t.id !== tripId));
      toast({
        title: "Trip Deleted",
        description: "Your trip has been removed",
      });
    } catch (error) {
      console.error('Error deleting trip:', error);
      toast({
        title: "Error",
        description: "Could not delete trip. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="fixed inset-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-green-500 to-teal-500">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                <MapPin className="w-6 h-6" />
                <span>My Trips</span>
              </h2>
              {isOffline && (
                <Badge variant="secondary" className="mt-2 bg-yellow-500 text-white">
                  <WifiOff className="w-3 h-3 mr-1" />
                  Offline Mode
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {isLoading ? (
              <div className="text-center py-12">
                <Loader2 className="w-12 h-12 animate-spin text-green-500 mx-auto mb-4" />
                <p className="text-gray-600">Loading your trips...</p>
              </div>
            ) : trips.length === 0 ? (
              <div className="text-center py-12">
                <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Trips Yet</h3>
                <p className="text-gray-500 mb-6">Start planning your first adventure!</p>
                <Button onClick={onClose} className="bg-green-500 hover:bg-green-600">
                  Create Your First Trip
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trips.map((trip) => (
                  <Card
                    key={trip.id}
                    className="hover:shadow-xl transition-all cursor-pointer group"
                    onClick={() => onViewTrip(trip)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2 group-hover:text-green-600 transition-colors">
                            {trip.destination}
                          </h3>
                          <Badge variant="outline" className="mb-2">
                            {trip.status || 'saved'}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-green-500" />
                          <span>{trip.duration}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-green-500" />
                          <span>{trip.travelers} traveler{trip.travelers > 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-green-500" />
                          <span>From {trip.from_location}</span>
                        </div>
                      </div>

                      {trip.additional_locations && trip.additional_locations.length > 0 && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-xs text-gray-500 mb-2">Places to visit:</p>
                          <div className="flex flex-wrap gap-1">
                            {trip.additional_locations.slice(0, 3).map((place: string, i: number) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {place}
                              </Badge>
                            ))}
                            {trip.additional_locations.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{trip.additional_locations.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex space-x-2 mt-4 pt-4 border-t">
                        <Button
                          size="sm"
                          className="flex-1 bg-green-500 hover:bg-green-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewTrip(trip);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => handleDelete(trip.id, e)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
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
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, MapPin, Calendar, Users, Eye, Trash2, Heart } from 'lucide-react';
import { Trip } from '@/entities';
import { useToast } from '@/hooks/use-toast';

interface MyTripsProps {
  isOpen: boolean;
  onClose: () => void;
  onViewTrip: (trip: any) => void;
}

export function MyTrips({ isOpen, onClose, onViewTrip }: MyTripsProps) {
  const [trips, setTrips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      loadTrips();
    }
  }, [isOpen]);

  const loadTrips = async () => {
    setIsLoading(true);
    try {
      const userTrips = await Trip.list('-created_at', 50);
      setTrips(userTrips);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load trips",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTrip = async (tripId: string) => {
    try {
      await Trip.delete(tripId);
      setTrips(trips.filter(trip => trip.id !== tripId));
      toast({
        title: "Trip Deleted",
        description: "Your trip has been deleted successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete trip",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'saved': return 'bg-green-100 text-green-800';
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-orange-100 text-orange-800';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="fixed inset-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-500 to-blue-600">
            <div>
              <h2 className="text-2xl font-bold text-white">My Trips</h2>
              <p className="text-blue-100">Manage your saved travel plans</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading your trips...</p>
              </div>
            ) : trips.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No trips yet</h3>
                <p className="text-gray-500">Start planning your first adventure!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trips.map((trip) => (
                  <Card key={trip.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{trip.name}</CardTitle>
                        <Badge className={getStatusColor(trip.status)}>
                          {trip.status}
                        </Badge>
                      </div>
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
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span>Created: {new Date(trip.created_at).toLocaleDateString()}</span>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4">
                          <Button
                            size="sm"
                            onClick={() => onViewTrip(trip)}
                            className="bg-blue-500 hover:bg-blue-600"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
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
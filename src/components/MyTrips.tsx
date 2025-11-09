import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Users, Trash2, Eye, Loader2, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MyTripsProps {
  isOpen: boolean;
  onClose: () => void;
  onViewTrip: (trip: any) => void;
}

export function MyTrips({ isOpen, onClose, onViewTrip }: MyTripsProps) {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const { toast } = useToast();

  // Sample trips for demo/offline mode
  const sampleTrips = [
    {
      id: 'sample-1',
      name: 'Rajasthan Heritage Tour',
      destination: 'Jaipur',
      duration: '7 days',
      travelers: 4,
      budget: '₹50,000 - ₹75,000',
      status: 'planning',
      created_at: new Date().toISOString(),
    },
    {
      id: 'sample-2',
      name: 'Kerala Backwaters Experience',
      destination: 'Alleppey',
      duration: '5 days',
      travelers: 2,
      budget: '₹30,000 - ₹50,000',
      status: 'confirmed',
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'sample-3',
      name: 'Goa Beach Vacation',
      destination: 'Goa',
      duration: '4 days',
      travelers: 6,
      budget: '₹25,000 - ₹40,000',
      status: 'completed',
      created_at: new Date(Date.now() - 172800000).toISOString(),
    },
  ];

  useEffect(() => {
    if (isOpen) {
      loadTrips();
    }
  }, [isOpen]);

  const loadTrips = async () => {
    try {
      setLoading(true);
      setIsOffline(false);

      // Try to load from database with timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 5000)
      );

      const loadPromise = (async () => {
        const { Trip } = await import('@/entities');
        return await Trip.list('-created_at', 50);
      })();

      try {
        const result = await Promise.race([loadPromise, timeoutPromise]) as any[];
        
        if (result && result.length > 0) {
          console.log('Loaded trips from database:', result.length);
          setTrips(result);
          setIsOffline(false);
        } else {
          // No trips in database, show samples
          console.log('No trips found, showing samples');
          setTrips(sampleTrips);
          setIsOffline(false);
        }
      } catch (networkError) {
        // Network error - use offline mode
        console.log('Network error, switching to offline mode:', networkError);
        setTrips(sampleTrips);
        setIsOffline(true);
        
        toast({
          title: 'Working Offline',
          description: 'Showing sample trips. Your saved trips will appear when connection is restored.',
          variant: 'default',
        });
      }
    } catch (err) {
      console.error('Error loading trips:', err);
      setTrips(sampleTrips);
      setIsOffline(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (tripId: string) => {
    if (tripId.startsWith('sample-')) {
      toast({
        title: 'Demo Mode',
        description: 'Sample trips cannot be deleted. Create your own trips to manage them!',
        variant: 'destructive',
      });
      return;
    }

    if (isOffline) {
      toast({
        title: 'Offline Mode',
        description: 'Cannot delete trips while offline. Please check your connection.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { Trip } = await import('@/entities');
      await Trip.delete(tripId);
      toast({
        title: 'Trip Deleted',
        description: 'Your trip has been removed successfully.',
      });
      loadTrips();
    } catch (err) {
      console.error('Error deleting trip:', err);
      toast({
        title: 'Error',
        description: 'Unable to delete trip. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500';
      case 'completed':
        return 'bg-blue-500';
      case 'planning':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            My Trips
            {isOffline && (
              <Badge variant="outline" className="text-xs font-normal">
                <WifiOff className="w-3 h-3 mr-1" />
                Offline
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-auto max-h-[calc(80vh-100px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
              <span className="ml-3 text-gray-600">Loading your trips...</span>
            </div>
          ) : (
            <>
              {isOffline && (
                <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-amber-900 mb-1">Working in Offline Mode</p>
                    <p className="text-sm text-amber-800">
                      Showing sample trips. Your saved trips will appear when your connection is restored.
                    </p>
                  </div>
                </div>
              )}

              {trips.length === 0 ? (
                <div className="text-center py-12">
                  <MapPin className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-600 mb-2">No trips yet</p>
                  <p className="text-sm text-gray-500">Start planning your first adventure!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {trips.map((trip) => (
                    <Card key={trip.id} className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">
                            {trip.name || trip.destination}
                          </h3>
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span>{trip.destination}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{trip.duration}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              <span>{trip.travelers} travelers</span>
                            </div>
                          </div>
                        </div>
                        <Badge className={`${getStatusColor(trip.status)} text-white capitalize`}>
                          {trip.status || 'planning'}
                        </Badge>
                      </div>

                      {trip.budget && (
                        <p className="text-sm text-gray-600 mb-4">
                          Budget: <strong>{trip.budget}</strong>
                        </p>
                      )}

                      <div className="flex gap-2">
                        <Button
                          onClick={() => onViewTrip(trip)}
                          className="flex-1 bg-orange-500 hover:bg-orange-600"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        <Button
                          onClick={() => handleDelete(trip.id)}
                          variant="outline"
                          size="icon"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          disabled={isOffline}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
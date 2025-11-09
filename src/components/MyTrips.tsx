import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trip } from '@/entities';
import { MapPin, Calendar, Users, Trash2, Eye, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MyTripsProps {
  isOpen: boolean;
  onClose: () => void;
  onViewTrip: (trip: any) => void;
}

export function MyTrips({ isOpen, onClose, onViewTrip }: MyTripsProps) {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      loadTrips();
    }
  }, [isOpen]);

  const loadTrips = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await Trip.list('-created_at', 50);
      setTrips(result || []);
    } catch (err) {
      console.error('Error loading trips:', err);
      setError('Unable to load trips. Please check your connection.');
      // Show sample trips for demo
      setTrips([
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
          name: 'Kerala Backwaters',
          destination: 'Alleppey',
          duration: '5 days',
          travelers: 2,
          budget: '₹30,000 - ₹50,000',
          status: 'confirmed',
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (tripId: string) => {
    try {
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
          <DialogTitle className="text-2xl font-bold">My Trips</DialogTitle>
        </DialogHeader>

        <div className="overflow-auto max-h-[calc(80vh-100px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
              <span className="ml-3 text-gray-600">Loading your trips...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">{error}</p>
              <p className="text-sm text-gray-500">Showing sample trips for demonstration</p>
            </div>
          ) : trips.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600 mb-2">No trips yet</p>
              <p className="text-sm text-gray-500">Start planning your first adventure!</p>
            </div>
          ) : null}

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
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trip } from '@/entities';
import { MapPin, Calendar, Users, Plane, RefreshCw } from 'lucide-react';
import { TripDetails } from './TripDetails';

const fallbackTrips = [
  {
    id: 'sample-1',
    name: 'Goa Beach Getaway',
    destination: 'Goa',
    from_location: 'Mumbai',
    duration: '4-5 days',
    travelers: 2,
    budget: 'medium',
    transport_mode: 'flight',
    interests: ['Beach', 'Food & Culture', 'Relaxation'],
    status: 'planning',
    created_at: new Date().toISOString(),
    ai_suggestions: `🎯 **Your Goa Beach Getaway**

📅 **Duration:** 4-5 days
👥 **Travelers:** 2 people
💰 **Budget:** ₹20,000 - ₹40,000 per person

**Day 1: Arrival & North Goa**
- Arrive at Goa Airport
- Check into beach resort
- Evening at Baga Beach
- Dinner at beach shack

**Day 2: Beach Hopping**
- Morning at Calangute Beach
- Water sports activities
- Lunch at Anjuna
- Sunset at Vagator Beach

**Day 3: South Goa Exploration**
- Visit Palolem Beach
- Dolphin watching tour
- Cabo de Rama Fort
- Beachside dinner

**Day 4: Culture & Shopping**
- Old Goa churches
- Spice plantation tour
- Flea market shopping
- Farewell dinner

**Recommended Hotels:**
- Beach resorts: ₹3,000-5,000/night
- Beachside cottages available

**Must-Try Food:**
- Goan fish curry
- Bebinca dessert
- Beach shack seafood`
  }
];

export function MyTrips() {
  const [trips, setTrips] = useState<any[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const userTrips = await Trip.list('-created_at', 50);
      console.log('Loaded trips from database:', userTrips);
      if (userTrips && userTrips.length > 0) {
        setTrips(userTrips);
      } else {
        console.log('No trips in database, using sample trips');
        setTrips(fallbackTrips);
      }
    } catch (error) {
      console.log('Database unavailable, using sample trips:', error);
      setTrips(fallbackTrips);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your trips...</p>
        </div>
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12">
          <Plane className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No trips yet</h3>
          <p className="text-gray-600">Start planning your dream vacation!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">My Trips</h2>
        {hasError && (
          <Button variant="outline" size="sm" onClick={loadTrips}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.map((trip) => (
          <Card key={trip.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedTrip(trip)}>
            <CardHeader>
              <CardTitle className="text-lg">{trip.name || `${trip.destination} Trip`}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{trip.destination}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span>{trip.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-gray-500" />
                <span>{trip.travelers} travelers</span>
              </div>
              {trip.interests && trip.interests.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {trip.interests.slice(0, 3).map((interest: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {interest}
                    </Badge>
                  ))}
                </div>
              )}
              <Button className="w-full bg-orange-500 hover:bg-orange-600 mt-4">
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedTrip && (
        <TripDetails trip={selectedTrip} onClose={() => setSelectedTrip(null)} />
      )}
    </div>
  );
}
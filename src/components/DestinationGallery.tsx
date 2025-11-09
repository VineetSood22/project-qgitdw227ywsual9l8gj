import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Destination } from '@/entities';
import { MapPin, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const fallbackDestinations = [
  {
    id: '1',
    name: 'Shimla',
    state: 'Himachal Pradesh',
    region: 'North',
    type: 'Hill Station',
    description: 'The Queen of Hills, known for colonial architecture and scenic beauty',
    image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&q=80',
    best_time_to_visit: 'March to June',
    popular_attractions: ['Mall Road', 'Jakhu Temple', 'Christ Church'],
    activities: ['Trekking', 'Skiing', 'Toy Train Ride']
  },
  {
    id: '2',
    name: 'Udaipur',
    state: 'Rajasthan',
    region: 'West',
    type: 'Heritage',
    description: 'City of Lakes with magnificent palaces and rich cultural heritage',
    image_url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&q=80',
    best_time_to_visit: 'October to March',
    popular_attractions: ['City Palace', 'Lake Pichola', 'Jag Mandir'],
    activities: ['Boat rides', 'Palace tours', 'Cultural shows']
  },
  {
    id: '3',
    name: 'Munnar',
    state: 'Kerala',
    region: 'South',
    type: 'Hill Station',
    description: 'Lush tea gardens and misty mountains in Gods Own Country',
    image_url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80',
    best_time_to_visit: 'September to May',
    popular_attractions: ['Tea Gardens', 'Eravikulam National Park', 'Mattupetty Dam'],
    activities: ['Tea plantation tours', 'Trekking', 'Wildlife spotting']
  },
  {
    id: '4',
    name: 'Rishikesh',
    state: 'Uttarakhand',
    region: 'North',
    type: 'Spiritual & Adventure',
    description: 'Yoga capital of the world on the banks of holy Ganges',
    image_url: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80',
    best_time_to_visit: 'February to May',
    popular_attractions: ['Laxman Jhula', 'Ram Jhula', 'Beatles Ashram'],
    activities: ['River rafting', 'Yoga', 'Bungee jumping', 'Camping']
  },
  {
    id: '5',
    name: 'Hampi',
    state: 'Karnataka',
    region: 'South',
    type: 'Heritage',
    description: 'Ancient ruins of Vijayanagara Empire, a UNESCO World Heritage Site',
    image_url: 'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=600&q=80',
    best_time_to_visit: 'October to February',
    popular_attractions: ['Virupaksha Temple', 'Vittala Temple', 'Stone Chariot'],
    activities: ['Temple tours', 'Rock climbing', 'Coracle rides']
  },
  {
    id: '6',
    name: 'Darjeeling',
    state: 'West Bengal',
    region: 'East',
    type: 'Hill Station',
    description: 'Famous for tea gardens and stunning views of Kanchenjunga',
    image_url: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=600&q=80',
    best_time_to_visit: 'March to May',
    popular_attractions: ['Tiger Hill', 'Batasia Loop', 'Tea Gardens'],
    activities: ['Toy train ride', 'Tea tasting', 'Monastery visits']
  },
  {
    id: '7',
    name: 'Andaman Islands',
    state: 'Andaman & Nicobar Islands',
    region: 'South',
    type: 'Beach',
    description: 'Pristine beaches, coral reefs, and crystal-clear waters',
    image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80',
    best_time_to_visit: 'October to May',
    popular_attractions: ['Radhanagar Beach', 'Cellular Jail', 'Ross Island'],
    activities: ['Scuba diving', 'Snorkeling', 'Island hopping']
  },
  {
    id: '8',
    name: 'Jaisalmer',
    state: 'Rajasthan',
    region: 'West',
    type: 'Desert',
    description: 'Golden city with magnificent fort and sand dunes',
    image_url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&q=80',
    best_time_to_visit: 'November to February',
    popular_attractions: ['Jaisalmer Fort', 'Sam Sand Dunes', 'Patwon Ki Haveli'],
    activities: ['Camel safari', 'Desert camping', 'Cultural performances']
  }
];

export function DestinationGallery() {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    loadDestinations();
  }, []);

  const loadDestinations = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const allDestinations = await Destination.list('-created_at', 20);
      console.log('Loaded destinations from database:', allDestinations);
      if (allDestinations && allDestinations.length > 0) {
        setDestinations(allDestinations);
      } else {
        console.log('No destinations in database, using fallback destinations');
        setDestinations(fallbackDestinations);
      }
    } catch (error) {
      console.log('Database temporarily unavailable, using fallback destinations:', error);
      setDestinations(fallbackDestinations);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    loadDestinations();
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Discovering destinations...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Explore Incredible India</h2>
          <p className="text-gray-600">Discover the diverse beauty and rich culture of India</p>
          {hasError && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <p className="text-sm text-amber-600">Showing sample destinations</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRetry}
                className="text-xs"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Retry
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((destination) => (
            <Card key={destination.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={destination.image_url} 
                  alt={destination.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3">
                  <Badge className="bg-white/90 text-gray-800 hover:bg-white">
                    {destination.type}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-1">{destination.name}</h3>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <MapPin className="w-3 h-3 mr-1" />
                  <span>{destination.state}</span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {destination.description}
                </p>
                {destination.best_time_to_visit && (
                  <p className="text-xs text-orange-600 font-medium">
                    Best time: {destination.best_time_to_visit}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
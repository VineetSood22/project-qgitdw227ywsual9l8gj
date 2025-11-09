import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package } from '@/entities';
import { MapPin, Calendar, Star, PackageOpen, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PackagesGalleryProps {
  onSelectPackage: (pkg: any) => void;
}

const fallbackPackages = [
  {
    id: '1',
    name: 'Himalayan Paradise',
    destination: 'Manali',
    state: 'Himachal Pradesh',
    duration: '6 Days / 5 Nights',
    price_per_person: '₹25,000',
    description: 'Experience the majestic Himalayas with snow-capped peaks, adventure sports, and serene valleys.',
    highlights: ['Solang Valley adventure', 'Rohtang Pass visit', 'River rafting', 'Local culture tour'],
    category: 'Adventure',
    rating: 4.8,
    image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'
  },
  {
    id: '2',
    name: 'Royal Rajasthan',
    destination: 'Jaipur',
    state: 'Rajasthan',
    duration: '5 Days / 4 Nights',
    price_per_person: '₹22,000',
    description: 'Explore the royal heritage of Rajasthan with magnificent forts, palaces, and vibrant culture.',
    highlights: ['Amber Fort tour', 'City Palace visit', 'Hawa Mahal', 'Traditional Rajasthani dinner'],
    category: 'Heritage',
    rating: 4.7,
    image_url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80'
  },
  {
    id: '3',
    name: 'Kerala Backwaters',
    destination: 'Alleppey',
    state: 'Kerala',
    duration: '4 Days / 3 Nights',
    price_per_person: '₹18,000',
    description: 'Cruise through tranquil backwaters, enjoy Ayurvedic treatments, and savor authentic Kerala cuisine.',
    highlights: ['Houseboat stay', 'Ayurvedic spa', 'Village tour', 'Traditional Kerala meals'],
    category: 'Relaxation',
    rating: 4.9,
    image_url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80'
  },
  {
    id: '4',
    name: 'Goa Beach Escape',
    destination: 'Goa',
    state: 'Goa',
    duration: '5 Days / 4 Nights',
    price_per_person: '₹20,000',
    description: 'Relax on pristine beaches, enjoy water sports, and experience vibrant nightlife.',
    highlights: ['Beach hopping', 'Water sports', 'Fort Aguada', 'Beach parties'],
    category: 'Beach',
    rating: 4.6,
    image_url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80'
  },
  {
    id: '5',
    name: 'Spiritual Varanasi',
    destination: 'Varanasi',
    state: 'Uttar Pradesh',
    duration: '3 Days / 2 Nights',
    price_per_person: '₹15,000',
    description: 'Witness ancient rituals on the Ganges, explore temples, and experience spiritual awakening.',
    highlights: ['Ganga Aarti', 'Temple tours', 'Boat ride', 'Sarnath visit'],
    category: 'Spiritual',
    rating: 4.8,
    image_url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&q=80'
  },
  {
    id: '6',
    name: 'Ladakh Adventure',
    destination: 'Leh',
    state: 'Ladakh',
    duration: '7 Days / 6 Nights',
    price_per_person: '₹35,000',
    description: 'Journey through the highest motorable roads, pristine lakes, and Buddhist monasteries.',
    highlights: ['Pangong Lake', 'Nubra Valley', 'Khardung La Pass', 'Monastery visits'],
    category: 'Adventure',
    rating: 4.9,
    image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80'
  }
];

export function PackagesGallery({ onSelectPackage }: PackagesGalleryProps) {
  const [packages, setPackages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const allPackages = await Package.list('-rating', 20);
      console.log('Loaded packages from database:', allPackages);
      if (allPackages && allPackages.length > 0) {
        setPackages(allPackages);
      } else {
        console.log('No packages in database, using fallback packages');
        setPackages(fallbackPackages);
      }
    } catch (error) {
      console.log('Database temporarily unavailable, using fallback packages:', error);
      setPackages(fallbackPackages);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    loadPackages();
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading amazing packages...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Curated Travel Packages</h2>
          <p className="text-gray-600">Handpicked packages for unforgettable experiences across India</p>
          {hasError && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <p className="text-sm text-amber-600">Showing sample packages</p>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <Card key={pkg.id} className="hover:shadow-xl transition-shadow overflow-hidden group">
              {pkg.image_url && (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={pkg.image_url} 
                    alt={pkg.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl">{pkg.name}</CardTitle>
                  {pkg.rating && (
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold">{pkg.rating}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 mt-2">
                  <MapPin className="w-4 h-4" />
                  <span>{pkg.destination}, {pkg.state}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 line-clamp-2">{pkg.description}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>{pkg.duration}</span>
                    </div>
                    {pkg.category && <Badge variant="secondary">{pkg.category}</Badge>}
                  </div>

                  {pkg.highlights && pkg.highlights.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Highlights:</h4>
                      <ul className="space-y-1">
                        {pkg.highlights.slice(0, 3).map((highlight: string, index: number) => (
                          <li key={index} className="text-xs text-gray-600 flex items-start">
                            <span className="text-orange-500 mr-1">•</span>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="text-xs text-gray-500">Starting from</p>
                      <p className="text-lg font-bold text-orange-600">{pkg.price_per_person}</p>
                    </div>
                    <Button 
                      onClick={() => onSelectPackage(pkg)}
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      Select
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
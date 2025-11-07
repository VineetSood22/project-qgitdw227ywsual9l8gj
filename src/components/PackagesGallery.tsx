import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package } from '@/entities';
import { MapPin, Calendar, Users, Star, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PackagesGalleryProps {
  onSelectPackage: (pkg: any) => void;
}

export function PackagesGallery({ onSelectPackage }: PackagesGalleryProps) {
  const [packages, setPackages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    setIsLoading(true);
    try {
      const allPackages = await Package.list('-rating', 20);
      setPackages(allPackages);
    } catch (error) {
      console.error('Failed to load packages:', error);
      toast({
        title: "Error",
        description: "Failed to load packages",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading packages...</p>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Curated Travel Packages</h2>
          <p className="text-gray-600">Handpicked packages for unforgettable experiences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <Card key={pkg.id} className="hover:shadow-xl transition-shadow overflow-hidden">
              {pkg.image_url && (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={pkg.image_url} 
                    alt={pkg.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl">{pkg.name}</CardTitle>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold">{pkg.rating}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 mt-2">
                  <MapPin className="w-4 h-4" />
                  <span>{pkg.destination}, {pkg.state}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">{pkg.description}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>{pkg.duration}</span>
                    </div>
                    <Badge variant="secondary">{pkg.category}</Badge>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm mb-2">Highlights:</h4>
                    <ul className="space-y-1">
                      {pkg.highlights?.slice(0, 3).map((highlight: string, index: number) => (
                        <li key={index} className="text-xs text-gray-600 flex items-start">
                          <span className="text-orange-500 mr-1">•</span>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="text-xs text-gray-500">Starting from</p>
                      <p className="text-lg font-bold text-orange-600">{pkg.price_per_person}</p>
                    </div>
                    <Button 
                      onClick={() => onSelectPackage(pkg)}
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      Select Package
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
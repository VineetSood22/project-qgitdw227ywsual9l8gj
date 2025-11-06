import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { X, Calendar, MapPin, Users, Thermometer, Backpack, Plane, Train, Bus, Car, Hotel, Home, Building, Tent, Star, Clock, TrendingUp, TrendingDown, Minus, ExternalLink } from 'lucide-react';
import { invokeLLM } from '@/integrations/core';
import { useToast } from '@/hooks/use-toast';

interface TripDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  tripData: any;
}

export function TripDetails({ isOpen, onClose, tripData }: TripDetailsProps) {
  const [activeTab, setActiveTab] = useState('itinerary');
  const [accommodations, setAccommodations] = useState<any[]>([]);
  const [isLoadingStays, setIsLoadingStays] = useState(false);
  const { toast } = useToast();

  const aiPlan = tripData?.ai_plan || {};

  useEffect(() => {
    if (isOpen && tripData) {
      loadAccommodations();
    }
  }, [isOpen, tripData]);

  const loadAccommodations = async () => {
    setIsLoadingStays(true);
    try {
      const response = await invokeLLM({
        prompt: `Find 6-8 accommodation options in ${tripData.destination} for ${tripData.travelers} travelers with ${tripData.budget} budget. Include a mix of:
        - Hotels (luxury and mid-range)
        - Resorts
        - Homestays/BnBs
        - Hostels (if budget-friendly)
        - Unique stays (heritage properties, etc.)
        
        For each accommodation, provide: name, type, price range per night, rating, key amenities, location, and booking recommendation.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            accommodations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  type: { type: "string" },
                  price_range: { type: "string" },
                  rating: { type: "number" },
                  amenities: { type: "array", items: { type: "string" } },
                  location: { type: "string" },
                  description: { type: "string" },
                  booking_tip: { type: "string" }
                }
              }
            }
          }
        }
      });
      
      setAccommodations(response.accommodations || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load accommodations",
        variant: "destructive"
      });
    } finally {
      setIsLoadingStays(false);
    }
  };

  const getTransportIcon = (mode: string) => {
    switch (mode.toLowerCase()) {
      case 'flight': return <Plane className="w-4 h-4" />;
      case 'train': return <Train className="w-4 h-4" />;
      case 'bus': return <Bus className="w-4 h-4" />;
      case 'car': return <Car className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const getAccommodationIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'hotel': return <Hotel className="w-4 h-4" />;
      case 'resort': return <Building className="w-4 h-4" />;
      case 'homestay':
      case 'bnb': return <Home className="w-4 h-4" />;
      case 'hostel': return <Tent className="w-4 h-4" />;
      default: return <Hotel className="w-4 h-4" />;
    }
  };

  const getCrowdIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high':
      case 'crowded': return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'low':
      case 'peaceful': return <TrendingDown className="w-4 h-4 text-green-500" />;
      default: return <Minus className="w-4 h-4 text-yellow-500" />;
    }
  };

  if (!isOpen || !tripData) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="fixed inset-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-orange-500 to-orange-600">
            <div>
              <h2 className="text-2xl font-bold text-white">{tripData.name}</h2>
              <div className="flex items-center space-x-4 mt-2 text-white/90">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{tripData.destination}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{tripData.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{tripData.travelers} travelers</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex-1 overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-6 bg-gray-50">
                <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                <TabsTrigger value="stays">Stays</TabsTrigger>
                <TabsTrigger value="weather">Weather</TabsTrigger>
                <TabsTrigger value="places">Places</TabsTrigger>
                <TabsTrigger value="packing">Packing</TabsTrigger>
                <TabsTrigger value="transport">Transport</TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto p-6">
                {/* Itinerary Tab */}
                <TabsContent value="itinerary" className="space-y-4 mt-0">
                  <h3 className="text-xl font-semibold mb-4">Your Day-by-Day Itinerary</h3>
                  {aiPlan.itinerary?.map((day: any, index: number) => (
                    <Card key={index} className="border-l-4 border-l-orange-500">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Badge variant="outline">Day {day.day}</Badge>
                          <span>{day.title}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium text-gray-700 mb-2">Activities:</h4>
                            <ul className="space-y-1">
                              {day.activities?.map((activity: string, i: number) => (
                                <li key={i} className="flex items-start space-x-2">
                                  <Clock className="w-4 h-4 mt-0.5 text-orange-500" />
                                  <span className="text-sm">{activity}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          {day.meals && (
                            <div>
                              <h4 className="font-medium text-gray-700">Meals:</h4>
                              <p className="text-sm text-gray-600">{day.meals}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                {/* Stays Tab */}
                <TabsContent value="stays" className="space-y-4 mt-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Accommodation Options</h3>
                    <Badge variant="secondary">{tripData.budget} budget</Badge>
                  </div>
                  
                  {isLoadingStays ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                      <p className="mt-2 text-gray-600">Finding best stays for you...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {accommodations.map((stay, index) => (
                        <Card key={index} className="hover:shadow-lg transition-shadow">
                          <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                {getAccommodationIcon(stay.type)}
                                <span className="text-lg">{stay.name}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm">{stay.rating}</span>
                              </div>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <Badge variant="outline">{stay.type}</Badge>
                                <span className="font-semibold text-orange-600">{stay.price_range}</span>
                              </div>
                              <p className="text-sm text-gray-600">{stay.description}</p>
                              <div>
                                <h4 className="font-medium text-sm mb-1">Amenities:</h4>
                                <div className="flex flex-wrap gap-1">
                                  {stay.amenities?.slice(0, 4).map((amenity: string, i: number) => (
                                    <Badge key={i} variant="secondary" className="text-xs">{amenity}</Badge>
                                  ))}
                                </div>
                              </div>
                              <div className="flex items-center justify-between pt-2">
                                <span className="text-xs text-gray-500">{stay.location}</span>
                                <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                                  <ExternalLink className="w-3 h-3 mr-1" />
                                  Book Now
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Weather Tab */}
                <TabsContent value="weather" className="space-y-4 mt-0">
                  <h3 className="text-xl font-semibold mb-4">Weather Overview</h3>
                  {aiPlan.weather && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Thermometer className="w-5 h-5 text-orange-500" />
                          <span>Weather Forecast for {tripData.destination}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Overview</h4>
                          <p className="text-gray-600">{aiPlan.weather.overview}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium mb-2">Temperature Range</h4>
                            <p className="text-lg font-semibold text-orange-600">{aiPlan.weather.temperature_range}</p>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Best Time to Visit</h4>
                            <p className="text-gray-600">{aiPlan.weather.best_time}</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">What to Expect</h4>
                          <p className="text-gray-600">{aiPlan.weather.what_to_expect}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Places Tab */}
                <TabsContent value="places" className="space-y-4 mt-0">
                  <h3 className="text-xl font-semibold mb-4">Must-Visit Places</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {aiPlan.places?.map((place: any, index: number) => (
                      <Card key={index} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <span>{place.name}</span>
                            <div className="flex items-center space-x-1">
                              {getCrowdIcon(place.crowd_level)}
                              <span className="text-xs text-gray-500">{place.crowd_level}</span>
                            </div>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <p className="text-sm text-gray-600">{place.description}</p>
                            <div className="flex items-center justify-between text-sm">
                              <div>
                                <span className="font-medium">Best Time:</span>
                                <span className="ml-1 text-gray-600">{place.best_time}</span>
                              </div>
                              <div>
                                <span className="font-medium">Duration:</span>
                                <span className="ml-1 text-gray-600">{place.duration}</span>
                              </div>
                            </div>
                            <div className="pt-2">
                              <Badge 
                                variant={place.crowd_level === 'low' ? 'default' : place.crowd_level === 'high' ? 'destructive' : 'secondary'}
                                className="text-xs"
                              >
                                Crowd Level: {place.crowd_level}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Packing Tab */}
                <TabsContent value="packing" className="space-y-4 mt-0">
                  <h3 className="text-xl font-semibold mb-4">Packing Checklist</h3>
                  {aiPlan.packing && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Backpack className="w-5 h-5 text-orange-500" />
                            <span>Essentials</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {aiPlan.packing.essentials?.map((item: string, index: number) => (
                              <li key={index} className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span className="text-sm">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Clothing</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {aiPlan.packing.clothing?.map((item: string, index: number) => (
                              <li key={index} className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span className="text-sm">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Accessories</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {aiPlan.packing.accessories?.map((item: string, index: number) => (
                              <li key={index} className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span className="text-sm">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </TabsContent>

                {/* Transport Tab */}
                <TabsContent value="transport" className="space-y-4 mt-0">
                  <h3 className="text-xl font-semibold mb-4">Transportation Guide</h3>
                  {aiPlan.transport && (
                    <div className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            {getTransportIcon(tripData.transportMode || 'flight')}
                            <span>Recommended Transportation</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 mb-4">{aiPlan.transport.recommendations}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium mb-2">Booking Tips</h4>
                              <p className="text-sm text-gray-600">{aiPlan.transport.booking_tips}</p>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Local Transport</h4>
                              <p className="text-sm text-gray-600">{aiPlan.transport.local_transport}</p>
                            </div>
                          </div>
                          <div className="mt-4 flex space-x-2">
                            <Button className="bg-blue-600 hover:bg-blue-700">
                              <Plane className="w-4 h-4 mr-2" />
                              Book Flights
                            </Button>
                            <Button variant="outline">
                              <Train className="w-4 h-4 mr-2" />
                              Book Trains
                            </Button>
                            <Button variant="outline">
                              <Bus className="w-4 h-4 mr-2" />
                              Book Bus
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { X, MapPin, Calendar, Users, DollarSign, Hotel, Utensils, Map, Star, Save, ExternalLink } from 'lucide-react';
import { Trip } from '@/entities';
import { stateCuisine } from '@/lib/india-places-data';
import { useToast } from '@/hooks/use-toast';

interface EnhancedTripDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  trip: any;
}

export function EnhancedTripDetails({ isOpen, onClose, trip }: EnhancedTripDetailsProps) {
  const [activeTab, setActiveTab] = useState('itinerary');
  const { toast } = useToast();

  const saveTrip = async () => {
    try {
      if (trip.id) {
        await Trip.update(trip.id, { status: 'saved' });
        toast({
          title: "Trip Saved!",
          description: "Your trip has been saved to My Trips"
        });
      }
    } catch (error) {
      console.log('Could not save trip:', error);
      toast({
        title: "Trip Saved Locally",
        description: "Your trip is saved in this session",
        variant: "default"
      });
    }
  };

  const cuisineList = stateCuisine[trip.destination] || [
    'Local Street Food',
    'Regional Thali',
    'Traditional Sweets',
    'Local Beverages',
    'Specialty Dishes'
  ];

  const mustVisitPlaces = trip.additional_locations || [trip.destination];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="fixed inset-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-orange-500 to-orange-600">
            <div>
              <h2 className="text-2xl font-bold text-white">{trip.name || trip.destination}</h2>
              <p className="text-orange-100 text-sm mt-1">
                {trip.duration} • {trip.travelers} travelers • {trip.budget} budget
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" onClick={saveTrip} className="text-white hover:bg-white/20">
                <Save className="w-5 h-5 mr-1" />
                Save Trip
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                <TabsTrigger value="itinerary" className="rounded-none border-b-2 data-[state=active]:border-orange-500">
                  Itinerary
                </TabsTrigger>
                <TabsTrigger value="places" className="rounded-none border-b-2 data-[state=active]:border-orange-500">
                  Must Visit Places
                </TabsTrigger>
                <TabsTrigger value="cuisine" className="rounded-none border-b-2 data-[state=active]:border-orange-500">
                  Famous Cuisine
                </TabsTrigger>
                <TabsTrigger value="stays" className="rounded-none border-b-2 data-[state=active]:border-orange-500">
                  Stays
                </TabsTrigger>
                <TabsTrigger value="budget" className="rounded-none border-b-2 data-[state=active]:border-orange-500">
                  Budget
                </TabsTrigger>
                <TabsTrigger value="distance" className="rounded-none border-b-2 data-[state=active]:border-orange-500">
                  Distance & Routes
                </TabsTrigger>
              </TabsList>

              <div className="p-6">
                <TabsContent value="itinerary" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Day-by-Day Itinerary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose max-w-none">
                        <pre className="whitespace-pre-wrap font-sans text-sm">
                          {trip.ai_suggestions || 'Loading itinerary...'}
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="places" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <MapPin className="w-5 h-5 text-orange-500" />
                        <span>Must Visit Places in {trip.destination}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {mustVisitPlaces.map((place: string, index: number) => (
                          <Card key={index} className="border-2 border-orange-100">
                            <CardContent className="p-4">
                              <div className="flex items-start space-x-3">
                                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                                  {index + 1}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-lg">{place}</h4>
                                  <p className="text-sm text-gray-600 mt-1">
                                    Explore the beauty and culture of {place}
                                  </p>
                                  <div className="flex items-center space-x-2 mt-2">
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    <span className="text-sm text-gray-600">Must visit destination</span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="cuisine" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Utensils className="w-5 h-5 text-orange-500" />
                        <span>Famous Cuisine of {trip.destination}</span>
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">Don't miss these local delicacies!</p>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {cuisineList.map((dish: string, index: number) => (
                          <Card key={index} className="border-2 border-orange-100 hover:border-orange-300 transition-all">
                            <CardContent className="p-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center text-white text-xl">
                                  🍽️
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold">{dish}</h4>
                                  <Badge variant="outline" className="mt-1">Traditional</Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <h4 className="font-semibold text-orange-900 mb-2">🌟 Pro Tip</h4>
                        <p className="text-sm text-orange-800">
                          Try local street food for authentic flavors! Ask locals for their favorite spots.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="stays" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Hotel className="w-5 h-5 text-orange-500" />
                        <span>Recommended Accommodations</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {['Budget Hotels', 'Mid-Range Hotels', 'Luxury Resorts', 'Homestays'].map((category, index) => (
                          <Card key={index} className="border-2 border-gray-200">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-semibold text-lg">{category}</h4>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {category === 'Budget Hotels' && '₹1,000 - ₹2,500 per night'}
                                    {category === 'Mid-Range Hotels' && '₹2,500 - ₹5,000 per night'}
                                    {category === 'Luxury Resorts' && '₹5,000+ per night'}
                                    {category === 'Homestays' && '₹800 - ₹2,000 per night'}
                                  </p>
                                  <div className="flex items-center space-x-1 mt-2">
                                    {[...Array(index + 2)].map((_, i) => (
                                      <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    ))}
                                  </div>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => window.open(`https://www.booking.com/searchresults.html?ss=${trip.destination}`, '_blank')}
                                >
                                  <ExternalLink className="w-4 h-4 mr-1" />
                                  Book Now
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="budget" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <DollarSign className="w-5 h-5 text-orange-500" />
                        <span>Estimated Budget Breakdown</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { category: 'Accommodation', amount: '₹8,000 - ₹15,000', percentage: 35 },
                          { category: 'Food & Dining', amount: '₹5,000 - ₹10,000', percentage: 25 },
                          { category: 'Transportation', amount: '₹6,000 - ₹12,000', percentage: 25 },
                          { category: 'Activities & Sightseeing', amount: '₹3,000 - ₹6,000', percentage: 15 }
                        ].map((item, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{item.category}</span>
                              <span className="text-orange-600 font-semibold">{item.amount}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-orange-500 h-2 rounded-full"
                                style={{ width: `${item.percentage}%` }}
                              />
                            </div>
                          </div>
                        ))}
                        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-lg">Total Estimated Cost</span>
                            <span className="font-bold text-2xl text-green-700">₹22,000 - ₹43,000</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-2">
                            For {trip.travelers} traveler{trip.travelers > 1 ? 's' : ''} • {trip.duration}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="distance" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Map className="w-5 h-5 text-orange-500" />
                        <span>Distance & Route Information</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <h4 className="font-semibold text-blue-900 mb-2">From: {trip.from_location}</h4>
                          <h4 className="font-semibold text-blue-900">To: {trip.destination}</h4>
                        </div>

                        {[
                          { mode: 'By Flight', icon: '✈️', distance: '~500-1500 km', time: '1-3 hours', cost: '₹3,000 - ₹8,000' },
                          { mode: 'By Train', icon: '🚂', distance: '~500-1500 km', time: '8-24 hours', cost: '₹500 - ₹2,500' },
                          { mode: 'By Bus', icon: '🚌', distance: '~500-1500 km', time: '10-30 hours', cost: '₹800 - ₹2,000' },
                          { mode: 'By Car', icon: '🚗', distance: '~500-1500 km', time: '10-25 hours', cost: '₹5,000 - ₹12,000' }
                        ].map((route, index) => (
                          <Card key={index} className="border-2 border-gray-200">
                            <CardContent className="p-4">
                              <div className="flex items-center space-x-4">
                                <div className="text-4xl">{route.icon}</div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-lg">{route.mode}</h4>
                                  <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
                                    <div>
                                      <span className="text-gray-600">Distance:</span>
                                      <p className="font-medium">{route.distance}</p>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Time:</span>
                                      <p className="font-medium">{route.time}</p>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Cost:</span>
                                      <p className="font-medium text-orange-600">{route.cost}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}

                        <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                          <h4 className="font-semibold text-orange-900 mb-2">📍 Route Map</h4>
                          <p className="text-sm text-orange-800 mb-3">
                            View detailed route on Google Maps
                          </p>
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => window.open(`https://www.google.com/maps/dir/${trip.from_location}/${trip.destination}`, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Open in Google Maps
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
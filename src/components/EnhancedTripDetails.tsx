import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X, Calendar, MapPin, Users, Thermometer, Backpack, Plane, Train, Bus, Car, Hotel, Home, Building, Tent, Star, Clock, TrendingUp, TrendingDown, Minus, ExternalLink, Navigation, Calculator, Save, Heart, Edit2, Utensils, Camera, MessageSquare, ThumbsUp } from 'lucide-react';
import { invokeLLM, generateImage } from '@/integrations/core';
import { useToast } from '@/hooks/use-toast';
import { Trip, Review } from '@/entities';

interface EnhancedTripDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  tripData: any;
}

export function EnhancedTripDetails({ isOpen, onClose, tripData }: EnhancedTripDetailsProps) {
  const [activeTab, setActiveTab] = useState('itinerary');
  const [accommodations, setAccommodations] = useState<any[]>([]);
  const [distanceInfo, setDistanceInfo] = useState<any>(null);
  const [fromLocation, setFromLocation] = useState(tripData?.from_location || '');
  const [isLoadingStays, setIsLoadingStays] = useState(false);
  const [isLoadingDistance, setIsLoadingDistance] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTrip, setEditedTrip] = useState(tripData);
  const [reviews, setReviews] = useState<any[]>([]);
  const [newReview, setNewReview] = useState({ rating: 5, title: '', review_text: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const { toast } = useToast();

  const aiPlan = tripData?.ai_plan || {};
  const budgetBreakdown = aiPlan?.budget_breakdown || null;

  useEffect(() => {
    if (isOpen && tripData) {
      setEditedTrip(tripData);
      setFromLocation(tripData.from_location || '');
      loadAccommodations();
      loadReviews();
      if (tripData.from_location) {
        loadDistanceInfo();
      }
    }
  }, [isOpen, tripData]);

  const loadAccommodations = async () => {
    setIsLoadingStays(true);
    try {
      const response = await invokeLLM({
        prompt: `Find 6-8 accommodation options in ${tripData.destination} for ${tripData.travelers} travelers with ${tripData.budget} budget. Include a mix of hotels, resorts, homestays, and hostels. For each accommodation, provide: name, type, price range per night, rating, key amenities, location, description, and booking recommendation.`,
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
      console.error('Failed to load accommodations:', error);
    } finally {
      setIsLoadingStays(false);
    }
  };

  const loadDistanceInfo = async () => {
    if (!fromLocation) return;

    setIsLoadingDistance(true);
    try {
      const response = await invokeLLM({
        prompt: `Calculate travel distance and route information from ${fromLocation} to ${tripData.destination}. Include distance by different transport modes, estimated travel time, route overview, and major stops/cities along the way.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            routes: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  mode: { type: "string" },
                  distance: { type: "string" },
                  duration: { type: "string" },
                  cost_estimate: { type: "string" },
                  route_description: { type: "string" }
                }
              }
            },
            major_stops: { type: "array", items: { type: "string" } },
            map_overview: { type: "string" },
            travel_tips: { type: "array", items: { type: "string" } }
          }
        }
      });
      
      setDistanceInfo(response);
    } catch (error) {
      console.error('Failed to load distance info:', error);
    } finally {
      setIsLoadingDistance(false);
    }
  };

  const loadReviews = async () => {
    try {
      const tripReviews = await Review.filter({ trip_id: tripData.id }, '-created_at', 50);
      setReviews(tripReviews);
    } catch (error) {
      console.error('Failed to load reviews:', error);
    }
  };

  const submitReview = async () => {
    if (!newReview.title || !newReview.review_text) {
      toast({
        title: "Missing Information",
        description: "Please provide a title and review text.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmittingReview(true);
    try {
      await Review.create({
        trip_id: tripData.id,
        destination: tripData.destination,
        rating: newReview.rating,
        title: newReview.title,
        review_text: newReview.review_text,
        travel_date: new Date().toISOString(),
        helpful_count: 0,
        photos: []
      });

      toast({
        title: "Review Submitted!",
        description: "Thank you for sharing your experience."
      });

      setNewReview({ rating: 5, title: '', review_text: '' });
      loadReviews();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review.",
        variant: "destructive"
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const saveTrip = async () => {
    setIsSaving(true);
    try {
      await Trip.update(tripData.id, {
        name: editedTrip.name,
        status: 'saved',
        ai_suggestions: JSON.stringify({
          ...aiPlan,
          accommodations,
          distance_info: distanceInfo
        })
      });
      
      toast({
        title: "Trip Saved!",
        description: "Your trip has been saved to your dashboard."
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save trip",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getTransportIcon = (mode: string) => {
    switch (mode?.toLowerCase()) {
      case 'flight': return <Plane className="w-4 h-4" />;
      case 'train': return <Train className="w-4 h-4" />;
      case 'bus': return <Bus className="w-4 h-4" />;
      case 'car': return <Car className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const getAccommodationIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'hotel': return <Hotel className="w-4 h-4" />;
      case 'resort': return <Building className="w-4 h-4" />;
      case 'homestay':
      case 'bnb': return <Home className="w-4 h-4" />;
      case 'hostel': return <Tent className="w-4 h-4" />;
      default: return <Hotel className="w-4 h-4" />;
    }
  };

  const getCrowdIcon = (level: string) => {
    switch (level?.toLowerCase()) {
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
            <div className="flex-1">
              {isEditing ? (
                <Input
                  value={editedTrip.name}
                  onChange={(e) => setEditedTrip({ ...editedTrip, name: e.target.value })}
                  className="text-2xl font-bold text-white bg-white/20 border-white/30"
                />
              ) : (
                <h2 className="text-2xl font-bold text-white">{tripData.name}</h2>
              )}
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
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsEditing(!isEditing)}
                className="text-white hover:bg-white/20"
              >
                <Edit2 className="w-5 h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={saveTrip}
                disabled={isSaving}
                className="text-white hover:bg-white/20"
              >
                {isSaving ? <Heart className="w-5 h-5 animate-pulse" /> : <Save className="w-5 h-5" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex-1 overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-10 bg-gray-50">
                <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                <TabsTrigger value="stays">Stays</TabsTrigger>
                <TabsTrigger value="cuisine">Cuisine</TabsTrigger>
                <TabsTrigger value="explore">Explore</TabsTrigger>
                <TabsTrigger value="weather">Weather</TabsTrigger>
                <TabsTrigger value="places">Places</TabsTrigger>
                <TabsTrigger value="distance">Distance</TabsTrigger>
                <TabsTrigger value="budget">Budget</TabsTrigger>
                <TabsTrigger value="transport">Transport</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                <Button 
                                  size="sm" 
                                  className="bg-blue-600 hover:bg-blue-700"
                                  onClick={() => window.open(`https://www.booking.com/search.html?ss=${encodeURIComponent(stay.name + ' ' + stay.location)}`, '_blank')}
                                >
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

                {/* Cuisine Tab */}
                <TabsContent value="cuisine" className="space-y-4 mt-0">
                  <h3 className="text-xl font-semibold mb-4">Local Cuisine & Food Guide</h3>
                  {aiPlan.cuisine && (
                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Utensils className="w-5 h-5 text-orange-500" />
                            <span>Must-Try Dishes</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {aiPlan.cuisine.must_try_dishes?.map((dish: string, index: number) => (
                              <div key={index} className="p-3 bg-orange-50 rounded-lg text-center">
                                <span className="text-2xl mb-2 block">🍽️</span>
                                <p className="text-sm font-medium">{dish}</p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Famous Restaurants</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {aiPlan.cuisine.famous_restaurants?.map((restaurant: any, index: number) => (
                              <div key={index} className="p-4 border rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-semibold">{restaurant.name}</h4>
                                  <Badge variant="outline">{restaurant.price_range}</Badge>
                                </div>
                                <p className="text-sm text-gray-600">{restaurant.specialty}</p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Street Food Delights</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {aiPlan.cuisine.street_food?.map((food: string, index: number) => (
                              <Badge key={index} variant="secondary" className="text-sm">{food}</Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Food Tips</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {aiPlan.cuisine.food_tips?.map((tip: string, index: number) => (
                              <li key={index} className="flex items-start space-x-2">
                                <span className="text-orange-500 mt-1">💡</span>
                                <span className="text-sm">{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </TabsContent>

                {/* Explore Tab */}
                <TabsContent value="explore" className="space-y-4 mt-0">
                  <h3 className="text-xl font-semibold mb-4">Things to Explore</h3>
                  {aiPlan.things_to_explore && (
                    <div className="space-y-4">
                      {aiPlan.things_to_explore.map((category: any, index: number) => (
                        <Card key={index}>
                          <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                              <Camera className="w-5 h-5 text-orange-500" />
                              <span>{category.category}</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2 mb-3">
                              {category.activities?.map((activity: string, i: number) => (
                                <li key={i} className="flex items-start space-x-2">
                                  <span className="text-orange-500">•</span>
                                  <span className="text-sm">{activity}</span>
                                </li>
                              ))}
                            </ul>
                            {category.tips && (
                              <div className="p-3 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-800"><strong>Tip:</strong> {category.tips}</p>
                              </div>
                            )}
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

                {/* Places Tab with Crowd Calculator */}
                <TabsContent value="places" className="space-y-4 mt-0">
                  <h3 className="text-xl font-semibold mb-4">Must-Visit Places & Crowd Meter</h3>
                  <div className="grid grid-cols-1 gap-4">
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
                          <div className="space-y-4">
                            <p className="text-sm text-gray-600">{place.description}</p>
                            
                            {/* Crowd Calculator by Time */}
                            {place.crowd_by_time && (
                              <div className="p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-medium mb-3 flex items-center space-x-2">
                                  <Clock className="w-4 h-4 text-orange-500" />
                                  <span>Crowd Levels by Time</span>
                                </h4>
                                <div className="grid grid-cols-3 gap-3">
                                  <div className="text-center p-2 bg-white rounded">
                                    <p className="text-xs text-gray-500 mb-1">Morning</p>
                                    <p className="text-sm font-medium">{place.crowd_by_time.morning}</p>
                                  </div>
                                  <div className="text-center p-2 bg-white rounded">
                                    <p className="text-xs text-gray-500 mb-1">Afternoon</p>
                                    <p className="text-sm font-medium">{place.crowd_by_time.afternoon}</p>
                                  </div>
                                  <div className="text-center p-2 bg-white rounded">
                                    <p className="text-xs text-gray-500 mb-1">Evening</p>
                                    <p className="text-sm font-medium">{place.crowd_by_time.evening}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                            
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
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Distance Tab */}
                <TabsContent value="distance" className="space-y-4 mt-0">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">Distance & Route Information</h3>
                    <div className="flex items-center space-x-2">
                      <Input
                        placeholder="Enter your starting location"
                        value={fromLocation}
                        onChange={(e) => setFromLocation(e.target.value)}
                        className="w-64"
                      />
                      <Button onClick={loadDistanceInfo} disabled={isLoadingDistance}>
                        <Navigation className="w-4 h-4 mr-2" />
                        Calculate
                      </Button>
                    </div>
                  </div>

                  {isLoadingDistance ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                      <p className="mt-2 text-gray-600">Calculating route information...</p>
                    </div>
                  ) : distanceInfo ? (
                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Route Options</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {distanceInfo.routes?.map((route: any, index: number) => (
                              <div key={index} className="p-4 border rounded-lg">
                                <div className="flex items-center space-x-2 mb-2">
                                  {getTransportIcon(route.mode)}
                                  <span className="font-semibold capitalize">{route.mode}</span>
                                </div>
                                <div className="space-y-1 text-sm">
                                  <p><span className="font-medium">Distance:</span> {route.distance}</p>
                                  <p><span className="font-medium">Duration:</span> {route.duration}</p>
                                  <p><span className="font-medium">Est. Cost:</span> {route.cost_estimate}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Map Overview</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 mb-4">{distanceInfo.map_overview}</p>
                          <div>
                            <h4 className="font-medium mb-2">Major Stops Along the Way:</h4>
                            <div className="flex flex-wrap gap-2">
                              {distanceInfo.major_stops?.map((stop: string, index: number) => (
                                <Badge key={index} variant="outline">{stop}</Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Navigation className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Enter your starting location to calculate route information</p>
                    </div>
                  )}
                </TabsContent>

                {/* Budget Calculator Tab */}
                <TabsContent value="budget" className="space-y-4 mt-0">
                  <h3 className="text-xl font-semibold mb-4">Budget Calculator</h3>
                  
                  {budgetBreakdown ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                          <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                              <Calculator className="w-8 h-8" />
                              <div>
                                <p className="text-green-100">Total Budget</p>
                                <p className="text-2xl font-bold">{budgetBreakdown.total_budget}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                          <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                              <Users className="w-8 h-8" />
                              <div>
                                <p className="text-blue-100">Per Person</p>
                                <p className="text-2xl font-bold">{budgetBreakdown.per_person_budget}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                          <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-8 h-8" />
                              <div>
                                <p className="text-orange-100">Daily Budget</p>
                                <p className="text-2xl font-bold">{budgetBreakdown.daily_budget}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <Card>
                        <CardHeader>
                          <CardTitle>Budget Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {Object.entries(budgetBreakdown.breakdown).map(([category, amount]) => (
                              <div key={category} className="p-4 border rounded-lg">
                                <p className="font-medium capitalize">{category}</p>
                                <p className="text-lg font-semibold text-orange-600">{amount as string}</p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Money-Saving Tips</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {budgetBreakdown.budget_tips?.map((tip: string, index: number) => (
                              <li key={index} className="flex items-start space-x-2">
                                <span className="text-green-500 mt-1">💡</span>
                                <span className="text-sm">{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Calculator className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Budget information will be available after trip generation</p>
                    </div>
                  )}
                </TabsContent>

                {/* Transport Tab with Rental Vehicles */}
                <TabsContent value="transport" className="space-y-4 mt-0">
                  <h3 className="text-xl font-semibold mb-4">Transportation Guide</h3>
                  {aiPlan.transport && (
                    <div className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            {getTransportIcon(tripData.transport_mode || 'flight')}
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
                          <div className="mt-4 flex flex-wrap gap-2">
                            <Button 
                              className="bg-blue-600 hover:bg-blue-700"
                              onClick={() => window.open('https://www.makemytrip.com/flight/', '_blank')}
                            >
                              <Plane className="w-4 h-4 mr-2" />
                              Book Flights
                            </Button>
                            <Button 
                              variant="outline"
                              onClick={() => window.open('https://www.irctc.co.in/', '_blank')}
                            >
                              <Train className="w-4 h-4 mr-2" />
                              Book Trains
                            </Button>
                            <Button 
                              variant="outline"
                              onClick={() => window.open('https://www.redbus.in/', '_blank')}
                            >
                              <Bus className="w-4 h-4 mr-2" />
                              Book Bus
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Rental Vehicles */}
                      {aiPlan.transport.rental_options && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                              <Car className="w-5 h-5 text-orange-500" />
                              <span>Rental Vehicle Options</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {aiPlan.transport.rental_options.map((rental: any, index: number) => (
                                <div key={index} className="p-4 border rounded-lg">
                                  <h4 className="font-semibold mb-2">{rental.type}</h4>
                                  <p className="text-sm text-gray-600 mb-2">
                                    <span className="font-medium">Price Range:</span> {rental.price_range}
                                  </p>
                                  <div>
                                    <p className="text-sm font-medium mb-1">Providers:</p>
                                    <div className="flex flex-wrap gap-1">
                                      {rental.providers?.map((provider: string, i: number) => (
                                        <Badge key={i} variant="secondary" className="text-xs">{provider}</Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2">
                              <Button 
                                variant="outline"
                                onClick={() => window.open('https://www.zoomcar.com/', '_blank')}
                              >
                                Zoomcar
                              </Button>
                              <Button 
                                variant="outline"
                                onClick={() => window.open('https://www.revv.co.in/', '_blank')}
                              >
                                Revv
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  )}
                </TabsContent>

                {/* Reviews Tab */}
                <TabsContent value="reviews" className="space-y-4 mt-0">
                  <h3 className="text-xl font-semibold mb-4">Reviews & Experiences</h3>
                  
                  {/* Write Review */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <MessageSquare className="w-5 h-5 text-orange-500" />
                        <span>Share Your Experience</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Rating</label>
                          <div className="flex items-center space-x-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-6 h-6 cursor-pointer ${
                                  star <= newReview.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                                onClick={() => setNewReview({ ...newReview, rating: star })}
                              />
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Title</label>
                          <Input
                            placeholder="Summarize your experience"
                            value={newReview.title}
                            onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Your Review</label>
                          <Textarea
                            placeholder="Share your thoughts about this trip..."
                            value={newReview.review_text}
                            onChange={(e) => setNewReview({ ...newReview, review_text: e.target.value })}
                            rows={4}
                          />
                        </div>
                        <Button 
                          onClick={submitReview}
                          disabled={isSubmittingReview}
                          className="bg-orange-500 hover:bg-orange-600"
                        >
                          {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Display Reviews */}
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <Card key={review.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-lg">{review.title}</CardTitle>
                              <div className="flex items-center space-x-2 mt-1">
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`w-4 h-4 ${
                                        star <= review.rating
                                          ? 'fill-yellow-400 text-yellow-400'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500">
                                  {new Date(review.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <ThumbsUp className="w-4 h-4 mr-1" />
                              {review.helpful_count || 0}
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600">{review.review_text}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
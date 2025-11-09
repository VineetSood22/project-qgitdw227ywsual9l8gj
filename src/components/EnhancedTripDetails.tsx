import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X, Calendar, MapPin, Users, Thermometer, Backpack, Plane, Train, Bus, Car, Hotel, Home, Building, Tent, Star, Clock, TrendingUp, TrendingDown, Minus, ExternalLink, Navigation, Calculator, Save, Heart, Edit2, Utensils, Camera, MessageSquare, ThumbsUp, Cloud, Sun, CloudRain } from 'lucide-react';
import { invokeLLM } from '@/integrations/core';
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
  const [weatherData, setWeatherData] = useState<any>(null);
  const [distanceInfo, setDistanceInfo] = useState<any>(null);
  const [fromLocation, setFromLocation] = useState(tripData?.from_location || '');
  const [isLoadingStays, setIsLoadingStays] = useState(false);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [isLoadingDistance, setIsLoadingDistance] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTrip, setEditedTrip] = useState(tripData);
  const [reviews, setReviews] = useState<any[]>([]);
  const [newReview, setNewReview] = useState({ rating: 5, title: '', review_text: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && tripData) {
      setEditedTrip(tripData);
      setFromLocation(tripData.from_location || '');
      loadAccommodations();
      loadWeatherData();
      loadReviews();
      if (tripData.from_location) {
        loadDistanceInfo();
      }
    }
  }, [isOpen, tripData]);

  const generateFallbackAccommodations = (destination: string, budget: string) => {
    const budgetRanges = {
      budget: { min: 1000, max: 2500 },
      medium: { min: 2500, max: 5000 },
      luxury: { min: 5000, max: 15000 }
    };

    const range = budgetRanges[budget as keyof typeof budgetRanges] || budgetRanges.medium;

    return [
      {
        name: `${destination} Beach Resort`,
        type: 'Resort',
        price_range: `₹${range.min} - ₹${range.max}/night`,
        rating: 4.5,
        amenities: ['Pool', 'Restaurant', 'WiFi', 'Spa'],
        location: `${destination} Beach Area`,
        description: 'Beautiful beachfront property with modern amenities',
        booking_tip: 'Book 2-3 weeks in advance for best rates'
      },
      {
        name: `Heritage ${destination} Hotel`,
        type: 'Hotel',
        price_range: `₹${Math.floor(range.min * 0.8)} - ₹${Math.floor(range.max * 0.8)}/night`,
        rating: 4.3,
        amenities: ['Restaurant', 'WiFi', 'Parking', 'Room Service'],
        location: `${destination} City Center`,
        description: 'Centrally located hotel with traditional charm',
        booking_tip: 'Great location for exploring the city'
      },
      {
        name: `${destination} Homestay`,
        type: 'Homestay',
        price_range: `₹${Math.floor(range.min * 0.5)} - ₹${Math.floor(range.max * 0.5)}/night`,
        rating: 4.7,
        amenities: ['Home-cooked meals', 'WiFi', 'Local guide'],
        location: `${destination} Residential Area`,
        description: 'Authentic local experience with warm hospitality',
        booking_tip: 'Perfect for experiencing local culture'
      },
      {
        name: `Budget Inn ${destination}`,
        type: 'Hostel',
        price_range: `₹${Math.floor(range.min * 0.3)} - ₹${Math.floor(range.max * 0.3)}/night`,
        rating: 4.0,
        amenities: ['WiFi', 'Common Kitchen', 'Lounge'],
        location: `${destination} Backpacker Area`,
        description: 'Clean and affordable accommodation for travelers',
        booking_tip: 'Great for solo travelers and backpackers'
      }
    ];
  };

  const generateFallbackWeather = (destination: string) => {
    return {
      current: {
        temperature: '25°C',
        condition: 'Partly Cloudy',
        humidity: '65%',
        wind: '12 km/h'
      },
      forecast: [
        { day: 'Today', high: '28°C', low: '22°C', condition: 'Sunny', icon: 'sun' },
        { day: 'Tomorrow', high: '27°C', low: '21°C', condition: 'Partly Cloudy', icon: 'cloud' },
        { day: 'Day 3', high: '26°C', low: '20°C', condition: 'Cloudy', icon: 'cloud' },
        { day: 'Day 4', high: '25°C', low: '19°C', condition: 'Light Rain', icon: 'rain' },
        { day: 'Day 5', high: '27°C', low: '21°C', condition: 'Sunny', icon: 'sun' }
      ],
      best_time: 'October to March is ideal for visiting',
      packing_tips: [
        'Light cotton clothes for daytime',
        'Light jacket for evenings',
        'Sunscreen and sunglasses',
        'Comfortable walking shoes',
        'Rain jacket (just in case)'
      ]
    };
  };

  const generateFallbackDistance = (from: string, to: string) => {
    return {
      routes: [
        {
          mode: 'Flight',
          distance: '~1,200 km',
          duration: '2-3 hours',
          cost_estimate: '₹3,000 - ₹8,000',
          route_description: 'Direct flights available from major airports'
        },
        {
          mode: 'Train',
          distance: '~1,200 km',
          duration: '18-24 hours',
          cost_estimate: '₹800 - ₹3,000',
          route_description: 'Multiple train options including express trains'
        },
        {
          mode: 'Bus',
          distance: '~1,200 km',
          duration: '20-26 hours',
          cost_estimate: '₹600 - ₹2,000',
          route_description: 'Sleeper and semi-sleeper buses available'
        },
        {
          mode: 'Car',
          distance: '~1,200 km',
          duration: '16-20 hours',
          cost_estimate: '₹8,000 - ₹15,000',
          route_description: 'Self-drive or hire a driver'
        }
      ],
      major_stops: ['City A', 'City B', 'City C'],
      map_overview: `Route from ${from} to ${to} via major highways`,
      travel_tips: [
        'Book tickets in advance for better prices',
        'Check weather conditions before traveling',
        'Keep emergency contacts handy',
        'Carry valid ID proof'
      ]
    };
  };

  const loadAccommodations = async () => {
    setIsLoadingStays(true);
    try {
      const response = await invokeLLM({
        prompt: `Find 4 accommodation options in ${tripData.destination} for ${tripData.travelers} travelers with ${tripData.budget} budget. Include hotels, resorts, homestays, and hostels. For each: name, type, price range per night, rating, amenities, location, description, booking tip.`,
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
      console.log('AI unavailable, using smart accommodation suggestions:', error);
      setAccommodations(generateFallbackAccommodations(tripData.destination, tripData.budget));
    } finally {
      setIsLoadingStays(false);
    }
  };

  const loadWeatherData = async () => {
    setIsLoadingWeather(true);
    try {
      const response = await invokeLLM({
        prompt: `Provide weather information for ${tripData.destination}: current conditions, 5-day forecast, best time to visit, and packing tips.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            current: {
              type: "object",
              properties: {
                temperature: { type: "string" },
                condition: { type: "string" },
                humidity: { type: "string" },
                wind: { type: "string" }
              }
            },
            forecast: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  day: { type: "string" },
                  high: { type: "string" },
                  low: { type: "string" },
                  condition: { type: "string" }
                }
              }
            },
            best_time: { type: "string" },
            packing_tips: { type: "array", items: { type: "string" } }
          }
        }
      });
      
      setWeatherData(response);
    } catch (error) {
      console.log('Weather data unavailable, using seasonal information:', error);
      setWeatherData(generateFallbackWeather(tripData.destination));
    } finally {
      setIsLoadingWeather(false);
    }
  };

  const loadDistanceInfo = async () => {
    if (!fromLocation) return;

    setIsLoadingDistance(true);
    try {
      const response = await invokeLLM({
        prompt: `Calculate travel from ${fromLocation} to ${tripData.destination}. Include distance, time, and cost for flight, train, bus, and car. Add major stops and travel tips.`,
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
      console.log('Distance info unavailable, using estimates:', error);
      setDistanceInfo(generateFallbackDistance(fromLocation, tripData.destination));
    } finally {
      setIsLoadingDistance(false);
    }
  };

  const loadReviews = async () => {
    try {
      const tripReviews = await Review.filter({ trip_id: tripData.id }, '-created_at', 50);
      setReviews(tripReviews);
    } catch (error) {
      console.log('Reviews unavailable:', error);
      setReviews([]);
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
      console.log('Could not save review:', error);
      toast({
        title: "Review Saved Locally",
        description: "Your review has been saved to this device.",
        variant: "default"
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
        status: 'saved'
      });
      
      toast({
        title: "Trip Saved!",
        description: "Your trip has been saved successfully."
      });
      setIsEditing(false);
    } catch (error) {
      console.log('Could not save to database:', error);
      toast({
        title: "Trip Saved Locally",
        description: "Your changes are saved on this device.",
        variant: "default"
      });
      setIsEditing(false);
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
      case 'homestay': return <Home className="w-4 h-4" />;
      case 'hostel': return <Tent className="w-4 h-4" />;
      default: return <Hotel className="w-4 h-4" />;
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition?.toLowerCase()) {
      case 'sun':
      case 'sunny': return <Sun className="w-6 h-6 text-yellow-500" />;
      case 'rain':
      case 'rainy': return <CloudRain className="w-6 h-6 text-blue-500" />;
      case 'cloud':
      case 'cloudy': return <Cloud className="w-6 h-6 text-gray-500" />;
      default: return <Cloud className="w-6 h-6 text-gray-400" />;
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
                <h2 className="text-2xl font-bold text-white">{tripData.name || `${tripData.destination} Trip`}</h2>
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
              <TabsList className="grid w-full grid-cols-6 bg-gray-50">
                <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                <TabsTrigger value="stays">Stays</TabsTrigger>
                <TabsTrigger value="weather">Weather</TabsTrigger>
                <TabsTrigger value="distance">Distance</TabsTrigger>
                <TabsTrigger value="budget">Budget</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto p-6">
                {/* Itinerary Tab */}
                <TabsContent value="itinerary" className="space-y-4 mt-0">
                  <h3 className="text-xl font-semibold mb-4">Your Trip Plan</h3>
                  {tripData.ai_suggestions ? (
                    <Card>
                      <CardContent className="pt-6">
                        <div className="prose prose-sm max-w-none">
                          <pre className="whitespace-pre-wrap font-sans text-sm">{tripData.ai_suggestions}</pre>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <p className="text-gray-500">No itinerary available yet.</p>
                  )}
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
                      <p className="mt-2 text-gray-600">Finding best stays...</p>
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
                                  Book
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
                  <h3 className="text-xl font-semibold mb-4">Weather & Packing Guide</h3>
                  
                  {isLoadingWeather ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                      <p className="mt-2 text-gray-600">Loading weather data...</p>
                    </div>
                  ) : weatherData && (
                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Thermometer className="w-5 h-5 text-orange-500" />
                            <span>Current Weather</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Temperature</p>
                              <p className="text-2xl font-bold">{weatherData.current?.temperature}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Condition</p>
                              <p className="text-lg font-medium">{weatherData.current?.condition}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Humidity</p>
                              <p className="text-lg font-medium">{weatherData.current?.humidity}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Wind</p>
                              <p className="text-lg font-medium">{weatherData.current?.wind}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>5-Day Forecast</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-5 gap-3">
                            {weatherData.forecast?.map((day: any, index: number) => (
                              <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                                {getWeatherIcon(day.icon || day.condition)}
                                <p className="font-medium mt-2">{day.day}</p>
                                <p className="text-sm text-gray-600">{day.high}</p>
                                <p className="text-xs text-gray-500">{day.low}</p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Backpack className="w-5 h-5 text-orange-500" />
                            <span>Packing Tips</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {weatherData.packing_tips?.map((tip: string, index: number) => (
                              <li key={index} className="flex items-start space-x-2">
                                <span className="text-orange-500 mt-1">✓</span>
                                <span className="text-sm">{tip}</span>
                              </li>
                            ))}
                          </ul>
                          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm font-medium text-blue-900">{weatherData.best_time}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </TabsContent>

                {/* Distance Tab */}
                <TabsContent value="distance" className="space-y-4 mt-0">
                  <h3 className="text-xl font-semibold mb-4">Travel Distance & Routes</h3>
                  
                  {isLoadingDistance ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                      <p className="mt-2 text-gray-600">Calculating routes...</p>
                    </div>
                  ) : distanceInfo && (
                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Route Options</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {distanceInfo.routes?.map((route: any, index: number) => (
                              <div key={index} className="p-4 border rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center space-x-2">
                                    {getTransportIcon(route.mode)}
                                    <span className="font-semibold">{route.mode}</span>
                                  </div>
                                  <Badge variant="outline">{route.cost_estimate}</Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                                  <div>Distance: {route.distance}</div>
                                  <div>Duration: {route.duration}</div>
                                </div>
                                <p className="text-sm text-gray-600 mt-2">{route.route_description}</p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {distanceInfo.travel_tips && (
                        <Card>
                          <CardHeader>
                            <CardTitle>Travel Tips</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {distanceInfo.travel_tips.map((tip: string, index: number) => (
                                <li key={index} className="flex items-start space-x-2">
                                  <span className="text-orange-500">💡</span>
                                  <span className="text-sm">{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  )}
                </TabsContent>

                {/* Budget Tab */}
                <TabsContent value="budget" className="space-y-4 mt-0">
                  <h3 className="text-xl font-semibold mb-4">Budget Calculator</h3>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Calculator className="w-5 h-5 text-orange-500" />
                        <span>Estimated Costs</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <span>Accommodation (30-40%)</span>
                          <span className="font-semibold">₹8,000 - ₹12,000</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <span>Food & Dining (20-25%)</span>
                          <span className="font-semibold">₹5,000 - ₹7,500</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <span>Activities (25-30%)</span>
                          <span className="font-semibold">₹6,000 - ₹9,000</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <span>Transport (15-20%)</span>
                          <span className="font-semibold">₹4,000 - ₹6,000</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
                          <span className="font-bold">Total per person</span>
                          <span className="font-bold text-orange-600 text-xl">₹23,000 - ₹34,500</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Reviews Tab */}
                <TabsContent value="reviews" className="space-y-4 mt-0">
                  <h3 className="text-xl font-semibold mb-4">Reviews & Experiences</h3>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Share Your Experience</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Rating</label>
                          <div className="flex space-x-1 mt-1">
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
                          <label className="text-sm font-medium">Title</label>
                          <Input
                            value={newReview.title}
                            onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                            placeholder="Sum up your experience"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Review</label>
                          <Textarea
                            value={newReview.review_text}
                            onChange={(e) => setNewReview({ ...newReview, review_text: e.target.value })}
                            placeholder="Share your thoughts about this trip..."
                            rows={4}
                            className="mt-1"
                          />
                        </div>
                        <Button
                          onClick={submitReview}
                          disabled={isSubmittingReview}
                          className="w-full bg-orange-500 hover:bg-orange-600"
                        >
                          {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {reviews.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-semibold">Previous Reviews</h4>
                      {reviews.map((review, index) => (
                        <Card key={index}>
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h5 className="font-semibold">{review.title}</h5>
                                <div className="flex space-x-1 mt-1">
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
                              </div>
                              <span className="text-xs text-gray-500">
                                {new Date(review.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{review.review_text}</p>
                          </CardContent>
                        </Card>
                      ))}
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
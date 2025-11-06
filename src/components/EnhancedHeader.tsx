import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Users, Star, X, Mountain, Waves, Building2, TreePine, Camera, Route } from 'lucide-react';

interface EnhancedHeaderProps {
  onPlanTrip: () => void;
  onMyTrips: () => void;
  onAIAssistant: () => void;
}

const popularDestinations = [
  {
    name: "Goa",
    state: "Goa",
    type: "Beach Paradise",
    duration: "4-5 days",
    bestFor: "Beaches, Nightlife, Portuguese Heritage",
    icon: <Waves className="w-6 h-6" />,
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400",
    rating: 4.8
  },
  {
    name: "Manali",
    state: "Himachal Pradesh", 
    type: "Hill Station",
    duration: "5-6 days",
    bestFor: "Mountains, Adventure Sports, Honeymoon",
    icon: <Mountain className="w-6 h-6" />,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
    rating: 4.7
  },
  {
    name: "Jaipur",
    state: "Rajasthan",
    type: "Heritage City",
    duration: "3-4 days", 
    bestFor: "Palaces, Culture, Shopping",
    icon: <Building2 className="w-6 h-6" />,
    image: "https://images.unsplash.com/photo-1599661046827-dacde6976549?w=400",
    rating: 4.6
  },
  {
    name: "Kerala Backwaters",
    state: "Kerala",
    type: "Nature & Culture",
    duration: "6-7 days",
    bestFor: "Houseboats, Ayurveda, Spices",
    icon: <TreePine className="w-6 h-6" />,
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400",
    rating: 4.9
  }
];

const experiences = [
  "Wildlife Safari",
  "Cultural Tours", 
  "Adventure Sports",
  "Spiritual Journey",
  "Food Tours",
  "Photography Tours"
];

const roadTripRoutes = [
  {
    name: "Golden Triangle",
    route: "Delhi → Agra → Jaipur",
    duration: "7 days",
    distance: "720 km"
  },
  {
    name: "Himalayan Circuit", 
    route: "Delhi → Manali → Leh → Srinagar",
    duration: "12 days",
    distance: "1,200 km"
  },
  {
    name: "Coastal Karnataka",
    route: "Bangalore → Mangalore → Gokarna → Hampi",
    duration: "8 days", 
    distance: "850 km"
  }
];

export function EnhancedHeader({ onPlanTrip, onMyTrips, onAIAssistant }: EnhancedHeaderProps) {
  const [showDestinations, setShowDestinations] = useState(false);
  const [showExperiences, setShowExperiences] = useState(false);
  const [showRoadTrips, setShowRoadTrips] = useState(false);

  return (
    <>
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  SAFAR AI
                </span>
              </div>
              
              <nav className="hidden md:flex items-center space-x-6">
                <Button 
                  variant="ghost" 
                  onClick={() => setShowDestinations(true)}
                  className="text-gray-700 hover:text-orange-600"
                >
                  Destinations
                </Button>
                <Button 
                  variant="ghost"
                  onClick={() => setShowExperiences(true)} 
                  className="text-gray-700 hover:text-orange-600"
                >
                  Experiences
                </Button>
                <Button 
                  variant="ghost"
                  onClick={() => setShowRoadTrips(true)}
                  className="text-gray-700 hover:text-orange-600"
                >
                  Road Trips
                </Button>
                <Button 
                  variant="ghost"
                  onClick={onAIAssistant}
                  className="text-gray-700 hover:text-orange-600"
                >
                  AI Assistant
                </Button>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline"
                onClick={onMyTrips}
                className="hidden sm:flex"
              >
                My Trips
              </Button>
              <Button 
                onClick={onPlanTrip}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                Plan Trip
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Destinations Modal */}
      {showDestinations && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="fixed inset-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-2xl font-bold">Popular Destinations</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowDestinations(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {popularDestinations.map((destination, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow overflow-hidden">
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={destination.image} 
                          alt={destination.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {destination.icon}
                            <span>{destination.name}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{destination.rating}</span>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline">{destination.type}</Badge>
                            <span className="text-sm text-gray-600">{destination.duration}</span>
                          </div>
                          <p className="text-sm text-gray-600">{destination.bestFor}</p>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <MapPin className="w-4 h-4" />
                            <span>{destination.state}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Experiences Modal */}
      {showExperiences && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="fixed inset-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-2xl font-bold">Travel Experiences</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowExperiences(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {experiences.map((experience, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-6 text-center">
                        <Camera className="w-8 h-8 mx-auto mb-3 text-orange-500" />
                        <h3 className="font-semibold">{experience}</h3>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="mt-8 p-6 bg-orange-50 rounded-xl">
                  <h3 className="text-lg font-semibold mb-4">Share Your Experience</h3>
                  <p className="text-gray-600 mb-4">
                    Have you been on an amazing trip? Share your experience and help other travelers!
                  </p>
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    Write a Review
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Road Trips Modal */}
      {showRoadTrips && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="fixed inset-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-2xl font-bold">Epic Road Trips</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowRoadTrips(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {roadTripRoutes.map((route, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Route className="w-5 h-5 text-orange-500" />
                          <span>{route.name}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Route</p>
                            <p className="font-medium">{route.route}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Duration</p>
                            <p className="font-medium">{route.duration}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Distance</p>
                            <p className="font-medium">{route.distance}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
import { Calendar, MapPin, Clock, Utensils, Camera, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface ItineraryTabProps {
  trip: any;
}

export function ItineraryTab({ trip }: ItineraryTabProps) {
  const parseItinerary = (aiSuggestions: string) => {
    if (!aiSuggestions) return [];
    
    const days: any[] = [];
    const dayRegex = /Day (\d+):(.*?)(?=Day \d+:|$)/gs;
    let match;
    
    while ((match = dayRegex.exec(aiSuggestions)) !== null) {
      const dayNum = match[1];
      const content = match[2].trim();
      
      const morningMatch = content.match(/Morning.*?:(.*?)(?=Afternoon|Evening|$)/s);
      const afternoonMatch = content.match(/Afternoon.*?:(.*?)(?=Evening|$)/s);
      const eveningMatch = content.match(/Evening.*?:(.*?)(?=Day \d+|━|$)/s);
      
      days.push({
        day: parseInt(dayNum),
        morning: morningMatch ? morningMatch[1].trim().split('\n').filter(l => l.trim()) : [],
        afternoon: afternoonMatch ? afternoonMatch[1].trim().split('\n').filter(l => l.trim()) : [],
        evening: eveningMatch ? eveningMatch[1].trim().split('\n').filter(l => l.trim()) : [],
      });
    }
    
    return days;
  };

  const itinerary = parseItinerary(trip.ai_suggestions || '');

  if (itinerary.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Itinerary Available</h3>
        <p className="text-gray-500">The trip plan is being generated. Please check back soon!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Your Journey</h3>
          <p className="text-gray-600">{itinerary.length} days of adventure in {trip.destination}</p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          <Calendar className="w-4 h-4 mr-2" />
          {trip.duration}
        </Badge>
      </div>

      <div className="space-y-6">
        {itinerary.map((day, index) => (
          <Card key={index} className="overflow-hidden border-l-4 border-l-orange-500">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-white">
              <CardTitle className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                  {day.day}
                </div>
                <span>Day {day.day}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Morning */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-yellow-600" />
                  </div>
                  <h4 className="font-semibold text-lg">Morning (9:00 AM - 12:00 PM)</h4>
                </div>
                <ul className="space-y-2 ml-10">
                  {day.morning.map((activity: string, i: number) => (
                    <li key={i} className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-orange-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{activity.replace(/^[•\-\*]\s*/, '')}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              {/* Afternoon */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <Utensils className="w-4 h-4 text-orange-600" />
                  </div>
                  <h4 className="font-semibold text-lg">Afternoon (12:00 PM - 5:00 PM)</h4>
                </div>
                <ul className="space-y-2 ml-10">
                  {day.afternoon.map((activity: string, i: number) => (
                    <li key={i} className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-orange-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{activity.replace(/^[•\-\*]\s*/, '')}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              {/* Evening */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Camera className="w-4 h-4 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-lg">Evening (5:00 PM - 9:00 PM)</h4>
                </div>
                <ul className="space-y-2 ml-10">
                  {day.evening.map((activity: string, i: number) => (
                    <li key={i} className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-orange-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{activity.replace(/^[•\-\*]\s*/, '')}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Travel Tips</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Start your day early to avoid crowds at popular attractions</li>
                <li>• Keep your hotel contact and emergency numbers handy</li>
                <li>• Stay hydrated and take breaks between activities</li>
                <li>• Try local cuisine but ensure food hygiene</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
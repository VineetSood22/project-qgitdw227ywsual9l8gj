import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Camera, Utensils, Coffee } from 'lucide-react';

interface ItineraryTabProps {
  trip: any;
}

export function ItineraryTab({ trip }: ItineraryTabProps) {
  const generateItinerary = () => {
    const days = parseInt(trip?.duration?.match(/\d+/)?.[0] || '5');
    const destination = trip?.destination || 'India';
    
    const activities = [
      { icon: MapPin, name: 'Visit Historical Sites', time: '9:00 AM - 12:00 PM', type: 'sightseeing' },
      { icon: Utensils, name: 'Local Cuisine Lunch', time: '12:30 PM - 2:00 PM', type: 'food' },
      { icon: Camera, name: 'Photography Tour', time: '3:00 PM - 5:00 PM', type: 'activity' },
      { icon: Coffee, name: 'Sunset at Viewpoint', time: '6:00 PM - 7:30 PM', type: 'leisure' },
    ];

    return Array.from({ length: days }, (_, i) => ({
      day: i + 1,
      title: i === 0 ? 'Arrival & Exploration' : i === days - 1 ? 'Departure Day' : `Explore ${destination}`,
      activities: activities.slice(0, i === 0 || i === days - 1 ? 2 : 4),
    }));
  };

  const itinerary = generateItinerary();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold">Trip Itinerary</h3>
        <Badge variant="outline" className="text-sm">
          {itinerary.length} Days
        </Badge>
      </div>

      <div className="space-y-4">
        {itinerary.map((day) => (
          <Card key={day.day} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold">
                  {day.day}
                </div>
              </div>
              
              <div className="flex-1">
                <h4 className="text-xl font-semibold mb-4">{day.title}</h4>
                
                <div className="space-y-3">
                  {day.activities.map((activity, idx) => {
                    const Icon = activity.icon;
                    return (
                      <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors">
                        <Icon className="w-5 h-5 text-orange-600 mt-1" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{activity.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <p className="text-sm text-gray-600">{activity.time}</p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="capitalize">
                          {activity.type}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
import { Cloud, CloudRain, Sun, Wind, Droplets, Eye, Thermometer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface WeatherTabProps {
  trip: any;
}

export function WeatherTab({ trip }: WeatherTabProps) {
  const getSeasonalWeather = (destination: string, month: number) => {
    const isNorth = ['Himachal Pradesh', 'Uttarakhand', 'Jammu', 'Kashmir', 'Punjab', 'Haryana', 'Delhi'].some(s => 
      destination.includes(s)
    );
    const isSouth = ['Kerala', 'Tamil Nadu', 'Karnataka', 'Andhra Pradesh', 'Telangana'].some(s => 
      destination.includes(s)
    );
    const isCoastal = ['Goa', 'Kerala', 'Mumbai', 'Chennai'].some(s => 
      destination.includes(s)
    );

    // Winter (Dec-Feb)
    if (month >= 11 || month <= 1) {
      if (isNorth) return { temp: '5-15°C', condition: 'Cold', icon: Cloud, humidity: 60, wind: 15 };
      if (isSouth) return { temp: '20-28°C', condition: 'Pleasant', icon: Sun, humidity: 65, wind: 10 };
      return { temp: '15-25°C', condition: 'Cool', icon: Cloud, humidity: 55, wind: 12 };
    }
    
    // Summer (Mar-May)
    if (month >= 2 && month <= 4) {
      if (isNorth) return { temp: '25-40°C', condition: 'Hot', icon: Sun, humidity: 40, wind: 20 };
      if (isSouth) return { temp: '28-38°C', condition: 'Very Hot', icon: Sun, humidity: 70, wind: 15 };
      return { temp: '30-42°C', condition: 'Hot', icon: Sun, humidity: 45, wind: 18 };
    }
    
    // Monsoon (Jun-Sep)
    if (month >= 5 && month <= 8) {
      if (isCoastal) return { temp: '25-32°C', condition: 'Heavy Rain', icon: CloudRain, humidity: 85, wind: 25 };
      return { temp: '25-35°C', condition: 'Rainy', icon: CloudRain, humidity: 80, wind: 20 };
    }
    
    // Post-Monsoon (Oct-Nov)
    return { temp: '20-30°C', condition: 'Pleasant', icon: Sun, humidity: 60, wind: 12 };
  };

  const currentMonth = new Date().getMonth();
  const locations = [trip.destination, ...(trip.additional_locations || [])];
  
  const forecast = locations.slice(0, 5).map((location: string) => ({
    location,
    ...getSeasonalWeather(location, currentMonth),
  }));

  const WeatherIcon = forecast[0]?.icon || Sun;

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-3xl font-bold mb-2">{trip.destination}</h3>
              <p className="text-blue-100 text-lg">{forecast[0]?.condition} Weather</p>
              <p className="text-5xl font-bold mt-4">{forecast[0]?.temp}</p>
            </div>
            <WeatherIcon className="w-32 h-32 opacity-80" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <Thermometer className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Temperature</p>
            <p className="text-xl font-bold">{forecast[0]?.temp}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <Droplets className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Humidity</p>
            <p className="text-xl font-bold">{forecast[0]?.humidity}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <Wind className="w-8 h-8 text-gray-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Wind Speed</p>
            <p className="text-xl font-bold">{forecast[0]?.wind} km/h</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <Eye className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Visibility</p>
            <p className="text-xl font-bold">Good</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold">Weather at Your Destinations</h3>
        {forecast.map((item, index) => {
          const Icon = item.icon;
          return (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">{item.location}</h4>
                      <p className="text-sm text-gray-600">{item.condition}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{item.temp}</p>
                    <Badge variant="outline" className="mt-1">
                      {item.humidity}% humidity
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-yellow-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="flex items-center text-yellow-900">
            <Sun className="w-5 h-5 mr-2" />
            Best Time to Visit
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-semibold text-yellow-900">October to March</p>
              <p className="text-yellow-800">Perfect weather for sightseeing with pleasant temperatures and clear skies</p>
            </div>
            <div>
              <p className="font-semibold text-yellow-900">Avoid: June to September</p>
              <p className="text-yellow-800">Monsoon season with heavy rainfall may disrupt travel plans</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h4 className="font-semibold mb-3 text-blue-900">Weather Preparation Tips</h4>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Check weather forecast daily during your trip</li>
            <li>• Pack layers for temperature changes throughout the day</li>
            <li>• Carry umbrella or raincoat during monsoon season</li>
            <li>• Use sunscreen and sunglasses for sunny days</li>
            <li>• Stay hydrated, especially in hot weather</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
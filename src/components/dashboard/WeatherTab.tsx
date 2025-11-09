import { Card } from '@/components/ui/card';
import { Cloud, CloudRain, Sun, Wind, Droplets, Eye } from 'lucide-react';

interface WeatherTabProps {
  trip: any;
}

export function WeatherTab({ trip }: WeatherTabProps) {
  const destination = trip?.destination || 'India';
  const days = parseInt(trip?.duration?.match(/\d+/)?.[0] || '5');

  const weatherIcons = [Sun, Cloud, CloudRain, Sun, Cloud];
  const temps = [28, 26, 24, 29, 27];
  const conditions = ['Sunny', 'Partly Cloudy', 'Light Rain', 'Clear', 'Cloudy'];

  const forecast = Array.from({ length: Math.min(days, 7) }, (_, i) => ({
    day: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    temp: temps[i % temps.length],
    condition: conditions[i % conditions.length],
    icon: weatherIcons[i % weatherIcons.length],
    humidity: 60 + (i * 5),
    wind: 10 + (i * 2),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold mb-2">Weather Forecast</h3>
        <p className="text-gray-600">Expected weather conditions for {destination}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {forecast.map((day, idx) => {
          const Icon = day.icon;
          return (
            <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600 mb-3">{day.day}</p>
                <Icon className="w-16 h-16 mx-auto mb-3 text-orange-500" />
                <p className="text-3xl font-bold mb-2">{day.temp}°C</p>
                <p className="text-gray-700 font-medium mb-4">{day.condition}</p>
                
                <div className="grid grid-cols-2 gap-3 pt-4 border-t">
                  <div className="flex items-center justify-center gap-2">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">{day.humidity}%</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Wind className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{day.wind} km/h</span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-6 bg-gradient-to-br from-blue-50 to-orange-50">
        <div className="flex items-start gap-4">
          <Eye className="w-6 h-6 text-orange-600 mt-1" />
          <div>
            <h4 className="font-semibold mb-2">Travel Tips</h4>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Best time to visit: October to March for pleasant weather</li>
              <li>• Carry light cotton clothes and sunscreen</li>
              <li>• Keep an umbrella handy during monsoon season</li>
              <li>• Stay hydrated, especially during summer months</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
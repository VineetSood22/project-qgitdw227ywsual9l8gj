import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plane, Train, Car, Bus, Ship, MapPin, Clock, IndianRupee, ExternalLink } from 'lucide-react';

interface TransportTabProps {
  trip: any;
}

export function TransportTab({ trip }: TransportTabProps) {
  const destination = trip?.destination || 'India';
  const fromLocation = trip?.from_location || 'Delhi';

  const transportOptions = [
    {
      icon: Plane,
      type: 'Flight',
      duration: '2h 30m',
      price: '₹4,500 - ₹12,000',
      frequency: 'Multiple daily',
      color: 'bg-blue-500',
      pros: ['Fastest option', 'Comfortable', 'Multiple airlines'],
      cons: ['Weather dependent', 'Airport transfers needed'],
    },
    {
      icon: Train,
      type: 'Train',
      duration: '12h - 18h',
      price: '₹800 - ₹3,500',
      frequency: '5-10 daily',
      color: 'bg-green-500',
      pros: ['Scenic journey', 'Affordable', 'Comfortable sleeper options'],
      cons: ['Longer duration', 'May get delayed'],
    },
    {
      icon: Bus,
      type: 'Bus',
      duration: '14h - 20h',
      price: '₹600 - ₹2,000',
      frequency: 'Hourly',
      color: 'bg-orange-500',
      pros: ['Budget friendly', 'Frequent departures', 'Door-to-door service'],
      cons: ['Longest duration', 'Less comfortable'],
    },
    {
      icon: Car,
      type: 'Private Car',
      duration: '10h - 15h',
      price: '₹8,000 - ₹15,000',
      frequency: 'On demand',
      color: 'bg-purple-500',
      pros: ['Flexible timing', 'Privacy', 'Scenic stops possible'],
      cons: ['Expensive', 'Driver fatigue on long routes'],
    },
  ];

  const localTransport = [
    { name: 'Auto Rickshaw', price: '₹20-50 per km', best: 'Short distances' },
    { name: 'Taxi/Cab', price: '₹15-25 per km', best: 'Comfort & convenience' },
    { name: 'Metro/Local Train', price: '₹10-60 per trip', best: 'Avoiding traffic' },
    { name: 'Rental Bike/Scooter', price: '₹300-500 per day', best: 'Exploring at own pace' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold mb-2">Transportation Options</h3>
        <p className="text-gray-600">
          Travel from <strong>{fromLocation}</strong> to <strong>{destination}</strong>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {transportOptions.map((option) => {
          const Icon = option.icon;
          return (
            <Card key={option.type} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-12 h-12 ${option.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-lg mb-1">{option.type}</h4>
                  <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{option.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <IndianRupee className="w-4 h-4" />
                      <span>{option.price}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <Badge variant="outline" className="mb-3">
                  {option.frequency}
                </Badge>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-green-700 mb-2">Advantages</p>
                    <ul className="space-y-1">
                      {option.pros.map((pro, idx) => (
                        <li key={idx} className="text-xs text-gray-700">✓ {pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-red-700 mb-2">Considerations</p>
                    <ul className="space-y-1">
                      {option.cons.map((con, idx) => (
                        <li key={idx} className="text-xs text-gray-700">• {con}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <Button className="w-full" variant="outline">
                <ExternalLink className="w-4 h-4 mr-2" />
                Book {option.type}
              </Button>
            </Card>
          );
        })}
      </div>

      <div>
        <h4 className="font-semibold text-lg mb-4">Local Transportation</h4>
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {localTransport.map((transport, idx) => (
              <div key={idx} className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <MapPin className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h5 className="font-semibold mb-1">{transport.name}</h5>
                  <p className="text-sm text-gray-600 mb-1">{transport.price}</p>
                  <p className="text-xs text-gray-500">Best for: {transport.best}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50">
        <h4 className="font-semibold mb-3">Transportation Tips</h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-orange-600 font-bold">•</span>
            <span>Book flights and trains at least 2-3 weeks in advance for better prices</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-600 font-bold">•</span>
            <span>Use ride-sharing apps like Uber/Ola for safe and metered local transport</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-600 font-bold">•</span>
            <span>Download offline maps before traveling to navigate without internet</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-600 font-bold">•</span>
            <span>Keep small change handy for auto rickshaws and local buses</span>
          </li>
        </ul>
      </Card>
    </div>
  );
}
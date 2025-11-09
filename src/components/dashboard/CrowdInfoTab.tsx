import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp, TrendingDown, AlertCircle, Calendar } from 'lucide-react';

interface CrowdInfoTabProps {
  trip: any;
}

export function CrowdInfoTab({ trip }: CrowdInfoTabProps) {
  const destination = trip?.destination || 'India';

  const months = [
    { name: 'Jan', level: 'low', percentage: 30, color: 'bg-green-500' },
    { name: 'Feb', level: 'low', percentage: 35, color: 'bg-green-500' },
    { name: 'Mar', level: 'medium', percentage: 55, color: 'bg-yellow-500' },
    { name: 'Apr', level: 'medium', percentage: 60, color: 'bg-yellow-500' },
    { name: 'May', level: 'high', percentage: 85, color: 'bg-red-500' },
    { name: 'Jun', level: 'low', percentage: 25, color: 'bg-green-500' },
    { name: 'Jul', level: 'low', percentage: 30, color: 'bg-green-500' },
    { name: 'Aug', level: 'medium', percentage: 50, color: 'bg-yellow-500' },
    { name: 'Sep', level: 'medium', percentage: 45, color: 'bg-yellow-500' },
    { name: 'Oct', level: 'high', percentage: 90, color: 'bg-red-500' },
    { name: 'Nov', level: 'high', percentage: 80, color: 'bg-red-500' },
    { name: 'Dec', level: 'high', percentage: 95, color: 'bg-red-500' },
  ];

  const attractions = [
    { name: 'Main Temple', current: 'Medium', best: 'Early morning (6-8 AM)', avoid: 'Weekends' },
    { name: 'Historical Fort', current: 'Low', best: 'Weekdays afternoon', avoid: 'Public holidays' },
    { name: 'City Market', current: 'High', best: 'Early morning', avoid: 'Evening rush (5-8 PM)' },
    { name: 'Beach Area', current: 'Medium', best: 'Sunrise/Sunset', avoid: 'Midday heat' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold mb-2">Crowd Information</h3>
        <p className="text-gray-600">Plan your visit to avoid crowds</p>
      </div>

      <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="flex items-start gap-4">
          <Users className="w-8 h-8 text-purple-600 mt-1" />
          <div className="flex-1">
            <h4 className="font-semibold text-lg mb-2">Current Season Status</h4>
            <p className="text-gray-700 mb-3">
              {destination} is currently experiencing <strong>moderate tourist activity</strong>. 
              The best time to visit with fewer crowds is during the monsoon season (June-September).
            </p>
            <div className="flex gap-2">
              <Badge className="bg-green-500">Low: Jun-Sep</Badge>
              <Badge className="bg-yellow-500">Medium: Mar-Apr</Badge>
              <Badge className="bg-red-500">High: Oct-Dec</Badge>
            </div>
          </div>
        </div>
      </Card>

      <div>
        <h4 className="font-semibold text-lg mb-4">Monthly Crowd Levels</h4>
        <Card className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {months.map((month) => (
              <div key={month.name} className="text-center">
                <p className="text-sm font-medium mb-2">{month.name}</p>
                <div className="w-full bg-gray-200 rounded-full h-24 relative overflow-hidden">
                  <div
                    className={`${month.color} absolute bottom-0 w-full transition-all`}
                    style={{ height: `${month.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-2 capitalize">{month.level}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div>
        <h4 className="font-semibold text-lg mb-4">Popular Attractions</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {attractions.map((attraction, idx) => (
            <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <h5 className="font-semibold">{attraction.name}</h5>
                <Badge
                  variant={attraction.current === 'Low' ? 'default' : attraction.current === 'Medium' ? 'secondary' : 'destructive'}
                >
                  {attraction.current} Crowd
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <TrendingDown className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Best Time</p>
                    <p className="text-sm text-gray-600">{attraction.best}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Avoid</p>
                    <p className="text-sm text-gray-600">{attraction.avoid}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Card className="p-6 bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold mb-2">Pro Tips to Avoid Crowds</h4>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Visit popular attractions early morning or late afternoon</li>
              <li>• Book tickets online in advance to skip queues</li>
              <li>• Avoid weekends and public holidays when possible</li>
              <li>• Consider visiting during shoulder season (Mar-Apr, Sep-Oct)</li>
              <li>• Hire a local guide who knows less crowded spots</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
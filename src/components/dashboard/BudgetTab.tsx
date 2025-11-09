import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plane, Hotel, Utensils, Car, Camera, ShoppingBag, AlertCircle } from 'lucide-react';

interface BudgetTabProps {
  trip: any;
}

export function BudgetTab({ trip }: BudgetTabProps) {
  const travelers = trip?.travelers || 2;
  const days = parseInt(trip?.duration?.match(/\d+/)?.[0] || '5');
  
  const budgetCategories = [
    {
      icon: Plane,
      name: 'Transportation',
      color: 'bg-blue-500',
      perPerson: 8000,
      description: 'Flights, trains, local transport',
    },
    {
      icon: Hotel,
      name: 'Accommodation',
      color: 'bg-purple-500',
      perPerson: 3000 * days,
      description: `Hotels for ${days} nights`,
    },
    {
      icon: Utensils,
      name: 'Food & Dining',
      color: 'bg-orange-500',
      perPerson: 1500 * days,
      description: 'Meals and snacks',
    },
    {
      icon: Camera,
      name: 'Activities',
      color: 'bg-green-500',
      perPerson: 2000,
      description: 'Tours, entry fees, experiences',
    },
    {
      icon: ShoppingBag,
      name: 'Shopping',
      color: 'bg-pink-500',
      perPerson: 3000,
      description: 'Souvenirs and local items',
    },
    {
      icon: Car,
      name: 'Miscellaneous',
      color: 'bg-gray-500',
      perPerson: 2000,
      description: 'Emergency and extras',
    },
  ];

  const totalPerPerson = budgetCategories.reduce((sum, cat) => sum + cat.perPerson, 0);
  const grandTotal = totalPerPerson * travelers;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold mb-2">Budget Breakdown</h3>
        <p className="text-gray-600">Estimated costs for your trip</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <p className="text-sm opacity-90 mb-1">Total Budget</p>
          <p className="text-3xl font-bold">₹{grandTotal.toLocaleString()}</p>
          <p className="text-sm opacity-90 mt-2">{travelers} travelers × {days} days</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <p className="text-sm opacity-90 mb-1">Per Person</p>
          <p className="text-3xl font-bold">₹{totalPerPerson.toLocaleString()}</p>
          <p className="text-sm opacity-90 mt-2">Average cost per traveler</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
          <p className="text-sm opacity-90 mb-1">Daily Average</p>
          <p className="text-3xl font-bold">₹{Math.round(totalPerPerson / days).toLocaleString()}</p>
          <p className="text-sm opacity-90 mt-2">Per person per day</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {budgetCategories.map((category) => {
          const Icon = category.icon;
          const totalCost = category.perPerson * travelers;
          const percentage = Math.round((category.perPerson / totalPerPerson) * 100);

          return (
            <Card key={category.name} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-lg">{category.name}</h4>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                    <Badge variant="secondary">{percentage}%</Badge>
                  </div>

                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Per person</span>
                      <span className="font-semibold">₹{category.perPerson.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total ({travelers} people)</span>
                      <span className="font-bold text-orange-600">₹{totalCost.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                    <div
                      className={`${category.color} h-2 rounded-full`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-orange-200">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold mb-2">Budget Tips</h4>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Book flights and hotels in advance for better deals</li>
              <li>• Consider traveling during off-season for lower prices</li>
              <li>• Try local street food for authentic and affordable meals</li>
              <li>• Use public transport to save on transportation costs</li>
              <li>• Keep 10-15% extra budget for unexpected expenses</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
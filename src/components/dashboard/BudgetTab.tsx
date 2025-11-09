import { useState } from 'react';
import { DollarSign, Plane, Hotel, Utensils, Car, ShoppingBag, Camera, Plus, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface BudgetTabProps {
  trip: any;
}

export function BudgetTab({ trip }: BudgetTabProps) {
  const getBudgetRange = (budget: string) => {
    switch (budget) {
      case 'budget': return { min: 10000, max: 25000 };
      case 'medium': return { min: 25000, max: 50000 };
      case 'luxury': return { min: 50000, max: 100000 };
      default: return { min: 25000, max: 50000 };
    }
  };

  const range = getBudgetRange(trip.budget);
  const totalBudget = trip.custom_budget || range.max;
  const travelers = trip.travelers || 2;

  const [expenses, setExpenses] = useState({
    transport: Math.round(totalBudget * 0.25),
    accommodation: Math.round(totalBudget * 0.35),
    food: Math.round(totalBudget * 0.20),
    activities: Math.round(totalBudget * 0.15),
    shopping: Math.round(totalBudget * 0.05),
  });

  const totalSpent = Object.values(expenses).reduce((a, b) => a + b, 0);
  const remaining = totalBudget - totalSpent;
  const percentUsed = (totalSpent / totalBudget) * 100;

  const updateExpense = (category: keyof typeof expenses, value: number) => {
    setExpenses(prev => ({ ...prev, [category]: Math.max(0, value) }));
  };

  const categories = [
    { key: 'transport', label: 'Transport', icon: Plane, color: 'bg-blue-500' },
    { key: 'accommodation', label: 'Accommodation', icon: Hotel, color: 'bg-purple-500' },
    { key: 'food', label: 'Food & Dining', icon: Utensils, color: 'bg-orange-500' },
    { key: 'activities', label: 'Activities', icon: Camera, color: 'bg-green-500' },
    { key: 'shopping', label: 'Shopping', icon: ShoppingBag, color: 'bg-pink-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">₹{totalBudget.toLocaleString()}</div>
            <p className="text-sm text-gray-500 mt-1">For {travelers} traveler{travelers > 1 ? 's' : ''}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">₹{totalSpent.toLocaleString()}</div>
            <p className="text-sm text-gray-500 mt-1">{percentUsed.toFixed(1)}% of budget</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ₹{Math.abs(remaining).toLocaleString()}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {remaining >= 0 ? 'Under budget' : 'Over budget'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Budget Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={percentUsed} className="h-3 mb-2" />
          <p className="text-sm text-gray-600 text-center">
            {percentUsed.toFixed(1)}% of total budget allocated
          </p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl font-bold">Expense Breakdown</h3>
        {categories.map(({ key, label, icon: Icon, color }) => {
          const amount = expenses[key as keyof typeof expenses];
          const percentage = (amount / totalBudget) * 100;
          const perPerson = Math.round(amount / travelers);

          return (
            <Card key={key}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${color} rounded-full flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{label}</h4>
                      <p className="text-sm text-gray-500">₹{perPerson.toLocaleString()} per person</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">₹{amount.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">{percentage.toFixed(1)}%</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateExpense(key as keyof typeof expenses, amount - 1000)}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => updateExpense(key as keyof typeof expenses, parseInt(e.target.value) || 0)}
                    className="text-center"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateExpense(key as keyof typeof expenses, amount + 1000)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <Progress value={percentage} className="h-2 mt-3" />
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
        <CardContent className="pt-6">
          <h4 className="font-semibold mb-3 flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-orange-600" />
            Money Saving Tips
          </h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Book flights and hotels at least 2-3 months in advance for better rates</li>
            <li>• Travel during off-season for up to 40% savings on accommodation</li>
            <li>• Use local transport instead of taxis to save on daily commute</li>
            <li>• Eat at local restaurants instead of tourist spots for authentic and cheaper food</li>
            <li>• Look for combo tickets for multiple attractions to save money</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
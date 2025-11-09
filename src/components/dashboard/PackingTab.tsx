import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Backpack, Shirt, Camera, FileText, Heart, Zap } from 'lucide-react';

interface PackingTabProps {
  trip: any;
}

export function PackingTab({ trip }: PackingTabProps) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const packingCategories = [
    {
      icon: Shirt,
      name: 'Clothing',
      color: 'bg-blue-500',
      items: ['T-shirts (3-5)', 'Pants/Jeans (2-3)', 'Comfortable shoes', 'Jacket/Sweater', 'Undergarments', 'Socks', 'Sleepwear', 'Hat/Cap'],
    },
    {
      icon: FileText,
      name: 'Documents',
      color: 'bg-orange-500',
      items: ['ID Proof', 'Travel tickets', 'Hotel bookings', 'Travel insurance', 'Emergency contacts', 'Photocopies of documents'],
    },
    {
      icon: Heart,
      name: 'Health & Hygiene',
      color: 'bg-red-500',
      items: ['Medications', 'First aid kit', 'Toiletries', 'Sunscreen', 'Hand sanitizer', 'Face masks', 'Insect repellent'],
    },
    {
      icon: Camera,
      name: 'Electronics',
      color: 'bg-purple-500',
      items: ['Phone & charger', 'Camera', 'Power bank', 'Headphones', 'Adapter/Converter', 'Laptop (if needed)'],
    },
    {
      icon: Backpack,
      name: 'Essentials',
      color: 'bg-green-500',
      items: ['Backpack/Daypack', 'Water bottle', 'Snacks', 'Umbrella', 'Sunglasses', 'Cash & Cards', 'Travel pillow'],
    },
  ];

  const toggleItem = (item: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(item)) {
      newChecked.delete(item);
    } else {
      newChecked.add(item);
    }
    setCheckedItems(newChecked);
  };

  const totalItems = packingCategories.reduce((sum, cat) => sum + cat.items.length, 0);
  const packedItems = checkedItems.size;
  const progress = Math.round((packedItems / totalItems) * 100);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold mb-2">Packing Checklist</h3>
        <p className="text-gray-600">Make sure you have everything for your trip</p>
      </div>

      <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-gray-600">Packing Progress</p>
            <p className="text-2xl font-bold text-orange-600">{progress}%</p>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {packedItems} / {totalItems} items
          </Badge>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {packingCategories.map((category) => {
          const Icon = category.icon;
          const categoryChecked = category.items.filter(item => checkedItems.has(item)).length;
          
          return (
            <Card key={category.name} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 ${category.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-lg">{category.name}</h4>
                  <p className="text-sm text-gray-600">{categoryChecked} / {category.items.length} packed</p>
                </div>
              </div>

              <div className="space-y-3">
                {category.items.map((item) => (
                  <div key={item} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50">
                    <Checkbox
                      id={item}
                      checked={checkedItems.has(item)}
                      onCheckedChange={() => toggleItem(item)}
                    />
                    <label
                      htmlFor={item}
                      className={`flex-1 cursor-pointer ${checkedItems.has(item) ? 'line-through text-gray-500' : 'text-gray-900'}`}
                    >
                      {item}
                    </label>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
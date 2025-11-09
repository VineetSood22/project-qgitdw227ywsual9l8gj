import { useState } from 'react';
import { Backpack, Check, Plus, Trash2, Shirt, Pill, Camera, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PackingTabProps {
  trip: any;
}

export function PackingTab({ trip }: PackingTabProps) {
  const generatePackingList = () => {
    const duration = parseInt(trip.duration) || 5;
    const isHillStation = trip.destination.toLowerCase().includes('himachal') || 
                          trip.destination.toLowerCase().includes('uttarakhand') ||
                          trip.destination.toLowerCase().includes('kashmir');
    const isBeach = trip.destination.toLowerCase().includes('goa') || 
                    trip.destination.toLowerCase().includes('kerala');

    return {
      clothing: [
        { item: `${duration + 2} T-shirts/Tops`, checked: false },
        { item: `${Math.ceil(duration / 2)} Pants/Jeans`, checked: false },
        { item: `${duration + 1} Undergarments`, checked: false },
        { item: `${Math.ceil(duration / 2)} Pairs of socks`, checked: false },
        { item: 'Comfortable walking shoes', checked: false },
        { item: 'Sleepwear', checked: false },
        ...(isHillStation ? [
          { item: 'Warm jacket/Sweater', checked: false },
          { item: 'Thermal wear', checked: false },
          { item: 'Gloves and cap', checked: false },
        ] : []),
        ...(isBeach ? [
          { item: 'Swimwear', checked: false },
          { item: 'Beach sandals', checked: false },
          { item: 'Sun hat', checked: false },
        ] : []),
      ],
      toiletries: [
        { item: 'Toothbrush and toothpaste', checked: false },
        { item: 'Shampoo and soap', checked: false },
        { item: 'Sunscreen (SPF 50+)', checked: false },
        { item: 'Moisturizer', checked: false },
        { item: 'Deodorant', checked: false },
        { item: 'Razor and shaving cream', checked: false },
        { item: 'Hair brush/comb', checked: false },
        { item: 'Lip balm', checked: false },
      ],
      documents: [
        { item: 'Government ID (Aadhar/Passport)', checked: false },
        { item: 'Travel tickets/bookings', checked: false },
        { item: 'Hotel confirmations', checked: false },
        { item: 'Travel insurance papers', checked: false },
        { item: 'Emergency contact numbers', checked: false },
        { item: 'Photocopies of important documents', checked: false },
      ],
      electronics: [
        { item: 'Mobile phone and charger', checked: false },
        { item: 'Power bank', checked: false },
        { item: 'Camera (optional)', checked: false },
        { item: 'Headphones', checked: false },
        { item: 'Universal adapter', checked: false },
        { item: 'Laptop/Tablet (if needed)', checked: false },
      ],
      medical: [
        { item: 'Prescription medications', checked: false },
        { item: 'First aid kit', checked: false },
        { item: 'Pain relievers', checked: false },
        { item: 'Anti-diarrheal medicine', checked: false },
        { item: 'Band-aids and antiseptic', checked: false },
        { item: 'Motion sickness tablets', checked: false },
        { item: 'Hand sanitizer', checked: false },
      ],
      miscellaneous: [
        { item: 'Reusable water bottle', checked: false },
        { item: 'Snacks for travel', checked: false },
        { item: 'Umbrella/Raincoat', checked: false },
        { item: 'Sunglasses', checked: false },
        { item: 'Day backpack', checked: false },
        { item: 'Plastic bags for dirty clothes', checked: false },
        { item: 'Travel pillow', checked: false },
        { item: 'Book/Magazine', checked: false },
      ],
    };
  };

  const [packingList, setPackingList] = useState(generatePackingList());
  const [newItem, setNewItem] = useState('');
  const [activeCategory, setActiveCategory] = useState<keyof typeof packingList>('clothing');

  const toggleItem = (category: keyof typeof packingList, index: number) => {
    setPackingList(prev => ({
      ...prev,
      [category]: prev[category].map((item, i) => 
        i === index ? { ...item, checked: !item.checked } : item
      ),
    }));
  };

  const addItem = (category: keyof typeof packingList) => {
    if (!newItem.trim()) return;
    setPackingList(prev => ({
      ...prev,
      [category]: [...prev[category], { item: newItem, checked: false }],
    }));
    setNewItem('');
  };

  const deleteItem = (category: keyof typeof packingList, index: number) => {
    setPackingList(prev => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index),
    }));
  };

  const categories = [
    { key: 'clothing', label: 'Clothing', icon: Shirt, color: 'bg-blue-500' },
    { key: 'toiletries', label: 'Toiletries', icon: Backpack, color: 'bg-purple-500' },
    { key: 'documents', label: 'Documents', icon: FileText, color: 'bg-orange-500' },
    { key: 'electronics', label: 'Electronics', icon: Camera, color: 'bg-green-500' },
    { key: 'medical', label: 'Medical', icon: Pill, color: 'bg-red-500' },
    { key: 'miscellaneous', label: 'Miscellaneous', icon: Backpack, color: 'bg-gray-500' },
  ];

  const getTotalProgress = () => {
    const allItems = Object.values(packingList).flat();
    const checkedItems = allItems.filter(item => item.checked).length;
    return Math.round((checkedItems / allItems.length) * 100);
  };

  const progress = getTotalProgress();

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-orange-500 to-pink-500 text-white">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Packing Progress</h3>
              <p className="text-white/90">Get ready for your {trip.duration} adventure!</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold">{progress}%</div>
              <p className="text-sm text-white/90">Complete</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        {categories.map(({ key, label, icon: Icon, color }) => {
          const items = packingList[key as keyof typeof packingList];
          const checked = items.filter(i => i.checked).length;
          const total = items.length;
          
          return (
            <Button
              key={key}
              variant={activeCategory === key ? 'default' : 'outline'}
              onClick={() => setActiveCategory(key as keyof typeof packingList)}
              className="flex items-center space-x-2"
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
              <Badge variant="secondary" className="ml-2">
                {checked}/{total}
              </Badge>
            </Button>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{categories.find(c => c.key === activeCategory)?.label}</span>
            <Badge variant="outline">
              {packingList[activeCategory].filter(i => i.checked).length} / {packingList[activeCategory].length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {packingList[activeCategory].map((item, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                item.checked ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center space-x-3 flex-1">
                <Checkbox
                  checked={item.checked}
                  onCheckedChange={() => toggleItem(activeCategory, index)}
                />
                <span className={`${item.checked ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                  {item.item}
                </span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => deleteItem(activeCategory, index)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}

          <div className="flex items-center space-x-2 pt-4 border-t">
            <Input
              placeholder="Add custom item..."
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addItem(activeCategory)}
            />
            <Button onClick={() => addItem(activeCategory)}>
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h4 className="font-semibold mb-3 text-blue-900 flex items-center">
            <Check className="w-5 h-5 mr-2" />
            Packing Tips
          </h4>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Roll clothes instead of folding to save space</li>
            <li>• Pack heaviest items at the bottom of your bag</li>
            <li>• Use packing cubes to organize different categories</li>
            <li>• Keep essentials and valuables in carry-on luggage</li>
            <li>• Leave some space for souvenirs and shopping</li>
            <li>• Pack a change of clothes in carry-on for emergencies</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
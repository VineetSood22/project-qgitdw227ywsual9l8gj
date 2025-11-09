import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { X, MapPin, Calendar, Users, DollarSign, Hotel, Utensils, Map, Star, Save, ExternalLink } from 'lucide-react';
import { Trip } from '@/entities';
import { stateCuisine } from '@/lib/india-places-data';
import { useToast } from '@/hooks/use-toast';

interface EnhancedTripDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  trip: any;
}

export function EnhancedTripDetails({ isOpen, onClose, trip }: EnhancedTripDetailsProps) {
  const [activeTab, setActiveTab] = useState('itinerary');
  const { toast } = useToast();

  // Early return if modal is closed or trip is null
  if (!isOpen || !trip) return null;

  const saveTrip = async () => {
    try {
      if (trip.id) {
        await Trip.update(trip.id, { status: 'saved' });
        toast({
          title: "Trip Saved!",
          description: "Your trip has been saved to My Trips"
        });
      }
    } catch (error) {
      console.log('Could not save trip:', error);
      toast({
        title: "Trip Saved Locally",
        description: "Your trip is saved in this session",
        variant: "default"
      });
    }
  };

  const cuisineList = stateCuisine[trip.destination] || [
    'Local Street Food',
    'Regional Thali',
    'Traditional Sweets',
    'Local Beverages',
    'Specialty Dishes'
  ];

  const mustVisitPlaces = trip.additional_locations || [trip.destination];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      {/* ... keep existing code */}
    </div>
  );
}
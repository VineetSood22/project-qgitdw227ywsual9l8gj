import { useState } from 'react';
import { X, Download, Share2, Edit, Calendar, DollarSign, Cloud, Backpack, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ItineraryTab } from './dashboard/ItineraryTab';
import { BudgetTab } from './dashboard/BudgetTab';
import { WeatherTab } from './dashboard/WeatherTab';
import { PackingTab } from './dashboard/PackingTab';
import { ReviewsTab } from './dashboard/ReviewsTab';
import { useToast } from '@/hooks/use-toast';

interface EnhancedTripDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  trip: any;
}

export function EnhancedTripDetails({ isOpen, onClose, trip }: EnhancedTripDetailsProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('itinerary');

  if (!isOpen || !trip) return null;

  const handleDownload = () => {
    const content = `
SAFAR AI - Trip Plan
====================

Destination: ${trip.destination}
Duration: ${trip.duration}
Travelers: ${trip.travelers}
Budget: ${trip.budget}
Transport: ${trip.transport_mode}

${trip.ai_suggestions || 'Trip details are being generated...'}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${trip.destination}-trip-plan.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded!",
      description: "Your trip plan has been saved",
    });
  };

  const handleShare = async () => {
    const shareText = `Check out my ${trip.duration} trip to ${trip.destination}! Planning with SAFAR AI 🌏`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Trip to ${trip.destination}`,
          text: shareText,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(shareText);
      toast({
        title: "Copied!",
        description: "Trip details copied to clipboard",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-hidden">
      <div className="fixed inset-4 bg-white rounded-2xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-orange-500 to-pink-500">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white mb-2">{trip.destination}</h2>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <Calendar className="w-3 h-3 mr-1" />
                {trip.duration}
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {trip.travelers} Traveler{trip.travelers > 1 ? 's' : ''}
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {trip.transport_mode}
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={handleDownload} className="text-white hover:bg-white/20">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button variant="ghost" size="sm" onClick={handleShare} className="text-white hover:bg-white/20">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="w-full justify-start border-b rounded-none bg-gray-50 p-0">
              <TabsTrigger value="itinerary" className="flex items-center space-x-2 data-[state=active]:bg-white">
                <Calendar className="w-4 h-4" />
                <span>Itinerary</span>
              </TabsTrigger>
              <TabsTrigger value="budget" className="flex items-center space-x-2 data-[state=active]:bg-white">
                <DollarSign className="w-4 h-4" />
                <span>Budget</span>
              </TabsTrigger>
              <TabsTrigger value="weather" className="flex items-center space-x-2 data-[state=active]:bg-white">
                <Cloud className="w-4 h-4" />
                <span>Weather</span>
              </TabsTrigger>
              <TabsTrigger value="packing" className="flex items-center space-x-2 data-[state=active]:bg-white">
                <Backpack className="w-4 h-4" />
                <span>Packing</span>
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex items-center space-x-2 data-[state=active]:bg-white">
                <Star className="w-4 h-4" />
                <span>Reviews</span>
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto p-6">
              <TabsContent value="itinerary" className="mt-0">
                <ItineraryTab trip={trip} />
              </TabsContent>

              <TabsContent value="budget" className="mt-0">
                <BudgetTab trip={trip} />
              </TabsContent>

              <TabsContent value="weather" className="mt-0">
                <WeatherTab trip={trip} />
              </TabsContent>

              <TabsContent value="packing" className="mt-0">
                <PackingTab trip={trip} />
              </TabsContent>

              <TabsContent value="reviews" className="mt-0">
                <ReviewsTab trip={trip} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
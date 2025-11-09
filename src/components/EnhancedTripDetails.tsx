import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { X, MapPin, Calendar, Users, Wallet, Download, Share2 } from 'lucide-react';
import { ItineraryTab } from './dashboard/ItineraryTab';
import { WeatherTab } from './dashboard/WeatherTab';
import { PackingTab } from './dashboard/PackingTab';
import { BudgetTab } from './dashboard/BudgetTab';
import { ReviewsTab } from './dashboard/ReviewsTab';
import { CrowdInfoTab } from './dashboard/CrowdInfoTab';
import { TransportTab } from './dashboard/TransportTab';
import { useToast } from '@/hooks/use-toast';

interface EnhancedTripDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  trip: any;
}

export function EnhancedTripDetails({ isOpen, onClose, trip }: EnhancedTripDetailsProps) {
  const [activeTab, setActiveTab] = useState('itinerary');
  const { toast } = useToast();

  if (!trip) return null;

  const handleDownload = () => {
    toast({
      title: 'Download Started',
      description: 'Your trip itinerary is being prepared for download.',
    });
  };

  const handleShare = () => {
    toast({
      title: 'Share Link Copied',
      description: 'Trip link has been copied to clipboard.',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="pr-12">
              <h2 className="text-3xl font-bold mb-3">{trip.name || trip.destination}</h2>
              
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{trip.destination}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{trip.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{trip.travelers} Travelers</span>
                </div>
                {trip.budget && (
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4" />
                    <span>{trip.budget}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  onClick={handleDownload}
                  size="sm"
                  variant="secondary"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button
                  onClick={handleShare}
                  size="sm"
                  variant="secondary"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Trip
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex-1 overflow-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="sticky top-0 bg-white border-b z-10">
                <TabsList className="w-full justify-start rounded-none h-auto p-0 bg-transparent">
                  <TabsTrigger value="itinerary" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-orange-500">
                    Itinerary
                  </TabsTrigger>
                  <TabsTrigger value="weather" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-orange-500">
                    Weather
                  </TabsTrigger>
                  <TabsTrigger value="packing" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-orange-500">
                    Packing
                  </TabsTrigger>
                  <TabsTrigger value="budget" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-orange-500">
                    Budget
                  </TabsTrigger>
                  <TabsTrigger value="transport" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-orange-500">
                    Transport
                  </TabsTrigger>
                  <TabsTrigger value="crowd" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-orange-500">
                    Crowd Info
                  </TabsTrigger>
                  <TabsTrigger value="reviews" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-orange-500">
                    Reviews
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="p-6">
                <TabsContent value="itinerary" className="mt-0">
                  <ItineraryTab trip={trip} />
                </TabsContent>

                <TabsContent value="weather" className="mt-0">
                  <WeatherTab trip={trip} />
                </TabsContent>

                <TabsContent value="packing" className="mt-0">
                  <PackingTab trip={trip} />
                </TabsContent>

                <TabsContent value="budget" className="mt-0">
                  <BudgetTab trip={trip} />
                </TabsContent>

                <TabsContent value="transport" className="mt-0">
                  <TransportTab trip={trip} />
                </TabsContent>

                <TabsContent value="crowd" className="mt-0">
                  <CrowdInfoTab trip={trip} />
                </TabsContent>

                <TabsContent value="reviews" className="mt-0">
                  <ReviewsTab trip={trip} />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
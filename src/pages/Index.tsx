import { useState } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { DestinationGallery } from '@/components/DestinationGallery';
import { TripPlanner } from '@/components/TripPlanner';
import { TripModal } from '@/components/TripModal';
import { TripDetails } from '@/components/TripDetails';
import { Footer } from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [isTripPlannerOpen, setIsTripPlannerOpen] = useState(false);
  const [isTripModalOpen, setIsTripModalOpen] = useState(false);
  const [isTripDetailsOpen, setIsTripDetailsOpen] = useState(false);
  const [currentTrip, setCurrentTrip] = useState(null);
  const { toast } = useToast();

  const handlePlanTrip = () => {
    setIsTripModalOpen(true);
  };

  const handleTripCreated = (tripData: any) => {
    setCurrentTrip(tripData);
    setIsTripDetailsOpen(true);
    setIsTripModalOpen(false);
  };

  const handleActionClick = async (action: string) => {
    setIsTripPlannerOpen(true);
    
    try {
      toast({
        title: "SAFAR AI Activated",
        description: "Your AI travel assistant is ready to help plan your Indian adventure!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to activate AI assistant. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen">
      <Header onPlanTrip={handlePlanTrip} />
      <Hero onActionClick={handleActionClick} />
      <DestinationGallery />
      <Footer />
      
      <TripPlanner 
        isOpen={isTripPlannerOpen} 
        onClose={() => setIsTripPlannerOpen(false)} 
      />
      
      <TripModal 
        isOpen={isTripModalOpen} 
        onClose={() => setIsTripModalOpen(false)}
        onTripCreated={handleTripCreated}
      />

      <TripDetails
        isOpen={isTripDetailsOpen}
        onClose={() => setIsTripDetailsOpen(false)}
        tripData={currentTrip}
      />
    </div>
  );
};

export default Index;
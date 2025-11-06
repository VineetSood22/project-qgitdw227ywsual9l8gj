import { useState } from 'react';
import { EnhancedHeader } from '@/components/EnhancedHeader';
import { Hero } from '@/components/Hero';
import { DestinationGallery } from '@/components/DestinationGallery';
import { TripModal } from '@/components/TripModal';
import { TripGenerationModal } from '@/components/TripGenerationModal';
import { EnhancedTripDetails } from '@/components/EnhancedTripDetails';
import { MyTrips } from '@/components/MyTrips';
import { EnhancedTripPlanner } from '@/components/EnhancedTripPlanner';
import { Footer } from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [isTripModalOpen, setIsTripModalOpen] = useState(false);
  const [isTripGenerationOpen, setIsTripGenerationOpen] = useState(false);
  const [isTripDetailsOpen, setIsTripDetailsOpen] = useState(false);
  const [isMyTripsOpen, setIsMyTripsOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [generatingTrip, setGeneratingTrip] = useState(null);
  const { toast } = useToast();

  const handlePlanTrip = () => {
    setIsTripModalOpen(true);
  };

  const handleTripCreated = (tripData: any) => {
    setGeneratingTrip(tripData);
    setIsTripGenerationOpen(true);
    setIsTripModalOpen(false);
  };

  const handleGenerationComplete = (generatedTrip: any) => {
    setCurrentTrip(generatedTrip);
    setIsTripGenerationOpen(false);
    setIsTripDetailsOpen(true);
  };

  const handleViewTrip = (trip: any) => {
    // Parse AI suggestions if they exist
    let aiPlan = {};
    if (trip.ai_suggestions) {
      try {
        aiPlan = JSON.parse(trip.ai_suggestions);
      } catch (error) {
        console.error('Failed to parse AI suggestions:', error);
      }
    }
    
    setCurrentTrip({ ...trip, ai_plan: aiPlan });
    setIsMyTripsOpen(false);
    setIsTripDetailsOpen(true);
  };

  const handleActionClick = async (action: string) => {
    setIsAIAssistantOpen(true);
    
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
      <EnhancedHeader 
        onPlanTrip={handlePlanTrip}
        onMyTrips={() => setIsMyTripsOpen(true)}
        onAIAssistant={() => setIsAIAssistantOpen(true)}
      />
      <Hero onActionClick={handleActionClick} />
      <DestinationGallery />
      <Footer />
      
      <TripModal 
        isOpen={isTripModalOpen} 
        onClose={() => setIsTripModalOpen(false)}
        onTripCreated={handleTripCreated}
      />

      <TripGenerationModal
        isOpen={isTripGenerationOpen}
        onClose={() => setIsTripGenerationOpen(false)}
        tripData={generatingTrip}
        onComplete={handleGenerationComplete}
      />

      <EnhancedTripDetails
        isOpen={isTripDetailsOpen}
        onClose={() => setIsTripDetailsOpen(false)}
        tripData={currentTrip}
      />

      <MyTrips
        isOpen={isMyTripsOpen}
        onClose={() => setIsMyTripsOpen(false)}
        onViewTrip={handleViewTrip}
      />

      <EnhancedTripPlanner 
        isOpen={isAIAssistantOpen} 
        onClose={() => setIsAIAssistantOpen(false)} 
      />
    </div>
  );
};

export default Index;
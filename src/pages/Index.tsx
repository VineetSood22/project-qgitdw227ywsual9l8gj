import { useState, useEffect } from 'react';
import { EnhancedHeader } from '@/components/EnhancedHeader';
import { Hero } from '@/components/Hero';
import { DestinationGallery } from '@/components/DestinationGallery';
import { PackagesGallery } from '@/components/PackagesGallery';
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

  const handleSelectPackage = (pkg: any) => {
    toast({
      title: "Package Selected",
      description: `Creating trip based on ${pkg.name}`,
    });
    setIsTripModalOpen(true);
  };

  const handleTripCreated = (tripData: any) => {
    console.log('Trip created:', tripData);
    setGeneratingTrip(tripData);
    setIsTripGenerationOpen(true);
    setIsTripModalOpen(false);
  };

  const handleGenerationComplete = (generatedTrip: any) => {
    console.log('Trip generation complete:', generatedTrip);
    setCurrentTrip(generatedTrip);
    setIsTripGenerationOpen(false);
    setIsTripDetailsOpen(true);
  };

  const handleViewTrip = (trip: any) => {
    console.log('Viewing trip:', trip);
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
    console.log('Action clicked:', action);
    setIsAIAssistantOpen(true);
    
    toast({
      title: "SAFAR AI Activated",
      description: "Your AI travel assistant is ready to help plan your Indian adventure!"
    });
  };

  return (
    <div className="min-h-screen">
      <EnhancedHeader 
        onPlanTrip={handlePlanTrip}
        onMyTrips={() => setIsMyTripsOpen(true)}
        onAIAssistant={() => setIsAIAssistantOpen(true)}
      />
      <Hero onActionClick={handleActionClick} />
      <PackagesGallery onSelectPackage={handleSelectPackage} />
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
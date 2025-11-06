import { useState } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { DestinationGallery } from '@/components/DestinationGallery';
import { TripPlanner } from '@/components/TripPlanner';
import { TripModal } from '@/components/TripModal';
import { Footer } from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { invokeLLM } from '@/integrations/core';

const Index = () => {
  const [isTripPlannerOpen, setIsTripPlannerOpen] = useState(false);
  const [isTripModalOpen, setIsTripModalOpen] = useState(false);
  const { toast } = useToast();

  const handlePlanTrip = () => {
    setIsTripModalOpen(true);
  };

  const handleActionClick = async (action: string) => {
    setIsTripPlannerOpen(true);
    
    // Generate AI response based on action
    try {
      let prompt = '';
      switch (action) {
        case 'incredible-views':
          prompt = 'Tell me about the most incredible scenic views and landscapes in India. Include specific locations, best viewing spots, and photography tips.';
          break;
        case 'bucket-list-food':
          prompt = 'What are the must-try bucket-list foods and culinary experiences across different regions of India? Include specific dishes, restaurants, and food tours.';
          break;
        case 'family-road-trip':
          prompt = 'Help me plan an amazing family road trip in India. Suggest routes, family-friendly destinations, and practical tips for traveling with kids.';
          break;
        case 'cultural-destinations':
          prompt = 'What are the top cultural destinations in India? Include heritage sites, museums, festivals, and cultural experiences that showcase India\'s rich history.';
          break;
        default:
          prompt = 'Tell me about amazing travel experiences in India.';
      }

      // The AI response will be handled by the TripPlanner component
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
      />
    </div>
  );
};

export default Index;
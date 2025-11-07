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
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/entities';
import { LogIn, LogOut } from 'lucide-react';

const Index = () => {
  const [isTripModalOpen, setIsTripModalOpen] = useState(false);
  const [isTripGenerationOpen, setIsTripGenerationOpen] = useState(false);
  const [isTripDetailsOpen, setIsTripDetailsOpen] = useState(false);
  const [isMyTripsOpen, setIsMyTripsOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [generatingTrip, setGeneratingTrip] = useState(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
    } catch (error) {
      // User not logged in
      setCurrentUser(null);
    }
  };

  const handleLogin = async () => {
    try {
      await User.login();
    } catch (error) {
      toast({
        title: "Login Error",
        description: "Failed to login. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleLogout = async () => {
    try {
      await User.logout();
      setCurrentUser(null);
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out."
      });
    } catch (error) {
      toast({
        title: "Logout Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handlePlanTrip = () => {
    if (!currentUser) {
      toast({
        title: "Login Required",
        description: "Please login to plan a trip.",
        variant: "destructive"
      });
      handleLogin();
      return;
    }
    setIsTripModalOpen(true);
  };

  const handleSelectPackage = (pkg: any) => {
    if (!currentUser) {
      toast({
        title: "Login Required",
        description: "Please login to select a package.",
        variant: "destructive"
      });
      handleLogin();
      return;
    }
    
    // Pre-fill trip modal with package data
    toast({
      title: "Package Selected",
      description: `Creating trip based on ${pkg.name}`,
    });
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
      {/* Login/Logout Button */}
      <div className="fixed top-4 right-4 z-50">
        {currentUser ? (
          <div className="flex items-center space-x-2 bg-white rounded-lg shadow-lg p-2">
            <span className="text-sm font-medium px-2">{currentUser.full_name || currentUser.email}</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-1" />
              Logout
            </Button>
          </div>
        ) : (
          <Button 
            onClick={handleLogin}
            className="bg-orange-500 hover:bg-orange-600 shadow-lg"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Login
          </Button>
        )}
      </div>

      <EnhancedHeader 
        onPlanTrip={handlePlanTrip}
        onMyTrips={() => {
          if (!currentUser) {
            toast({
              title: "Login Required",
              description: "Please login to view your trips.",
              variant: "destructive"
            });
            handleLogin();
            return;
          }
          setIsMyTripsOpen(true);
        }}
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
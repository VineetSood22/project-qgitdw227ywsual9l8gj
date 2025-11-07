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
import { LogIn, LogOut, Loader2 } from 'lucide-react';

const Index = () => {
  const [isTripModalOpen, setIsTripModalOpen] = useState(false);
  const [isTripGenerationOpen, setIsTripGenerationOpen] = useState(false);
  const [isTripDetailsOpen, setIsTripDetailsOpen] = useState(false);
  const [isMyTripsOpen, setIsMyTripsOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [generatingTrip, setGeneratingTrip] = useState(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    setIsCheckingAuth(true);
    try {
      const user = await User.me();
      console.log('Current user:', user);
      setCurrentUser(user);
    } catch (error) {
      console.log('User not logged in:', error);
      setCurrentUser(null);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const handleLogin = async () => {
    try {
      console.log('Initiating login...');
      await User.login();
      // After login redirect, user will be checked again
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Error",
        description: "Failed to login. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await User.logout();
      setCurrentUser(null);
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out."
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoggingOut(false);
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
      {/* Login/Logout Button */}
      <div className="fixed top-4 right-4 z-50">
        {isCheckingAuth ? (
          <div className="bg-white rounded-lg shadow-lg p-3">
            <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
          </div>
        ) : currentUser ? (
          <div className="flex items-center space-x-2 bg-white rounded-lg shadow-lg p-2">
            <span className="text-sm font-medium px-2">
              {currentUser.full_name || currentUser.email}
            </span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <LogOut className="w-4 h-4 mr-1" />
              )}
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
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Map, BookOpen } from 'lucide-react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Footer } from '@/components/Footer';
import { TripModal } from '@/components/TripModal';
import { TripGenerationModal } from '@/components/TripGenerationModal';
import { EnhancedTripDetails } from '@/components/EnhancedTripDetails';
import { MyTrips } from '@/components/MyTrips';
import { EnhancedTripPlanner } from '@/components/EnhancedTripPlanner';

export default function Index() {
  const [isTripModalOpen, setIsTripModalOpen] = useState(false);
  const [isGenerationModalOpen, setIsGenerationModalOpen] = useState(false);
  const [isTripDetailsOpen, setIsTripDetailsOpen] = useState(false);
  const [isMyTripsOpen, setIsMyTripsOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [currentTripData, setCurrentTripData] = useState<any>(null);
  const [generatedTrip, setGeneratedTrip] = useState<any>(null);

  const handleTripCreated = (tripData: any) => {
    console.log('Trip created:', tripData);
    setCurrentTripData(tripData);
    setIsTripModalOpen(false);
    setIsGenerationModalOpen(true);
  };

  const handleGenerationComplete = (trip: any) => {
    console.log('Trip generation complete:', trip);
    setGeneratedTrip(trip);
    setIsGenerationModalOpen(false);
    setIsTripDetailsOpen(true);
  };

  const handleViewTrip = (trip: any) => {
    console.log('Viewing trip:', trip);
    setGeneratedTrip(trip);
    setIsMyTripsOpen(false);
    setIsTripDetailsOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <Header />
      <Hero />

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Start Your Journey</h2>
          <p className="text-gray-600 text-lg">Choose how you want to plan your perfect trip</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div
            onClick={() => setIsTripModalOpen(true)}
            className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-orange-500"
          >
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Map className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-center mb-2">Dream Your Trip</h3>
            <p className="text-gray-600 text-center text-sm">
              Select your state and choose from famous places to create your perfect itinerary
            </p>
          </div>

          <div
            onClick={() => setIsMyTripsOpen(true)}
            className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-orange-500"
          >
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-center mb-2">My Trips</h3>
            <p className="text-gray-600 text-center text-sm">
              View and manage all your saved trips in one place
            </p>
          </div>

          <div
            onClick={() => setIsAIAssistantOpen(true)}
            className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-orange-500"
          >
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-center mb-2">AI Assistant</h3>
            <p className="text-gray-600 text-center text-sm">
              Chat with SAFAR AI for personalized travel recommendations
            </p>
          </div>
        </div>
      </div>

      <Footer />

      <TripModal
        isOpen={isTripModalOpen}
        onClose={() => setIsTripModalOpen(false)}
        onTripCreated={handleTripCreated}
      />

      <TripGenerationModal
        isOpen={isGenerationModalOpen}
        onClose={() => setIsGenerationModalOpen(false)}
        tripData={currentTripData}
        onComplete={handleGenerationComplete}
      />

      <EnhancedTripDetails
        isOpen={isTripDetailsOpen}
        onClose={() => setIsTripDetailsOpen(false)}
        trip={generatedTrip}
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
}
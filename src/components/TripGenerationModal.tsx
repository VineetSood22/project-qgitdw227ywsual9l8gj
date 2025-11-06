import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X, MapPin, Calendar, Users, Wallet, Plane, Train, Bus, Car } from 'lucide-react';

interface TripGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripData: any;
  onComplete: (generatedTrip: any) => void;
}

const generationSteps = [
  { step: 1, label: "Analyzing destination", progress: 15 },
  { step: 2, label: "Finding best routes", progress: 30 },
  { step: 3, label: "Searching accommodations", progress: 45 },
  { step: 4, label: "Planning activities", progress: 60 },
  { step: 5, label: "Checking weather conditions", progress: 75 },
  { step: 6, label: "Calculating budget", progress: 90 },
  { step: 7, label: "Finalizing your perfect trip", progress: 100 }
];

export function TripGenerationModal({ isOpen, onClose, tripData, onComplete }: TripGenerationModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < generationSteps.length - 1) {
          const nextStep = prev + 1;
          setProgress(generationSteps[nextStep].progress);
          return nextStep;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            onComplete(tripData);
          }, 1000);
          return prev;
        }
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isOpen, tripData, onComplete]);

  if (!isOpen) return null;

  const getTransportIcon = (mode: string) => {
    switch (mode?.toLowerCase()) {
      case 'flight': return <Plane className="w-6 h-6" />;
      case 'train': return <Train className="w-6 h-6" />;
      case 'bus': return <Bus className="w-6 h-6" />;
      case 'car': return <Car className="w-6 h-6" />;
      default: return <MapPin className="w-6 h-6" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-orange-500 via-orange-600 to-red-600">
      <div className="absolute inset-0 bg-black/20" />
      
      {/* Close button */}
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onClose}
        className="absolute top-6 right-6 text-white hover:bg-white/20 z-10"
      >
        <X className="w-6 h-6" />
      </Button>

      <div className="relative h-full flex items-center justify-center p-8">
        <div className="max-w-2xl w-full text-center text-white">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent">
              Creating Your Perfect Trip
            </h1>
            <p className="text-xl text-orange-100">
              Our AI is crafting a personalized journey just for you
            </p>
          </div>

          {/* Trip Info Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
              <MapPin className="w-8 h-8 mx-auto mb-2 text-orange-200" />
              <p className="text-sm text-orange-100">Destination</p>
              <p className="font-semibold">{tripData?.destination}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-orange-200" />
              <p className="text-sm text-orange-100">Duration</p>
              <p className="font-semibold">{tripData?.duration}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
              <Users className="w-8 h-8 mx-auto mb-2 text-orange-200" />
              <p className="text-sm text-orange-100">Travelers</p>
              <p className="font-semibold">{tripData?.travelers}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
              {getTransportIcon(tripData?.transportMode)}
              <p className="text-sm text-orange-100 mt-2">Transport</p>
              <p className="font-semibold capitalize">{tripData?.transportMode}</p>
            </div>
          </div>

          {/* Progress Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold">{progress}%</span>
                <span className="text-orange-200">Complete</span>
              </div>
              <Progress value={progress} className="h-3 bg-white/20" />
            </div>

            <div className="space-y-4">
              {generationSteps.map((step, index) => (
                <div 
                  key={step.step}
                  className={`flex items-center space-x-4 p-3 rounded-xl transition-all duration-500 ${
                    index <= currentStep 
                      ? 'bg-white/20 text-white' 
                      : 'bg-white/5 text-orange-200'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index < currentStep 
                      ? 'bg-green-500 text-white' 
                      : index === currentStep 
                        ? 'bg-white text-orange-600 animate-pulse' 
                        : 'bg-white/20 text-orange-300'
                  }`}>
                    {index < currentStep ? '✓' : step.step}
                  </div>
                  <span className="font-medium">{step.label}</span>
                  {index === currentStep && (
                    <div className="ml-auto">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Fun Facts */}
          <div className="mt-8 text-orange-100">
            <p className="text-sm">
              💡 Did you know? India has over 40 UNESCO World Heritage Sites!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
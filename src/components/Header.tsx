import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, MapPin, Compass, Calendar, Route, Sparkles } from 'lucide-react';

interface HeaderProps {
  onPlanTrip: () => void;
}

export function Header({ onPlanTrip }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-morphism">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 saffron-gradient rounded-lg flex items-center justify-center">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">SAFAR AI</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-1 text-white hover:text-orange-300 cursor-pointer transition-colors">
              <MapPin className="w-4 h-4" />
              <span>Destinations</span>
            </div>
            <div className="flex items-center space-x-1 text-white hover:text-orange-300 cursor-pointer transition-colors">
              <Sparkles className="w-4 h-4" />
              <span>Experiences</span>
            </div>
            <div className="flex items-center space-x-1 text-white hover:text-orange-300 cursor-pointer transition-colors">
              <Calendar className="w-4 h-4" />
              <span>India250</span>
            </div>
            <div className="flex items-center space-x-1 text-white hover:text-orange-300 cursor-pointer transition-colors">
              <Route className="w-4 h-4" />
              <span>Road Trips</span>
            </div>
            <span className="text-white hover:text-orange-300 cursor-pointer transition-colors">Major Events</span>
          </nav>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-4 text-sm text-white">
              <span className="hover:text-orange-300 cursor-pointer transition-colors">🇮🇳 Visa & Entry</span>
              <span className="hover:text-orange-300 cursor-pointer transition-colors">📱 Travel Trade</span>
              <span className="hover:text-orange-300 cursor-pointer transition-colors">English ›</span>
            </div>
            <Button 
              onClick={onPlanTrip}
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Plan a trip
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-white/20">
            <nav className="flex flex-col space-y-4 mt-4">
              <div className="flex items-center space-x-2 text-white hover:text-orange-300 cursor-pointer transition-colors">
                <MapPin className="w-4 h-4" />
                <span>Destinations</span>
              </div>
              <div className="flex items-center space-x-2 text-white hover:text-orange-300 cursor-pointer transition-colors">
                <Sparkles className="w-4 h-4" />
                <span>Experiences</span>
              </div>
              <div className="flex items-center space-x-2 text-white hover:text-orange-300 cursor-pointer transition-colors">
                <Calendar className="w-4 h-4" />
                <span>India250</span>
              </div>
              <div className="flex items-center space-x-2 text-white hover:text-orange-300 cursor-pointer transition-colors">
                <Route className="w-4 h-4" />
                <span>Road Trips</span>
              </div>
              <span className="text-white hover:text-orange-300 cursor-pointer transition-colors">Major Events</span>
              <Button 
                onClick={onPlanTrip}
                className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm w-full mt-4"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Plan a trip
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
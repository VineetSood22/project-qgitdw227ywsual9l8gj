import { Button } from '@/components/ui/button';
import { Sparkles, Eye, MapPin, Users, Palette } from 'lucide-react';

interface HeroProps {
  onActionClick: (action: string) => void;
}

export function Hero({ onActionClick }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80')`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 text-shadow fade-in">
          INCREDIBLE
          <br />
          <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
            INDIA
          </span>
        </h1>

        <div className="flex items-center justify-center mb-8">
          <Sparkles className="w-6 h-6 text-orange-400 mr-2" />
          <p className="text-xl text-white/90">Get travel ideas</p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto mb-12">
          <Button
            onClick={() => onActionClick('incredible-views')}
            className="glass-morphism text-white hover:bg-white/20 py-6 px-6 text-left flex items-center space-x-3 group"
          >
            <Eye className="w-5 h-5 text-orange-400 group-hover:scale-110 transition-transform" />
            <span>Show me incredible views</span>
          </Button>
          
          <Button
            onClick={() => onActionClick('bucket-list-food')}
            className="glass-morphism text-white hover:bg-white/20 py-6 px-6 text-left flex items-center space-x-3 group"
          >
            <Sparkles className="w-5 h-5 text-orange-400 group-hover:scale-110 transition-transform" />
            <span>Find bucket-list cuisine</span>
          </Button>
          
          <Button
            onClick={() => onActionClick('family-road-trip')}
            className="glass-morphism text-white hover:bg-white/20 py-6 px-6 text-left flex items-center space-x-3 group"
          >
            <Users className="w-5 h-5 text-orange-400 group-hover:scale-110 transition-transform" />
            <span>Build my family road trip</span>
          </Button>
          
          <Button
            onClick={() => onActionClick('cultural-destinations')}
            className="glass-morphism text-white hover:bg-white/20 py-6 px-6 text-left flex items-center space-x-3 group"
          >
            <Palette className="w-5 h-5 text-orange-400 group-hover:scale-110 transition-transform" />
            <span>See top cultural destinations</span>
          </Button>
        </div>

        {/* Bottom Banner */}
        <div className="glass-morphism rounded-full px-8 py-4 inline-flex items-center space-x-4">
          <span className="text-white text-lg">India is Open | Most Travel Services Operating With Minor Delays.</span>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-6">
            Plan Your Visit
          </Button>
        </div>
      </div>

      {/* Trip Planner Button - Fixed Position */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-20">
        <div className="writing-vertical text-white bg-black/50 backdrop-blur-sm px-4 py-8 rounded-l-lg">
          <span className="text-sm font-medium">Trip Planner</span>
        </div>
      </div>
    </section>
  );
}
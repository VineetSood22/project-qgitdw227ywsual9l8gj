import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const destinations = [
  {
    id: 1,
    title: "3 Things To Do in Kerala",
    subtitle: "God's Own Country",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    badge: "INDIA"
  },
  {
    id: 2,
    title: "Day Trip to Golden Temple",
    subtitle: "from Amritsar",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    badge: "INDIA"
  },
  {
    id: 3,
    title: "5 Free Things To Do in Goa",
    subtitle: "Beach Paradise",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    badge: "INDIA"
  },
  {
    id: 4,
    title: "Rajasthan: The Land of Kings",
    subtitle: "Royal Heritage",
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    badge: "INDIA"
  },
  {
    id: 5,
    title: "Kashmir: Paradise on Earth",
    subtitle: "Himalayan Beauty",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    badge: "INDIA"
  }
];

export function DestinationGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % destinations.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + destinations.length) % destinations.length);
  };

  const getVisibleDestinations = () => {
    const visible = [];
    for (let i = 0; i < 4; i++) {
      const index = (currentIndex + i) % destinations.length;
      visible.push(destinations[index]);
    }
    return visible;
  };

  return (
    <section className="bg-slate-800 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
            JOIN THE ADVENTURE. FOLLOW @SAFARAI
          </h2>
        </div>

        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 text-white transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 text-white transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Destination Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-16">
            {getVisibleDestinations().map((destination, index) => (
              <div
                key={`${destination.id}-${currentIndex}-${index}`}
                className="relative group cursor-pointer hover-scale"
              >
                <div className="relative h-80 rounded-lg overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  
                  {/* Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {destination.badge}
                    </span>
                  </div>
                  
                  {/* Content */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-bold text-lg mb-1">
                      {destination.title}
                    </h3>
                    <p className="text-white/80 text-sm">
                      {destination.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="text-center mt-16">
          <div className="glass-morphism rounded-full px-8 py-4 inline-flex items-center space-x-4">
            <span className="text-white text-lg">India is Open | Most Travel Services Operating With Minor Delays.</span>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-6">
              Plan Your Visit
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
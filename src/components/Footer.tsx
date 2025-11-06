import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 saffron-gradient rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">SAFAR AI</span>
            </div>
            <p className="text-gray-300 mb-4">
              Your AI-powered companion for exploring incredible India. Discover hidden gems, plan perfect trips, and create unforgettable memories.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Instagram className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Youtube className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Destinations */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Popular Destinations</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="hover:text-white cursor-pointer transition-colors">Rajasthan</li>
              <li className="hover:text-white cursor-pointer transition-colors">Kerala</li>
              <li className="hover:text-white cursor-pointer transition-colors">Goa</li>
              <li className="hover:text-white cursor-pointer transition-colors">Kashmir</li>
              <li className="hover:text-white cursor-pointer transition-colors">Himachal Pradesh</li>
              <li className="hover:text-white cursor-pointer transition-colors">Uttarakhand</li>
            </ul>
          </div>

          {/* Experiences */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Experiences</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="hover:text-white cursor-pointer transition-colors">Cultural Tours</li>
              <li className="hover:text-white cursor-pointer transition-colors">Adventure Travel</li>
              <li className="hover:text-white cursor-pointer transition-colors">Spiritual Journeys</li>
              <li className="hover:text-white cursor-pointer transition-colors">Wildlife Safaris</li>
              <li className="hover:text-white cursor-pointer transition-colors">Beach Holidays</li>
              <li className="hover:text-white cursor-pointer transition-colors">Mountain Treks</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>hello@safarai.com</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 mt-1" />
                <span>123 Travel Street<br />New Delhi, India 110001</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 SAFAR AI. All rights reserved. | Proudly promoting Incredible India
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0 text-sm text-gray-400">
              <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
              <span className="hover:text-white cursor-pointer transition-colors">Cookie Policy</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
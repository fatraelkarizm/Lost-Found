
import { Search, Heart, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <div className="bg-gradient-to-br from-[#eff6ff] to-[##dbeafe] py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left animate-fade-in">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Reunite with Your
              <span className="text-primary-600 block">Lost Items</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Join our community-driven platform where lost becomes found. 
              Connect with people in your area and help each other recover precious belongings.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button 
                size="lg" 
                className="bg-primary text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Register Now
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-[#1e40af] text-[#1e40af] hover:bg-[#1e40af] hover:text-white px-8 py-4 text-lg font-semibold transition-all duration-300"
              >
                Find an Item
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="w-12 h-12 bg-[#dbeafe] rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search className="w-6 h-6 text-[#1e40af]" />
                </div>
                <p className="text-sm font-medium text-gray-700">Smart Search</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-[#dbeafe] rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-[#1e40af]" />
                </div>
                <p className="text-sm font-medium text-gray-700">Community Driven</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-[#dbeafe] rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-[#1e40af]" />
                </div>
                <p className="text-sm font-medium text-gray-700">Safe & Secure</p>
              </div>
            </div>
          </div>

          {/* Right Column - Visual Element */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="aspect-square bg-gradient-to-br from-[#60a5fa] to-[#1e40af] rounded-xl flex items-center justify-center">
                <div className="text-center text-white">
                  <Search className="w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Your Items</h3>
                  <p className="text-primary-100">Are Waiting</p>
                </div>
              </div>
            </div>
            
            {/* Floating Cards */}
            <div className="absolute -top-4 -left-4 bg-white rounded-lg shadow-lg p-4 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xs font-bold">✓</span>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-lg p-4 transform rotate-6 hover:rotate-0 transition-transform duration-300">
              <div className="w-8 h-8 bg-[#60a5fa] rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

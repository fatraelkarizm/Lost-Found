
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to scroll to a specific section
  // This function uses the section ID to find the element and scrolls to it smoothly
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-[#1d4ed8]">Lost&Found</span>
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex items-center space-x-8 cursor-pointer">
              <button 
                onClick={() => scrollToSection('home')}
                className="text-gray-700 hover:text-[#1d4ed8] font-medium transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('browse-items')}
                className="text-gray-700 hover:text-[#1d4ed8] font-medium transition-colors"
              >
                Browse Items
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="text-gray-700 hover:text-[#1d4ed8] font-medium transition-colors"
              >
                How It Works
              </button>
              <button 
                onClick={() => scrollToSection('success-stories')}
                className="text-gray-700 hover:text-[#1d4ed8] font-medium transition-colors"
              >
                Success Stories
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost" className="text-gray-700 hover:text-[#1d4ed8] hover:bg-gray-100">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" className="border text-[#1d4ed8] hover:bg-gray-100">
                Register
              </Button>
            </Link>
            <Link to="/post-item">
              <Button className="bg-primary text-white">
                Post an Item
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-4">
              {/* Mobile Navigation Links */}
              <div className="flex flex-col space-y-2">
                <button 
                  onClick={() => scrollToSection('home')}
                  className="text-gray-700 hover:text-[#1d4ed8]-600 font-medium py-2 text-left"
                >
                  Home
                </button>
                <button 
                  onClick={() => scrollToSection('browse-items')}
                  className="text-gray-700 hover:text-[#1d4ed8]-600 font-medium py-2 text-left"
                >
                  Browse Items
                </button>
                <button 
                  onClick={() => scrollToSection('how-it-works')}
                  className="text-gray-700 hover:text-[#1d4ed8]-600 font-medium py-2 text-left"
                >
                  How It Works
                </button>
                <button 
                  onClick={() => scrollToSection('success-stories')}
                  className="text-gray-700 hover:text-[#1d4ed8]-600 font-medium py-2 text-left"
                >
                  Success Stories
                </button>
              </div>
              
              {/* Mobile Action Buttons */}
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                <Link to="/login">
                  <Button variant="ghost" className="justify-start text-gray-700 w-full">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline" className="justify-start border-primary-600 text-[#1d4ed8]-600 w-full">
                    Register
                  </Button>
                </Link>
                <Link to="/post-item">
                  <Button className="bg-primary text-white justify-start w-full">
                    Post an Item
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;


import { MessageCircle, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ContactFinder = () => {
  return (
    <div className="fixed bottom-4 right-4 z-40">
      <div className="bg-primary text-white rounded-full p-4 shadow-lg hover:bg-primary-700 transition-colors cursor-pointer group">
        <div className="flex items-center gap-1">
          <MessageCircle className="w-6 h-6" />
          <span className="hidden group-hover:block whitespace-nowrap font-medium">
            Contact Finder
          </span>
        </div>
        
        {/* Tooltip/Expanded options on hover */}
        <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-white rounded-lg shadow-lg p-3 min-w-[200px]">
            <div className="space-y-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start text-gray-700 hover:bg-primary-50"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call Finder
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start text-gray-700 hover:bg-primary-50"
              >
                <Mail className="w-4 h-4 mr-2" />
                Email Finder
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start text-gray-700 hover:bg-primary-50"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactFinder;

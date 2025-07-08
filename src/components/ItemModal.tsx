
import { useState } from 'react';
import { X, MapPin, Clock, User, Send, Phone, Mail, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Comment {
  id: number;
  author: string;
  message: string;
  timeAgo: string;
  avatar?: string;
}

interface ItemModalProps {
  item: {
    id: number;
    title: string;
    category: string;
    location: string;
    timeAgo: string;
    description: string;
    image: string;
    status: string;
    urgent: boolean;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

const ItemModal = ({ item, isOpen, onClose }: ItemModalProps) => {
  const [newComment, setNewComment] = useState('');
  const [showContactOptions, setShowContactOptions] = useState(false);
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: "Sarah M.",
      message: "I think I saw this near the coffee shop on Main Street yesterday!",
      timeAgo: "2 hours ago"
    },
    {
      id: 2,
      author: "Mike R.",
      message: "Hope you find the owner soon. Such a beautiful item!",
      timeAgo: "4 hours ago"
    }
  ]);

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: comments.length + 1,
        author: "You",
        message: newComment,
        timeAgo: "Just now"
      };
      setComments([comment, ...comments]);
      setNewComment('');
    }
  };

  const handleContact = (method: string) => {
    console.log(`Contacting finder via ${method}`);
    // Here you would implement the actual contact functionality
    setShowContactOptions(false);
  };

  if (!isOpen || !item) return null;

  return (
      <div className="fixed inset-0 bg-opacity-10 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">{item.title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Item Details */}
          <div className="p-4">
            <div className="mb-4">
              <img 
                src={item.image} 
                alt={item.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>

            <div className="flex gap-2 mb-3">
              <Badge className="bg-green-100 text-green-800 border-green-200">
                {item.status}
              </Badge>
              {item.urgent && (
                <Badge className="bg-red-100 text-red-800 border-red-200">
                  Urgent
                </Badge>
              )}
              <Badge variant="outline">
                {item.category}
              </Badge>
            </div>

            <p className="text-gray-600 mb-4">{item.description}</p>

            <div className="flex items-center text-sm text-gray-500 mb-6">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="mr-4">{item.location}</span>
              <Clock className="w-4 h-4 mr-1" />
              <span>{item.timeAgo}</span>
            </div>

            {/* Contact Finder Section */}
            <div className="mb-6 p-4 bg-primary-50 rounded-lg border border-[bg-primary]">
              <h3 className="font-semibold text-primary-900 mb-3">Contact the Finder</h3>
              
              {!showContactOptions ? (
                <Button 
                  onClick={() => setShowContactOptions(true)}
                  className="w-full bg-primary hover:bg-primary-700 text-white"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Contact Finder
                </Button>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-primary-800 mb-3">
                    Choose how you'd like to contact the finder:
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    <Button 
                      onClick={() => handleContact('phone')}
                      variant="outline"
                      className="justify-start border-primary-300 text-primary-700 hover:bg-primary-100"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call: (555) 123-4567
                    </Button>
                    <Button 
                      onClick={() => handleContact('email')}
                      variant="outline"
                      className="justify-start border-primary-300 text-primary-700 hover:bg-primary-100"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Email: finder@example.com
                    </Button>
                    <Button 
                      onClick={() => handleContact('message')}
                      variant="outline"
                      className="justify-start border-primary-300 text-primary-700 hover:bg-primary-100"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                  <Button 
                    onClick={() => setShowContactOptions(false)}
                    variant="ghost"
                    size="sm"
                    className="w-full mt-2 text-gray-500"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Comments Section */}
          <div className="border-t bg-gray-50">
            <div className="p-4">
              <h3 className="font-semibold mb-4 flex items-center">
                <User className="w-4 h-4 mr-2" />
                Comments ({comments.length})
              </h3>

              {/* Comment Input */}
              <div className="flex gap-3 mb-4">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">Y</span>
                </div>
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment()}
                  />
                  <Button 
                    onClick={handleSubmitComment}
                    size="sm"
                    className="bg-primary-600 hover:bg-primary-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 text-sm font-medium">
                        {comment.author.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{comment.author}</span>
                          <span className="text-xs text-gray-500">{comment.timeAgo}</span>
                        </div>
                        <p className="text-sm text-gray-700">{comment.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemModal;

// ItemModal.tsx
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

// === PERBAIKAN INTERFACE ITEMMODALPROPS ===
// Sesuaikan dengan Item interface dari Redux Slice (itemsSlice.ts)
interface ItemModalProps {
  item: {
    id: string; 
    title: string; 
    name: string; 

    description: string;
    category: { name: string; slug: string; }; // Menggunakan objek category
    address: string;

    city: { name: string; slug: string; };
    province: { name: string; slug: string; };
    images: { id: string; url: string; }[]; 

    isFound: boolean; 
    createdAt: string;
    status: string; 

    finderContactMethod?: string;
    finderContactInfo?: string;
    urgent?: boolean; 
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
    // Di sini Anda akan mengimplementasikan fungsionalitas kontak sebenarnya
    // Misalnya, membuka tautan telepon, email client, atau form pesan
    setShowContactOptions(false);
  };

  // Helper function untuk format waktu (jika ItemModal tidak menerima timeAgo langsung)
  const formatTimeAgo = (isoDateString: string) => {
    const date = new Date(isoDateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} days ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks} weeks ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} months ago`;
    const years = Math.floor(days / 365);
    return `${years} years ago`;
  };


  if (!isOpen || !item) return null;

  return (
      <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50 flex items-center justify-center p-4"> {/* Ubah background agar lebih terlihat */}
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl"> {/* Tambah shadow */}
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">{item.name}</h2> {/* Menggunakan item.name */}
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
                src={item.images[0]?.url || 'https://via.placeholder.com/600x400?text=No+Image'} 
                alt={item.name}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>

            <div className="flex gap-2 mb-3">
              <Badge className={item.isFound ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"}> {/* Menggunakan item.isFound */}
                {item.isFound ? 'Found' : 'Lost'} {/* Menggunakan item.isFound */}
              </Badge>
              {/* Asumsi 'urgent' adalah properti di item, jika tidak ada, hapus */}
              {/* {item.urgent && (
                <Badge className="bg-red-100 text-red-800 border-red-200">
                  Urgent
                </Badge>
              )} */}
              <Badge variant="outline">
                {item.category.name} {/* Menggunakan item.category.name */}
              </Badge>
            </div>

            <p className="text-gray-600 mb-4">{item.description}</p>

            <div className="flex items-center text-sm text-gray-500 mb-6">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="mr-4">{item.address}, {item.city.name}, {item.province.name}</span> {/* Menggunakan detail lokasi */}
              <Clock className="w-4 h-4 mr-1" />
              <span>{formatTimeAgo(item.createdAt)}</span> {/* Menggunakan createdAt dan formatTimeAgo */}
            </div>

            {/* Contact Finder Section */}
            {/* Anda perlu menambahkan contactMethod dan contactInfo ke Item interface jika ingin ini dinamis */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200"> {/* Ganti warna primary ke blue untuk konsisten */}
              <h3 className="font-semibold text-blue-900 mb-3">Contact the Finder</h3>

              {!showContactOptions ? (
                <Button
                  onClick={() => setShowContactOptions(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Contact Finder
                </Button>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-blue-800 mb-3">
                    Choose how you'd like to contact the finder:
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {/* Anda perlu properti contactMethod/Info di item untuk menampilkan ini secara dinamis */}
                    {/* Contoh statis dulu, sesuaikan jika ada di API */}
                    <Button
                      onClick={() => handleContact('phone')}
                      variant="outline"
                      className="justify-start border-blue-300 text-blue-700 hover:bg-blue-100"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call: (555) 123-4567 {/* Ganti dengan item.finderPhone jika ada */}
                    </Button>
                    <Button
                      onClick={() => handleContact('email')}
                      variant="outline"
                      className="justify-start border-blue-300 text-blue-700 hover:bg-blue-100"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Email: finder@example.com {/* Ganti dengan item.finderEmail jika ada */}
                    </Button>
                    <Button
                      onClick={() => handleContact('message')}
                      variant="outline"
                      className="justify-start border-blue-300 text-blue-700 hover:bg-blue-100"
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
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center"> {/* Warna diubah */}
                  <span className="text-white text-sm font-medium">Y</span>
                </div>
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment()}
                  />
                  <Button
                    onClick={handleSubmitComment}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700" 
                  >
                    <Send className="w-4 h-4 text-white" />
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
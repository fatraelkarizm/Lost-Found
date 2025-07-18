// ItemModal.tsx
import { useState, useEffect, useCallback } from 'react';
import { X, MapPin, Clock, User, Send, Phone, Mail, MessageCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Import dari Redux
import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch, type RootState } from '@/redux/store';
import { selectAuthToken } from '@/redux/auth/authSlice';
import { selectCurrentUser } from '@/redux/user/userSlice';

// Import Comment Slice
import {
  fetchComments,
  createComment,
  clearComments,
  selectComments,
  selectCommentsStatus,
  selectCommentsError,
  selectCommentsNextCursor,
  selectHasMoreComments,
  type Comment,
} from '@/redux/comments/commentSlice';

// Import Item interface dari itemsSlice
import { type Item } from '@/redux/item/itemSlice';


interface ItemModalProps {
  item: Item | null;
  isOpen: boolean;
  onClose: () => void;
}

const ItemModal = ({ item, isOpen, onClose }: ItemModalProps) => {
  const dispatch: AppDispatch = useDispatch();

  const comments = useSelector((state: RootState) => selectComments(state));
  const commentsStatus = useSelector((state: RootState) => selectCommentsStatus(state));
  const commentsError = useSelector((state: RootState) => selectCommentsError(state));
  const commentsNextCursor = useSelector((state: RootState) => selectCommentsNextCursor(state));
  const hasMoreComments = useSelector((state: RootState) => selectHasMoreComments(state));

  const authToken = useSelector((state: RootState) => selectAuthToken(state));
  const currentUser = useSelector((state: RootState) => selectCurrentUser(state));

  const [newCommentContent, setNewCommentContent] = useState('');
  const [showContactOptions, setShowContactOptions] = useState(false);

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

  const loadComments = useCallback((cursor: string | null = null, replace: boolean = false) => {
    if (item?.id) {
      dispatch(fetchComments({
        idItem: item.id,
        cursor: cursor || undefined,
        limit: 10,
        replace: replace,
      }));
    }
  }, [dispatch, item?.id]);

  useEffect(() => {
    if (isOpen && item?.id) {
      dispatch(clearComments());
      loadComments(null, true);
    }
    return () => {
      dispatch(clearComments());
    };
  }, [isOpen, item?.id, dispatch, loadComments]);

  const handleSubmitComment = () => {
    if (newCommentContent.trim() && item?.id && currentUser?.id && authToken) {
      dispatch(createComment({
        itemId: item.id,
        userId: currentUser.id,
        content: newCommentContent,
        authToken: authToken,
      }));
      setNewCommentContent('');
    } else if (!currentUser?.id) {
      alert("Please log in to add comments.");
    } else if (!authToken) {
      alert("Authentication token is missing. Please log in again.");
    }
  };

  const handleLoadMoreComments = () => {
    if (hasMoreComments && commentsNextCursor && commentsStatus !== 'loading') {
      loadComments(commentsNextCursor, false);
    }
  };

  // --- Fungsi handleContact diperbarui ---
  const handleContact = (method: 'email' | 'message') => { // Hapus 'phone' dari tipe
    if (!item?.user) return; // Pastikan data user item ada

    if (method === 'email' && item.user.email) { // Asumsi item.user memiliki email
      window.location.href = `mailto:${item.user.email}`;
    } else if (method === 'message') {
      console.log(`Sending message to ${item.user.name || item.user.username}`);
    }
    setShowContactOptions(false);
  };
  // --- Akhir Pembaruan ---

  if (!isOpen || !item) return null;

  // Nama Finder
  const finderName = item.user?.name || item.user?.username || 'Unknown Finder';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">{item.name}</h2>
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
              <Badge className={item.isFound ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"}>
                {item.isFound ? 'Found' : 'Lost'}
              </Badge>
              <Badge variant="outline">
                {item.category.name}
              </Badge>
            </div>

            <p className="text-gray-600 mb-4">{item.description}</p>

            <div className="flex items-center text-sm text-gray-500 mb-6">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="mr-4">{item.address}, {item.city.name}, {item.province.name}</span>
              <Clock className="w-4 h-4 mr-1" />
              <span>{formatTimeAgo(item.createdAt)}</span>
            </div>

            {/* Contact Finder Section */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-3">Contact the Finder: {finderName}</h3>

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
                    <Button
                      onClick={() => handleContact('email')}
                      variant="outline"
                      className="justify-start border-blue-300 text-blue-700 hover:bg-blue-100"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Email: {item.user?.email || 'N/A'}
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
              {currentUser?.id && authToken ? (
                <div className="flex gap-3 mb-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">{currentUser.name?.charAt(0) || currentUser.username?.charAt(0) || 'U'}</span>
                  </div>
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={newCommentContent}
                      onChange={(e) => setNewCommentContent(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment()}
                      disabled={commentsStatus === 'loading'}
                    />
                    <Button
                      onClick={handleSubmitComment}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={commentsStatus === 'loading'}
                    >
                      {commentsStatus === 'loading' ? <Loader2 className="animate-spin h-4 w-4" /> : <Send className="w-4 h-4 text-white" />}
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-600 mb-4">Please log in to add comments.</p>
              )}

              {/* Komentar Status */}
              {commentsStatus === 'loading' && comments.length === 0 && (
                <div className="flex items-center justify-center text-gray-600 my-4">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading comments...
                </div>
              )}
              {commentsError && <p className="text-red-500 text-sm my-4">Error loading comments: {commentsError}</p>}
              {commentsStatus === 'succeeded' && comments.length === 0 && (
                <p className="text-gray-500 text-sm my-4">No comments yet. Be the first to comment!</p>
              )}

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment: Comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                      {comment.user?.photoprofile ? (
                        <img src={comment.user.photoprofile} alt={comment.user.name || 'User'} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-gray-600 text-sm font-medium">
                          {comment.user?.name?.charAt(0) || comment.user?.username?.charAt(0) || 'U'}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{comment.user?.name || comment.user?.username || 'Unknown User'}</span>
                          <span className="text-xs text-gray-500">{formatTimeAgo(comment.createdAt)}</span>
                        </div>
                        <p className="text-sm text-gray-700">{comment.content}</p>
                      </div>
                      {/* Tampilkan balasan (rekursif) jika ada */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="ml-8 mt-2 space-y-3">
                          {comment.replies.map((reply: Comment) => (
                             <div key={reply.id} className="flex gap-3">
                                 <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                                     {reply.user?.photoprofile ? (
                                         <img src={reply.user.photoprofile} alt={reply.user.name || 'User'} className="w-full h-full object-cover" />
                                     ) : (
                                         <span className="text-gray-500 text-xs font-medium">
                                             {reply.user?.name?.charAt(0) || reply.user?.username?.charAt(0) || 'U'}
                                         </span>
                                     )}
                                 </div>
                                 <div className="flex-1">
                                     <div className="bg-white rounded-lg p-2 shadow-sm">
                                         <div className="flex items-center gap-2 mb-1">
                                             <span className="font-medium text-xs">{reply.user?.name || reply.user?.username || 'Unknown User'}</span>
                                             <span className="text-xs text-gray-500">{formatTimeAgo(reply.createdAt)}</span>
                                         </div>
                                         <p className="text-xs text-gray-700">{reply.content}</p>
                                     </div>
                                 </div>
                             </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Komentar */}
              {hasMoreComments && commentsStatus !== 'loading' && (
                <div className="text-center mt-4">
                  <Button onClick={() => handleLoadMoreComments()} variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-100">
                    Load More Comments
                  </Button>
                </div>
              )}
              {commentsStatus === 'loading' && comments.length > 0 && (
                <div className="flex items-center justify-center text-gray-600 my-4">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading more comments...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemModal;
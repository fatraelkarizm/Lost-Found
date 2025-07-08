
import { Quote, Star, MapPin, CheckCircle } from 'lucide-react';

const SuccessStories = () => {
  const stories = [
    {
      id: 1,
      name: "Sarah Chen",
      location: "Toronto, ON",
      item: "Wedding Ring",
      image: "https://images.unsplash.com/photo-1494790108755-2616c28ca96b?w=150&h=150&fit=crop&crop=face",
      story: "I lost my grandmother's wedding ring at the park. Within 24 hours, someone found it and posted it here. I'm so grateful for this amazing community!",
      timeAgo: "2 weeks ago",
      rating: 5
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      location: "Vancouver, BC",
      item: "Laptop Backpack",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      story: "Lost my work backpack with important documents. The finder contacted me through this platform and returned everything intact. Incredible service!",
      timeAgo: "1 month ago",
      rating: 5
    },
    {
      id: 3,
      name: "Emma Thompson",
      location: "Montreal, QC",
      item: "House Keys",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      story: "Dropped my keys while jogging. A kind stranger found them and posted here. Got them back the same day. This platform is a lifesaver!",
      timeAgo: "3 weeks ago",
      rating: 5
    }
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Success Stories</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Read about happy reunions in our community and the joy of finding lost treasures
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story) => (
            <div key={story.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
              <div className="flex items-center mb-4">
                <img
                  src={story.image}
                  alt={story.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{story.name}</h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="w-3 h-3 mr-1" />
                    {story.location}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center mb-2">
                  {[...Array(story.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-primary-600 font-medium mb-2">Found: {story.item}</p>
              </div>

              <div className="relative">
                <Quote className="absolute -top-2 -left-1 w-8 h-8 text-gray-200" />
                <p className="text-gray-700 italic pl-6 mb-4">"{story.story}"</p>
              </div>

              <div className="text-sm text-gray-500">{story.timeAgo}</div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center px-6 py-3 bg-primary-50 rounded-lg">
            <CheckCircle className="w-5 h-5 text-primary-600 mr-2" />
            <span className="text-primary-800 font-medium">Over 10,000+ successful reunions and counting!</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessStories;

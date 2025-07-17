import { MapPin, Clock} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Mengambil data di API nantinya
const FeaturedItems = () => {

  //Data Dummy
  const featuredItems = [
    {
      id: 0,
      title: "iPhone 14 Pro - Black",
      category: "Electronics",
      location: "Downtown Toronto, ON",
      timeAgo: "2 hours ago",
      description:
        "Found near Union Station. Black iPhone with cracked screen protector.",
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
      status: "Found",
      urgent: false,
    },
    {
      id: 2,
      title: "Brown Leather Wallet",
      category: "Bags & Wallets",
      location: "Vancouver, BC",
      timeAgo: "5 hours ago",
      description: "Found at Granville Island. Contains cards and cash.",
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
      status: "Found",
      urgent: true,
    },
    {
      id: 3,
      title: "Set of House Keys",
      category: "Keys",
      location: "Calgary, AB",
      timeAgo: "1 day ago",
      description: "Found near Stephen Avenue. Has distinctive blue keychain.",
      image:
        "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400&h=300&fit=crop",
      status: "Found",
      urgent: false,
    },
    {
      id: 4,
      title: "Gold Wedding Ring",
      category: "Jewelry",
      location: "Montreal, QC",
      timeAgo: "3 hours ago",
      description:
        "Found in Parc du Mont-Royal. Inscription inside: 'Forever Yours'",
      image:
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop",
      status: "Found",
      urgent: true,
    },
    {
      id: 5,
      title: "Blue Backpack",
      category: "Bags & Wallets",
      location: "Halifax, NS",
      timeAgo: "6 hours ago",
      description: "Found at Dalhousie University campus. Contains textbooks.",
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
      status: "Found",
      urgent: false,
    },
    {
      id: 6,
      title: "Glasses in Black Case",
      category: "Other",
      location: "Ottawa, ON",
      timeAgo: "4 hours ago",
      description: "Found at Rideau Centre. Prescription glasses in hard case.",
      image:
        "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=300&fit=crop",
      status: "Found",
      urgent: false,
    },
  ];

  return (
    <div id="browse-items" className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Recently Found Items
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            These items were recently found by our community members and are
            waiting to be reunited with their owners
          </p>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-1 cursor-pointer"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    {item.status}
                  </Badge>
                  {item.urgent && (
                    <Badge className="bg-red-100 text-red-800 border-red-200">
                      Urgent
                    </Badge>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
                    {item.title}
                  </h3>
                  <Badge variant="outline" className="text-xs">
                    {item.category}
                  </Badge>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {item.description}
                </p>

                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="mr-4">{item.location}</span>
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{item.timeAgo}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-[#1d4ed8] text-[#1d4ed8] hover:bg-[#1d4ed8] hover:text-white px-8 py-4 text-lg font-semibold transition-all duration-300"
          >
            View All Found Items
          </Button>
        </div>
      </div>

    </div>
  );
};

export default FeaturedItems;

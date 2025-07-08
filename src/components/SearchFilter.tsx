// SearchFilters.tsx

import { useState } from 'react';
import { Search, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const SearchFilters = () => {
  const [searchQuery, setSearchQuery] = useState('');
  type SectionKey = 'priority' | 'category' | 'location' | 'time';
  const [expandedSections, setExpandedSections] = useState<Record<SectionKey, boolean>>({
    priority: true,
    category: true,
    location: true,
    time: true
  });

  // Dummy Data for Categories
  const categories = [
    'Electronics', 'Keys', 'Jewelry', 'Bags & Wallets', 'Clothing', 
    'Documents', 'Pet Items', 'Sports Equipment', 'Books', 'Other'
  ];

  // Dummy Data for Provinces
  const provinces = [
    'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 
    'Newfoundland and Labrador', 'Nova Scotia', 'Ontario', 
    'Prince Edward Island', 'Quebec', 'Saskatchewan'
  ];
  const toggleSection = (section: SectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="bg-white py-12 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Find Your Lost Items
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Use our advanced search to filter through thousands of found items in your area
          </p>
        </div>

        <div className="flex gap-8">
          {/* Left Sidebar - Advanced Filters */}
          <div className="w-80 bg-gray-50 rounded-lg p-6 h-fit">
            {/* Main Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11 h-12 bg-white border-gray-200 focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Priority Section */}
            <div className="mb-6">
              <button
                onClick={() => toggleSection('priority')}
                className="flex items-center justify-between w-full text-left font-semibold text-gray-900 mb-3"
              >
                <span>Priority</span>
                {expandedSections.priority ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {expandedSections.priority && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="urgent" className="rounded border-gray-300" />
                    <label htmlFor="urgent" className="text-sm text-gray-700">Most Relevant</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="recent" className="rounded border-gray-300" />
                    <label htmlFor="recent" className="text-sm text-gray-700">Recently Added</label>
                  </div>
                </div>
              )}
            </div>

            {/* Category Section */}
            <div className="mb-6">
              <button
                onClick={() => toggleSection('category')}
                className="flex items-center justify-between w-full text-left font-semibold text-gray-900 mb-3"
              >
                <span>Category</span>
                {expandedSections.category ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {expandedSections.category && (
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <input type="checkbox" id={category} className="rounded border-gray-300" />
                      <label htmlFor={category} className="text-sm text-gray-700">{category}</label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Location Section */}
            <div className="mb-6">
              <button
                onClick={() => toggleSection('location')}
                className="flex items-center justify-between w-full text-left font-semibold text-gray-900 mb-3"
              >
                <span>Location</span>
                {expandedSections.location ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {expandedSections.location && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                    <Select>
                      <SelectTrigger className="h-10 bg-white border-gray-200">
                        <SelectValue placeholder="All Provinces" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg">
                        <SelectItem value="all">All Provinces</SelectItem>
                        {provinces.map((province) => (
                          <SelectItem key={province} value={province.toLowerCase()}>
                            {province}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <Input
                      type="text"
                      placeholder="Enter city..."
                      className="h-10 bg-white border-gray-200"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Time Section */}
            <div className="mb-6">
              <button
                onClick={() => toggleSection('time')}
                className="flex items-center justify-between w-full text-left font-semibold text-gray-900 mb-3"
              >
                <span>Time Posted</span>
                {expandedSections.time ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {expandedSections.time && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="radio" name="time" id="today" className="rounded border-gray-300" />
                    <label htmlFor="today" className="text-sm text-gray-700">Today</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" name="time" id="week" className="rounded border-gray-300" />
                    <label htmlFor="week" className="text-sm text-gray-700">This Week</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" name="time" id="month" className="rounded border-gray-300" />
                    <label htmlFor="month" className="text-sm text-gray-700">This Month</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" name="time" id="all" className="rounded border-gray-300" />
                    <label htmlFor="all" className="text-sm text-gray-700">All Time</label>
                  </div>
                </div>
              )}
            </div>

            {/* Search Button */}
            <Button 
              className="w-full h-12 bg-primary-600 hover:bg-primary-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Search className="w-5 h-5 mr-2" />
              Search Items
            </Button>
          </div>

          {/* Right Side - Search Results Area */}
          <div className="flex-1">
            <div className="bg-gray-50 rounded-lg p-8 min-h-[500px] flex items-center justify-center">
              <div className="text-center">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Search for Lost Items
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Use the filters on the left to find specific items, or browse through our featured items below
                </p>
                <div className="mt-4 text-sm text-gray-500">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Database updated: 2 hours ago
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;

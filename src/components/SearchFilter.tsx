// SearchFilters.tsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, ChevronDown, ChevronUp, Loader2, MapPin, Clock, ExternalLink} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Import ItemModal
import ItemModal from './ItemModal'; // Pastikan path ini benar

// Import dari Redux
import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch, type RootState } from '@/redux/store';

// Import Category Slice
import {
  fetchCategories,
  selectCategories,
  selectCategoriesStatus,
  selectCategoriesError,
  type Category,
} from '@/redux/categories/categoriesSlice';

// Import Province Slice
import {
  fetchProvinces,
  selectProvinces,
  selectProvincesStatus,
  selectProvincesError,
  type Province,
} from '@/redux/provinces/provinceSlice';

// Import City Slice
import {
  fetchCities,
  selectCities,
  selectCitiesStatus,
  selectCitiesError,
  type City,
  clearCities,
} from '@/redux/cities/citySlice';

// Import Item Slice
import {
  fetchItems,
  selectItems,
  selectItemsStatus,
  selectItemsError,
  selectNextCursor,
  selectHasMoreItems,
  type Item, // Import Item interface
} from '@/redux/item/itemSlice'; // Pastikan path ini benar (itemsSlice)


const SearchFilters = () => {
  const dispatch: AppDispatch = useDispatch();

  const categories = useSelector((state: RootState) => selectCategories(state));
  const categoriesStatus = useSelector((state: RootState) => selectCategoriesStatus(state));
  const categoriesError = useSelector((state: RootState) => selectCategoriesError(state));

  const provinces = useSelector((state: RootState) => selectProvinces(state));
  const provincesStatus = useSelector((state: RootState) => selectProvincesStatus(state));
  const provincesError = useSelector((state: RootState) => selectProvincesError(state));

  const cities = useSelector((state: RootState) => selectCities(state));
  const citiesStatus = useSelector((state: RootState) => selectCitiesStatus(state));
  const citiesError = useSelector((state: RootState) => selectCitiesError(state));

  const items = useSelector((state: RootState) => selectItems(state));
  const itemsStatus = useSelector((state: RootState) => selectItemsStatus(state));
  const itemsError = useSelector((state: RootState) => selectItemsError(state));
  const nextCursor = useSelector((state: RootState) => selectNextCursor(state));
  const hasMoreItems = useSelector((state: RootState) => selectHasMoreItems(state));


  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvinceId, setSelectedProvinceId] = useState<string | null>(null);
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<string | null>(null);
  const [isUrgent, setIsUrgent] = useState<boolean>(false);
  const [isRecentlyAdded, setIsRecentlyAdded] = useState<boolean>(false);

  // === State untuk ItemModal ===
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null); // Menyimpan item yang akan ditampilkan di modal

  const isFirstRender = useRef(true);


  type SectionKey = 'priority' | 'category' | 'location' | 'time';
  const [expandedSections, setExpandedSections] = useState<Record<SectionKey, boolean>>({
    priority: true,
    category: true,
    location: true,
    time: true
  });

  const toggleSection = (section: SectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const performSearch = useCallback((cursor: string | null = null, replaceItems: boolean = false) => {
    const filters = {
      q: searchQuery || undefined,
      category: selectedCategoryId || undefined,
      province: selectedProvinceId || undefined,
      city: selectedCityId || undefined,
      // Tambahkan ini jika backend Anda sudah mengimplementasikan time_filter, is_urgent, is_recently_added
      // time_filter: selectedTimeFilter || undefined,
      // is_urgent: isUrgent || undefined,
      // is_recently_added: isRecentlyAdded || undefined,
    };

    dispatch(fetchItems({
      limit: 6,
      cursor: cursor || undefined,
      filters: filters,
      replace: replaceItems,
    }));
  }, [dispatch, searchQuery, selectedCategoryId, selectedProvinceId, selectedCityId, selectedTimeFilter, isUrgent, isRecentlyAdded]);


  useEffect(() => {
    // Fetch Categories
    if (categoriesStatus === 'idle' && categories.length === 0) {
      dispatch(fetchCategories());
    }
    // Fetch Provinces
    if (provincesStatus === 'idle' && provinces.length === 0) {
      dispatch(fetchProvinces());
    }

    if (isFirstRender.current) {
        performSearch(null, true);
        isFirstRender.current = false;
    }
  }, [categoriesStatus, categories.length, provincesStatus, provinces.length, dispatch, performSearch]);


  useEffect(() => {
    if (selectedProvinceId) {
      if (citiesStatus === 'idle' || citiesStatus === 'failed' || cities.length === 0) {
        dispatch(fetchCities({ authToken: '', idProvinceOrSlug: selectedProvinceId }));
      }
    } else {
      dispatch(clearCities());
    }
  }, [selectedProvinceId, citiesStatus, cities.length, dispatch]);


  useEffect(() => {
    if (isFirstRender.current) {
      return;
    }

    const handler = setTimeout(() => {
      performSearch(null, true);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery, selectedCategoryId, selectedProvinceId, selectedCityId, selectedTimeFilter, isUrgent, isRecentlyAdded, performSearch]);


  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategoryId(prev => (prev === categoryId ? null : categoryId));
  };

  const handleProvinceChange = (value: string) => {
    setSelectedProvinceId(value === 'all' ? null : value);
    setSelectedCityId(null);
    dispatch(clearCities());
  };

  const handleCityChange = (value: string) => {
    setSelectedCityId(value === 'all' ? null : value);
  };

  const handleTimeFilterChange = (value: string) => {
    setSelectedTimeFilter(value);
  };

  const handleUrgentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setIsUrgent(isChecked);
    if (isChecked) {
        setIsRecentlyAdded(false);
    }
  };

  const handleRecentlyAddedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setIsRecentlyAdded(isChecked);
    if (isChecked) {
        setIsUrgent(false);
    }
  };

  const handleSearchButtonClick = () => {
    performSearch(null, true);
  };

  const handleLoadMore = () => {
    if (hasMoreItems && nextCursor && itemsStatus !== 'loading') {
      performSearch(nextCursor, false);
    }
  };

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

  // === Handler untuk membuka modal ===
  const openItemModal = (item: Item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  // === Handler untuk menutup modal ===
  const closeItemModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };


  return (
    <div className="bg-white py-12 border-b border-gray-100">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
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
                  className="pl-11 h-12 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
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
                    <input
                      type="checkbox"
                      id="mostRelevant"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={isUrgent}
                      onChange={handleUrgentChange}
                    />
                    <label htmlFor="mostRelevant" className="text-sm text-gray-700">Most Relevant</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="recentlyAdded"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={isRecentlyAdded}
                      onChange={handleRecentlyAddedChange}
                    />
                    <label htmlFor="recentlyAdded" className="text-sm text-gray-700">Recently Added</label>
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
                  {categoriesStatus === 'loading' && <div className="flex items-center text-gray-600"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading categories...</div>}
                  {categoriesError && <p className="text-red-500 text-sm">Error loading categories: {categoriesError}</p>}
                  {categoriesStatus === 'succeeded' && categories.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {categories.map((category: Category) => (
                        <div
                          key={category.id}
                          className={`
                            p-2 rounded-md border cursor-pointer
                            ${selectedCategoryId === category.id
                              ? 'bg-blue-100 border-blue-500 text-blue-700'
                              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100'
                            }
                            flex items-center justify-between
                          `}
                          onClick={() => handleCategoryChange(category.id)}
                        >
                          <span>{category.name}</span>
                          {category.itemCount !== undefined && (
                            <span className="text-xs bg-gray-200 px-1.5 py-0.5 rounded-full">
                              {category.itemCount}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    categoriesStatus === 'succeeded' && categories.length === 0 && <p className="text-gray-500 text-sm">No categories found.</p>
                  )}
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
                    <Select onValueChange={handleProvinceChange} value={selectedProvinceId || 'all'}>
                      <SelectTrigger className="h-10 bg-white border-gray-200">
                        <SelectValue placeholder="All Provinces" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg">
                        {provincesStatus === 'loading' && <SelectItem value="loading" disabled><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading provinces...</SelectItem>}
                        {provincesError && <SelectItem value="error" disabled className="text-red-500">Error: {provincesError}</SelectItem>}
                        {provincesStatus === 'succeeded' && (
                          <>
                            <SelectItem value="all" className='cursor-pointer hover:bg-blue-500 hover:text-white'>All Provinces</SelectItem>
                            {provinces.map((province: Province) => (
                              <SelectItem key={province.id} value={province.id} className='cursor-pointer hover:bg-blue-500 hover:text-white'>
                                {province.name}
                              </SelectItem>
                            ))}
                          </>
                        )}
                         {provincesStatus === 'idle' && !provincesError && (
                            <SelectItem value="loading-initial" disabled>Loading provinces...</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='cursor-pointer'>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <Select onValueChange={handleCityChange} value={selectedCityId || 'all'} disabled={!selectedProvinceId || citiesStatus === 'loading' || citiesError !== null}>
                      <SelectTrigger className="h-10 bg-white border-gray-200">
                        <SelectValue placeholder="All Cities" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg cursor-pointer">
                        {citiesStatus === 'loading' && <SelectItem value="loading" disabled><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading cities...</SelectItem>}
                        {citiesError && <SelectItem value="error" disabled className="text-red-500">Error: {citiesError}</SelectItem>}
                        {citiesStatus === 'succeeded' && (
                          <>
                            <SelectItem value="all" className='cursor-pointer hover:bg-blue-500 hover:text-white' >All Cities</SelectItem>
                            {cities.map((city: City) => (
                              <SelectItem key={city.id} value={city.id} className='cursor-pointer hover:bg-blue-500 hover:text-white'>
                                {city.name}
                              </SelectItem>
                            ))}
                          </>
                        )}
                        {(!selectedProvinceId && citiesStatus === 'idle') && (
                          <SelectItem value="no-province" disabled>Select a province first</SelectItem>
                        )}
                        {(selectedProvinceId && citiesStatus === 'succeeded' && cities.length === 0) && (
                           <SelectItem value="no-city" disabled>No cities found for this province</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
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
                    <input
                      type="radio"
                      name="time"
                      id="today"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={selectedTimeFilter === 'today'}
                      onChange={() => handleTimeFilterChange('today')}
                    />
                    <label htmlFor="today" className="text-sm text-gray-700">Today</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="time"
                      id="week"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={selectedTimeFilter === 'week'}
                      onChange={() => handleTimeFilterChange('week')}
                    />
                    <label htmlFor="week" className="text-sm text-gray-700">This Week</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="time"
                      id="month"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={selectedTimeFilter === 'month'}
                      onChange={() => handleTimeFilterChange('month')}
                    />
                    <label htmlFor="month" className="text-sm text-gray-700">This Month</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="time"
                      id="all"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={selectedTimeFilter === 'all'}
                      onChange={() => handleTimeFilterChange('all')}
                    />
                    <label htmlFor="all" className="text-sm text-gray-700">All Time</label>
                  </div>
                </div>
              )}
            </div>

            {/* Search Button */}
            <Button
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={handleSearchButtonClick}
            >
              <Search className="w-5 h-5" />
              Search Items
            </Button>
          </div>

          {/* Right Side - Search Results Area */}
          <div className="flex-1">
            <div className="bg-gray-50 rounded-lg p-8 min-h-[500px]">
              {/* Conditional rendering for status */}
              {itemsStatus === 'loading' && items.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-gray-600">
                  <Loader2 className="h-16 w-16 animate-spin mb-4" />
                  <p className="text-lg">Loading items...</p>
                </div>
              )}

              {itemsError && (
                <div className="flex flex-col items-center justify-center h-full text-red-500">
                  <p className="text-lg">Error loading items: {itemsError}</p>
                  <Button onClick={() => performSearch()} className="mt-4">Try Again</Button>
                </div>
              )}

              {itemsStatus === 'succeeded' && items.length === 0 && (
                <div className="text-center flex flex-col items-center justify-center h-full">
                  <Search className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No items found matching your criteria.
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Try adjusting your filters or search query.
                  </p>
                </div>
              )}

              {/* Tampilkan item cards jika ada data */}
              {(itemsStatus === 'succeeded' || (itemsStatus === 'loading' && items.length > 0)) && items.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((item: Item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                      onClick={() => openItemModal(item)} // === Tambahkan handler onClick di sini ===
                    >
                      <div className="relative h-48 w-full">
                        <img
                          src={item.images[0]?.url || 'https://via.placeholder.com/400x250?text=No+Image'}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        {/* Conditional badge for Found/Lost */}
                        {item.isFound ? (
                          <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
                            Found
                          </span>
                        ) : (
                          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
                            Lost
                          </span>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-lg font-semibold text-gray-900 line-clamp-1">{item.name}</h4>
                          <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded-full">
                            {item.category.name}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                          <span>{item.address}</span>, {item.city.name}, {item.province.name}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mb-4">
                          <Clock className="w-4 h-4 mr-1 text-gray-400" />
                          <span>{formatTimeAgo(item.createdAt)}</span>
                        </div>
                        <Button
                          className="w-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center"
                          onClick={(e) => { // Menghentikan event bubbling agar klik tombol tidak menutup modal
                            e.stopPropagation();
                            openItemModal(item);
                          }}
                        >
                          View Details <ExternalLink className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Load More Button for Infinite Scroll */}
              {hasMoreItems && (itemsStatus === 'succeeded' || itemsStatus === 'idle' || (itemsStatus === 'loading' && items.length > 0)) && (
                <div className="text-center mt-8">
                  <Button onClick={handleLoadMore} className="bg-blue-500 hover:bg-blue-600 text-white" disabled={itemsStatus === 'loading'}>
                    {itemsStatus === 'loading' && items.length > 0 ? (
                        <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading...</>
                    ) : (
                        'Load More'
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Render ItemModal */}
      {isModalOpen && selectedItem && (
        <ItemModal
          item={{
            id: selectedItem.id,
            title: selectedItem.name,
            name: selectedItem.name,
            description: selectedItem.description,
            category: {
              name: selectedItem.category.name,
              slug: selectedItem.category.slug,
            },
            address: selectedItem.address,
            city: {
              name: selectedItem.city.name,
              slug: selectedItem.city.slug,
            },
            province: {
              name: selectedItem.province.name,
              slug: selectedItem.province.slug,
            },
            images: selectedItem.images && selectedItem.images.length > 0
              ? selectedItem.images
              : [{ id: 'placeholder', url: 'https://via.placeholder.com/400x250?text=No+Image' }],
            createdAt: selectedItem.createdAt,
            status: selectedItem.isFound ? 'Found' : 'Lost',
            isFound: selectedItem.isFound,
            urgent: false, 
          }}
          isOpen={isModalOpen}
          onClose={closeItemModal}
        />
      )}
    </div>
  );
};

export default SearchFilters;
import React from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { Button, Input, Label, Textarea } from '@/components/ui';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Fetch Data
import { useSelector, useDispatch } from 'react-redux'; 
import type { RootState, AppDispatch } from '@/redux/store'; 
import { fetchCategories } from '@/redux/categories/categoriesSlice'; 
import { fetchProvinces } from '@/redux/provinces/provinceSlice';

import usePostForm from './usePostForm';


const PostItem = () => {
  const dispatch: AppDispatch = useDispatch();
  const { categories, status, error } = useSelector((state: RootState) => state.categories);
  const { provinces } = useSelector((state: RootState) => state.provinces);
  const { images, formData, setFormData, handleImageUpload, removeImage, handleInputChange, handleSubmit } = usePostForm();
  const authToken = ''; 

  React.useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCategories(authToken)); 
      dispatch(fetchProvinces(authToken));
    }
  }, [status, dispatch, authToken]);


  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Post a Found Item</h1>
          <p className="text-lg text-gray-600">Help reunite lost items with their owners</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="w-5 h-5 mr-2" />
              Item Details
            </CardTitle>
            <CardDescription>
              Provide as much detail as possible to help the owner identify their item
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <div>
                <Label>Item Photos</Label>
                <div className="mt-2">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <p className="text-lg font-medium text-gray-900">Upload photos</p>
                        <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                      </div>
                    </label>
                  </div>
                  
                  {images.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Item Title */}
              <div>
                <Label htmlFor="title">Item Title *</Label>
                <Input
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Black iPhone 14 Pro"
                  className="mt-1"
                />
              </div>

              {/* Category */}
              <div>
                <Label>Category *</Label>
                <Select onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {status === 'loading' && <SelectItem value="loading-placeholder" disabled>Loading categories...</SelectItem>}
                    {status === 'failed' && <SelectItem value="error-placeholder" disabled>Error: {error}</SelectItem>}
                    {status === 'succeeded' && categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}> {/* Use category.id as value */}
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the item in detail. Include color, brand, condition, any distinctive features..."
                  className="mt-1 min-h-[100px]"
                />
              </div>

              {/* Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Province *</Label>
                  <Select onValueChange={(value) => setFormData({...formData, province: value})}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select province" />
                    </SelectTrigger>
                    <SelectContent>
                    {status === 'loading' && <SelectItem value="loading-placeholder" disabled>Loading Provinces...</SelectItem>}
                    {status === 'failed' && <SelectItem value="error-placeholder" disabled>Error: {error}</SelectItem>}
                    {status === 'succeeded' && provinces.map((province) => (
                      <SelectItem key={province.id} value={province.id}> 
                        {province.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Enter city"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">Specific Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Near Tim Hortons on Main Street"
                  className="mt-1"
                />
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
                <div>
                  <Label>Preferred Contact Method *</Label>
                  <Select onValueChange={(value) => setFormData({...formData, contactMethod: value})}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="How should people contact you?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="message">Platform Message</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {formData.contactMethod && formData.contactMethod !== 'message' && (
                  <div>
                    <Label htmlFor="contactInfo">
                      {formData.contactMethod === 'email' ? 'Email Address' : 'Phone Number'} *
                    </Label>
                    <Input
                      id="contactInfo"
                      name="contactInfo"
                      type={formData.contactMethod === 'email' ? 'email' : 'tel'}
                      required
                      value={formData.contactInfo}
                      onChange={handleInputChange}
                      placeholder={formData.contactMethod === 'email' ? 'your@email.com' : '+1 (555) 123-4567'}
                      className="mt-1"
                    />
                  </div>
                )}
              </div>

              {/* Urgent */}
              <div className="flex items-center">
                <input
                  id="urgent"
                  name="urgent"
                  type="checkbox"
                  checked={formData.urgent}
                  onChange={(e) => setFormData({...formData, urgent: e.target.checked})}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="urgent" className="ml-2 block text-sm text-gray-900">
                  Mark as urgent (for important items like IDs, medications, etc.)
                </label>
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1 bg-primary-600 hover:bg-primary-700">
                  <Upload className="w-4 h-4 mr-2" />
                  Post Found Item
                </Button>
                <Button type="button" variant="outline" className="flex-1">
                  Save as Draft
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PostItem;
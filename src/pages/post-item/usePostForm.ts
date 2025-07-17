// src/hooks/usePostForm.ts
import React from 'react';

// Ini adalah Custom Hook
const usePostForm = () => {
  const [images, setImages] = React.useState<string[]>([]);
  const [formData, setFormData] = React.useState({
    title: '',
    category: '',
    description: '',
    location: '',
    province: '',
    city: '',
    contactMethod: '',
    contactInfo: '',
    urgent: false
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setImages(prev => [...prev, event.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Post item:', { ...formData, images });
  };

  // Custom Hook akan me-return state dan fungsi-fungsi yang dibutuhkan
  return {
    images,
    setImages,
    formData,
    setFormData,
    handleImageUpload,
    removeImage,
    handleInputChange,
    handleSubmit,
  };
};
export default usePostForm;
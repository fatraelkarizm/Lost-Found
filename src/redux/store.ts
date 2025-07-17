// app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@/redux/user/userSlice'; 
import categoriesReducer from '@/redux/categories/categoriesSlice';
import provincesReducer from '@/redux/provinces/provinceSlice';
import authReducer from '@/redux/auth/authSlice'; 
import imageReducer from '@/redux/image/imageSlice'; 
import cityReducer from '@/redux/cities/citySlice'; 
import itemReducer from '@/redux/item/itemSlice'; 
import commentsReducer from '@/redux/comments/commentSlice'; // Import commentReducer

export const store = configureStore({
     reducer: {
          user: userReducer,
          categories: categoriesReducer,
          provinces: provincesReducer, 
          auth: authReducer, 
          image: imageReducer,
          city: cityReducer, 
          items: itemReducer, 
          comments: commentsReducer, // Add commentReducer here
          // Add other reducers here if you have them
     },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
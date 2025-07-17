// app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@/redux/user/userSlice'; 
import categoriesReducer from '@/redux/categories/categoriesSlice';
import provincesReducer from '@/redux/provinces/provinceSlice';

export const store = configureStore({
     reducer: {
          user: userReducer,
          categories: categoriesReducer,
          provinces: provincesReducer, 
          // Add other reducers here if you have them
     },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
// app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@/redux/user/userSlice'; // Adjust the path as needed
import categoriesReducer from '@/redux/categories/categoriesSlice';

export const store = configureStore({
     reducer: {
          user: userReducer,
          categories: categoriesReducer, // Add the categories reducer
          // Add other reducers here if you have them
     },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
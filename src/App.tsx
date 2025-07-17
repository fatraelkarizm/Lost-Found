import React from 'react'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route} from "react-router-dom";
import { Toaster as Sonner, TooltipProvider } from "@/components/ui";

// Auth and Redux Logic, will be used later

// import { useDispatch } from 'react-redux';
// import type { RootState } from '@/redux/store'; 
// import type { User, loginWithGoogle } from '@/redux/user/userSlice'; 



const queryClient = new QueryClient();
import {
  Landing,
  Login,
  Register,
  PostItem,
} from "@/pages";


// Create a separate component that uses the hook inside Router context
const AppRoutes: React.FC = () => {
  
  return (
    <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
        <Routes>
          <Route path="/" element={<Landing/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/post-item" element={<PostItem />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          {/* {/* <Route path="*" element={<NotFound />} />  */}
        </Routes>
    </TooltipProvider>
  </QueryClientProvider>
  );
};
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
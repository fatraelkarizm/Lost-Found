import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import routes from './routes';

import {
  Landing,
  Login
} from "@/pages";
// Create a separate component that uses the hook inside Router context
const AppRoutes: React.FC = () => {
  
  return (
    <>
    <Routes>
      <Route path="*" />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Landing />} />
    </Routes>

    </>
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
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Create a separate component that uses the hook inside Router context
const AppRoutes: React.FC = () => {
  
  return (
    <Routes>
      <Route path="*" />
    </Routes>
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
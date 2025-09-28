import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Simple pages
const HomePage = () => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-purple-600 mb-4">dr Hedera</h1>
      <p className="text-gray-600 mb-8">Healthcare Platform</p>
      <div className="space-y-4">
        <button className="block w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
          Get Started
        </button>
        <button className="block w-full px-6 py-3 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50">
          Learn More
        </button>
      </div>
    </div>
  </div>
);

const LoginPage = () => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-2xl font-bold text-purple-600 mb-4">Login</h1>
      <p className="text-gray-600">Login page placeholder</p>
    </div>
  </div>
);

const App = () => {
  console.log('App with AuthProvider rendering...');
  
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;

import React from "react";

// Simple test component without any contexts
const SimpleApp = () => {
  console.log('SimpleApp rendering...');
  
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-purple-600 mb-4">dr Hedera</h1>
        <p className="text-gray-600 mb-8">Healthcare Platform</p>
        <p className="text-sm text-gray-500 mb-8">React is working correctly!</p>
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
};

export default SimpleApp;

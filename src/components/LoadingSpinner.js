import React from 'react';
import { Car } from 'lucide-react';
 
const LoadingSpinner = ({ message = "Loading...", fullScreen = true }) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative">
        {/* Outer spinning circle */}
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        
        {/* Inner car icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Car className="w-6 h-6 text-primary-600 animate-pulse" />
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-lg font-medium text-gray-900">{message}</p>
        <p className="text-sm text-gray-500 mt-1">Please wait...</p>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      {content}
    </div>
  );
};

export default LoadingSpinner;

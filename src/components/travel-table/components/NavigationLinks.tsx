
import React from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';

export const NavigationLinks = () => {
  const scrollToAddTripForm = () => {
    const element = document.querySelector('.mt-16.mb-8');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToAvailableTrips = () => {
    const element = document.querySelector('.product-hunt-card');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-3 flex justify-center items-center space-x-6">
      <button 
        onClick={scrollToAvailableTrips}
        className="text-[#8A898C] hover:text-[#403E43] flex items-center font-medium text-sm transition-colors"
      >
        Scroll to view available trips
        <ArrowDown className="ml-1 w-4 h-4" />
      </button>
      
      <button 
        onClick={scrollToAddTripForm}
        className="text-[#1EAEDB] hover:text-[#0FA0CE] flex items-center font-medium text-sm transition-colors"
      >
        Add your trip
        <ArrowRight className="ml-1 w-4 h-4" />
      </button>
    </div>
  );
};

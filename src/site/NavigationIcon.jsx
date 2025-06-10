import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';

const NavigationIcon = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    setIsVisible(window.scrollY > 300);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      onClick={scrollToTop}
      className={`
        fixed z-50
        ${isVisible ? 'opacity-100' : 'opacity-0'} 
        transition-opacity duration-300 ease-in-out
        bottom-6 right-6 
        bg-blue-600 bg-opacity-90 text-white 
        rounded-full shadow-lg backdrop-blur-sm
        p-4 md:p-5 
        cursor-pointer hover:bg-blue-700 hover:animate-bounce
      `}
    >
      <FaArrowUp className="w-5 h-5 md:w-6 md:h-6" />
    </div>
  );
};

export default NavigationIcon;

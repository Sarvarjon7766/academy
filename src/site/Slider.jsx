import React, { useState, useEffect } from 'react';
import Slider4 from '../assets/slider4.jpg';
import Slider5 from '../assets/slider5.jpg';
import Slider6 from '../assets/slider6.jpg';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Slider = () => {
  const images = [Slider4, Slider5, Slider6];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(nextSlide, 4000);
      return () => clearInterval(interval);
    }
  }, [currentIndex, isHovered]);

  return (
    <div
      className="relative w-full h-[50vh] sm:h-[70vh] lg:h-[80vh] overflow-hidden rounded-xl shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div key={index} className="w-full h-full flex-shrink-0">
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Left Button */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 text-gray-800 p-2 rounded-full shadow-md transition-all duration-300"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Right Button */}
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 text-gray-800 p-2 rounded-full shadow-md transition-all duration-300"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
              currentIndex === index ? 'bg-blue-600 scale-125' : 'bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;

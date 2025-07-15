import React from 'react';

const Footer = () => {
  return (
    <footer className="pt-5 mt-10 bg-gradient-to-r from-blue-700 to-teal-400 text-white">
      <div className="w-full py-6 px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Footer Content */}
        <div className="flex flex-col items-center space-y-4">
          {/* Footer Header */}
          <h1 className="text-center text-sm sm:text-base  lg:text-lg  font-semibold">
            &copy; Bulung'ur Akademiyasi 2025
          </h1>
          
          {/* Footer Description */}
          <div className="flex justify-center mt-4">
            <p className="text-xs sm:text-sm md:text-base lg:text-lg font-light text-center">
              <span className="hover:text-blue-300 transition-colors duration-300">
                Barcha huquqlar himoyalangan. Mualliflik huquqi va turdosh huquqlarga muvofiq himoya qilinadi.
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

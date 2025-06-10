import React from 'react';
import { AiOutlineTeam } from "react-icons/ai";
import { PiStudentBold } from "react-icons/pi";
import { GiPodiumWinner } from "react-icons/gi";
import { FaBookBookmark } from "react-icons/fa6";

const features = [
  { title: "Ajoyib Jamoa", icon: <AiOutlineTeam /> },
  { title: "Innovatsion Ta'lim", icon: <FaBookBookmark /> },
  { title: "Ulkan Natijalar", icon: <GiPodiumWinner /> },
  { title: "Xalqaro Standart", icon: <PiStudentBold /> }
];

const Intro = () => {
  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-white min-h-[20vh]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((item, index) => (
          <div
            key={index}
            className="group bg-white hover:bg-gradient-to-br hover:from-blue-100 hover:to-blue-300 shadow-xl rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all duration-500 hover:scale-[1.03]"
          >
            <div className="text-5xl sm:text-6xl text-blue-700 group-hover:scale-110 transition-transform duration-500">
              {item.icon}
            </div>
            <h3 className="mt-4 text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 group-hover:text-blue-900 transition-colors duration-300">
              {item.title}
            </h3>
            <div className="mt-2 h-1 w-12 bg-blue-500 rounded-full group-hover:w-16 transition-all duration-500"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Intro;

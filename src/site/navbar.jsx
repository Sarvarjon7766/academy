import React, { useState } from 'react';
import logo from '../assets/logo.jpg';
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate()
  const loginHandler = ()=>{
    navigate('/login')
  }
  return (
    <nav className="bg-gradient-to-r from-blue-700 to-teal-400 text-white py-4 px-6 flex items-center justify-between fixed top-0 left-0 w-full shadow-lg z-50 rounded-b-lg">
      <div className="flex items-center space-x-4">
        <img src={logo} alt="Logo" className="w-12 h-12 rounded-full object-cover" />
        <div className="flex flex-col sm:flex-row sm:space-x-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold">Bulung'ur Akademiyasi</h2>
          <div className="hidden md:block">
            <p className="text-sm">Samarqand, Bulung'ur</p>
            <p className="text-xs">Mingchinor Tig'iriq 64-uy</p>
          </div>
          <div className="hidden md:block">
            <p className="text-xs">Du-jum soat 22:00 gacha qo'ng'iroq qiling</p>
            <h2 className="text-sm">+998(97) 438 08 96</h2>
          </div>
        </div>
      </div>
      <button onClick={loginHandler} className="text-[7px] sm:text-sm  bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded ">Shaxsiy kabinet</button>
    </nav>
  );
};

export default Navbar;

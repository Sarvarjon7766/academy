import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaUserPlus,
  FaUserMinus,
  FaMoneyBillWave,
  FaMoneyCheckAlt,
  FaUsers,
  FaArrowRight
} from 'react-icons/fa';

const RegisterHome = () => {
  const buttons = [
    {
      icon: <FaUserPlus />,
      title: "Student registratsiya",
      link: '/register/student-register'
    },
    {
      icon: <FaUserMinus />,
      title: "Studentni chiqarish",
      link: '/register/student-status-manager'
    },
    {
      icon: <FaMoneyBillWave />,
      title: "Oylik to'lov",
      link: '/register/student-payment'
    },
    {
      icon: <FaMoneyCheckAlt />,
      title: "To'lovni qaytarish",
      link: '/register/student-refund'
    },
    {
      icon: <FaUsers />,
      title: "Talabalar ro'yxati",
      link: '/register/student-list'
    },
  ];

  return (
    <div className="w-full bg-gradient-to-br from-indigo-50 to-blue-100 min-h-screen p-6 sm:p-10">
      <h2 className="text-4xl font-extrabold text-center text-indigo-800 mb-12 drop-shadow-md">
        📋 Registratsiya Paneli
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {buttons.map((btn, index) => (
          <Link
            to={btn.link}
            key={index}
            className="group flex items-center justify-between p-6 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 hover:bg-indigo-50"
          >
            <div className="flex items-center gap-5">
              <div className="bg-indigo-100 text-indigo-600 p-4 rounded-full text-2xl group-hover:bg-indigo-600 group-hover:text-white transition duration-300">
                {btn.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 group-hover:text-indigo-700">
                {btn.title}
              </h3>
            </div>
            <FaArrowRight className="text-gray-400 group-hover:text-indigo-500 text-xl transition duration-300" />
          </Link>
        ))}
      </div>
    </div>
  );
};


export default RegisterHome;





import React, { useEffect, useState } from "react";
import { FaChartBar, FaUserEdit, FaUsers, FaChevronRight, FaBell } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { AddGroup, Statistics, WithdrawGroup, StudentList } from '../../components/teacher/index';

const TeacherSubject = () => {
  const token = localStorage.getItem('token');
  const [isActive, setIsActive] = useState('active');
  const [activeTab, setActiveTab] = useState('active');

  const buttons = [
    { id: 'active', icon: FaChartBar, title: 'Statistika' },
    { id: 'WithdrawGroup', icon: FaUserEdit, title: 'O‘quvchini ko‘chirish' },
    { id: 'studentList', icon: FaUsers, title: 'O‘quvchilar ro‘yxati' },
  ];

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleLocation = (id) => {
    setIsActive(id);
    setActiveTab(id);
  };

  // Mock data for statistics
  const statsData = [
    { label: "Jami o'quvchilar", value: 142, change: "+12%", color: "from-indigo-500 to-indigo-600" },
    { label: "Aktiv guruhlar", value: 8, change: "+1", color: "from-emerald-500 to-emerald-600" },
    { label: "O'rtacha baho", value: 4.7, change: "+0.2", color: "from-amber-500 to-amber-600" },
    { label: "Darslar", value: 32, change: "3 yangi", color: "from-rose-500 to-rose-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6">

      {/* Quick stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsData.map((stat, index) => (
          <div 
            key={index} 
            className={`bg-gradient-to-br ${stat.color} rounded-xl shadow-lg p-5 text-white`}
          >
            <p className="text-sm opacity-90">{stat.label}</p>
            <div className="flex items-end justify-between mt-2">
              <p className="text-2xl font-bold">{stat.value}</p>
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation tabs */}
      <div className="bg-white rounded-2xl shadow-md p-4 mb-8">
        <div className="flex flex-wrap gap-2 sm:gap-4 justify-center">
          {buttons.map(({ id, icon: Icon, title }) => (
            <button
              key={id}
              onClick={() => handleLocation(id)}
              className={`
                flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                transition-all duration-300 transform hover:scale-[1.02]
                ${activeTab === id
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-indigo-50 border border-gray-100'}
                min-w-[180px]
              `}
            >
              <Icon className="text-lg" />
              <span className="font-medium">{title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main content area */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300">
        {/* Tab indicator */}
        <div className="flex items-center bg-gray-50 px-6 py-3 border-b border-gray-100">
          <span className="text-gray-500">Boshqaruv paneli</span>
          <FaChevronRight className="mx-2 text-gray-400 text-xs" />
          <span className="font-medium text-indigo-600">
            {buttons.find(btn => btn.id === activeTab)?.title}
          </span>
        </div>
        
        {/* Content */}
        <div className="p-4 sm:p-6">
          {isActive === 'active' && <Statistics />}
          {isActive === 'WithdrawGroup' && <WithdrawGroup />}
          {isActive === 'studentList' && <StudentList />}
        </div>
      </div>
    </div>
  );
};

export default TeacherSubject;
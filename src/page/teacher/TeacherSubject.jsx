import React, { useEffect, useState } from "react";
import { FaChartBar, FaUserEdit, FaUsers, FaChevronRight } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { AddGroup, Statistics, WithdrawGroup, StudentList } from '../../components/teacher/index';
import axios from 'axios';

const TeacherSubject = () => {
  const token = localStorage.getItem('token');
  const [isActive, setIsActive] = useState('active');
  const [activeTab, setActiveTab] = useState('active');
  const [stats, setStats] = useState({
    students: 0,
    subjects: 0,
    groups: 0,
    averageGrade: 0,
    attendance: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  
  useEffect(() => {
    const fetchStatistics = async () => {
      if (!token) {
        setError('Token topilmadi');
        return;
      }

      try {
        setLoading(true);
        const headers = { Authorization: `Bearer ${token}` };
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/statistics/inMonth`, { headers });
        
        if (res.status === 200) {
          setStats({
            students: res.data.students || 0,
            subjects: res.data.subjects || 0,
            groups: res.data.groups || 0,
            averageGrade: res.data.score || 0,
            attendance: res.data.attendance || 0
          });
        } else {
          setError(`Kutilmagan javob holati: ${res.status}`);
        }
      } catch (error) {
        console.error('Statistika olishda xatolik:', error);
        setError('Statistika ma\'lumotlarini yuklashda xatolik yuz berdi');
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [token]);

  // Statistika kartalari uchun ma'lumotlar
  const statsData = [
    { 
      label: "Jami o'quvchilar", 
      value: stats.students, 
      change: "+12%", 
      color: "from-indigo-500 to-indigo-600",
      icon: <FaUsers className="text-xl opacity-80" />
    },
    { 
      label: "Jami fanlar", 
      value: stats.subjects, 
      change: "+1", 
      color: "from-emerald-500 to-emerald-600",
      icon: <FaChartBar className="text-xl opacity-80" />
    },
    { 
      label: "Jami guruhlar", 
      value: stats.groups, 
      change: "+0.2", 
      color: "from-amber-500 to-amber-600",
      icon: <FaUserEdit className="text-xl opacity-80" />
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-indigo-700">Ma'lumotlar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-md text-center">
          <div className="text-rose-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Xatolik yuz berdi</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Qayta yuklash
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6">
      {/* Sarlavha */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">O'qituvchi boshqaruv paneli</h1>

      {/* Statistika kartalari */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statsData.map((stat, index) => (
          <div 
            key={index} 
            className={`bg-gradient-to-br ${stat.color} rounded-xl shadow-lg p-5 text-white transition-all hover:shadow-xl`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm opacity-90">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className="bg-white/20 p-2 rounded-lg">
                {stat.icon}
              </div>
            </div>
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full mt-2 inline-block">
              {stat.change}
            </span>
          </div>
        ))}
      </div>

      {/* Navigatsiya tablari */}
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
                min-w-[180px] flex-1
              `}
            >
              <Icon className="text-lg" />
              <span className="font-medium">{title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Asosiy kontent */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300">
        {/* Tab indikatori */}
        <div className="flex items-center bg-gray-50 px-6 py-3 border-b border-gray-100">
          <span className="text-gray-500">Boshqaruv paneli</span>
          <FaChevronRight className="mx-2 text-gray-400 text-xs" />
          <span className="font-medium text-indigo-600">
            {buttons.find(btn => btn.id === activeTab)?.title}
          </span>
        </div>
        
        {/* Kontent */}
        <div className="p-4 sm:p-6">
          {isActive === 'active' && <Statistics stats={stats} />}
          {isActive === 'WithdrawGroup' && <WithdrawGroup />}
          {isActive === 'studentList' && <StudentList />}
        </div>
      </div>
    </div>
  );
};

export default TeacherSubject;
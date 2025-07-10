import axios from 'axios';
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList
} from 'recharts';
import { motion } from 'framer-motion';

const TotalStudent = () => {
  const token = localStorage.getItem('token');
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Ranglar palettasi
  const COLORS = [
    '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe',
    '#4f46e5', '#4338ca', '#3730a3', '#312e81'
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/group/search-group`, { headers });
      console.log(res.data)

      if (res.status === 200) {
        // Ma'lumotlarni talabalar soni bo'yicha saralash
        const sortedData = res.data.groups
          .map(group => ({
            name: group.subject,
            talabalar: group.totalStudents
          }))
          .sort((a, b) => b.talabalar - a.talabalar);
        
        setGroups(sortedData);
      }
    } catch (error) {
      console.error("Ma'lumotlarni yuklashda xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Maxsus Tooltip komponenti
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border border-indigo-100">
          <p className="font-bold text-indigo-800">{payload[0].payload.name}</p>
          <p className="text-lg font-semibold text-indigo-600">
            {payload[0].value} <span className="text-sm text-gray-500">talaba</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div 
      className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl shadow-xl p-5 border border-indigo-100 hover:shadow-2xl transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-4 text-center">
        <h3 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
          Fanlar bo‘yicha talabalar soni
        </h3>
        <p className="text-gray-500 text-sm mt-1">Har bir fanga qabul qilingan talabalar soni</p>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-indigo-600 rounded-full mx-auto mt-2" />
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : groups.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center text-center p-4">
          <div className="bg-indigo-100 p-4 rounded-full mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h4 className="text-lg font-semibold text-gray-700">Ma'lumot topilmadi</h4>
          <p className="text-gray-500 mt-1">Fanlar bo'yicha talabalar soni mavjud emas</p>
          <button 
            onClick={fetchData}
            className="mt-4 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
          >
            Qayta yuklash
          </button>
        </div>
      ) : (
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={groups}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                horizontal={true} 
                vertical={false} 
                stroke="#e0e7ff" 
              />
              <XAxis 
                type="number" 
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                dataKey="name" 
                type="category" 
                tick={{ fontSize: 12, fontWeight: 600, fill: '#4b5563' }}
                width={120}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                content={<CustomTooltip />}
                cursor={{ fill: '#e0e7ff' }}
              />
              <Bar 
                dataKey="talabalar" 
                barSize={16} 
                radius={[0, 8, 8, 0]}
                animationDuration={1500}
              >
                {groups.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                  />
                ))}
                <LabelList 
                  dataKey="talabalar" 
                  position="right" 
                  formatter={(value) => `${value} ta`}
                  style={{ fill: '#4b5563', fontSize: 11, fontWeight: 600 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t border-indigo-100 flex justify-between items-center">
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 bg-indigo-500 rounded-full mr-2"></span>
          <span className="text-sm text-gray-600">Jami: {groups.reduce((sum, item) => sum + item.talabalar, 0)} talaba</span>
        </div>
        <button 
          onClick={fetchData}
          className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Yangilash
        </button>
      </div>
    </motion.div>
  );
};

export default TotalStudent;
import axios from 'axios';
import React, { useEffect, useState } from "react";
import { FaUserCheck, FaUserTimes, FaPaperPlane, FaChevronLeft, FaChartLine } from "react-icons/fa";
import { FiCheckCircle } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";

const Attendance = () => {
  const token = localStorage.getItem('token');
  const location = useLocation();
  const navigate = useNavigate();
  const { groupId, students } = location.state || {};
  const [permission, setPermission] = useState(false);
  const [showSubmitButton, setShowSubmitButton] = useState(false);
  const [attendance, setAttendance] = useState({});
  const today = new Date().setHours(0, 0, 0, 0);
  const [stats, setStats] = useState({ present: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(false);

  // Authentication and data validation
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    
    if (!groupId || !students?.length) {
      navigate('/teacher');
      return;
    }
    
    setPermission(true);
  }, [token, navigate, groupId, students]);

  // Initialize attendance state
  useEffect(() => {
    if (students?.length) {
      const initialAttendance = students.reduce((acc, student) => {
        acc[student.id] = { attended: false, grade: '' };
        return acc;
      }, {});
      setAttendance(initialAttendance);
      setStats({ present: 0, total: students.length });
    }
  }, [students]);

  const markAttendance = (id) => {
    setAttendance(prev => {
      const newAttendance = {
        ...prev,
        [id]: {
          ...prev[id],
          attended: !prev[id]?.attended,
          grade: prev[id]?.attended ? '' : prev[id]?.grade
        }
      };
      
      // Update stats
      const presentCount = Object.values(newAttendance).filter(a => a.attended).length;
      setStats({ present: presentCount, total: students.length });
      
      return newAttendance;
    });
    
    setShowSubmitButton(true);
  };

  const handleGradeChange = (id, value) => {
    // Validate grade input (0-100)
    let gradeValue = value;
    if (gradeValue !== '') {
      const numericValue = Number(gradeValue);
      if (isNaN(numericValue)) return;
      gradeValue = Math.min(100, Math.max(0, numericValue));
    }
    
    setAttendance(prev => ({
      ...prev,
      [id]: { ...prev[id], grade: gradeValue }
    }));
  };

  const submitAttendance = async () => {
    setIsLoading(true);
    try {
      // Transform to required format: { studentId: { attended: true, grade: number } }
      const attendanceData = Object.entries(attendance).reduce(
        (acc, [studentId, { attended, grade }]) => {
          if (attended) {
            acc[studentId] = { attended, grade };
          }
          return acc;
        }, {}
      );

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/attandance/create`,
        { 
          attendance: attendanceData, 
          gId:{groupId} 
        },
        {
          headers: { 
            Authorization: `Bearer ${token}` 
          }
        }
      );

      alert(data.message || "Davomat muvaffaqiyatli qayd etildi!");
      navigate('/teacher');
    } catch (error) {
      alert(error.response?.data?.message || "Xatolik yuz berdi!");
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate attendance percentage
  const attendancePercentage = stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0;
  
  // Early return for permission errors
  if (!permission) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md w-full mx-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Yuklanmoqda...</h2>
          <p className="text-gray-600">Talabalar ro'yxati yuklanmoqda</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-8 px-4">
      <div className="mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <button 
            onClick={() => navigate('/teacher')}
            className="flex items-center gap-2 bg-white py-3 px-5 rounded-xl shadow hover:shadow-md transition-all duration-300 text-indigo-700 hover:text-indigo-900 font-medium"
          >
            <FaChevronLeft />
            <span>Orqaga qaytish</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">Davomatni belgilash</h1>
            <p className="text-gray-600 mt-2">
              {new Date(today).toLocaleDateString('uz-UZ', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          
          <div className="flex items-center gap-2 bg-white py-2 px-4 rounded-xl shadow">
            <FaChartLine className="text-indigo-600" />
            <span className="font-medium">
              <span className="text-green-600">{stats.present}</span> / {stats.total}
            </span>
          </div>
        </div>
        
        {/* Stats Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-100 p-4 rounded-xl">
                <FaUserCheck className="text-indigo-600 text-2xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Davomat statistikasi</h3>
                <p className="text-gray-500">{stats.present} ta talaba ishtirok etmoqda</p>
              </div>
            </div>
            
            <div className="w-full sm:w-64">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Davomat foizi</span>
                <span className="text-sm font-bold text-gray-700">{attendancePercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-500 to-teal-500 h-3 rounded-full transition-all duration-700"
                  style={{ width: `${attendancePercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                  <th className="py-4 px-6 text-left rounded-tl-2xl">№</th>
                  <th className="py-4 px-6 text-left">Talaba</th>
                  <th className="py-4 px-6 text-center">Davomat</th>
                  <th className="py-4 px-6 text-center">Baho</th>
                  <th className="py-4 px-6 text-center rounded-tr-2xl">Holat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {students.map((student, index) => (
                  <tr 
                    key={student.id} 
                    className="hover:bg-indigo-50 transition-colors"
                  >
                    <td className="py-4 px-6 font-medium">
                      <span className="bg-indigo-100 text-indigo-800 py-1 px-3 rounded-full text-sm">
                        {index + 1}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="bg-indigo-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                          <span className="font-bold text-indigo-700">
                            {student.studentName.charAt(0)}
                          </span>
                        </div>
                        <span className="font-medium">{student.studentName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => markAttendance(student.id)}
                        className={`p-3 rounded-xl transition duration-200 ${
                          attendance[student.id]?.attended
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                        aria-label={attendance[student.id]?.attended 
                          ? "Davomat belgilangan" 
                          : "Davomat belgilash"
                        }
                      >
                        {attendance[student.id]?.attended ? (
                          <FaUserCheck size={20} />
                        ) : (
                          <FiCheckCircle size={20} />
                        )}
                      </button>
                    </td>
                    <td className="py-4 px-6">
                      <div className="relative max-w-[120px] mx-auto">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          disabled={!attendance[student.id]?.attended}
                          value={attendance[student.id]?.grade}
                          onChange={(e) => 
                            handleGradeChange(student.id, e.target.value)
                          }
                          placeholder="0-100"
                          className={`w-full p-3 rounded-lg border shadow-sm transition duration-200 text-gray-800 font-medium ${
                            attendance[student.id]?.attended
                              ? 'bg-white border-indigo-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500'
                              : 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                          }`}
                        />
                        {attendance[student.id]?.attended && (
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 font-medium">
                            %
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        attendance[student.id]?.attended
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {attendance[student.id]?.attended ? (
                          <>
                            <FaUserCheck className="mr-1" /> Ishtirok etdi
                          </>
                        ) : (
                          <>
                            <FaUserTimes className="mr-1" /> Keldi-ketdi
                          </>
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Floating Submit Button */}
        {showSubmitButton && (
          <div className="fixed bottom-6 left-0 right-0 flex justify-center z-10 animate-fade-in">
            <button
              onClick={submitAttendance}
              disabled={isLoading}
              className="flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Jo'natilmoqda...</span>
                </>
              ) : (
                <>
                  <FaPaperPlane />
                  <span>Davomatni saqlash</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;
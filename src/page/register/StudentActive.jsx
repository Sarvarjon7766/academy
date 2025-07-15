import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { FaFileExcel, FaSearch, FaFilter, FaUserGraduate, FaArchive } from 'react-icons/fa';

const StudentActive = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/student/getAllfull`);
        if (res.data.success) {
          setStudents(res.data.students);
          setFilteredStudents(res.data.students);
        } else {
          setStudents([]);
          setFilteredStudents([]);
        }
      } catch (error) {
        console.error('Xatolik:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    let result = students;
    
    // Filtrlash
    if (filter !== 'all') {
      result = result.filter(student => student.status === filter);
    }
    
    // Qidiruv
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(student => 
        student.fullName.toLowerCase().includes(term) || 
        student.phone.toLowerCase().includes(term)
      );
    }
    
    setFilteredStudents(result);
  }, [students, filter, searchTerm]);

  const handleFilter = (type) => {
    setFilter(type);
  };

  const translateStatus = (status) => {
    switch(status) {
      case 'active': return 'Faol';
      case 'archived': return 'Arxivlangan';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const exportToExcel = () => {
    const activeStudents = students
      .filter(student => student.status === 'active')
      .map((student, index) => ({
        '№': index + 1,
        'F.I.SH': student.fullName,
        'Telefon': student.phone,
        'Holati': 'Faol'
      }));
    
    const archivedStudents = students
      .filter(student => student.status === 'archived')
      .map((student, index) => ({
        '№': index + 1,
        'F.I.SH': student.fullName,
        'Telefon': student.phone,
        'Holati': 'Arxivlangan'
      }));
    
    const wb = XLSX.utils.book_new();
    const activeWS = XLSX.utils.json_to_sheet(activeStudents);
    XLSX.utils.book_append_sheet(wb, activeWS, "Faol Talabalar");
    
    const archivedWS = XLSX.utils.json_to_sheet(archivedStudents);
    XLSX.utils.book_append_sheet(wb, archivedWS, "Arxivlangan Talabalar");
    
    XLSX.writeFile(wb, "Talabalar.xlsx");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-4 md:p-8">
      <div className="mx-auto">
        {/* Sarlavha va kontrollar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-indigo-800 flex items-center gap-3">
                <FaUserGraduate className="text-indigo-600" />
                Talabalar Ma'lumotlari
              </h1>
              <p className="text-gray-600 mt-2">Barcha talabalar ro'yxati va ularning holati</p>
            </div>
            
            <button 
              onClick={exportToExcel}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all transform hover:scale-105"
            >
              <FaFileExcel className="text-xl" />
              Excelga Yuklab Olish
            </button>
          </div>
          
          {/* Filtr va qidiruv paneli */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
                <FaFilter className="text-indigo-500" />
                Holat bo'yicha filtrlash
              </h2>
              <div className="flex flex-wrap gap-3">
                <button
                  className={`px-5 py-2 rounded-full flex items-center gap-2 transition-all ${filter === 'all' ? 'bg-indigo-500 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-indigo-50'}`}
                  onClick={() => handleFilter('all')}
                >
                  <div className={`w-3 h-3 rounded-full ${filter === 'all' ? 'bg-white' : 'bg-indigo-500'}`}></div>
                  Barchasi
                </button>
                <button
                  className={`px-5 py-2 rounded-full flex items-center gap-2 transition-all ${filter === 'active' ? 'bg-green-500 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-green-50'}`}
                  onClick={() => handleFilter('active')}
                >
                  <div className={`w-3 h-3 rounded-full ${filter === 'active' ? 'bg-white' : 'bg-green-500'}`}></div>
                  Faol
                </button>
                <button
                  className={`px-5 py-2 rounded-full flex items-center gap-2 transition-all ${filter === 'archived' ? 'bg-red-500 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-red-50'}`}
                  onClick={() => handleFilter('archived')}
                >
                  <div className={`w-3 h-3 rounded-full ${filter === 'archived' ? 'bg-white' : 'bg-red-500'}`}></div>
                  Arxivlangan
                </button>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
                <FaSearch className="text-indigo-500" />
                Talaba qidirish
              </h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ism yoki telefon raqam bo'yicha qidiring..."
                  className="w-full px-4 py-3 pl-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Statistik ma'lumotlar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 flex items-center">
            <div className="bg-indigo-100 p-4 rounded-full mr-4">
              <FaUserGraduate className="text-3xl text-indigo-600" />
            </div>
            <div>
              <p className="text-gray-600">Jami talabalar</p>
              <p className="text-3xl font-bold text-indigo-800">{students.length}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 flex items-center">
            <div className="bg-green-100 p-4 rounded-full mr-4">
              <FaUserGraduate className="text-3xl text-green-600" />
            </div>
            <div>
              <p className="text-gray-600">Faol talabalar</p>
              <p className="text-3xl font-bold text-green-700">{students.filter(s => s.status === 'active').length}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 flex items-center">
            <div className="bg-red-100 p-4 rounded-full mr-4">
              <FaArchive className="text-3xl text-red-600" />
            </div>
            <div>
              <p className="text-gray-600">Arxivlangan talabalar</p>
              <p className="text-3xl font-bold text-red-700">{students.filter(s => s.status === 'archived').length}</p>
            </div>
          </div>
        </div>
        
        {/* Talabalar jadvali */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white">
                      <th className="py-4 px-6 text-left rounded-tl-xl">#</th>
                      <th className="py-4 px-6 text-left">F.I.SH</th>
                      <th className="py-4 px-6 text-left">Telefon</th>
                      <th className="py-4 px-6 text-left rounded-tr-xl">Holati</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student, index) => (
                        <tr 
                          key={student._id} 
                          className="border-b border-gray-200 hover:bg-indigo-50 transition-colors"
                        >
                          <td className="py-4 px-6 font-medium">{index + 1}</td>
                          <td className="py-4 px-6">
                            <div className="flex items-center">
                              <div className="bg-indigo-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                                <span className="text-indigo-700 font-bold">
                                  {student.fullName.charAt(0)}
                                </span>
                              </div>
                              {student.fullName}
                            </div>
                          </td>
                          <td className="py-4 px-6">{student.phone}</td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(student.status)}`}>
                              {translateStatus(student.status)}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-12 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <FaUserGraduate className="text-6xl text-gray-300 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-600">Talabalar topilmadi</h3>
                            <p className="text-gray-500 mt-2">
                              {searchTerm ? 
                                `"${searchTerm}" bo'yicha hech qanday natija topilmadi` : 
                                'Sizning filtr sorovingiz boyicha talabalar topilmadi'
                              }
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {filteredStudents.length > 0 && (
                <div className="px-6 py-4 bg-gray-50 text-gray-600 rounded-b-xl">
                  Jami {filteredStudents.length} ta talaba topildi
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentActive;
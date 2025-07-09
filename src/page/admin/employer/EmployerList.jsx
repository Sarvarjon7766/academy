import axios from 'axios';
import React, { useEffect, useState } from 'react';

const EmployerList = () => {
  const [employers, setEmployers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployer, setSelectedEmployer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployers = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/employer/getAll`);
        if (res.data.success) {
          setEmployers(res.data.employer);
          setError(null);
        } else {
          setError('Xodimlarni yuklashda xatolik yuz berdi');
        }
      } catch (err) {
        console.error('Xodimlarni olishda xatolik:', err);
        setError('Serverga ulana olmadi. Iltimos, internet aloqasini tekshiring');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEmployers();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredEmployers = employers.filter((emp) =>
    (emp.fullName?.toLowerCase() || '').includes(searchTerm) ||
    (emp.phone || '').includes(searchTerm) ||
    (emp.address?.toLowerCase() || '').includes(searchTerm)
  );

  // Modalni tashqarini bosish orqali yopish
  const closeModal = (e) => {
    if (e.target === e.currentTarget) {
      setSelectedEmployer(null);
    }
  };

  // Jinsni ikona bilan ifodalash
  const renderGenderIcon = (gender) => {
    if (gender === 'Erkak') return '👨';
    if (gender === 'Ayol') return '👩';
    return '👤';
  };

  // Maoshni formatlash
  const formatSalary = (salary) => {
    if (!salary) return '-';
    return salary.toLocaleString('uz-UZ') + ' so\'m';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4 sm:p-6 md:p-8">
      <div className="mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900 mb-3">
            Xodimlar Boshqaruv Tizimi
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Barcha xodimlaringizning ma'lumotlarini bitta joyda boshqaring
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-5 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="w-full md:w-1/2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Xodim ismi, telefon yoki manzil bo'yicha qidirish..."
                  className="w-full border-2 border-blue-200 rounded-lg px-4 py-3 pl-12 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-600 transition"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-blue-900 font-medium">
                Jami xodimlar: <span className="text-blue-600">{employers.length}</span>
              </span>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-red-800 font-medium">{error}</h3>
              </div>
              <p className="mt-2 text-red-700">Iltimos, keyinroq qayta urinib ko'ring</p>
            </div>
          ) : (
            <div className="border border-blue-200 rounded-lg shadow-sm bg-white overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="py-3 px-4 text-left rounded-tl-lg">Ism Familiya</th>
                    <th className="py-3 px-4 text-left hidden sm:table-cell">Lavozimi</th>
                    <th className="py-3 px-4 text-left">Telefon</th>
                    <th className="py-3 px-4 text-left hidden md:table-cell">Manzil</th>
                    <th className="py-3 px-4 text-left rounded-tr-lg">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployers.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-6 text-center text-gray-500">
                        <div className="flex flex-col items-center justify-center py-8">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Hech qanday xodim topilmadi
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredEmployers.map((emp) => (
                      <tr 
                        key={emp._id} 
                        onClick={() => setSelectedEmployer(emp)}
                        className="border-t border-blue-100 hover:bg-blue-50 transition cursor-pointer"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <div className="bg-blue-100 text-blue-800 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                              {renderGenderIcon(emp.gender)}
                            </div>
                            <div>
                              <div className="font-medium text-blue-900">{emp.fullName}</div>
                              <div className="text-sm text-gray-600 sm:hidden">{emp.position}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 hidden sm:table-cell">{emp.position}</td>
                        <td className="py-4 px-4">
                          <a href={`tel:${emp.phone}`} className="text-blue-600 hover:text-blue-800 transition">
                            {emp.phone}
                          </a>
                        </td>
                        <td className="py-4 px-4 hidden md:table-cell">{emp.address || '-'}</td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            emp.status === 'Ishlaydi' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {emp.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {selectedEmployer && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center px-4 py-6"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-t-2xl p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">
                    {selectedEmployer.fullName}
                  </h2>
                  <p className="text-blue-100">{selectedEmployer.position}</p>
                </div>
                <button
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition"
                  onClick={() => setSelectedEmployer(null)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="flex items-center mt-4">
                <div className="bg-white bg-opacity-20 rounded-full p-3 mr-3">
                  {renderGenderIcon(selectedEmployer.gender)}
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-white bg-opacity-20 rounded-full px-3 py-1 text-sm flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {selectedEmployer.phone}
                  </span>
                  <span className="bg-white bg-opacity-20 rounded-full px-3 py-1 text-sm flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {selectedEmployer.address || 'Manzil kiritilmagan'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Shaxsiy ma'lumotlar</h3>
                  <ul className="space-y-3">
                    <li className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-600">Tug'ilgan sana:</span>
                      <span className="font-medium">
                        {selectedEmployer.date_of_birth 
                          ? new Date(selectedEmployer.date_of_birth).toLocaleDateString() 
                          : '-'}
                      </span>
                    </li>
                    <li className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-600">Jinsi:</span>
                      <span className="font-medium">
                        {renderGenderIcon(selectedEmployer.gender)} {selectedEmployer.gender || '-'}
                      </span>
                    </li>
                    <li className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-600">Qo'shimcha ma'lumot:</span>
                      <span className="font-medium">{selectedEmployer.additionalInfo || '-'}</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Ish haqida ma'lumot</h3>
                  <ul className="space-y-3">
                    <li className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-600">Lavozim:</span>
                      <span className="font-medium">{selectedEmployer.position}</span>
                    </li>
                    <li className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-600">Maosh:</span>
                      <span className="font-medium text-green-600">
                        {formatSalary(selectedEmployer.salary)}
                      </span>
                    </li>
                    <li className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-600">Status:</span>
                      <span className={`font-medium ${
                        selectedEmployer.status === 'Ishlaydi' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {selectedEmployer.status}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Kontakt ma'lumotlari</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <div className="bg-blue-100 text-blue-800 rounded-lg p-3 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">
                        {selectedEmployer.email || 'Kiritilmagan'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="bg-blue-100 text-blue-800 rounded-lg p-3 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Telefon</p>
                      <p className="font-medium">{selectedEmployer.phone}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex justify-end">
              <button 
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                onClick={() => setSelectedEmployer(null)}
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerList;
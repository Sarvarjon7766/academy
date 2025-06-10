import axios from 'axios';
import React, { useEffect, useState } from 'react';

const EmployerList = () => {
  const [employers, setEmployers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployer, setSelectedEmployer] = useState(null);

  useEffect(() => {
    const fetchEmployers = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/employer/getAll');
        if (res.data.success) {
          setEmployers(res.data.employer);
        }
      } catch (error) {
        console.error('Xodimlarni olishda xatolik:', error);
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

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gradient-to-br from-blue-50 via-white to-blue-50 min-h-screen">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-blue-900 mb-6 text-center drop-shadow-md">
        Xodimlar Ro'yxati
      </h2>

      <div className="max-w-2xl mx-auto mb-6">
        <input
          type="text"
          placeholder="Xodim ismi, telefon yoki manzil bo'yicha qidirish..."
          className="w-full border-2 border-blue-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-600 transition"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="mx-auto border border-blue-300 rounded-lg shadow-sm bg-white overflow-x-auto">
        <ul className="min-w-full">
          <li className="hidden sm:grid grid-cols-4 gap-4 bg-blue-200 text-blue-900 font-semibold rounded-t-lg p-3 select-none">
            <span>Ism Familiya</span>
            <span>Lavozimi</span>
            <span>Telefon</span>
            <span>Manzil</span>
          </li>

          {filteredEmployers.length === 0 ? (
            <li className="p-4 text-center text-gray-500">Xodim topilmadi</li>
          ) : (
            filteredEmployers.map((emp) => (
              <li
                key={emp._id}
                onClick={() => setSelectedEmployer(emp)}
                className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4 border-t border-blue-100 cursor-pointer hover:bg-blue-50 transition px-3 py-4 items-center"
              >
                <span className="font-medium text-blue-800">{emp.fullName}</span>
                <span className="text-sm sm:text-base">{emp.position}</span>
                <span className="text-sm sm:text-base">{emp.phone}</span>
                <span className="text-sm sm:text-base">{emp.address || '-'}</span>
              </li>
            ))
          )}
        </ul>
      </div>

      {selectedEmployer && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-6 relative overflow-y-auto max-h-[90vh]">
            <button
              className="absolute bg-white top-3 right-4 text-gray-500 hover:text-red-500 text-xl"
              onClick={() => setSelectedEmployer(null)}
            >
              &times;
            </button>

            <h2 className="text-2xl font-semibold text-indigo-700 mb-4 break-words">
              👤 {selectedEmployer.fullName} - batafsil ma'lumot
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
              <div>
                <p><strong>📞 Telefon:</strong> {selectedEmployer.phone}</p>
                <p><strong>📍 Manzil:</strong> {selectedEmployer.address}</p>
                <p><strong>🎂 Tug‘ilgan sana:</strong> {new Date(selectedEmployer.date_of_birth).toLocaleDateString()}</p>
                <p><strong>🚻 Jinsi:</strong> {selectedEmployer.gender}</p>
              </div>
              <div>
                <p><strong>💼 Lavozim:</strong> {selectedEmployer.position}</p>
                <p><strong>💰 Maosh:</strong> {selectedEmployer.salary?.toLocaleString()} so'm</p>
                <p><strong>📊 Status:</strong> {selectedEmployer.status}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerList;

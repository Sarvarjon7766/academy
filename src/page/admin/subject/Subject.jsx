import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaPlus, FaBook, FaMoneyBillWave, FaLayerGroup } from "react-icons/fa";
import Transport from './Transport';
import Hostel from './Hostel';
import MealCost from './MealCost';

const Subject = () => {
  const [subjectName, setSubjectName] = useState("");
  const [mainPrice, setSubjectPrice] = useState("");
  const [additionalPrice, setAdditionalPrice] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [editId, setEditId] = useState(null);
  const [activeSection, setActiveSection] = useState("Fanlar");

  const sections = [
    { name: "Fanlar", icon: <FaBook /> },
    { name: "Yotoq Joy", icon: <div>🛏️</div> },
    { name: "Transport", icon: <div>🚌</div> },
    { name: "Oziq-ovqat", icon: <div>🍲</div> }
  ];

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/subject/getAll`);
      setSubjects(response.data.subject);
    } catch (error) {
      console.error("Subjectlarni olishda xatolik:", error);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const addSubject = async () => {
    if (subjectName && mainPrice && additionalPrice) {
      try {
        const subjectData = { subjectName, mainPrice, additionalPrice };
        if (editId) {
          await axios.put(`${import.meta.env.VITE_API_URL}/api/subject/update/${editId}`, subjectData);
          setEditId(null);
        } else {
          await axios.post(`${import.meta.env.VITE_API_URL}/api/subject/create`, subjectData);
        }
        setSubjectName("");
        setSubjectPrice("");
        setAdditionalPrice("");
        fetchSubjects();
      } catch (error) {
        console.error("Subject qo'shishda xatolik:", error);
      }
    }
  };

  const deleteSubject = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/subject/delete/${id}`);
      fetchSubjects();
    } catch (error) {
      console.error("Subject o'chirishda xatolik:", error);
    }
  };

  const editSubject = (subject) => {
    setSubjectName(subject.subjectName);
    setSubjectPrice(subject.mainPrice);
    setAdditionalPrice(subject.additionalPrice);
    setEditId(subject._id);
  };

  return (
    <div className="mx-auto p-6 bg-gradient-to-br from-indigo-50 to-white rounded-3xl shadow-2xl">
      {/* Animated Navigation Tabs */}
      <div className="flex flex-wrap justify-center mb-8 gap-3">
        {sections.map((section) => (
          <button
            key={section.name}
            onClick={() => setActiveSection(section.name)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
              activeSection === section.name
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                : "bg-white text-indigo-700 shadow-md hover:bg-indigo-50"
            }`}
          >
            <span className="text-lg">{section.icon}</span>
            <span>{section.name}</span>
          </button>
        ))}
      </div>

      {/* Fanlar bo'limi */}
      {activeSection === "Fanlar" && (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
         

          {/* Form with floating labels */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
              <div className="relative z-0">
                <input
                  type="text"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  className="block py-3 px-4 w-full text-sm bg-transparent rounded-lg border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
                  placeholder=" "
                />
                <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-indigo-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3">
                  Fan nomi
                </label>
                <FaBook className="absolute right-3 top-3.5 text-gray-400" />
              </div>
              
              <div className="relative z-0">
                <input
                  type="number"
                  value={mainPrice}
                  onChange={(e) => setSubjectPrice(e.target.value)}
                  className="block py-3 px-4 w-full text-sm bg-transparent rounded-lg border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
                  placeholder=" "
                />
                <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-indigo-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3">
                  Asosiy to'lov
                </label>
                <FaMoneyBillWave className="absolute right-3 top-3.5 text-gray-400" />
              </div>
              
              <div className="relative z-0">
                <input
                  type="number"
                  value={additionalPrice}
                  onChange={(e) => setAdditionalPrice(e.target.value)}
                  className="block py-3 px-4 w-full text-sm bg-transparent rounded-lg border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
                  placeholder=" "
                />
                <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-indigo-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3">
                  Qo'shimcha to'lov
                </label>
                <FaLayerGroup className="absolute right-3 top-3.5 text-gray-400" />
              </div>
              
              <button
                onClick={addSubject}
                className={`flex items-center justify-center gap-2 h-full rounded-lg px-4 py-3 text-white font-medium transition-all shadow-lg ${
                  editId 
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                    : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                }`}
              >
                {editId ? <FaEdit /> : <FaPlus />}
                {editId ? "O'zgartirish" : "Yangi qo'shish"}
              </button>
            </div>

            {/* Subject Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-200 shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-indigo-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                      Fan nomi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                      Asosiy to'lov
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                      Qo'shimcha to'lov
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                      Amallar
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {subjects.length > 0 ? (
                    subjects.map((subject) => (
                      <tr 
                        key={subject._id} 
                        className="hover:bg-indigo-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                              <FaBook className="text-indigo-600" />
                            </div>
                            <span className="font-medium">{subject.subjectName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-green-600 font-medium">
                          {Number(subject.mainPrice).toLocaleString("ru-RU")} so'm
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-amber-600 font-medium">
                          {Number(subject.additionalPrice || 0).toLocaleString("ru-RU")} so'm
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-3">
                            <button
                              onClick={() => editSubject(subject)}
                              className="p-2 bg-blue-100 rounded-lg text-blue-600 hover:bg-blue-200 transition-colors"
                              title="Tahrirlash"
                            >
                              <FaEdit size={16} />
                            </button>
                            <button
                              onClick={() => deleteSubject(subject._id)}
                              className="p-2 bg-red-100 rounded-lg text-red-600 hover:bg-red-200 transition-colors"
                              title="O'chirish"
                            >
                              <FaTrash size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center justify-center">
                          <div className="bg-indigo-100 p-4 rounded-full mb-3">
                            <FaBook className="text-indigo-500 text-xl" />
                          </div>
                          <p className="text-lg">Hozircha fanlar mavjud emas</p>
                          <p className="mt-1">Yangi fan qo'shish uchun yuqoridagi formani to'ldiring</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Other Sections */}
      {activeSection === "Transport" && <Transport />}
      {activeSection === "Yotoq Joy" && <Hostel />}
      {activeSection === "Oziq-ovqat" && <MealCost />}
    </div>
  );
};

export default Subject;
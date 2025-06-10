import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import Transport from './Transport';
import Hostel from './Hostel';
import MealCost from './MealCost';

const API_URL = "http://localhost:4000/api/subject";

const Subject = () => {
  const [subjectName, setSubjectName] = useState("");
  const [mainPrice, setSubjectPrice] = useState("");
  const [additionalPrice, setAdditionalPrice] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [editId, setEditId] = useState(null);
  const [activeSection, setActiveSection] = useState("Fanlar");

  const sections = ["Fanlar", "Yotoq Joy", "Transport", "Oziq-ovqat"];

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(`${API_URL}/getAll`);
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
          await axios.put(`${API_URL}/update/${editId}`, subjectData);
          setEditId(null);
        } else {
          await axios.post(`${API_URL}/create`, subjectData);
        }
        setSubjectName("");
        setSubjectPrice("");
        setAdditionalPrice("");
        fetchSubjects();
      } catch (error) {
        console.error("Subject qo‘shishda xatolik:", error);
      }
    }
  };

  const deleteSubject = async (id) => {
    try {
      await axios.delete(`${API_URL}/delete/${id}`);
      fetchSubjects();
    } catch (error) {
      console.error("Subject o‘chirishda xatolik:", error);
    }
  };

  const editSubject = (subject) => {
    setSubjectName(subject.subjectName);
    setSubjectPrice(subject.mainPrice);
    setAdditionalPrice(subject.additionalPrice);
    setEditId(subject._id);
  };

  return (
    <div className=" mx-auto p-6 bg-gradient-to-br from-indigo-100 to-white rounded-2xl shadow-lg">
      {/* Navigation Tabs */}
      <div className="flex flex-wrap justify-center mb-6 gap-2">
        {sections.map((section) => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`px-6 py-2 rounded-full font-medium transition-colors duration-300 ${
              activeSection === section
                ? "bg-indigo-700 text-white shadow-md"
                : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
            }`}
          >
            {section}
          </button>
        ))}
      </div>

      {/* Fanlar bo‘limi */}
      {activeSection === "Fanlar" && (
        <>
          <h1 className="text-3xl font-bold text-center text-indigo-800 mb-6">📘 Fanlar</h1>

          {/* Form */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <input
              type="text"
              placeholder="Fan nomi"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <input
              type="number"
              placeholder="Asosiy to‘lov"
              value={mainPrice}
              onChange={(e) => setSubjectPrice(e.target.value)}
              className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <input
              type="number"
              placeholder="Qo‘shimcha to‘lov"
              value={additionalPrice}
              onChange={(e) => setAdditionalPrice(e.target.value)}
              className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              onClick={addSubject}
              className="bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700 transition"
            >
              {editId ? "✏️ O‘zgartirish" : "➕ Yuklash"}
            </button>
          </div>

          {/* Table-like UL Layout */}
          <ul className="w-full border border-gray-300 rounded-lg overflow-hidden">
            {/* Header */}
            <li className="grid grid-cols-4 bg-indigo-200 text-indigo-800 font-semibold p-3 border-b border-gray-300">
              <span>📘 Fan nomi</span>
              <span>💰 Asosiy</span>
              <span>➕ Qo‘shimcha</span>
              <span>⚙️ Amallar</span>
            </li>

            {/* Subject Rows */}
            {subjects.map((subject) => (
              <li
                key={subject._id}
                className="grid grid-cols-4 items-center px-4 py-3 border-b hover:bg-indigo-50"
              >
                <span>{subject.subjectName}</span>
                <span>{Number(subject.mainPrice).toLocaleString("ru-RU")} so'm</span>
                <span>{Number(subject.additionalPrice || 0).toLocaleString("ru-RU")} so'm</span>
                <span className="flex gap-4 justify-start">
                  <button
                    onClick={() => editSubject(subject)}
                    className="text-blue-600 bg-[#F1F4FF] hover:text-blue-800"
                    title="Tahrirlash"
                  >
                    <FaEdit size={18} />
                  </button>
                  <button
                    onClick={() => deleteSubject(subject._id)}
                    className="text-red-600 bg-[#F1F4FF] hover:text-red-800"
                    title="O‘chirish"
                  >
                    <FaTrash size={18} />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Other Sections */}
      {activeSection === "Transport" && <Transport />}
      {activeSection === "Yotoq Joy" && <Hostel />}
      {activeSection === "Oziq-ovqat" && <MealCost />}
    </div>
  );
};

export default Subject;

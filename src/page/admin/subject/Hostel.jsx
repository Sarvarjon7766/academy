import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

const API_URL = "http://localhost:4000/api/hostel";

const Hostel = () => {
  const [hostelName, setHostelName] = useState("");
  const [hostelPrice, setHostelPrice] = useState("");
  const [hostels, setHostels] = useState([]);
  const [editId, setEditId] = useState(null);

  const fetchHostels = async () => {
    try {
      const response = await axios.get(`${API_URL}/getAll`);
      setHostels(response.data.hostels);
    } catch (error) {
      console.error("Yotoqxonalarni olishda xatolik:", error);
    }
  };

  useEffect(() => {
    fetchHostels();
  }, []);

  const addHostel = async () => {
    if (hostelName && hostelPrice) {
      try {
        const hostelData = { hostelName, hostelPrice };

        if (editId) {
          await axios.put(`${API_URL}/update/${editId}`, hostelData);
          setHostels(
            hostels.map((hostel) =>
              hostel._id === editId ? { ...hostel, ...hostelData } : hostel
            )
          );
          setEditId(null);
        } else {
          const response = await axios.post(`${API_URL}/create`, hostelData);
          setHostels([...hostels, response.data.newHostel]);
        }

        setHostelName("");
        setHostelPrice("");
      } catch (error) {
        console.error("Yotoqxona qo‘shishda xatolik:", error);
      }
    } else {
      alert("Iltimos, nom va narxni kiriting");
    }
  };

  const deleteHostel = async (id) => {
    try {
      await axios.delete(`${API_URL}/delete/${id}`);
      setHostels(hostels.filter((hostel) => hostel._id !== id));
    } catch (error) {
      console.error("Yotoqxona o‘chirishda xatolik:", error);
    }
  };

  const editHostel = (hostel) => {
    setHostelName(hostel.hostelName);
    setHostelPrice(hostel.hostelPrice);
    setEditId(hostel._id);
  };

  return (
    <div className="mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-indigo-800 mb-6">🏠 Yotoqxona Joylari</h1>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <input
          type="text"
          placeholder="Yotoqxona nomi"
          value={hostelName}
          onChange={(e) => setHostelName(e.target.value)}
          className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <input
          type="number"
          placeholder="Narxi"
          value={hostelPrice}
          onChange={(e) => setHostelPrice(e.target.value)}
          className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          onClick={addHostel}
          className="bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700 transition"
        >
          {editId ? "✏️ O‘zgartirish" : "➕ Qo‘shish"}
        </button>
      </div>

      {/* Table-like UL Layout */}
      <ul className="w-full border border-gray-300 rounded-lg overflow-hidden">
        {/* Header */}
        <li className="grid grid-cols-4 bg-indigo-200 text-indigo-800 font-semibold p-3 border-b border-gray-300">
          <span>🏠 Yotoqxona nomi</span>
          <span>💰 Narxi</span>
          <span></span> {/* Bo'sh ustun */}
          <span>⚙️ Amallar</span>
        </li>

        {/* Hostel Rows */}
        {hostels.length > 0 ? (
          hostels.map((hostel) => (
            <li
              key={hostel._id}
              className="grid grid-cols-4 items-center px-4 py-3 border-b hover:bg-indigo-50"
            >
              <span>{hostel.hostelName}</span>
              <span>{Number(hostel.hostelPrice).toLocaleString("ru-RU")} so'm</span>
              <span></span> {/* Bo'sh ustun */}
              <span className="flex gap-4 justify-start">
                <button
                  onClick={() => editHostel(hostel)}
                  className="text-blue-600 bg-[#F1F4FF] hover:text-blue-800"
                  title="Tahrirlash"
                >
                  <FaEdit size={18} />
                </button>
                <button
                  onClick={() => deleteHostel(hostel._id)}
                  className="text-red-600 bg-[#F1F4FF] hover:text-red-800"
                  title="O‘chirish"
                >
                  <FaTrash size={18} />
                </button>
              </span>
            </li>
          ))
        ) : (
          <li className="text-center text-gray-600 p-6">Yotoqxonalar mavjud emas</li>
        )}
      </ul>
    </div>
  );
};

export default Hostel;

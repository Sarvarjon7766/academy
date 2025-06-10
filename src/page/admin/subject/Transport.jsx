import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

const API_URL = "http://localhost:4000/api/transport";

const Transport = () => {
  const [transportName, setTransportName] = useState("");
  const [transportPrice, setTransportPrice] = useState("");
  const [transports, setTransports] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchTransports();
  }, []);

  const fetchTransports = async () => {
    try {
      const response = await axios.get(`${API_URL}/getAll`);
      setTransports(response.data.transports);
    } catch (error) {
      console.error("Ma'lumotlarni olishda xatolik:", error);
    }
  };

  const addTransport = async () => {
    if (!transportName || !transportPrice) {
      alert("Iltimos, transport nomi va narxini kiriting");
      return;
    }

    const transportData = { transportName, transportPrice: Number(transportPrice) };

    try {
      if (editId) {
        await axios.put(`${API_URL}/update/${editId}`, transportData);
        setTransports((prev) =>
          prev.map((item) =>
            item._id === editId ? { ...item, ...transportData } : item
          )
        );
        setEditId(null);
      } else {
        const response = await axios.post(`${API_URL}/create`, transportData);
        setTransports([...transports, response.data.transport]);
      }

      setTransportName("");
      setTransportPrice("");
    } catch (error) {
      console.error("Saqlashda xatolik:", error);
    }
  };

  const deleteTransport = async (id) => {
    try {
      await axios.delete(`${API_URL}/delete/${id}`);
      setTransports((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("O‘chirishda xatolik:", error);
    }
  };

  const editTransport = (item) => {
    setTransportName(item.transportName);
    setTransportPrice(item.transportPrice);
    setEditId(item._id);
  };

  return (
    <div className="mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-indigo-800 mb-6">🚌 Transportlar</h1>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <input
          type="text"
          placeholder="Transport nomi"
          value={transportName}
          onChange={(e) => setTransportName(e.target.value)}
          className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <input
          type="number"
          placeholder="Narxi"
          value={transportPrice}
          onChange={(e) => setTransportPrice(e.target.value)}
          className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          onClick={addTransport}
          className="bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700 transition"
        >
          {editId ? "✏️ O‘zgartirish" : "➕ Qo‘shish"}
        </button>
      </div>

      {/* Table-like UL Layout */}
      <ul className="w-full border border-gray-300 rounded-lg overflow-hidden">
        {/* Header */}
        <li className="grid grid-cols-3 bg-indigo-200 text-indigo-800 font-semibold p-3 border-b border-gray-300">
          <span>🚌 Transport nomi</span>
          <span>💰 Narxi</span>
          <span>⚙️ Amallar</span>
        </li>

        {/* Transport Rows */}
        {transports.map((item) => (
          <li
            key={item._id}
            className="grid grid-cols-3 items-center px-4 py-3 border-b hover:bg-indigo-50"
          >
            <span>{item.transportName}</span>
            <span>{Number(item.transportPrice).toLocaleString("ru-RU")} so'm</span>
            <span className="flex gap-4 justify-start">
              <button
                onClick={() => editTransport(item)}
                className="text-blue-600 bg-[#F1F4FF] hover:text-blue-800 rounded px-2"
                title="Tahrirlash"
              >
                <FaEdit size={18} />
              </button>
              <button
                onClick={() => deleteTransport(item._id)}
                className="text-red-600 bg-[#F1F4FF] hover:text-red-800 rounded px-2"
                title="O‘chirish"
              >
                <FaTrash size={18} />
              </button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Transport;

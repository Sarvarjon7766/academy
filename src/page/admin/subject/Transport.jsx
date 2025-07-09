import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaBusAlt, FaMoneyBillWave } from "react-icons/fa";

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
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/transport/getAll`);
      setTransports(res.data.transports);
    } catch (err) {
      console.error("Ma'lumotlarni olishda xatolik:", err);
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
        await axios.put(`${import.meta.env.VITE_API_URL}/api/transport/update/${editId}`, transportData);
        setTransports(prev => prev.map(item => item._id === editId ? { ...item, ...transportData } : item));
        setEditId(null);
      } else {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/transport/create`, transportData);
        setTransports([...transports, res.data.transport]);
      }

      setTransportName("");
      setTransportPrice("");
    } catch (err) {
      console.error("Saqlashda xatolik:", err);
    }
  };

  const deleteTransport = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/transport/delete/${id}`);
      setTransports(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      console.error("O‘chirishda xatolik:", err);
    }
  };

  const editTransport = (item) => {
    setTransportName(item.transportName);
    setTransportPrice(item.transportPrice);
    setEditId(item._id);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="relative z-0">
            <input
              type="text"
              value={transportName}
              onChange={(e) => setTransportName(e.target.value)}
              className="block py-3 px-4 w-full text-sm bg-transparent rounded-lg border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
              placeholder=" "
            />
            <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3">
              Transport nomi
            </label>
            <FaBusAlt className="absolute right-3 top-3.5 text-gray-400" />
          </div>

          <div className="relative z-0">
            <input
              type="number"
              value={transportPrice}
              onChange={(e) => setTransportPrice(e.target.value)}
              className="block py-3 px-4 w-full text-sm bg-transparent rounded-lg border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
              placeholder=" "
            />
            <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3">
              Narxi
            </label>
            <FaMoneyBillWave className="absolute right-3 top-3.5 text-gray-400" />
          </div>

          <button
            onClick={addTransport}
            className={`flex items-center justify-center gap-2 h-full rounded-lg px-4 py-3 text-white font-medium transition-all shadow-lg ${
              editId
                ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            }`}
          >
            {editId ? <FaEdit /> : "➕"}
            {editId ? "O‘zgartirish" : "Yangi qo‘shish"}
          </button>
        </div>

        {/* Transport Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-indigo-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                  Transport nomi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                  Narxi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                  Amallar
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transports.length > 0 ? (
                transports.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-indigo-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                          <FaBusAlt className="text-indigo-600" />
                        </div>
                        <span className="font-medium">{item.transportName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-green-600 font-medium">
                      {Number(item.transportPrice).toLocaleString("ru-RU")} so'm
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-3">
                        <button
                          onClick={() => editTransport(item)}
                          className="p-2 bg-blue-100 rounded-lg text-blue-600 hover:bg-blue-200 transition-colors"
                          title="Tahrirlash"
                        >
                          <FaEdit size={16} />
                        </button>
                        <button
                          onClick={() => deleteTransport(item._id)}
                          className="p-2 bg-red-100 rounded-lg text-red-600 hover:bg-red-200 transition-colors"
                          title="O‘chirish"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="bg-indigo-100 p-4 rounded-full mb-3">
                        <FaBusAlt className="text-indigo-500 text-xl" />
                      </div>
                      <p className="text-lg">Hozircha transportlar mavjud emas</p>
                      <p className="mt-1">Yuqoridagi formani to‘ldirib yangi transport qo‘shing</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transport;

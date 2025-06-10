import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaUsers } from "react-icons/fa";

const TeacherMessage = () => {
  const navigate = useNavigate();
  const [isMessage, setMessage] = useState([]);
  const token = localStorage.getItem("token");

  const fetchData = useCallback(async () => {
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(`http://localhost:4000/api/message/getTeacher`, { headers });
      if (res.status === 200) {
        setMessage(res.data.messages);
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Xatolik yuz berdi:", error);
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleGroup = () => {
    fetchData();
  };

  const handlePersonal = async () => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(`http://localhost:4000/api/message/personal`, { headers });
      if (res.status === 200) {
        setMessage(res.data.messages);
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Xatolik yuz berdi:", error);
      navigate("/login");
    }
  };

  const whoIsText = (who_is) => {
    switch (who_is) {
      case 1:
        return "O'qituvchilar";
      case 2:
        return "O'quvchilar";
      case 3:
        return "Ota-onalar";
      case 4:
        return "Hamma uchun";
      default:
        return "Noma'lum";
    }
  };

  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 via-blue-100 to-indigo-200 min-h-screen">
      <h1 className="text-4xl text-center font-semibold text-indigo-700 mb-8">Xabarlar</h1>

      <div className="flex gap-5 justify-center mb-6">
        <button
          className="flex items-center justify-center p-3 bg-blue-600 text-white rounded-full shadow-xl w-14 h-14 hover:bg-blue-700 transition transform hover:scale-105"
          onClick={() => handleGroup()}
          aria-label="Umumiy eslatmalar"
        >
          <FaUsers size={20} />
        </button>
        <button
          className="flex items-center justify-center p-3 bg-blue-600 text-white rounded-full shadow-xl w-14 h-14 hover:bg-blue-700 transition transform hover:scale-105"
          onClick={() => handlePersonal()}
          aria-label="Sizning eslatmalaringiz"
        >
          <FaUser size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isMessage.length > 0 ? (
          isMessage.map((msg) => (
            <div key={msg._id} className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-transform transform hover:scale-105">
              <h3 className="text-2xl font-bold text-indigo-800 mb-2">{msg.messageName}</h3>
              <p className="text-sm text-gray-600 mb-4">{msg.messageTitle}</p>
              <p className="text-sm text-gray-500">
                <strong>Kim uchun:</strong> {whoIsText(msg.who_is)}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Sana:</strong> {new Date(msg.sent_date).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">Mos keladigan xabarlar topilmadi.</p>
        )}
      </div>
    </div>
  );
};

export default TeacherMessage;

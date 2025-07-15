import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaUsers, FaEnvelope, FaRegClock, FaUserFriends, FaUserAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const TeacherMessage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState("group");
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchData = useCallback(async () => {
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      setIsLoading(true);
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/message/getTeacher`, { headers });
      if (res.status === 200) {
        setMessages(res.data.messages);
        setActiveTab("group");
      }
    } catch (error) {
      console.error("Xatolik yuz berdi:", error);
    } finally {
      setIsLoading(false);
    }
  }, [token, navigate]);

  const fetchPersonalMessages = useCallback(async () => {
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      setIsLoading(true);
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/message/personal`, { headers });
      if (res.status === 200) {
        setMessages(res.data.messages);
        setActiveTab("personal");
      }
    } catch (error) {
      console.error("Xatolik yuz berdi:", error);
    } finally {
      setIsLoading(false);
    }
  }, [token, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  const whoIsIcon = (who_is) => {
    switch (who_is) {
      case 1:
        return <FaUserAlt className="text-blue-500" />;
      case 2:
        return <FaUser className="text-green-500" />;
      case 3:
        return <FaUserFriends className="text-purple-500" />;
      case 4:
        return <FaUsers className="text-yellow-500" />;
      default:
        return <FaUsers className="text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uz-UZ', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="mx-auto">

        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full shadow-lg p-1 flex">
            <button
              className={`flex items-center justify-center px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === "group" 
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md" 
                  : "text-gray-600 hover:text-indigo-700 bg-white"
              }`}
              onClick={fetchData}
            >
              <FaUsers className="mr-2" />
              Guruh Xabarlari
            </button>
            <button
              className={`flex items-center justify-center px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === "personal" 
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md" 
                  : "text-gray-600 hover:text-purple-700 bg-white"
              }`}
              onClick={fetchPersonalMessages}
            >
              <FaUser className="mr-2" />
              Shaxsiy Xabarlar
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : messages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {messages.map((msg) => (
              <motion.div
                key={msg._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
              >
                <div className="p-5 flex-1">
                  <div className="flex items-start mb-4">
                    <div className="bg-indigo-100 p-3 rounded-xl mr-4">
                      <FaEnvelope className="text-indigo-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">{msg.messageName}</h3>
                      <p className="text-gray-600">{msg.messageTitle}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <FaRegClock className="mr-2" />
                    <span>{formatDate(msg.sent_date)}</span>
                  </div>
                  
                  <div className="flex items-center text-sm mb-4">
                    {whoIsIcon(msg.who_is)}
                    <span className="ml-2 text-gray-700 font-medium">{whoIsText(msg.who_is)}</span>
                  </div>
                  
                  {msg.messageBody && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-gray-700">{msg.messageBody.substring(0, 100)}...</p>
                    </div>
                  )}
                </div>
                
                <div className="px-5 py-3 bg-gray-50 flex justify-between items-center">
                  <span className="text-xs text-gray-500">ID: {msg._id.substring(0, 8)}</span>
                  <button className="text-xs bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-1 rounded-full transition-colors">
                    Batafsil
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-lg"
          >
            <div className="bg-indigo-100 p-5 rounded-full mb-6">
              <FaEnvelope className="text-indigo-600 text-4xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {activeTab === "group" ? "Guruh xabarlari topilmadi" : "Shaxsiy xabarlar topilmadi"}
            </h3>
            <p className="text-gray-600 max-w-md text-center mb-6">
              {activeTab === "group" 
                ? "Hozircha sizga yuborilgan guruh xabarlari mavjud emas. Keyinroq kuzatib boring." 
                : "Sizga yuborilgan shaxsiy xabarlar mavjud emas. Yangi xabarlar kelganda bu yerda paydo bo'ladi."}
            </p>
            <button 
              onClick={activeTab === "group" ? fetchData : fetchPersonalMessages}
              className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-medium py-2 px-6 rounded-full transition-all duration-300 shadow-md"
            >
              Yangilash
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TeacherMessage;
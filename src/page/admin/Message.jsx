import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaPaperPlane, FaTrash, FaEdit, FaEnvelope, FaUsers, FaUserGraduate, FaUserFriends, FaGlobe, FaUser, FaBell } from "react-icons/fa";

const MessageForm = () => {
  const [formData, setFormData] = useState({
    messageName: "",
    messageTitle: "",
    who_is: 0,
    teacher: ""
  });
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [teacher, setTeacher] = useState([]);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isWho, setWhoIs] = useState(false);
  const [editId, setEditId] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchMessages();
    fetchTeacher();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    if (activeTab === "all") {
      setFilteredMessages(messages);
    } else {
      setFilteredMessages(messages.filter(msg => String(msg.who_is) === activeTab));
    }
  }, [activeTab, messages]);

  const fetchTeacher = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/teacher/getAll`);
      setTeacher(res.data.teachers);
    } catch (error) {}
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/message/getAll`);
      setMessages(response.data.messages);
      setFilteredMessages(response.data.messages);
    } catch (error) {
      console.error("Xatolik:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (editId) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/message/update/${editId}`, formData);
        setMessage("Xabar muvaffaqiyatli yangilandi!");
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/message/create`, formData);
        setMessage("Xabar muvaffaqiyatli yuborildi!");
      }
      setFormData({ messageName: "", messageTitle: "", who_is: 0, teacher: "" });
      setEditId(null);
      fetchMessages();
      setWhoIs(false);
    } catch (error) {
      console.error("Xatolik:", error);
      setMessage("Xabar yuborishda xatolik yuz berdi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditMessage = (msg) => {
    setFormData({ 
      messageName: msg.messageName, 
      messageTitle: msg.messageTitle, 
      who_is: msg.who_is, 
      teacher: msg.teacher || "" 
    });
    setEditId(msg._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteMessage = async (messageId) => {
    if (window.confirm("Haqiqatan ham bu xabarni o'chirmoqchimisiz?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/message/delete/${messageId}`);
        fetchMessages();
      } catch (error) {
        console.error("Xatolik:", error);
      }
    }
  };

  const handleSelect = () => {
    setWhoIs(prev => !prev);
  };

  const whoIsText = (who_is) => {
    switch (who_is) {
      case 1: return "O'qituvchilar";
      case 2: return "O'quvchilar";
      case 3: return "Ota-onalar";
      case 4: return "Hamma uchun";
      default: return "O'qituvchiga";
    }
  };

  const getIconForRecipient = (who_is) => {
    switch (who_is) {
      case 1: return <FaUserGraduate className="text-blue-500" />;
      case 2: return <FaUser className="text-green-500" />;
      case 3: return <FaUserFriends className="text-purple-500" />;
      case 4: return <FaGlobe className="text-amber-500" />;
      default: return <FaUser className="text-indigo-500" />;
    }
  };

  return (
    <div className="mx-auto px-4 py-8">
      {/* Notification */}
      {message && (
        <div className={`mb-6 p-4 rounded-xl ${
          message.includes("muvaffaqiyatli") 
            ? "bg-green-100 border border-green-300 text-green-700" 
            : "bg-red-100 border border-red-300 text-red-700"
        }`}>
          <div className="flex items-center">
            <FaBell className="mr-2" />
            <span>{message}</span>
          </div>
        </div>
      )}

      {/* Form Section */}
      <div className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl shadow-xl border border-indigo-100 overflow-hidden mb-14">
        <div className="p-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
        
        <div className="p-6 md:p-8">
          <h3 className="text-xl font-bold text-indigo-800 mb-6 flex items-center gap-2">
            <FaPaperPlane className="text-blue-500" />
            {editId ? "Xabarni Tahrirlash" : "Yangi Xabar Yuborish"}
          </h3>
          
          <form onSubmit={handleSendMessage}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="relative z-0">
                <input
                  type="text"
                  name="messageName"
                  value={formData.messageName}
                  onChange={handleInputChange}
                  className="block py-3 px-4 w-full text-sm bg-transparent rounded-lg border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
                  placeholder=" "
                  required
                />
                <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-indigo-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3">
                  Xabar nomi
                </label>
              </div>
              
              <div className="relative z-0">
                {!isWho ? (
                  <>
                    <select
                      name="who_is"
                      value={formData.who_is}
                      onChange={handleInputChange}
                      className="block py-3 px-4 w-full text-sm bg-transparent rounded-lg border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
                      required
                    >
                      <option value=""> </option>
                      <option value="1">O'qituvchilar</option>
                      <option value="2">O'quvchilar</option>
                      <option value="3">Ota-onalar</option>
                      <option value="4">Hamma uchun</option>
                    </select>
                    <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-indigo-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3">
                      Kimlarga yuborish
                    </label>
                  </>
                ) : (
                  <>
                    <select
                      name="teacher"
                      value={formData.teacher}
                      onChange={handleInputChange}
                      className="block py-3 px-4 w-full text-sm bg-transparent rounded-lg border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
                      required
                    >
                      <option value=""> </option>
                      {teacher && teacher.map((t, i) => (
                        <option key={i} value={t._id}>{t.fullName}</option>
                      ))}
                    </select>
                    <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-indigo-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3">
                      O'qituvchini tanlang
                    </label>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center mb-6">
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  onChange={handleSelect} 
                  className="sr-only peer" 
                  checked={isWho}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ml-3 text-gray-700 font-medium">O'qituvchiga maxsus yuborish</span>
              </label>
            </div>

            <div className="mb-6">
              <div className="relative z-0">
                <textarea
                  name="messageTitle"
                  value={formData.messageTitle}
                  onChange={handleInputChange}
                  rows="4"
                  className="block py-3 px-4 w-full text-sm bg-transparent rounded-lg border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
                  placeholder=" "
                  required
                ></textarea>
                <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-indigo-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3">
                  Xabar matni
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-6 rounded-xl font-medium text-white transition-all shadow-lg ${
                editId 
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                  : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              } flex items-center justify-center gap-2`}
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <FaPaperPlane />
              )}
              {isLoading ? "Yuborilmoqda..." : editId ? "Yangilash" : "Xabarni Yuborish"}
            </button>
          </form>
        </div>
      </div>

      {/* Messages Section */}
      <div className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl shadow-xl border border-indigo-100 overflow-hidden">
        <div className="p-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
        
        <div className="p-6 md:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h3 className="text-xl font-bold text-indigo-800 flex items-center gap-2">
              <FaEnvelope className="text-blue-500" />
              Xabarlar Ro'yxati
            </h3>
            
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeTab === "all" 
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Hammasi
              </button>
              <button 
                onClick={() => setActiveTab("1")}
                className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1 transition-colors ${
                  activeTab === "1" 
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <FaUserGraduate /> O'qituvchilar
              </button>
              <button 
                onClick={() => setActiveTab("2")}
                className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1 transition-colors ${
                  activeTab === "2" 
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <FaUser /> O'quvchilar
              </button>
              <button 
                onClick={() => setActiveTab("3")}
                className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1 transition-colors ${
                  activeTab === "3" 
                    ? "bg-gradient-to-r from-purple-500 to-violet-600 text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <FaUserFriends /> Ota-onalar
              </button>
              <button 
                onClick={() => setActiveTab("4")}
                className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1 transition-colors ${
                  activeTab === "4" 
                    ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <FaGlobe /> Hammaga
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMessages.length > 0 ? (
              filteredMessages.map((msg) => (
                <div 
                  key={msg._id} 
                  className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg"
                >
                  <div className={`p-4 ${
                    msg.who_is === 1 ? "bg-blue-50" : 
                    msg.who_is === 2 ? "bg-green-50" : 
                    msg.who_is === 3 ? "bg-purple-50" : 
                    msg.who_is === 4 ? "bg-amber-50" : "bg-indigo-50"
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${
                          msg.who_is === 1 ? "bg-blue-100" : 
                          msg.who_is === 2 ? "bg-green-100" : 
                          msg.who_is === 3 ? "bg-purple-100" : 
                          msg.who_is === 4 ? "bg-amber-100" : "bg-indigo-100"
                        }`}>
                          {getIconForRecipient(msg.who_is)}
                        </div>
                        <span className="font-semibold text-gray-800">{msg.messageName}</span>
                      </div>
                      <span className="text-xs bg-white px-2 py-1 rounded-full text-gray-500">
                        {new Date(msg.sent_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <p className="text-gray-600 mb-4 line-clamp-3">{msg.messageTitle}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        msg.who_is === 1 ? "bg-blue-100 text-blue-800" : 
                        msg.who_is === 2 ? "bg-green-100 text-green-800" : 
                        msg.who_is === 3 ? "bg-purple-100 text-purple-800" : 
                        msg.who_is === 4 ? "bg-amber-100 text-amber-800" : "bg-indigo-100 text-indigo-800"
                      }`}>
                        {whoIsText(msg.who_is)}
                      </span>
                      
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEditMessage(msg)}
                          className="p-2 bg-blue-100 rounded-lg text-blue-600 hover:bg-blue-200 transition-colors"
                          title="Tahrirlash"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button 
                          onClick={() => handleDeleteMessage(msg._id)}
                          className="p-2 bg-red-100 rounded-lg text-red-600 hover:bg-red-200 transition-colors"
                          title="O'chirish"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="inline-flex items-center justify-center bg-indigo-100 p-4 rounded-full mb-4">
                  <FaEnvelope className="text-2xl text-indigo-600" />
                </div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">Xabarlar mavjud emas</h3>
                <p className="text-gray-600">
                  Yangi xabar yuborish uchun yuqoridagi formani to'ldiring
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageForm;
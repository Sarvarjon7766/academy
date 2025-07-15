import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaLock, FaCheckCircle, FaBirthdayCake, FaPhone, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const RegisterProfile = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [inputValue, setInputValue] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchData = useCallback(async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/register/getOne`, { headers });
      
      if (res.status === 200) {
        console.log(res.data)
        setUser(res.data.data);
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

  const handleSelect = (e) => {
    setInputValue(e.target.checked);
    setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Parollar mos kelmadi!");
      return;
    }

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/teacher/changePassword/${user._id}`,
        { password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.status === 200) {
        setSuccessMessage(res.data.message);
        setPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          setInputValue(false);
          setSuccessMessage("");
        }, 3000);
      }
    } catch (error) {
      console.error("Xatolik:", error);
      alert("Parolni o'zgartirishda xatolik yuz berdi!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-800 mb-3">
            Shaxsiy Kabinet
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-indigo-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                <div className="relative">
                  <FaUserCircle className="text-8xl text-indigo-200" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FaUser className="text-4xl text-indigo-600" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">{user.fullName || "Noma'lum"}</h2>
                  <p className="text-gray-500 flex items-center">
                    <MdEmail className="mr-2 text-indigo-500" />
                    {user.login || "Noma'lum"}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <FaPhone className="text-indigo-500 mr-3 w-5" />
                  <span className="text-gray-700">
                    <span className="font-semibold">Telefon:</span> {user.phone || "Noma'lum"}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <FaBirthdayCake className="text-indigo-500 mr-3 w-5" />
                  <span className="text-gray-700">
                    <span className="font-semibold">Tug'ilgan sana:</span> {user.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString() : "Noma'lum"}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <FaUser className="text-indigo-500 mr-3 w-5" />
                  <span className="text-gray-700">
                    <span className="font-semibold">Jins:</span> {user.gender || "Noma'lum"}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <FaMapMarkerAlt className="text-indigo-500 mr-3 w-5" />
                  <span className="text-gray-700">
                    <span className="font-semibold">Manzil:</span> {user.address || "Noma'lum"}
                  </span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      onChange={handleSelect} 
                      checked={inputValue}
                    />
                    <div className={`block w-10 h-6 rounded-full ${inputValue ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${inputValue ? 'transform translate-x-4' : ''}`}></div>
                  </div>
                  <div className="ml-3 text-gray-700 font-medium flex items-center">
                    <FaLock className="mr-2 text-indigo-500" />
                    Parolni o'zgartirish
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Password Change Form */}
          {inputValue && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 sm:p-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <FaLock className="text-indigo-500 mr-2" />
                  Parolni yangilash
                </h3>
                
                {successMessage && (
                  <div className="mb-6 p-3 bg-green-100 text-green-700 rounded-lg flex items-center">
                    <FaCheckCircle className="mr-2" />
                    {successMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Yangi parol</label>
                    <input
                      type="password"
                      placeholder="Yangi parolni kiriting"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Parolni tasdiqlang</label>
                    <input
                      type="password"
                      placeholder="Parolni qayta kiriting"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:from-indigo-700 hover:to-blue-700 transition duration-300 shadow-md"
                  >
                    Parolni yangilash
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterProfile;
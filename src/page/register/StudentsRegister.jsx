// src/pages/StudentsRegister.jsx
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import ProgressBar from '../../components/ProgressBar ';
import AddSubjectAdd from './form/AddSubjectAdd';
import OtherCosts from './form/OtherCosts';
import RoomAttachment from './form/RoomAttachment';
import Shunchaki from './form/Shunchaki';
import SubjectAdd from './form/SubjectAdd';
import { FaUserGraduate, FaSchool, FaPhone, FaLock, FaMapMarkerAlt, FaBirthdayCake, FaVenusMars, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StudentsRegister = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isHotel, setIsHotel] = useState(true);
  const { student, section } = location.state || {};

  const defaultForm = {
    fullName: '',
    date_of_birth: '',
    gender: '',
    address: '',
    old_school: '',
    old_class: '',
    phone: '',
    login: '',
    password: '',
    role: 2
  };

  const [formData, setFormData] = useState(defaultForm);
  const [studentId, setStudentId] = useState(null);
  const [isAvailable, setIsAvailable] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Show toast notification
  const showToast = (message, type = 'success') => {
    if (type === 'success') {
      toast.success(message, {
        icon: <FaCheck className="text-green-500" />,
        className: 'bg-green-50 text-green-800 border border-green-200'
      });
    } else {
      toast.error(message, {
        icon: <FaExclamationTriangle className="text-red-500" />,
        className: 'bg-red-50 text-red-800 border border-red-200'
      });
    }
  };

  useEffect(() => {
    if (student) {
      setFormData({
        fullName: student.fullName || '',
        date_of_birth: student.date_of_birth || '',
        gender: student.gender || '',
        address: student.address || '',
        old_school: student.old_school || '',
        old_class: student.old_class || '',
        phone: student.phone || '',
        login: student.login || '',
        password: student.password || '',
        role: student.role || 2
      });
      setStudentId(student._id || student.id || null);
    }

    if (section !== undefined && section !== null) {
      setIsAvailable(Number(section));
    }
  }, [student, section]);

  const handleChange = ({ target: { name, value } }) =>
    setFormData(prev => ({ ...prev, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Basic validation
    if (!formData.fullName || !formData.phone || !formData.login || !formData.password) {
      showToast("Iltimos, barcha kerakli maydonlarni to'ldiring!", 'error');
      setIsSubmitting(false);
      return;
    }
    
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/student/create-personal`, formData, {
        headers: { "Content-Type": "application/json" }
      });
      
      showToast(res.data.message);
      setStudentId(res.data.studentId);
      setIsAvailable(res.data.success ? 1 : 0);
    } catch (err) {
      showToast(err?.response?.data?.message || "Xatolik yuz berdi", 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlerExit = () => {
    showToast("Ro'yxatdan o'tish bekor qilindi");
    setStudentId(null);
    setIsAvailable(0);
    setIsHotel(true);
    setFormData(defaultForm);
    navigate('/register');
  };

  const inputs = [
    { label: "To'liq ism familiyasi", name: 'fullName', placeholder: "Ismingiz va familiyangiz", type: 'text', icon: <FaUserGraduate className="text-blue-500" />, required: true },
    { label: "Tug'ilgan kun", name: 'date_of_birth', type: 'date', icon: <FaBirthdayCake className="text-pink-500" /> },
    { label: "Jinsi", name: 'gender', type: 'select', options: ['erkak', 'ayol'], icon: <FaVenusMars className="text-purple-500" />, required: true },
    { label: "Manzili", name: 'address', placeholder: "To'liq manzil", type: 'text', icon: <FaMapMarkerAlt className="text-red-500" />, required: true },
    { label: "Maktabingiz", name: 'old_school', placeholder: "Maktab nomi", type: 'text', icon: <FaSchool className="text-green-500" />, required: true },
    { label: "Sinfingiz", name: 'old_class', placeholder: "Sinf nomi", type: 'text', icon: <FaSchool className="text-green-500" />, required: true },
    { label: "Telefon raqam", name: 'phone', placeholder: "+998901234567", type: 'text', icon: <FaPhone className="text-teal-500" />, required: true },
    { label: "Login", name: 'login', placeholder: "Login", type: 'text', icon: <FaLock className="text-gray-500" />, required: true },
    { label: "Parol", name: 'password', placeholder: "Parol", type: 'password', icon: <FaLock className="text-gray-500" />, required: true },
  ];

  return (
    <div className="w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-100 min-h-screen py-8 px-4">
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="rounded-lg shadow-md"
        bodyClassName="font-medium"
      />
      
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Talabani Ro'yxatga Olish
          </h1>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className='p-6'>
            <ProgressBar isAvailable={isAvailable} />
          </div>
          
          <div className="p-6 md:p-8">
            {isAvailable === 0 && (
              <>
                <div className="flex items-center mb-6">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <FaUserGraduate className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Shaxsiy ma'lumotlar</h2>

                  </div>
                </div>
                
                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {inputs.map(({ label, name, placeholder, type, options, icon, required }) => (
                    <div key={name} className="flex flex-col">
                      <label htmlFor={name} className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                        {icon}
                        <span className="ml-2">{label}</span>
                        {required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      {type === 'select' ? (
                        <div className="relative">
                          <select
                            id={name}
                            name={name}
                            value={formData[name]}
                            onChange={handleChange}
                            required={required}
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
                          >
                            <option value="">Tanlang</option>
                            {options.map(opt => (
                              <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                          </div>
                        </div>
                      ) : (
                        <input
                          type={type}
                          id={name}
                          name={name}
                          placeholder={placeholder}
                          value={formData[name]}
                          onChange={handleChange}
                          required={required}
                          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
                        />
                      )}
                    </div>
                  ))}
                  
                  <div className="col-span-full flex flex-col sm:flex-row justify-between items-center mt-6 pt-6 border-t border-gray-200">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition shadow-md w-full sm:w-auto disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Jarayon...
                        </span>
                      ) : (
                        "Ro'yxatdan o'tkazish"
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}

            {isAvailable === 1 && (
              <SubjectAdd 
                studentId={studentId} 
                onclick={() => {
                  setIsAvailable(2);
                  showToast("Asosiy fanlar muvaffaqiyatli qo'shildi!");
                }} 
              />
            )}
            
            {isAvailable === 2 && (
              <AddSubjectAdd 
                studentId={studentId} 
                onclick={() => {
                  setIsAvailable(3);
                  showToast("Qo'shimcha fanlar muvaffaqiyatli qo'shildi!");
                }} 
              />
            )}
            
            {isAvailable === 3 && (
              <OtherCosts
                studentId={studentId}
                onclick={() => {
                  setIsAvailable(4);
                  showToast("Qo'shimcha xarajatlar saqlandi!");
                }}
                onHotelChange={() => setIsHotel(false)}
                handlerExit={handlerExit}
              />
            )}
            
            {isAvailable === 4 && (
              <>
                {isHotel ? (
                  <RoomAttachment 
                    studentId={studentId} 
                    onHotelChange={() => {
                      setIsHotel(false);
                      showToast("Mehmonxona tanlandi!");
                    }} 
                  />
                ) : (
                  <Shunchaki 
                    studentId={studentId} 
                    onExit={() => {
                      showToast("Ro'yxatdan o'tish muvaffaqiyatli yakunlandi!");
                      handlerExit();
                    }} 
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentsRegister;
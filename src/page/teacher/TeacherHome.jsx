import axios from 'axios'
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { VscAdd } from "react-icons/vsc"
import { MdOutlineMenuBook } from "react-icons/md"
import { FaChalkboardTeacher } from "react-icons/fa"
import { BsPeopleFill, BsFillCheckCircleFill } from "react-icons/bs"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TeacherHome = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const [subjects, setSubjects] = useState([])
  const [headers, setHeaders] = useState({})
  const [teacherId, setTeacherId] = useState()
  const [selectSubject, setSelectSubject] = useState()
  const [groups, setGroups] = useState([])
  const [isCreate, setIsCreate] = useState(false)
  const [formData, setFormData] = useState({ groupName: "" })

  useEffect(() => {
    const fetchSubjects = async () => {
      if (!token) {
        navigate('/login')
        return
      }
      try {
        const headers = { Authorization: `Bearer ${token}` }
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/teacher/getSubjects`, { headers })
        setTeacherId(res.data.teacherid)
      } catch (error) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          navigate('/login')
        } else {
          console.error("API Error:", error)
        }
      }
    }
    fetchSubjects()
  }, [token, navigate])

  const fetchData = async () => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/teacher/getSubjects`, { headers })
      setSubjects(res.data.subjects || [])
      setHeaders(headers)
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }
  
  useEffect(() => { 
    fetchData() 
  }, [])

  const handleGroup = async (subject) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/group/groups/${subject._id}`, { headers })
      if (res.data.groups.length !== 0) {
        setGroups(res.data.groups)
      } else {
        toast.info(`${subject.subjectName} fanida hali guruhlar mavjud emas`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
      setSelectSubject(subject)
      setIsCreate(false)
    } catch (error) {
      console.error(error)
    }
  }

  const handleCreateGroup = async (subject, formDatas) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/group/create-group/${subject._id}`,
        formDatas,
        { headers }
      )
      if (res.data.success === false) {
        toast.error(res.data.message, {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.success("Guruh muvaffaqiyatli yaratildi!", {
          position: "top-right",
          autoClose: 2000,
          icon: <BsFillCheckCircleFill className="text-green-500 text-xl" />
        });
        setSelectSubject([])
        setIsCreate(false)
        fetchData()
        handleGroup(subject)
        setFormData({ groupName: "" })
      }
    } catch (error) {
      console.log(error)
      toast.error("Guruh yaratishda xatolik yuz berdi", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  }

  const handleAttandance = async (groupId) => {
    if (!groupId) {
      toast.error("Iltimos, guruhni tanlang!", {
        position: "top-right",
        autoClose: 3000,
      });
      return
    }
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      const [res, response] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/group/groups-v3/${groupId}`),
        axios.get(`${import.meta.env.VITE_API_URL}/api/attandance/checking/${groupId}`, { headers })
      ])

      if (res.data.success && response.data.success) {
        toast.success("Davomatni belgilash sahifasiga o'tilmoqda...", {
          position: "top-right",
          autoClose: 1500,
        });
        setTimeout(() => {
          navigate('/teacher/attendance', {
            state: {
              teacherId: teacherId,
              groupId,
              students: response.data.students
            }
          })
        }, 1700);
      } else {
        toast.error(res.data.success ? response.data.message : res.data.message, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error('Xatolik yuz berdi:', error)
      toast.error("Tarmoq xatosi yoki serverda muammo bor", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  }

  return (
    <div className="p-4 bg-gradient-to-br from-indigo-50 to-blue-100 min-h-screen">
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="mt-14"
      />
      
      <div className="mx-auto p-6">


        {/* Fanlar ro'yxati */}
        <div className="mb-10">
          
          {subjects.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-xl shadow-md">
              <p className="text-gray-500 text-lg">Sizda hali fanlar mavjud emas</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {subjects.map((subject) => (
                <button 
                  key={subject._id} 
                  onClick={() => handleGroup(subject)}
                  className={`group p-5 bg-gradient-to-br from-white to-indigo-50 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 ${
                    selectSubject?._id === subject._id 
                      ? "border-indigo-500 ring-2 ring-indigo-200" 
                      : "border-transparent"
                  }`}
                >
                  <div className="flex flex-col items-center text-indigo-700">
                    <div className="bg-indigo-100 p-3 rounded-full mb-3">
                      <MdOutlineMenuBook size={32} className="text-indigo-600" />
                    </div>
                    <h2 className="mt-1 font-bold text-lg text-center text-indigo-900 group-hover:text-indigo-700 transition-colors">
                      {subject.subjectName}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">{subject.subjectCode}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tanlangan fan uchun guruhlar */}
        {selectSubject && (
          <div className="mt-10 p-6 bg-white rounded-2xl shadow-lg border border-indigo-100 animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-indigo-800 flex items-center gap-2">
                <BsPeopleFill className="text-indigo-600" />
                {selectSubject.subjectName} - Guruhlar
              </h3>
              
              <button 
                onClick={() => setIsCreate(prev => !prev)} 
                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-xl hover:shadow-md transition-all duration-300"
              >
                <VscAdd /> 
                {isCreate ? "Bekor qilish" : "Guruh qo'shish"}
              </button>
            </div>

            {isCreate && (
              <form 
                onSubmit={(e) => { 
                  e.preventDefault(); 
                  handleCreateGroup(selectSubject, formData) 
                }} 
                className="space-y-4 mb-8 p-5 bg-indigo-50 rounded-xl border border-indigo-200 animate-fadeIn"
              >
                <div className="flex gap-3 items-center">
                  <input
                    type="text"
                    name="groupName"
                    placeholder="Guruh nomi"
                    value={formData.groupName}
                    onChange={(e) => setFormData({ groupName: e.target.value })}
                    className="flex-1 p-3 border border-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                  <button 
                    type="submit" 
                    className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:shadow-md transition-all"
                  >
                    Yaratish
                  </button>
                </div>
              </form>
            )}

            {groups.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {groups.map((group) => (
                  <button 
                    key={group._id} 
                    onClick={() => handleAttandance(group._id)} 
                    className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 text-emerald-800 rounded-2xl shadow hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-emerald-200 relative group"
                  >
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <BsFillCheckCircleFill className="text-emerald-500" />
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="bg-emerald-100 p-3 rounded-full mb-3">
                        <BsPeopleFill size={24} className="text-emerald-600" />
                      </div>
                      <h4 className="font-bold text-lg">{group.groupName}</h4>
                      <p className="text-sm text-emerald-600 mt-1">Davomat belgilash</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-indigo-100">
                <BsPeopleFill size={48} className="text-indigo-300 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-indigo-700">Guruhlar mavjud emas</h4>
                <p className="text-indigo-500 mt-2">"Guruh qo'shish" tugmasi orqali yangi guruh yarating</p>
              </div>
            )}
          </div>
        )}

        {!selectSubject && (
          <div className="text-center mt-16 py-10 bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-md border border-indigo-100">
            <MdOutlineMenuBook size={64} className="text-indigo-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-indigo-700">Fan tanlang</h3>
            <p className="text-indigo-500 mt-2">Yuqoridagi fanlardan birini tanlab, guruhlarni boshqaring</p>
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

export default TeacherHome
import axios from 'axios'
import React, { useEffect, useState } from "react"
import { FaUserCheck, FaCalendarCheck, FaRegClock } from "react-icons/fa"
import { FiCheckCircle } from "react-icons/fi"
import { motion } from 'framer-motion'

const AttendanceSunday = () => {
  const token = localStorage.getItem('token')
  const [isButton, setIsButton] = useState(false)
  const [students, setStudents] = useState([])
  const [show, setShow] = useState(false)
  const [message, setMessage] = useState(null)
  const [attendance, setAttendance] = useState({})
  const [isDate] = useState(new Date().setHours(0, 0, 0, 0))
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const today = new Date()
    if (today.getDay() !== 0) {
      setShow(true)
      axios.get(`${import.meta.env.VITE_API_URL}/api/student/getSunday`)
        .then(res => {
          if (res.data.success) {
            setStudents(res.data.data)
          } else {
            console.error(res.data.message || 'Xatolik yuz berdi')
          }
        })
        .catch(err => console.error('Xatolik:', err))
        .finally(() => setLoading(false))
    } else {
      setShow(false)
      setMessage("Bugun kun yakshanba emas")
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (students.length > 0) {
      const initialAttendance = students.reduce((acc, student) => {
        acc[student._id] = { attended: false }
        return acc
      }, {})
      setAttendance(initialAttendance)
    }
  }, [students])

  const markAttendance = (id) => {
    setAttendance((prev) => ({
      ...prev,
      [id]: { attended: !prev[id]?.attended }
    }))
    setIsButton(true)
  }

  const setAttendanceHandler = async () => {
    try {
      setSubmitting(true)
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      const data = { attendance }
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/attandance/create-sunday`,
        data,
        { headers }
      )
      if (res.status === 200) {
        setSuccess(true)
        setTimeout(() => {
          setSuccess(false)
          setSubmitting(false)
        }, 2000)
      }
    } catch (error) {
      alert("Xatolik yuz berdi!")
      setSubmitting(false)
    }
  }

  const getDayName = (date) => {
    const days = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba']
    return days[new Date(date).getDay()]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="mx-auto">
        {/* Sarlavha */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-800">
            Davomat Yakshanba
          </h1>
          <div className="mt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
            <div className="flex items-center gap-2 bg-indigo-100 px-4 py-2 rounded-full">
              <FaCalendarCheck className="text-indigo-600" />
              <span className="font-medium">
                {new Date(isDate).toLocaleDateString()} - {getDayName(isDate)}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-indigo-100 px-4 py-2 rounded-full">
              <FaRegClock className="text-indigo-600" />
              <span className="font-medium">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Yakshanba emasligi haqidagi xabar */}
        {!show && !loading && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex justify-center items-center min-h-[300px] px-4"
          >
            <div className="w-full max-w-3xl bg-gradient-to-r from-yellow-50 via-red-100 to-pink-50 border-l-4 border-red-500 text-red-800 p-6 rounded-2xl shadow-xl flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-1">Eslatma!</h1>
                <p className="text-lg">{message}</p>
                <p className="mt-4 text-gray-700">Davomat faqat yakshanba kunlari olib boriladi. Iltimos, yakshanba kunlari tizimga kiring.</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Yuklanish holati */}
        {loading && (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
            <p className="text-lg text-indigo-800 font-medium">Talabalar ro'yxati yuklanmoqda...</p>
          </div>
        )}

        {/* Davomat jadvali */}
        {show && !loading && (
          <>
            {students.length !== 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
              >
                <div className="bg-gradient-to-r from-indigo-600 to-blue-700 p-6">
                  <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                    <FaUserCheck className="text-yellow-300" />
                    Davomat ro'yxati
                  </h2>
                  <p className="text-indigo-200 mt-1">
                    Talabalarni davomatini belgilash uchun ularning nomlari yonidagi tugmani bosing
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-indigo-50 text-indigo-800">
                        <th className="py-4 px-6 text-left rounded-tl-xl">№</th>
                        <th className="py-4 px-6 text-left">F.I.Sh</th>
                        <th className="py-4 px-6 text-center rounded-tr-xl">Holati</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student, index) => (
                        <tr 
                          key={student._id} 
                          className={`border-b border-indigo-100 hover:bg-indigo-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-indigo-50'}`}
                        >
                          <td className="py-4 px-6 font-medium text-indigo-900">{index + 1}</td>
                          <td className="py-4 px-6">
                            <div className="flex items-center">
                              <div className="bg-indigo-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                                <span className="text-indigo-700 font-bold">
                                  {student.fullName.charAt(0)}
                                </span>
                              </div>
                              <span className="font-medium">{student.fullName}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => markAttendance(student._id)}
                              className={`p-3 rounded-full transition-all duration-300 ${
                                attendance[student._id]?.attended 
                                  ? 'bg-green-100 ring-2 ring-green-400' 
                                  : 'bg-gray-200 hover:bg-indigo-200'
                              }`}
                            >
                              {attendance[student._id]?.attended ? (
                                <FaUserCheck size={24} className="text-green-600" />
                              ) : (
                                <FiCheckCircle size={24} className="text-gray-500" />
                              )}
                            </motion.button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {isButton && (
                  <div className="p-6 bg-indigo-50 flex justify-center">
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={setAttendanceHandler}
                      disabled={submitting}
                      className={`px-8 py-3 rounded-full font-bold text-white shadow-lg transition-all ${
                        submitting 
                          ? 'bg-indigo-400 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800'
                      }`}
                    >
                      {submitting ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saqlanmoqda...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <FaUserCheck />
                          Davomatni Saqlash
                        </span>
                      )}
                    </motion.button>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="text-center mt-10 bg-white rounded-2xl p-8 shadow-lg">
                <div className="bg-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUserCheck className="text-indigo-600 text-3xl" />
                </div>
                <h3 className="text-xl font-bold text-indigo-800 mb-2">Talabalar topilmadi</h3>
                <p className="text-gray-600">Ro'yxatga olingan talabalar mavjud emas yoki ruxsat yo'q</p>
              </div>
            )}
          </>
        )}

        {/* Muvaffaqiyatli saqlash animatsiyasi */}
        {success && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="fixed inset-0 flex items-center justify-center z-50"
          >
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 10, -10, 0],
                y: [0, -20, 0]
              }}
              transition={{ duration: 0.5 }}
              className="relative bg-white rounded-2xl p-8 shadow-2xl text-center"
            >
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-green-700 mb-2">Davomat Saqlandi!</h3>
              <p className="text-gray-600">Barcha talabalarning davomat ma'lumotlari muvaffaqiyatli saqlandi</p>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default AttendanceSunday
import axios from "axios"
import { useEffect, useState } from "react"
import { FaUserGraduate, FaBirthdayCake, FaVenusMars, FaMapMarkerAlt, FaSchool, FaPhone, FaLock, FaCheck, FaExclamationTriangle } from "react-icons/fa"
import { useLocation, useNavigate } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import ProgressBar3 from '../../components/ProgressBar3'
import AddSubjectAdd from './form/AddSubjectAdd'
import OtherCosts from './form/OtherCosts'
import SubjectAdd from './form/SubjectAdd'

const TeacherRegister = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { teacher, section } = location.state || {}

  const defaultForm = {
    fullName: '',
    date_of_birth: '',
    qualification: '',
    gender: '',
    address: '',
    phone: '',
    login: '',
    password: '',
    role: 1
  }

  const [formData, setFormData] = useState(defaultForm)
  const [teacherId, setTeacherId] = useState(null)
  const [isAvailable, setIsAvailable] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const showToast = (message, type = 'success') => {
    const options = {
      icon: type === 'success' ? <FaCheck className="text-green-500" /> : <FaExclamationTriangle className="text-red-500" />,
      className: type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
    }
    toast[type](message, options)
  }

  useEffect(() => {
    if (teacher) {
      setFormData({
        fullName: teacher.fullName || '',
        date_of_birth: teacher.date_of_birth || '',
        qualification: teacher.qualification || '',
        gender: teacher.gender || '',
        address: teacher.address || '',
        phone: teacher.phone || '',
        login: teacher.login || '',
        password: teacher.password || '',
        role: teacher.role || 1
      })
      setTeacherId(teacher._id || teacher.id || null)
    }
    if (section !== undefined && section !== null) {
      setIsAvailable(Number(section))
    }
  }, [teacher, section])

  const handleChange = ({ target: { name, value } }) =>
    setFormData(prev => ({ ...prev, [name]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!formData.fullName || !formData.phone || !formData.login || !formData.password) {
      showToast("Iltimos, barcha kerakli maydonlarni to'ldiring!", 'error')
      setIsSubmitting(false)
      return
    }

    try {
      let res
      if (teacher && section !== undefined) {
        res = await axios.put(`${import.meta.env.VITE_API_URL}/api/teacher/create-personal/${teacher._id}`, formData, {
          headers: { "Content-Type": "application/json" }
        })
      } else {
        res = await axios.post(`${import.meta.env.VITE_API_URL}/api/teacher/create-personal`, formData, {
          headers: { "Content-Type": "application/json" }
        })
      }
      showToast(res.data.message)
      setTeacherId(res.data.teacher._id)
      setIsAvailable(res.data.success ? 1 : 0)
    } catch (err) {
      showToast(err?.response?.data?.message || "Xatolik yuz berdi", 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlerExit = () => {
    setTeacherId(null)
    setIsAvailable(0)
    setFormData(defaultForm)
    navigate('/admin')
  }

  const inputs = [
    { label: "To'liq ism familiyasi", name: 'fullName', placeholder: "Ismingiz va familiyangiz", type: 'text', icon: <FaUserGraduate />, required: true },
    { label: "Tug'ilgan kun", name: 'date_of_birth', type: 'date', icon: <FaBirthdayCake /> },
    { label: "Darajasi", name: 'qualification', type: 'text', icon: <FaSchool />, required: true },
    { label: "Jinsi", name: 'gender', type: 'select', options: ['erkak', 'ayol'], icon: <FaVenusMars />, required: true },
    { label: "Manzili", name: 'address', placeholder: "To'liq manzil", type: 'text', icon: <FaMapMarkerAlt />, required: true },
    { label: "Telefon raqam", name: 'phone', placeholder: "+998901234567", type: 'text', icon: <FaPhone />, required: true },
    { label: "Login", name: 'login', placeholder: "Login", type: 'text', icon: <FaLock />, required: true },
    { label: "Parol", name: 'password', placeholder: "Parol", type: 'password', icon: <FaLock />, required: true },
  ]

  return (
    <div className="w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-100 min-h-screen py-8 px-4">
      <ToastContainer />
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl p-3 text-center md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          O'qituvchi Ro'yxatga Olish
        </h1>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className='pt-3'>
            <ProgressBar3 isAvailable={isAvailable} />
          </div>

          <div className="p-6 md:p-8">
            {isAvailable === 0 && (
              <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {inputs.map(({ label, name, placeholder, type, options, icon, required }) => (
                  <div key={name} className="flex flex-col">
                    <label htmlFor={name} className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                      {icon}<span className="ml-2">{label}</span>{required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {type === 'select' ? (
                      <select id={name} name={name} value={formData[name]} onChange={handleChange} required={required}
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition">
                        <option value="">Tanlang</option>
                        {options.map(opt => (
                          <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                        ))}
                      </select>
                    ) : (
                      <input type={type} id={name} name={name} placeholder={placeholder} value={formData[name]} onChange={handleChange} required={required}
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition" />
                    )}
                  </div>
                ))}

                <div className="col-span-full flex flex-col sm:flex-row justify-between items-center mt-6 pt-6 border-t border-gray-200">
                  <button type="button" onClick={() => navigate('/admin')} className="px-6 bg-green-400 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition mb-4 sm:mb-0 w-full sm:w-auto">
                    Orqaga qaytish
                  </button>
                  <button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition shadow-md w-full sm:w-auto disabled:opacity-70">
                    {isSubmitting ? "Jarayon..." : "Ro'yxatdan o'tkazish"}
                  </button>
                </div>
              </form>
            )}

            {isAvailable === 1 && <SubjectAdd teacherId={teacherId} onSuccess={() => setIsAvailable(2)} />}
            {isAvailable === 2 && <AddSubjectAdd teacherId={teacherId} onSuccess={() => setIsAvailable(3)} />}
            {isAvailable === 3 && <OtherCosts teacherId={teacherId} onSuccess={handlerExit} handlerExit={handlerExit} />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeacherRegister
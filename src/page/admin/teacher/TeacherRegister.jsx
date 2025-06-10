import axios from "axios"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from 'react-router-dom'
import ProgressBar3 from '../../../components/ProgressBar3'
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

  useEffect(() => {
    console.log(teacher)
    console.log(section)
    // Agar teacher mavjud bo‘lsa, formni to‘ldirish
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

    // Agar section mavjud bo‘lsa, isAvailable ni o‘rnatish
    if (section !== undefined && section !== null) {
      setIsAvailable(Number(section))
    }
  }, [teacher, section])

  const handleChange = ({ target: { name, value } }) =>
    setFormData(prev => ({ ...prev, [name]: value }))

  const handleSubmit = async (e) => {
  e.preventDefault()
  try {
    let res
    if (teacher && section !== undefined) {
      // teacher va section mavjud bo'lsa PUT so'rov
      res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/teacher/create-personal/${teacher._id}`, // update endpoint, o'zgartiring kerak bo'lsa
        formData,
        { headers: { "Content-Type": "application/json" } }
      )
    } else {
      // yo'q bo'lsa POST so'rov yuboriladi
      res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/teacher/create-personal`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      )
    }
    
    alert(res.data.message)
    setTeacherId(res.data.teacher._id)
    setIsAvailable(res.data.success ? 1 : 0)

  } catch (err) {
    alert(err?.response?.data?.message || "Xatolik yuz berdi")
  }
}


  const handlerExit = () => {
    setTeacherId(null)
    setIsAvailable(0)
    setFormData(defaultForm)
  }

  const inputs = [
    { label: "To'liq ism familiyasi", name: 'fullName', placeholder: "Ismingiz va familiyangiz", type: 'text' },
    { label: "Tug'ilgan kun", name: 'date_of_birth', type: 'date' },
    { label: "Darajasi", name: 'qualification', type: 'text' },
    { label: "Jinsi", name: 'gender', type: 'select', options: ['erkak', 'ayol'] },
    { label: "Manzili", name: 'address', placeholder: "To'liq manzil", type: 'text' },
    { label: "Telefon raqam", name: 'phone', placeholder: "+998901234567", type: 'text' },
    { label: "Login", name: 'login', placeholder: "Login", type: 'text' },
    { label: "Parol", name: 'password', placeholder: "Parol", type: 'password' },
  ]

  return (
    <div className="w-full bg-gradient-to-br from-indigo-50 to-blue-100 min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-10">
        <ProgressBar3 isAvailable={isAvailable} />

        {isAvailable === 0 && (
          <div className=" p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">👨‍🏫 O‘qituvchini Ro‘yxatga Olish</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {inputs.map(({ label, name, placeholder, type, options }) => (
                <div key={name} className="flex flex-col">
                  <label htmlFor={name} className="text-sm font-medium text-gray-700 mb-1">{label}</label>
                  {type === 'select' ? (
                    <select
                      id={name}
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:outline-none"
                    >
                      <option value="">Tanlang</option>
                      {options.map(opt => (
                        <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={type}
                      id={name}
                      name={name}
                      placeholder={placeholder}
                      value={formData[name]}
                      onChange={handleChange}
                      className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:outline-none"
                    />
                  )}
                </div>
              ))}
              <div className="col-span-full flex justify-center mt-4">
                <button
                  type="submit"
                  className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-300"
                >
                  Ro'yxatdan o'tkazish
                </button>
              </div>
            </form>
          </div>
        )}

        {isAvailable === 1 && <SubjectAdd teacherId={teacherId} onSuccess={() => setIsAvailable(2)} />}
        {isAvailable === 2 && <AddSubjectAdd teacherId={teacherId} onSuccess={() => setIsAvailable(3)} />}
        {isAvailable === 3 && (
          <OtherCosts
            teacherId={teacherId}
            onSuccess={() => {
              setIsAvailable(0)
              handlerExit()
            }}
            handlerExit={handlerExit}
          />
        )}
      </div>
    </div>
  )
}

export default TeacherRegister

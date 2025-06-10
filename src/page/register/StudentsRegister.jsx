import axios from "axios"
import { useEffect, useState } from "react"
import { useLocation } from 'react-router-dom'
import ProgressBar from '../../components/ProgressBar '
import AddSubjectAdd from './form/AddSubjectAdd'
import OtherCosts from './form/OtherCosts'
import RoomAttachment from './form/RoomAttachment'
import Shunchaki from './form/Shunchaki'
import SubjectAdd from './form/SubjectAdd'

const StudentsRegister = () => {
  const location = useLocation()


  const [isHotel, setIsHotel] = useState(true)
  const { student, section } = location.state || {}

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
  }

  const [formData, setFormData] = useState(defaultForm)
  const [studentId, setStudentId] = useState(null)
  const [isAvailable, setIsAvailable] = useState(0)

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
      })
      setStudentId(student._id || student.id || null)
    }

    // Agar section mavjud bo‘lsa, isAvailable ni o‘rnatish
    if (section !== undefined && section !== null) {
      setIsAvailable(Number(section))
    }
  }, [student, section])

  const handleChange = ({ target: { name, value } }) =>
    setFormData(prev => ({ ...prev, [name]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post("http://localhost:4000/api/student/create-personal", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      alert(res.data.message)
      setStudentId(res.data.studentId)
      setIsAvailable(res.data.success ? 1 : 0)
    } catch (err) {
      alert(err?.response?.data?.message || "Xatolik yuz berdi")
    }
  }

  const handlerExit = () => {
    setStudentId(null)
    setIsAvailable(0)
    setIsHotel(true)
    setFormData(defaultForm)
  }

  const inputs = [
    { label: "To'liq ism familiyasi", name: 'fullName', placeholder: "Ismingiz va familiyangiz", type: 'text' },
    { label: "Tug'ilgan kun", name: 'date_of_birth', type: 'date' },
    { label: "Jinsi", name: 'gender', type: 'select', options: ['erkak', 'ayol'] },
    { label: "Manzili", name: 'address', placeholder: "To'liq manzil", type: 'text' },
    { label: "Maktabingiz", name: 'old_school', placeholder: "Maktab nomi", type: 'text' },
    { label: "Sinfingiz", name: 'old_class', placeholder: "Sinf nomi", type: 'text' },
    { label: "Telefon raqam", name: 'phone', placeholder: "+998901234567", type: 'text' },
    { label: "Login", name: 'login', placeholder: "Login", type: 'text' },
    { label: "Parol", name: 'password', placeholder: "Parol", type: 'password' },
  ]

  return (
    <div className="w-full bg-gradient-to-br from-indigo-50 to-blue-100 min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-10 ">
        <ProgressBar isAvailable={isAvailable} />

        {isAvailable === 0 && (
          <div className='rounded-2xl shadow-lg p-4 m-4'>
            <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">🎓 Talaba Ro‘yxatga Olish</h2>
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

        {isAvailable === 1 && <SubjectAdd studentId={studentId} onclick={() => setIsAvailable(2)} />}
        {isAvailable === 2 && <AddSubjectAdd studentId={studentId} onclick={() => setIsAvailable(3)} />}
        {isAvailable === 3 && (
          <OtherCosts
            studentId={studentId}
            onclick={() => setIsAvailable(4)}
            onHotelChange={() => setIsHotel(false)}
            handlerExit={handlerExit}
          />
        )}
        {isAvailable === 4 && (
          isHotel
            ? <RoomAttachment studentId={studentId} onHotelChange={() => setIsHotel(false)} />
            : <Shunchaki studentId={studentId} onExit={handlerExit} />
        )}
      </div>
    </div>
  )
}

export default StudentsRegister

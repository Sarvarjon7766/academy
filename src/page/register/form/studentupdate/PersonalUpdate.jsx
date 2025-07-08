import axios from 'axios'
import { useEffect, useState } from 'react'
import { FiUser, FiCalendar, FiMapPin, FiBook, FiPhone, FiKey, FiSave, FiArrowLeft } from 'react-icons/fi'

const PersonalUpdate = ({ student, onSuccess }) => {
  const [formData, setFormData] = useState({
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
  })
  
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  useEffect(() => {
    if (student) {
      setFormData({
        fullName: student.fullName || '',
        date_of_birth: student?.date_of_birth
          ? new Date(student.date_of_birth).toISOString().split('T')[0]
          : '',
        gender: student.gender || '',
        address: student.address || '',
        old_school: student.old_school || '',
        old_class: student.old_class || '',
        phone: student.phone || '',
        login: student.login || '',
        password: student.password || '',
        role: student.role || 2
      })
    }
  }, [student])
  
  const handleChange = ({ target: { name, value } }) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)
    
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/student/update-personal/${student._id}`, 
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      
      if (res.data.success) {
        setSuccess(true)
        if (onSuccess) onSuccess()
        
        // Xabarni 3 soniyadan keyin yo'q qilish
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (error) {
      console.error("Ma'lumotlarni yangilashda xato:", error)
    } finally {
      setLoading(false)
    }
  }
  
  const inputFields = [
    { 
      label: "To'liq ism familiyasi", 
      name: 'fullName', 
      placeholder: "Ismingiz va familiyangiz", 
      type: 'text',
      icon: <FiUser className="text-blue-500" />,
      colSpan: "col-span-2"
    },
    { 
      label: "Tug'ilgan kun", 
      name: 'date_of_birth', 
      type: 'date',
      icon: <FiCalendar className="text-purple-500" />
    },
    { 
      label: "Jinsi", 
      name: 'gender', 
      type: 'select', 
      options: ['erkak', 'ayol'],
      icon: <FiUser className="text-pink-500" />
    },
    { 
      label: "Manzili", 
      name: 'address', 
      placeholder: "To'liq manzil", 
      type: 'text',
      icon: <FiMapPin className="text-green-500" />,
      colSpan: "col-span-2"
    },
    { 
      label: "Maktabingiz", 
      name: 'old_school', 
      placeholder: "Maktab nomi", 
      type: 'text',
      icon: <FiBook className="text-yellow-500" />
    },
    { 
      label: "Sinfingiz", 
      name: 'old_class', 
      placeholder: "Sinf nomi", 
      type: 'text',
      icon: <FiBook className="text-yellow-500" />
    },
    { 
      label: "Telefon raqam", 
      name: 'phone', 
      placeholder: "+998901234567", 
      type: 'text',
      icon: <FiPhone className="text-blue-400" />
    },
    { 
      label: "Login", 
      name: 'login', 
      placeholder: "Login", 
      type: 'text',
      icon: <FiKey className="text-gray-500" />
    },
    { 
      label: "Parol", 
      name: 'password', 
      placeholder: "Parol", 
      type: 'password',
      icon: <FiKey className="text-gray-500" />
    },
  ]
  
  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md w-full">
  {success && (
    <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center animate-fadeIn">
      <div className="bg-green-200 p-1 rounded-full mr-3">
        <FiSave className="text-green-700" />
      </div>
      <span>Ma'lumotlar muvaffaqiyatli yangilandi!</span>
    </div>
  )}

  <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
    {inputFields.map((field) => (
      <div
        key={field.name}
        className={`w-full ${field.colSpan ? 'sm:col-span-2' : ''} bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition`}
      >
        <label htmlFor={field.name} className="flex items-center text-sm font-medium text-gray-700 mb-2">
          <span className="mr-2">{field.icon}</span>
          {field.label}
        </label>

        {field.type === 'select' ? (
          <select
            id={field.name}
            name={field.name}
            value={formData[field.name]}
            onChange={handleChange}
            className="block w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Tanlang</option>
            {field.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={field.type}
            id={field.name}
            name={field.name}
            placeholder={field.placeholder}
            value={formData[field.name]}
            onChange={handleChange}
            className="block w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        )}
      </div>
    ))}

    <div className="col-span-full flex flex-col sm:flex-row flex-wrap justify-end gap-4 pt-6">
      <button
        type="submit"
        disabled={loading}
        className={`flex items-center justify-center px-6 py-3 rounded-lg text-white font-medium transition ${
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
        }`}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Yangilanmoqda...
          </>
        ) : (
          <>
            <FiSave className="mr-2" />
            Yangilashni saqlash
          </>
        )}
      </button>
    </div>
  </form>
</div>

  )
}

export default PersonalUpdate
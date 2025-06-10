import axios from 'axios'
import { useEffect, useState } from 'react'
import {
  FaBirthdayCake,
  FaBook,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaPhone,
  FaUserGraduate,
} from 'react-icons/fa'

const OtherCosts = ({ teacherId, onSuccess }) => {
  const [teacher, setTeacher] = useState(null)
  const [error, setError] = useState('')

  const fetchData = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/api/teacher/personal/${teacherId}`)
      if (res.data.success) {
        setTeacher(res.data.teacher)
      } else {
        setError("O'qituvchi ma'lumotlari topilmadi")
      }
    } catch (error) {
      console.error(error)
      setError("Xatolik yuz berdi")
    }
  }

  useEffect(() => {
    fetchData()
  }, [teacherId]) // teacherId o'zgarsa, fetchData qayta chaqiriladi

  const handleFinish = () => {
    if (onSuccess) onSuccess()
  }

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>
  }

  if (!teacher) {
    return <div className="text-center mt-4 text-lg font-medium animate-pulse">Yuklanmoqda...</div>
  }

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-3xl p-8">
      <div className="flex flex-col items-center space-y-4">
        <img
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
            teacher.fullName
          )}&background=0D8ABC&color=fff&size=128`}
          alt="avatar"
          className="w-32 h-32 rounded-full shadow-lg"
        />
        <h2 className="text-3xl font-bold text-gray-800">{teacher.fullName}</h2>
        <span className="px-3 py-1 rounded-full bg-blue-200 text-blue-800 font-semibold text-sm">
          {teacher.qualification}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8 text-gray-700">
        <div className="flex items-center space-x-3">
          <FaPhone className="text-blue-500" />
          <p>{teacher.phone || 'Noma’lum'}</p>
        </div>
        <div className="flex items-center space-x-3">
          <FaMapMarkerAlt className="text-green-500" />
          <p>{teacher.address || 'Noma’lum'}</p>
        </div>
        <div className="flex items-center space-x-3">
          <FaBirthdayCake className="text-pink-500" />
          <p>{teacher.date_of_birth ? teacher.date_of_birth.split('T')[0] : 'Noma’lum'}</p>
        </div>
        <div className="flex items-center space-x-3">
          <FaUserGraduate className="text-yellow-500" />
          <p>{teacher.gender || 'Noma’lum'}</p>
        </div>
        <div className="flex items-center space-x-3">
          <FaMoneyBillWave className="text-green-700" />
          <p>
            Maosh:{' '}
            {teacher.salary !== undefined
              ? teacher.salary.toLocaleString() + " so'm"
              : 'Noma’lum'}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <p className="font-medium text-purple-700">
            Ulushi: {teacher.share_of_salary !== undefined ? teacher.share_of_salary + '%' : 'Noma’lum'}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-2">
          <FaBook className="text-indigo-500" /> O'qitadigan fanlar:
        </h3>
        <div className="flex flex-wrap gap-3 mt-2">
          {teacher.subjects && teacher.subjects.length > 0 ? (
            teacher.subjects.map((subj) => (
              <span
                key={subj._id}
                className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium shadow-sm"
              >
                {subj.subjectName}
              </span>
            ))
          ) : (
            <span className="text-sm text-gray-500">Fanlar topilmadi</span>
          )}
        </div>
      </div>

      <div className="flex justify-end mt-10">
        <button
          onClick={handleFinish}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl shadow-md text-sm font-semibold transition"
        >
          Yakunlash
        </button>
      </div>
    </div>
  )
}

export default OtherCosts

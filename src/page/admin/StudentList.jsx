import axios from 'axios'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const StudentList = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [students, setStudents] = useState([])
  const [filteredStudents, setFilteredStudents] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOption, setSelectedOption] = useState('')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const { student } = location.state || {}

  useEffect(() => {
    if (student) {
      setSelectedStudent(student)
      setModalOpen(true) // Shu bilan birga modalni ochsangiz ham yaxshi bo'ladi
    }
  }, [student])

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/student/getAll`)
        if (res.data.success) {
          setStudents(res.data.students)
          setFilteredStudents(res.data.students)
        }
      } catch (error) {
        console.error(error)
      }
    }
    fetchStudents()
  }, [])

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase()
    setSearchTerm(value)

    const filtered = students.filter((student) =>
      student.fullName.toLowerCase().includes(value) ||
      student.phone.toLowerCase().includes(value) ||
      student.address?.toLowerCase().includes(value)
    )
    setFilteredStudents(filtered)
  }

  const openModal = (student) => {
    setSelectedStudent(student)
    setModalOpen(true)
  }

  const closeModal = () => {
    setSelectedStudent(null)
    setModalOpen(false)
  }
  const updateHandler = () => {
    if (!selectedOption) return
    navigate('/register/student-update', {
      state: {
        student: selectedStudent,
        section: selectedOption, // 0, 1, 2 qiymatlar
      },
    })
  }

  const calculateMonthlyPayment = (student) => {
    if (!student) return 0
    let total = 0

    // Asosiy fanlar
    if (student.main_subjects?.length > 0) {
      total += student.main_subjects.reduce((sum, subj) => sum + (subj.price || 0), 0)
    }

    // Qo‘shimcha fanlar
    if (student.additionalSubjects?.length > 0) {
      total += student.additionalSubjects.reduce((sum, subj) => sum + (subj.price || 0), 0)
    }

    // Xizmatlar (hostel, product, transport)
    if (student.hostel?.hostelPrice) total += student.hostel.hostelPrice
    if (student.product?.productPrice) total += student.product.productPrice
    if (student.transport?.transportPrice) total += student.transport.transportPrice

    return total
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gradient-to-br from-blue-50 via-white to-blue-50 min-h-screen">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-blue-900 mb-6 text-center drop-shadow-md">
        Talabalar Ro'yxati
      </h2>

      <div className="max-w-2xl mx-auto mb-6">
        <input
          type="text"
          placeholder="Talaba ismi, telefon yoki manzil bo'yicha qidirish..."
          className="w-full border-2 border-blue-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-600 transition"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="mx-auto border border-blue-300 rounded-lg shadow-sm bg-white overflow-x-auto">
        <ul className="min-w-full">
          {/* Sarlavha */}
          <li className="hidden sm:grid grid-cols-3 gap-4 bg-blue-200 text-blue-900 font-semibold rounded-t-lg p-3 select-none">
            <span>Ism Familiya</span>
            <span>Telefon</span>
            <span>Manzil</span>
          </li>

          {/* Ma'lumotlar */}
          {filteredStudents.length === 0 ? (
            <li className="p-4 text-center text-gray-500">Talaba topilmadi</li>
          ) : (
            filteredStudents.map((student) => (
              <li
                key={student._id}
                onClick={() => openModal(student)}
                className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 border-t border-blue-100 cursor-pointer hover:bg-blue-50 transition px-3 py-4 items-center"
              >
                <span className="font-medium text-blue-800">{student.fullName}</span>
                <span className="text-sm sm:text-base">{student.phone}</span>
                <span className="text-sm sm:text-base">{student.address || '-'}</span>
              </li>
            ))
          )}
        </ul>
      </div>

      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-6 relative overflow-y-auto max-h-[90vh]">
            <button
              className="absolute bg-white top-3 right-4 text-gray-500 hover:text-red-500 text-xl"
              onClick={() => setSelectedStudent(null)}
            >
              &times;
            </button>

            <h2 className="text-2xl font-semibold text-indigo-700 mb-4 break-words">
              📋 {selectedStudent.fullName} - batafsil ma'lumot
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
              <div>
                <p><strong>📱 Telefon:</strong> {selectedStudent.phone}</p>
                <p><strong>📍 Manzil:</strong> {selectedStudent.address}</p>
                <p><strong>🎂 Tug‘ilgan sana:</strong> {new Date(selectedStudent.date_of_birth).toLocaleDateString()}</p>
                <p><strong>🚻 Jinsi:</strong> {selectedStudent.gender}</p>
                <p><strong>💰 O‘quv to‘lovi:</strong>{calculateMonthlyPayment(selectedStudent).toLocaleString()} so‘m</p>
              </div>
              <div>
                <p><strong>🏫 Maktabi:</strong> {selectedStudent.old_school} ({selectedStudent.old_class})</p>
                <p><strong>🔑 Login:</strong> {selectedStudent.login}</p>
                <p><strong>📊 Holati:</strong> {selectedStudent.status}</p>
                {selectedStudent.sunday && (
                  <p className="text-red-600 font-semibold">
                    ⚠️ Ushbu talaba yotoq joyda turmaydi
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-indigo-600 mb-2">🎯 Asosiy fanlar</h3>
                <ul className="list-disc pl-5 text-gray-800 space-y-1">
                  {selectedStudent.main_subjects?.map(subj => (
                    <li key={subj._id}>
                      {subj.subjectId.subjectName} - {subj.price} so‘m
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-indigo-600 mb-2">📚 Qo‘shimcha fanlar</h3>
                <ul className="list-disc pl-5 text-gray-800 space-y-1">
                  {selectedStudent.additionalSubjects?.map(subj => (
                    <li key={subj._id}>
                      {subj.subjectId.subjectName} - {subj.price} so‘m
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-indigo-600 mb-2">👥 Guruhlar</h3>
              <ul className="list-disc pl-5 text-gray-800 space-y-1">
                {selectedStudent.groups?.map(gr => (
                  <li key={gr._id} className="mb-1">
                    <div>
                      {gr.group.groupName} <span>({gr.type === 'main' ? "Asosiy" : "qo'shimcha"})</span>
                      <span className="text-xs text-gray-500 mt-0.5 ml-6 italic">
                        {gr.teacherId.fullName}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* Select dropdown */}
              <select
                className="border border-purple-400 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
              >
                <option value="">Tanlang</option>
                <option value={0}>Shaxsiy</option>
                <option value={1}>Asosiy Fan</option>
                <option value={2}>Qo'shimcha Fan</option>
                <option value={3}>Qo'shimcha xizmatlar</option>
                <option value={4}>Talabani Arxivlash</option>
              </select>

              {/* Buttons */}
              <button
                onClick={updateHandler}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md w-full shadow-sm transition duration-200 text-sm sm:text-base"
              >
                Yangilash
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default StudentList

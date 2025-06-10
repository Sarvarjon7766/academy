import axios from 'axios'
import { useEffect, useState } from 'react'

const StudentList = () => {
  const [students, setStudents] = useState([])
  const [filteredStudents, setFilteredStudents] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

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
                <p><strong>💰 O‘quv to‘lovi:</strong> {selectedStudent.monthly_payment} so‘m</p>
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
                  <li key={gr._id}>
                    {gr.group.groupName} ({gr.type})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default StudentList

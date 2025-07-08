import axios from 'axios'
import { useEffect, useState } from 'react'
import { FiUser } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

const TeachersManage = () => {
  const navigate = useNavigate()
  const [teachers, setTeachers] = useState([])
  const [filteredTeachers, setFilteredTeachers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTeacher, setSelectedTeacher] = useState(null)
  const [updateModalOpen, setUpdateModalOpen] = useState(false)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [selectedSection, setSelectedSection] = useState('')

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/teacher/getAll`)
        if (res.data.success) {
          const filtered = res.data.teachers.filter(teacher => teacher.isAdmin === false)
          setTeachers(filtered)
          setFilteredTeachers(filtered)
        }
      } catch (error) {
        console.error("O'qituvchilarni olishda xatolik:", error)
      }
    }

    fetchTeachers()
  }, [])

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase()
    setSearchTerm(value)

    const filtered = teachers.filter((teacher) =>
      teacher.fullName.toLowerCase().includes(value) ||
      teacher.phone.toLowerCase().includes(value) ||
      (teacher.address && teacher.address.toLowerCase().includes(value))
    )
    setFilteredTeachers(filtered)
  }

  const openUpdateModal = (teacher, e) => {
    e.stopPropagation()
    setSelectedTeacher(teacher)
    setUpdateModalOpen(true)
  }

  const openDetailModal = (teacher) => {
    setSelectedTeacher(teacher)
    setDetailModalOpen(true)
  }

  const closeModals = () => {
    setSelectedTeacher(null)
    setUpdateModalOpen(false)
    setDetailModalOpen(false)
  }

  const updateHandler = () => {
    if (!selectedSection) return

    navigate('/admin/teacher-register', {
      state: {
        teacher: selectedTeacher,
        section: selectedSection,
      },
    })
  }

  const getLatestSalary = (teacher) => {
    return teacher.salaryHistory?.[teacher.salaryHistory.length - 1] || { salary: teacher.salary, share_of_salary: teacher.share_of_salary }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 md:p-8">
      <div className="mx-auto">
        {/* Sarlavha qismi */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-800">
            O'qituvchilar Boshqaruvi
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Barcha o'qituvchilar ro'yxati va ularni boshqarish
          </p>
        </div>

        {/* Qidiruv va jami hisobot */}
        <div className="mb-6 bg-white rounded-2xl shadow-lg p-4 md:p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="O'qituvchi ismi, telefon yoki manzil bo'yicha qidirish..."
                className="w-full border-2 border-blue-200 rounded-xl px-5 py-3 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition pl-12"
                value={searchTerm}
                onChange={handleSearch}
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
            <div className="bg-blue-100 text-blue-800 rounded-xl px-4 py-2 font-medium flex items-center whitespace-nowrap">
              <span className="mr-2">Jami o'qituvchilar:</span>
              <span className="text-xl font-bold">{filteredTeachers.length}</span>
            </div>
          </div>
        </div>

        {/* Jadval qismi */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    №
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Ism Familiya
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Telefon
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Fanlar
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Oylik maosh
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Ulushi
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Amallar
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTeachers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                      O'qituvchilar topilmadi
                    </td>
                  </tr>
                ) : (
                  filteredTeachers.map((teacher, index) => (
                    <tr
                      key={teacher._id}
                      className="hover:bg-blue-50 cursor-pointer"
                      onClick={() => openDetailModal(teacher)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10 mr-3 flex items-center justify-center">
                            <FiUser className="text-blue-600 text-xl" />
                          </div>

                          <div className="text-sm font-medium text-gray-900">{teacher.fullName}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {teacher.phone}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {teacher.subjects ? (
                            teacher.subjects.slice(0, 3).map((subject, idx) => (
                              <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                {subject.subjectName}
                              </span>
                            ))
                          ) : (
                            teacher.subjectNames && teacher.subjectNames.split(',').slice(0, 3).map((subject, idx) => (
                              <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                {subject.trim()}
                              </span>
                            ))
                          )}
                          {(teacher.subjects && teacher.subjects.length > 3) && (
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              +{teacher.subjects.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getLatestSalary(teacher).salary?.toLocaleString() || 'N/A'} UZS
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                          {getLatestSalary(teacher).share_of_salary ?? 'N/A'}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={(e) => openUpdateModal(teacher, e)}
                          className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:from-blue-600 hover:to-indigo-700 transition duration-300 shadow-md"
                        >
                          Yangilash
                        </button>

                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* O'qituvchi ma'lumotlari modal oynasi */}
      {detailModalOpen && selectedTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">{selectedTeacher.fullName}</h2>
                <button
                  onClick={closeModals}
                  className="text-white bg-indigo-700 hover:text-blue-200 transition-colors"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              <p className="text-blue-200 mt-1">{selectedTeacher.phone}</p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-xl p-5">
                  <h3 className="text-lg font-semibold text-blue-800 mb-3">Shaxsiy ma'lumotlar</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-blue-600">Manzil</p>
                      <p className="text-gray-800">{selectedTeacher.address || 'Manzil kiritilmagan'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-600">Tug'ilgan sana</p>
                      <p className="text-gray-800">{new Date(selectedTeacher.date_of_birth).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-600">Jins</p>
                      <p className="text-gray-800">{selectedTeacher.gender}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-indigo-50 rounded-xl p-5">
                  <h3 className="text-lg font-semibold text-indigo-800 mb-3">Kasbiy ma'lumotlar</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-indigo-600">Malaka</p>
                      <p className="text-gray-800">{selectedTeacher.qualification}</p>
                    </div>
                    <div>
                      <p className="text-sm text-indigo-600">O'qitadigan fanlar</p>
                      <p className="text-gray-800">
                        {selectedTeacher.subjects ?
                          selectedTeacher.subjects.map(s => s.subjectName).join(', ') :
                          selectedTeacher.subjectNames}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-xl p-5 md:col-span-2">
                  <h3 className="text-lg font-semibold text-green-800 mb-3">Moliyaviy ma'lumotlar</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-green-600">Oylik maosh</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {getLatestSalary(selectedTeacher).salary?.toLocaleString() || 'N/A'} UZS
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-green-600">Ulushi</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {getLatestSalary(selectedTeacher).share_of_salary ?? 'N/A'}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Yangilash modal oynasi */}
      {updateModalOpen && selectedTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Ma'lumotlarni yangilash</h2>
                <button
                  onClick={closeModals}
                  className="text-white bg-indigo-600 hover:text-blue-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              <p className="text-blue-200 mt-1">{selectedTeacher.fullName}</p>
            </div>

            <div className="p-6">
              <div className="mb-5">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Yangilash bo'limini tanlang
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                >
                  <option value="">Tanlang</option>
                  <option value="0">Shaxsiy ma'lumotlar</option>
                  <option value="1">Fanlar</option>
                  <option value="2">Oylik maosh</option>
                </select>
              </div>

              <div className="flex flex-col sm:flex-row justify-end items-center gap-3 mt-6">
                <button
                  onClick={closeModals}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 transition duration-300 shadow-sm"
                >
                  Bekor qilish
                </button>

                <button
                  onClick={updateHandler}
                  disabled={!selectedSection}
                  className={`w-full sm:w-auto px-5 py-2.5 rounded-lg font-semibold text-white transition duration-300 shadow-sm ${selectedSection
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
                      : 'bg-gray-400 cursor-not-allowed'
                    }`}
                >
                  Yangilash
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TeachersManage
import axios from 'axios'
import { useEffect, useState, useCallback, useMemo } from 'react'
import { FaBook, FaChalkboardTeacher, FaUsers, FaDownload, FaCalendarAlt, FaSpinner } from 'react-icons/fa'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import * as XLSX from 'xlsx'

const TeacherAttendance = () => {
  const [teachers, setTeachers] = useState([])
  const [selectedTeacher, setSelectedTeacher] = useState('')
  const [subjects, setSubjects] = useState([])
  const [selectedSubject, setSelectedSubject] = useState('')
  const [groups, setGroups] = useState([])
  const [selectedGroup, setSelectedGroup] = useState('')
  const [attendanceData, setAttendanceData] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingGroups, setLoadingGroups] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  
  // Yangi holatlar: joriy yil va oy
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [years, setYears] = useState([])
  const [months, setMonths] = useState([
    { id: 1, name: 'Yanvar' },
    { id: 2, name: 'Fevral' },
    { id: 3, name: 'Mart' },
    { id: 4, name: 'Aprel' },
    { id: 5, name: 'May' },
    { id: 6, name: 'Iyun' },
    { id: 7, name: 'Iyul' },
    { id: 8, name: 'Avgust' },
    { id: 9, name: 'Sentabr' },
    { id: 10, name: 'Oktabr' },
    { id: 11, name: 'Noyabr' },
    { id: 12, name: 'Dekabr' },
  ])

  // Yillar ro'yxatini yaratish
  useEffect(() => {
    const currentYear = new Date().getFullYear()
    const yearsList = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)
    setYears(yearsList)
  }, [])

  const fetchTeachers = useCallback(async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/teacher/getAll`)
      if (res.data.success) {
        setTeachers(res.data.teachers)
      } else {
        toast.warning("O'qituvchilarni olishda muammo yuz berdi")
      }
    } catch (error) {
      console.error("O'qituvchilarni olishda xatolik:", error)
      toast.error("O'qituvchilarni yuklab bo'lmadi. Qayta urinib ko'ring!")
    }
  }, [])

  // API so'roviga yil va oyni qo'shamiz
  const fetchAttendanceData = useCallback(async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/teacher-attandance/getInmonth`, {
        params: { 
          year: selectedYear,
          month: selectedMonth 
        }
      })
      if (res.data.success) {
        setAttendanceData(res.data.data)
      } else {
        toast.warning("Davomat ma'lumotlari topilmadi")
      }
    } catch (error) {
      console.error("Davomat ma'lumotlarini olishda xatolik:", error)
      toast.error("Davomat ma'lumotlarini yuklab bo'lmadi!")
    } finally {
      setLoading(false)
    }
  }, [selectedYear, selectedMonth])

  useEffect(() => {
    fetchTeachers()
    fetchAttendanceData()
  }, [fetchTeachers, fetchAttendanceData])

  const handleTeacherChange = (e) => {
    const teacherId = e.target.value
    setSelectedTeacher(teacherId)
    setSelectedSubject('')
    setSelectedGroup('')
    setSubjects([])
    setGroups([])

    if (teacherId) {
      const foundTeacher = teachers.find(t => t._id === teacherId)
      setSubjects(foundTeacher?.subjects || [])
    }
  }

  const handleSubjectChange = async (e) => {
    const subjectId = e.target.value
    setSelectedSubject(subjectId)
    setSelectedGroup('')
    setGroups([])

    if (subjectId && selectedTeacher) {
      try {
        setLoadingGroups(true)
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/group/get-techer-group`, {
          params: { subjectId, teacherId: selectedTeacher }
        })
        if (res.data.success) {
          setGroups(res.data.groups)
        } else {
          toast.warning("Guruhlar topilmadi")
        }
      } catch (error) {
        console.error("Guruhlarni olishda xatolik:", error)
        toast.error("Guruhlarni yuklab bo'lmadi!")
      } finally {
        setLoadingGroups(false)
      }
    }
  }

  const handleSubmit = async () => {
    try {
      setSubmitting(true)
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/teacher-attandance/attandanceAdd`, {
        teacher: selectedTeacher,
        subject: selectedSubject,
        group: selectedGroup
      })
      
      if (res.data.success) {
        toast.success(res.data.data?.message || "✅ Davomat muvaffaqiyatli qo'shildi!")
        await fetchAttendanceData()
        resetForm()
      } else {
        toast.warn(res.data.message || "⚠️ Bugungi davomat allaqachon kiritilgan")
      }
    } catch (error) {
      console.error("Davomatni yuborishda xatolik:", error)
      const errorMsg = error.response?.data?.message || "❌ Davomatni saqlashda xatolik!"
      toast.error(errorMsg)
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setSelectedTeacher('')
    setSelectedSubject('')
    setSelectedGroup('')
    setSubjects([])
    setGroups([])
  }

  const exportToExcel = () => {
    if (attendanceData.length === 0) {
      toast.warning("Eksport qilish uchun ma'lumot mavjud emas")
      return
    }

    try {
      const worksheetData = attendanceData.map((item, index) => ({
        '#': index + 1,
        'Ism Familya': item.teacher?.fullName || 'Nomaʼlum',
        'Fan': item.subject?.subjectName || 'Nomaʼlum',
        'Guruh': item.group?.groupName || 'Nomaʼlum',
        'Sana': formatDate(item.date)
      }))
      
      const worksheet = XLSX.utils.json_to_sheet(worksheetData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Davomat')
      
      const monthName = months.find(m => m.id === selectedMonth)?.name || selectedMonth
      XLSX.writeFile(workbook, `o'qituvchi_davomati_${monthName}_${selectedYear}.xlsx`)
      toast.success("Excel fayli muvaffaqiyatli yuklab olindi!")
    } catch (error) {
      console.error("Excelga eksport qilishda xatolik:", error)
      toast.error("Faylni yuklab olishda xatolik!")
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "—"
    const date = new Date(dateString)
    return date.toLocaleDateString('uz-UZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const isSubmitEnabled = useMemo(() => (
    selectedTeacher && selectedSubject && selectedGroup
  ), [selectedTeacher, selectedSubject, selectedGroup])

  // Tanlangan oy va yilga mos davomat ma'lumotlari
  const filteredAttendanceData = useMemo(() => {
    return attendanceData.filter(item => 
      (!selectedTeacher || item.teacher?._id === selectedTeacher) &&
      (!selectedSubject || item.subject?._id === selectedSubject) &&
      (!selectedGroup || item.group?._id === selectedGroup)
    )
  }, [attendanceData, selectedTeacher, selectedSubject, selectedGroup])

  return (
    <div className="mx-auto p-4 md:p-6 mt-4 md:mt-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-xl p-x-2">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-indigo-700">📊 O'qituvchi Davomati</h2>
        
        {/* Oy va yil tanlash qismi */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-indigo-200 shadow-sm">
            <FaCalendarAlt className="text-indigo-500" />
            <label className="text-sm font-medium text-gray-700">Yil:</label>
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-transparent text-gray-700 font-medium focus:outline-none"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-indigo-200 shadow-sm">
            <FaCalendarAlt className="text-indigo-500" />
            <label className="text-sm font-medium text-gray-700">Oy:</label>
            <select 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="bg-transparent text-gray-700 font-medium focus:outline-none"
            >
              {months.map(month => (
                <option key={month.id} value={month.id}>{month.name}</option>
              ))}
            </select>
          </div>
          
          <button 
            onClick={fetchAttendanceData}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow transition"
          >
            <FaSpinner className="animate-spin hidden" />
            Ma'lumotlarni yuklash
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* O'qituvchi */}
        <div className="space-y-1">
          <label className="font-semibold text-gray-700 flex items-center gap-2">
            <FaChalkboardTeacher className="text-indigo-500" /> O‘qituvchi:
          </label>
          <select 
            value={selectedTeacher} 
            onChange={handleTeacherChange}
            className="w-full px-3 py-2 rounded-lg border border-indigo-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          >
            <option value="">-- Tanlang --</option>
            {teachers.map(teacher => (
              <option key={teacher._id} value={teacher._id}>{teacher.fullName}</option>
            ))}
          </select>
        </div>

        {/* Fan */}
        <div className="space-y-1">
          <label className="font-semibold text-gray-700 flex items-center gap-2">
            <FaBook className="text-indigo-500" /> Fan:
          </label>
          <select 
            value={selectedSubject} 
            onChange={handleSubjectChange}
            disabled={!selectedTeacher}
            className="w-full px-3 py-2 rounded-lg border border-indigo-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none disabled:opacity-50"
          >
            <option value="">-- Tanlang --</option>
            {subjects.map(subject => (
              <option key={subject._id} value={subject._id}>{subject.subjectName}</option>
            ))}
          </select>
        </div>

        {/* Guruh */}
        <div className="space-y-1">
          <label className="font-semibold text-gray-700 flex items-center gap-2">
            <FaUsers className="text-indigo-500" /> Guruh:
          </label>
          <div className="relative">
            <select 
              value={selectedGroup} 
              onChange={e => setSelectedGroup(e.target.value)}
              disabled={!selectedSubject || loadingGroups}
              className="w-full px-3 py-2 rounded-lg border border-indigo-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none disabled:opacity-50"
            >
              <option value="">-- Tanlang --</option>
              {groups.map(group => (
                <option key={group._id} value={group._id}>{group.groupName}</option>
              ))}
            </select>
            {loadingGroups && (
              <FaSpinner className="animate-spin absolute right-3 top-3 text-indigo-500" />
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-end">
          <button 
            onClick={handleSubmit}
            disabled={!isSubmitEnabled || submitting}
            className={`w-full h-[42px] flex items-center justify-center ${
              isSubmitEnabled 
                ? 'bg-indigo-600 hover:bg-indigo-700' 
                : 'bg-gray-300 cursor-not-allowed'
            } text-white font-medium rounded-lg transition`}
          >
            {submitting ? (
              <FaSpinner className="animate-spin" />
            ) : (
              "Davomatni yuborish"
            )}
          </button>
        </div>
      </div>

      {/* Export and Filter Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div className="text-sm text-gray-600">
          Jami davomatlar: <span className="font-semibold">{filteredAttendanceData.length}</span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={exportToExcel}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg shadow transition"
          >
            <FaDownload /> Excelga yuklash
          </button>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm mb-8">
        <div className="bg-indigo-50 p-4 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-700">📅 Davomat Jadvali</h3>
          <span className="text-sm text-indigo-600 font-medium">
            {months.find(m => m.id === selectedMonth)?.name || selectedMonth}, {selectedYear}
          </span>
        </div>
        <table className="w-full">
          <thead className="bg-indigo-100 text-indigo-900">
            <tr>
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">Ism Familya</th>
              <th className="px-4 py-2 text-left">Fan</th>
              <th className="px-4 py-2 text-left">Guruh</th>
              <th className="px-4 py-2 text-left">Sana</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                  <div className="flex justify-center">
                    <FaSpinner className="animate-spin text-indigo-500 text-2xl" />
                  </div>
                  <p className="mt-2">Davomat maʼlumotlari yuklanmoqda...</p>
                </td>
              </tr>
            ) : filteredAttendanceData.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                  <div className="text-lg mb-2">📭</div>
                  Hech qanday davomat maʼlumoti topilmadi
                </td>
              </tr>
            ) : (
              filteredAttendanceData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 font-medium">{item.teacher?.fullName || "—"}</td>
                  <td className="px-4 py-3">{item.subject?.subjectName || "—"}</td>
                  <td className="px-4 py-3">
                    <span className="bg-indigo-100 text-indigo-800 py-1 px-2 rounded-full text-sm">
                      {item.group?.groupName || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium">{formatDate(item.date)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ToastContainer 
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  )
}

export default TeacherAttendance
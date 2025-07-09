import axios from "axios"
import { useEffect, useState } from "react"
import { FiBook, FiUser, FiUsers, FiDollarSign, FiSave, FiArrowLeft } from "react-icons/fi"

const MainSubjectUpdate = ({ student, onSuccess }) => {
  const [subjects, setSubjects] = useState([])
  const [main_subject, setMainSubject] = useState([])
  const [selections, setSelections] = useState([
    { subject: null, teachers: [], teacher: null, groups: [], group: null, price: "" },
    { subject: null, teachers: [], teacher: null, groups: [], group: null, price: "" },
  ])
  const [error, setError] = useState(null)
  const [loadingSubjects, setLoadingSubjects] = useState(false)
  const [loadingStudentSubjects, setLoadingStudentSubjects] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  // Fetch all subjects once
  useEffect(() => {
    const fetchSubjects = async () => {
      setLoadingSubjects(true)
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/subject/getAll`)
        setSubjects(res.data.subject || [])
      } catch {
        setError("Fanlarni yuklab bo'lmadi!")
      } finally {
        setLoadingSubjects(false)
      }
    }
    fetchSubjects()
  }, [])

  // Fetch student's current subjects
  useEffect(() => {
    if (!student?._id) return

    const fetchStudentSubject = async () => {
      setLoadingStudentSubjects(true)
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/student/main-subject/${student._id}`)
        if (res.data.success) {
          const fetchedSubjects = res.data.main_subjects || []
          setMainSubject(fetchedSubjects)
          const newSelections = fetchedSubjects.map(item => ({
            subject: item.subjectId || null,
            teacher: item.teacherId || null,
            group: item.groupId || null,
            teachers: item.teacherId ? [item.teacherId] : [],
            groups: item.groupId ? [item.groupId] : [],
            price: item.price || "",
          }))

          while (newSelections.length < 2) {
            newSelections.push({ subject: null, teachers: [], teacher: null, groups: [], group: null, price: "" })
          }
          setSelections(newSelections)
        }
      } catch (err) {
        setError("Fanlarni yuklab bo'lmadi!")
      } finally {
        setLoadingStudentSubjects(false)
      }
    }
    fetchStudentSubject()
  }, [student?._id])

  const handleSubjectChange = async (index, subjectId) => {
    setSelections(prev => {
      const updated = [...prev]
      const subject = subjects.find(s => s._id === subjectId) || null
      updated[index] = {
        subject,
        teachers: [],
        teacher: null,
        groups: [],
        group: null,
        price: subject?.mainPrice || "",
      }
      return updated
    })

    if (!subjectId) return

    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/teacher/subject/${subjectId}`)
      const teachers = res.data.teachers || []
      setSelections(prev => {
        const updated = [...prev]
        updated[index].teachers = teachers
        return updated
      })
    } catch {
      setError("O'qituvchilarni yuklab bo'lmadi!")
    }
  }

  const handleTeacherChange = async (index, teacherId) => {
    setSelections(prev => {
      const updated = [...prev]
      updated[index].teacher = teacherId ? updated[index].teachers.find(t => t._id === teacherId) : null
      updated[index].group = null
      updated[index].groups = []
      return updated
    })

    const subjectId = selections[index]?.subject?._id
    if (!teacherId || !subjectId) return

    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/group/groups/${teacherId}/${subjectId}`)
      const groups = res.data.groups || []
      setSelections(prev => {
        const updated = [...prev]
        updated[index].groups = groups
        return updated
      })
    } catch {
      setError("Guruhlarni yuklab bo'lmadi!")
    }
  }

  const handleGroupChange = (index, groupId) => {
    setSelections(prev => {
      const updated = [...prev]
      updated[index].group = updated[index].groups.find(g => g._id === groupId) || null
      if (updated[index].subject && !updated[index].price) {
        updated[index].price = updated[index].subject.mainPrice || ""
      }
      return updated
    })
  }

  const handlePriceChange = (index, value) => {
    setSelections(prev => {
      const updated = [...prev]
      updated[index].price = value
      return updated
    })
  }

  const handleSubmit = async () => {
    const selectedData = selections
      .filter(s => s.subject && s.teacher && s.group)
      .map(s => ({
        subjectId: s.subject._id,
        teacherId: s.teacher._id,
        groupId: s.group._id,
        price: s.price,
      }))

    if (selectedData.length === 0) {
      setError("Iltimos, kamida bitta fanga guruh va o'qituvchi tanlang.")
      return
    }

    try {
      setError(null)
      setIsSubmitting(true)
      console.log(selectedData)
      console.log(main_subject)
      console.log(student._id)
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/student/update-main/${student._id}`,
        { newsubjects: selectedData, oldsubjects: main_subject },
        { headers: { "Content-Type": "application/json" } }
      )
      if (res.data.success) {
        setSuccess(true)
        if (onSuccess) onSuccess()
        
        // Xabarni 3 soniyadan keyin yo'q qilish
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (err) {
      console.error("Xatolik:", err)
      setError("Ma'lumotlarni yuborishda xatolik yuz berdi.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderSubjectBlock = (index) => {
    const { subject, teachers, teacher, groups, group, price } = selections[index]

    return (
      <div 
        key={index} 
        className={`p-6 rounded-2xl border-2 ${subject ? 'border-indigo-200 bg-indigo-50' : 'border-gray-200 bg-gray-50'} transition-all`}
      >
        <div className="flex items-center mb-4">
          <div className="bg-indigo-100 p-2 rounded-lg mr-3">
            <FiBook className="text-indigo-600 text-xl" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Fan {index + 1}</h3>
        </div>

        <div className="space-y-4">
          {/* Fan tanlash */}
          <div>
            <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FiBook className="mr-2 text-indigo-500" />
              Fan tanlang
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
              value={subject?._id || ""}
              onChange={(e) => handleSubjectChange(index, e.target.value || null)}
            >
              <option value="">Fan tanlang</option>
              {subjects
                .filter(sub => index === 0 || sub._id !== selections[0].subject?._id)
                .map(sub => (
                  <option key={sub._id} value={sub._id}>
                    {sub.subjectName}
                  </option>
                ))}
            </select>
          </div>

          {/* O'qituvchi tanlash */}
          {subject && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FiUser className="mr-2 text-blue-500" />
                O'qituvchini tanlang
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                value={teacher?._id || ""}
                onChange={(e) => handleTeacherChange(index, e.target.value || null)}
              >
                <option value="">O'qituvchi tanlang</option>
                {teachers.map(t => (
                  <option key={t._id} value={t._id}>
                    {t.fullName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Guruh tanlash */}
          {subject && teacher && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FiUsers className="mr-2 text-green-500" />
                Guruhni tanlang
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                value={group?._id || ""}
                onChange={(e) => handleGroupChange(index, e.target.value || null)}
              >
                <option value="">Guruh tanlang</option>
                {groups.map(g => (
                  <option key={g._id} value={g._id}>
                    {g.groupName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Narxni kiritish */}
          {group && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FiDollarSign className="mr-2 text-yellow-500" />
                Fan narxi
              </label>
              <input
                type="number"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={price}
                onChange={(e) => handlePriceChange(index, e.target.value)}
                placeholder="Fan narxi"
              />
            </div>
          )}
        </div>
      </div>
    )
  }

  if (loadingSubjects || loadingStudentSubjects) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6">

      {/* Xabarlar */}
      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center">
          <FiSave className="mr-2 text-xl" />
          <span>Ma'lumotlar muvaffaqiyatli yangilandi!</span>
        </div>
      )}

      {/* Fan bloklari */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {[0, 1].map(renderSubjectBlock)}
      </div>

      {/* Tugmalar */}
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`flex items-center justify-center px-6 py-3 rounded-lg text-white font-medium transition ${
            isSubmitting 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
          }`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
    </div>
  )
}

export default MainSubjectUpdate
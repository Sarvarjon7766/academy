import axios from 'axios'
import { useEffect, useState } from 'react'
import { FaBook, FaChalkboardTeacher, FaUsers, FaDollarSign, FaCheck, FaChevronRight } from 'react-icons/fa'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const SubjectAdd = ({ studentId, onclick }) => {
  const [subjects, setSubjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selections, setSelections] = useState([
    { subject: null, teachers: [], teacher: null, groups: [], group: null, price: '' },
    { subject: null, teachers: [], teacher: null, groups: [], group: null, price: '' }
  ])
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch student subjects
        const studentRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/student/main-subject/${studentId}`)
				console.log(studentRes.data)
        if (studentRes.data.success) {
          const subjects = studentRes.data.main_subjects

          const newSelections = subjects.map(item => ({
            subject: item.subjectId,
            teacher: item.teacherId,
            group: item.groupId,
            teachers: [item.teacherId],
            groups: [item.groupId],
            price: item.subjectId?.mainPrice || ''
          }))

          while (newSelections.length < 2) {
            newSelections.push({ subject: null, teachers: [], teacher: null, groups: [], group: null, price: '' })
          }

          setSelections(newSelections)
        }
        
        // Fetch all subjects
        const subjectsRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/subject/getAll`)
        setSubjects(subjectsRes.data.subject)
      } catch (error) {
        console.error(error)
        setError("Ma'lumotlarni yuklab bo'lmadi!")
        toast.error("Ma'lumotlarni yuklab bo'lmadi!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [studentId])

  const handleSubjectChange = async (index, subject) => {
    const updated = [...selections]
    updated[index].subject = subject
    updated[index].teacher = null
    updated[index].group = null
    updated[index].groups = []
    updated[index].price = subject?.mainPrice || ''

    if (subject) {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/teacher/subject/${subject._id}`)
        updated[index].teachers = res.data.teachers || []
      } catch {
        setError("O'qituvchilarni yuklab bo'lmadi!")
      }
    } else {
      updated[index].teachers = []
    }

    setSelections(updated)
  }

  const handleTeacherChange = async (index, teacher) => {
    const updated = [...selections]
    updated[index].teacher = teacher
    updated[index].group = null

    if (teacher && updated[index].subject) {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/group/groups/${teacher._id}/${updated[index].subject._id}`)
        updated[index].groups = res.data.groups || []
      } catch {
        setError("Guruhlarni yuklab bo'lmadi!")
      }
    }

    setSelections(updated)
  }

  const handleGroupChange = (index, group) => {
    const updated = [...selections]
    updated[index].group = group
    if (updated[index].subject && !updated[index].price) {
      updated[index].price = updated[index].subject.mainPrice || ''
    }
    setSelections(updated)
  }

  const handlePriceChange = (index, value) => {
    const updated = [...selections]
    updated[index].price = value
    setSelections(updated)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    const selectedData = selections
      .filter(s => s.subject && s.teacher && s.group)
      .map(s => ({
        subjectId: s.subject._id,
        teacherId: s.teacher._id,
        groupId: s.group._id,
        price: s.price
      }))

    if (selectedData.length === 0) {
      setError("Iltimos, kamida bitta fanga guruh va o'qituvchi tanlang.")
      toast.error("Iltimos, kamida bitta fanga guruh va o'qituvchi tanlang.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
      setIsSubmitting(false)
      return
    }

    try {
      setError(null)
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/student/add-main/${studentId}`,
        { subjects: selectedData },
        { headers: { "Content-Type": "application/json" } }
      )
      if (res.data.success) {
        toast.success("Fanlar muvaffaqiyatli biriktirildi!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
        setTimeout(() => {
          onclick()
        }, 2200)
      }
    } catch (err) {
      console.error("Xatolik:", err)
      setError("Ma'lumotlarni yuborishda xatolik yuz berdi.")
      toast.error("Ma'lumotlarni yuborishda xatolik yuz berdi.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderSubjectBlock = (index) => {
    const {
      subject,
      teachers,
      teacher,
      groups,
      group,
      price
    } = selections[index]

    return (
      <div 
        className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl border border-indigo-50"
        key={index}
      >
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
            <span className="text-indigo-600 font-bold">{index + 1}</span>
          </div>
          <h3 className="text-xl font-bold text-indigo-800">Fan {index + 1}</h3>
        </div>

        <div className="space-y-4">
          {/* Subject Selection */}
          <div className="relative">
            <div className="flex items-center mb-1">
              <FaBook className="text-indigo-500 mr-2" />
              <label className="text-sm font-medium text-gray-700">Fan tanlang</label>
            </div>
            <select
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition appearance-none bg-white"
              value={subject ? JSON.stringify(subject) : ""}
              onChange={(e) => handleSubjectChange(index, e.target.value ? JSON.parse(e.target.value) : null)}
            >
              <option value="">Fan tanlang...</option>
              {subjects
                .filter(sub => index === 0 || sub._id !== selections[0].subject?._id)
                .map(sub => (
                  <option key={sub._id} value={JSON.stringify(sub)}>
                    {sub.subjectName}
                  </option>
                ))}
            </select>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none top-7">
              <FaBook className="text-gray-400" />
            </div>
          </div>

          {/* Teacher Selection */}
          {subject && (
            <div className="relative">
              <div className="flex items-center mb-1">
                <FaChalkboardTeacher className="text-indigo-500 mr-2" />
                <label className="text-sm font-medium text-gray-700">O'qituvchi tanlang</label>
              </div>
              <select
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition appearance-none bg-white"
                value={teacher ? JSON.stringify(teacher) : ""}
                onChange={(e) => handleTeacherChange(index, e.target.value ? JSON.parse(e.target.value) : null)}
              >
                <option value="">O'qituvchi tanlang...</option>
                {teachers.map(teacher => (
                  <option key={teacher._id} value={JSON.stringify(teacher)}>
                    {teacher.fullName}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none top-7">
                <FaChalkboardTeacher className="text-gray-400" />
              </div>
            </div>
          )}

          {/* Group Selection */}
          {subject && teacher && (
            <div className="relative">
              <div className="flex items-center mb-1">
                <FaUsers className="text-indigo-500 mr-2" />
                <label className="text-sm font-medium text-gray-700">Guruh tanlang</label>
              </div>
              <select
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition appearance-none bg-white"
                value={group ? JSON.stringify(group) : ""}
                onChange={(e) => handleGroupChange(index, e.target.value ? JSON.parse(e.target.value) : null)}
              >
                <option value="">Guruh tanlang...</option>
                {groups.map(g => (
                  <option key={g._id} value={JSON.stringify(g)}>
                    {g.groupName}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none top-7">
                <FaUsers className="text-gray-400" />
              </div>
            </div>
          )}

          {/* Price Input */}
          {group && (
            <div className="relative">
              <div className="flex items-center mb-1">
                <FaDollarSign className="text-indigo-500 mr-2" />
                <label className="text-sm font-medium text-gray-700">Fan narxi</label>
              </div>
              <div className="relative">
                <input
                  type="number"
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition"
                  value={price}
                  onChange={(e) => handlePriceChange(index, e.target.value)}
                  placeholder="Fan narxi"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaDollarSign className="text-gray-400" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-xl shadow p-8">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500 mb-4"></div>
        <p className="text-lg text-gray-700">Fan ma'lumotlari yuklanmoqda...</p>
      </div>
    )
  }

  return (
    <div className="mx-auto p-4">
      <ToastContainer />
      
      <div className="text-center mb-2">
        <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
          Asosiy Fanlar
        </h2>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {[0, 1].map(renderSubjectBlock)}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
          <FaExclamationTriangle className="mr-2" />
          {error}
        </div>
      )}

      <div className="flex justify-center mt-8">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition shadow-lg flex items-center disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Biriktirilmoqda...
            </>
          ) : (
            <>
              Fanlarni Biriktirish
              <FaChevronRight className="ml-2" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default SubjectAdd
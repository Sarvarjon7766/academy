import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'

const MainSubjectUpdate = ({ student }) => {
  const [subjects, setSubjects] = useState([])
  const navigate = useNavigate()
  const [main_subject, setMainSubject] = useState([])
  const [selections, setSelections] = useState([
    { subject: null, teachers: [], teacher: null, groups: [], group: null, price: "" },
    { subject: null, teachers: [], teacher: null, groups: [], group: null, price: "" },
  ])
  const [error, setError] = useState(null)
  const [loadingSubjects, setLoadingSubjects] = useState(false)
  const [loadingStudentSubjects, setLoadingStudentSubjects] = useState(false)

  // Fetch all subjects once
  useEffect(() => {
    const fetchSubjects = async () => {
      setLoadingSubjects(true)
      try {
        const res = await axios.get("http://localhost:4000/api/subject/getAll")
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
        const res = await axios.get(`http://localhost:4000/api/student/main-subject/${student._id}`)
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
      const res = await axios.get(`http://localhost:4000/api/teacher/subject/${subjectId}`)
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
      const res = await axios.get(`http://localhost:4000/api/group/groups/${teacherId}/${subjectId}`)
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
      const res = await axios.put(
        `http://localhost:4000/api/student/update-main/${student._id}`,
        { newsubjects: selectedData, oldsubjects: main_subject },
        { headers: { "Content-Type": "application/json" } }
      )
      if (res.data.success) {
        navigate('/register/student-list',
          {
            state: {
              student: res.data.student
            },
          }
        )
      }
    } catch (err) {
      console.error("Xatolik:", err)
      setError("Ma'lumotlarni yuborishda xatolik yuz berdi.")
    }
  }

  const renderSubjectBlock = (index) => {
    const { subject, teachers, teacher, groups, group, price } = selections[index]

    return (
      <div className="p-4 rounded shadow border" key={index}>
        <h3 className="font-semibold text-indigo-700 mb-2">Fan {index + 1}</h3>

        <select
          className="border outline-indigo-700 p-2 w-full mb-2"
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

        {subject && (
          <>
            <h3 className="font-semibold text-indigo-700 mb-2">O'qituvchini tanlang</h3>
            <select
              className="border outline-indigo-700 p-2 w-full mb-2"
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
          </>
        )}

        {subject && teacher && (
          <>
            <h3 className="font-semibold text-indigo-700 mb-2">Guruhni tanlang</h3>
            <select
              className="border outline-indigo-700 p-2 w-full mb-2"
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
          </>
        )}

        {group && (
          <>
            <h3 className="font-semibold text-indigo-700 mb-2">Fan narxi</h3>
            <input
              type="number"
              className="border outline-indigo-700 p-2 w-full mb-2"
              value={price}
              onChange={(e) => handlePriceChange(index, e.target.value)}
              placeholder="Fan narxi"
            />
          </>
        )}
      </div>
    )
  }

  if (loadingSubjects || loadingStudentSubjects) {
    return <div className="text-center p-4">Yuklanmoqda...</div>
  }

  return (
    <div className="mx-auto p-6 sm:p-8 rounded-xl max-w-4xl">
      <h2 className="text-2xl sm:text-3xl text-center text-indigo-800 font-extrabold mb-6">
        {student.fullName}ning asosiy fanlarni yangilash
      </h2>

      {error && <div className="text-red-600 text-center mb-4">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[0, 1].map(renderSubjectBlock)}
      </div>

      <button
        onClick={handleSubmit}
        className="bg-indigo-600 text-white px-6 py-2 my-4 rounded hover:bg-indigo-700 w-full md:w-auto"
      >
        Biriktirish
      </button>
    </div>
  )
}

export default MainSubjectUpdate

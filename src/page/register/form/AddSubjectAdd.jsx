import axios from 'axios'
import { useEffect, useState } from 'react'

const MAX_SUBJECTS = 3

const AddSubjectAdd = ({ studentId, onclick }) => {
    const [subjects, setSubjects] = useState([])
    const [error, setError] = useState(null)
    const [formData, setFormData] = useState(
        Array(MAX_SUBJECTS).fill().map(() => ({
            subject: null,
            teacher: null,
            group: null,
            teachers: [],
            groups: [],
            price: ''
        }))
    )
    const [sundayRegistration, setSundayRegistration] = useState(false)

    // Fetch all allowed subjects
    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/subject/getAll`)
                const allowedSubjects = ["Matematika", "Tarix", "Ona tili"]
                const filteredSubjects = res.data.subject.filter(sub =>allowedSubjects.includes(sub.subjectName))
                setSubjects(filteredSubjects)
            } catch {
                setError("Fanlarni yuklab bo'lmadi!")
            }
        }
        fetchSubjects()
    }, [])

    // Fetch student's current additional subjects and preload form
    useEffect(() => {
        const fetchStudentSubject = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/student/additional-subject/${studentId}`)
                if (res.data.success && Array.isArray(res.data.additionalSub)) {
                    const additionalSub = res.data.additionalSub

                    const updatedForm = await Promise.all(
                        additionalSub.slice(0, MAX_SUBJECTS).map(async (sub) => {
                            let teachers = []
                            let groups = []
                            try {
                                const teacherRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/teacher/subject/${sub._id}`)
                                teachers = teacherRes.data.teachers || []
                            } catch {
                                console.error("O'qituvchilarni olishda xatolik")
                            }

                            try {
                                const groupRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/group/groups/${sub.teacher._id}/${sub._id}`)
                                groups = groupRes.data.groups || []
                            } catch {
                                console.error("Guruhlarni olishda xatolik")
                            }

                            const matchedSubject = {
                                _id: sub._id,
                                subjectName: sub.subjectName,
                                additionalPrice: sub.additionalPrice
                            }

                            return {
                                subject: matchedSubject,
                                teacher: sub.teacher,
                                group: sub.group,
                                teachers,
                                groups,
                                price: sub.price || sub.additionalPrice || ''
                            }
                        })
                    )

                    // Fill remaining empty blocks if less than MAX_SUBJECTS
                    while (updatedForm.length < MAX_SUBJECTS) {
                        updatedForm.push({
                            subject: null,
                            teacher: null,
                            group: null,
                            teachers: [],
                            groups: [],
                            price: ''
                        })
                    }

                    setFormData(updatedForm)
                }
            } catch (error) {
                console.error(error)
                setError("Fanlarni yuklab bo'lmadi!")
            }
        }
        fetchStudentSubject()
    }, [studentId])

    const handleChange = async (index, type, value) => {
        const newFormData = [...formData]

        // If subject, teacher or group is null, clear the block
        if (value === null || value === "") {
            newFormData[index] = {
                subject: null,
                teacher: null,
                group: null,
                teachers: [],
                groups: [],
                price: ''
            }
            setFormData(newFormData)
            return
        }

        newFormData[index] = {
            ...newFormData[index],
            [type]: value,
        }

        if (type === "subject") {
            newFormData[index].teacher = null
            newFormData[index].group = null
            newFormData[index].price = value.additionalPrice || ''
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/teacher/subject/${value._id}`)
                newFormData[index].teachers = res.data.teachers || []
            } catch {
                setError("O'qituvchilarni yuklab bo'lmadi!")
            }
        }

        if (type === "teacher") {
            newFormData[index].group = null
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/group/groups/${value._id}/${newFormData[index].subject._id}`)
                newFormData[index].groups = res.data.groups || []
            } catch {
                setError("Guruhlarni yuklab bo'lmadi!")
            }
        }

        setFormData(newFormData)
    }

    const handlePriceChange = (index, value) => {
        const newFormData = [...formData]
        newFormData[index].price = value
        setFormData(newFormData)
    }

    const handleSundayChange = (e) => {
        setSundayRegistration(e.target.checked)
    }

    const handleSubmit = async () => {
        const validSubjects = formData
            .filter(entry => entry.subject && entry.teacher && entry.group)
            .map(entry => ({
                subjectId: entry.subject._id,
                teacherId: entry.teacher._id,
                groupId: entry.group._id,
                price: Number(entry.price) || 0
            }))

        if (validSubjects.length === 0 && !sundayRegistration) {
            setError("Kamida bitta fan, o'qituvchi va guruh tanlang yoki Yakshanba uchun belgilang.")
            return
        }

        try {
            setError(null)
            const payload = sundayRegistration
                ? { sunday: true }
                : { subjects: validSubjects, sunday: false }

            const res = await axios.put(
                `${import.meta.env.VITE_API_URL}/api/student/add-addition/${studentId}`,
                payload,
                { headers: { "Content-Type": "application/json" } }
            )

            if (res.data.success) {
                onclick()
            }
        } catch (err) {
            console.error("Xatolik:", err)
            setError("Ma'lumotlarni yuborishda xatolik yuz berdi.")
        }
    }

    const renderSubjectBlock = (index) => {
        const entry = formData[index]

        return (
            <div key={index} className="p-4 rounded shadow border">
                <h3 className="font-semibold text-indigo-700 mb-2">Fan {index + 1}</h3>
                <select
                    className="border outline-indigo-700 p-2 w-full mb-2"
                    value={entry.subject ? JSON.stringify(entry.subject) : ""}
                    onChange={(e) => {
                        const subject = e.target.value ? JSON.parse(e.target.value) : null
                        handleChange(index, "subject", subject)
                    }}
                >
                    <option value="">Fan tanlang</option>
                    {subjects
                        .filter(sub => !formData.some((fd, i) => i !== index && fd.subject?._id === sub._id))
                        .map((subj) => (
                            <option key={subj._id} value={JSON.stringify(subj)}>
                                {subj.subjectName}
                            </option>
                        ))}
                </select>

                {entry.subject && entry.teachers?.length > 0 && (
                    <>
                        <h3 className="font-semibold text-indigo-700 mb-2">O'qituvchini tanlang</h3>
                        <select
                            className="border outline-indigo-700 p-2 w-full mb-2"
                            value={entry.teacher ? JSON.stringify(entry.teacher) : ""}
                            onChange={(e) => {
                                const teacher = e.target.value ? JSON.parse(e.target.value) : null
                                handleChange(index, "teacher", teacher)
                            }}
                        >
                            <option value="">O'qituvchi tanlang</option>
                            {entry.teachers.map(teacher => (
                                <option key={teacher._id} value={JSON.stringify(teacher)}>
                                    {teacher.fullName}
                                </option>
                            ))}
                        </select>
                    </>
                )}

                {entry.teacher && entry.groups?.length > 0 && (
                    <>
                        <h3 className="font-semibold text-indigo-700 mb-2">Guruhni tanlang</h3>
                        <select
                            className="border outline-indigo-700 p-2 w-full mb-2"
                            value={entry.group ? JSON.stringify(entry.group) : ""}
                            onChange={(e) => {
                                const group = e.target.value ? JSON.parse(e.target.value) : null
                                handleChange(index, "group", group)
                            }}
                        >
                            <option value="">Guruh tanlang</option>
                            {entry.groups.map(group => (
                                <option key={group._id} value={JSON.stringify(group)}>
                                    {group.groupName}
                                </option>
                            ))}
                        </select>
                    </>
                )}

                {entry.group && (
                    <>
                        <h3 className="font-semibold text-indigo-700 mb-2">Qo'shimcha narx</h3>
                        <input
                            type="number"
                            className="border outline-indigo-700 p-2 w-full mb-2"
                            value={entry.price}
                            onChange={(e) => handlePriceChange(index, e.target.value)}
                            placeholder="Qo'shimcha narx"
                        />
                    </>
                )}
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-md">
            <h2 className="text-2xl sm:text-3xl text-center text-indigo-800 font-extrabold mb-6">
                📖 Qo'shimcha fanlarni biriktirish
            </h2>

            {error && <div className="text-red-600 text-center mb-4">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Array.from({ length: MAX_SUBJECTS }).map((_, idx) => renderSubjectBlock(idx))}
            </div>

            <div className="mt-6 p-4 rounded border bg-gray-50">
                <h3 className="font-semibold text-indigo-700 mb-2">Yakshanba uchun ro'yxatga olish</h3>
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={sundayRegistration}
                        onChange={handleSundayChange}
                        className="mr-2"
                    />
                    <label>Yakshanba uchun ro'yxatdan o'tkazish</label>
                </div>
            </div>

            <button
                onClick={handleSubmit}
                className="bg-indigo-600 text-white px-6 py-2 my-6 rounded hover:bg-indigo-700 w-full"
            >
                Biriktirish
            </button>
        </div>
    )
}

export default AddSubjectAdd
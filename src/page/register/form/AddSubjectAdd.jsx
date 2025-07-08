import axios from 'axios'
import { useEffect, useState } from 'react'
import { FaBook, FaChalkboardTeacher, FaUsers, FaDollarSign, FaCalendarDay, FaCheck, FaExclamationTriangle } from 'react-icons/fa'

const MAX_SUBJECTS = 3

const AddSubjectAdd = ({ studentId, onclick }) => {
    const [subjects, setSubjects] = useState([])
    const [isLoading, setIsLoading] = useState(true)
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
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Fetch all allowed subjects
    useEffect(() => {
        const fetchSubjects = async () => {
            setIsLoading(true)
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/subject/getAll`)
                const allowedSubjects = ["Matematika", "Tarix", "Ona tili"]
                const filteredSubjects = res.data.subject.filter(sub => allowedSubjects.includes(sub.subjectName))
                setSubjects(filteredSubjects)
            } catch {
                setError("Fanlarni yuklab bo'lmadi!")
            } finally {
                setIsLoading(false)
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
                            
                            if (sub && sub._id) {
                                try {
                                    const teacherRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/teacher/subject/${sub._id}`)
                                    teachers = teacherRes.data.teachers || []
                                } catch {
                                    console.error("O'qituvchilarni olishda xatolik")
                                }

                                try {
                                    if (sub.teacher?._id) {
                                        const groupRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/group/groups/${sub.teacher._id}/${sub._id}`)
                                        groups = groupRes.data.groups || []
                                    }
                                } catch {
                                    console.error("Guruhlarni olishda xatolik")
                                }
                            }

                            const matchedSubject = subjects.find(s => s._id === sub?._id) || {
                                _id: sub?._id,
                                subjectName: sub?.subjectName,
                                additionalPrice: sub?.additionalPrice
                            }

                            return {
                                subject: matchedSubject,
                                teacher: sub?.teacher || null,
                                group: sub?.group || null,
                                teachers,
                                groups,
                                price: sub?.price || matchedSubject?.additionalPrice || ''
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
        
        if (studentId) {
            fetchStudentSubject()
        }
    }, [studentId, subjects])

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
        setIsSubmitting(true)
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
            setIsSubmitting(false)
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
        } finally {
            setIsSubmitting(false)
        }
    }

    const renderSubjectBlock = (index) => {
        const entry = formData[index]

        return (
            <div key={index} className="bg-gradient-to-br from-white to-indigo-50 rounded-xl shadow-lg p-6 border border-indigo-100 transition-all duration-300 hover:shadow-xl">
                <div className="flex items-center mb-4">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                        <span className="text-indigo-600 font-bold">{index + 1}</span>
                    </div>
                    <h3 className="text-xl font-bold text-indigo-800">Qo'shimcha Fan {index + 1}</h3>
                </div>
                
                <div className="space-y-4">
                    {/* Fan tanlash */}
                    <div className="relative">
                        <div className="flex items-center mb-1">
                            <FaBook className="text-indigo-500 mr-2" />
                            <label className="text-sm font-medium text-gray-700">Fan tanlang</label>
                        </div>
                        <select
                            className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition appearance-none bg-white"
                            value={entry.subject ? JSON.stringify(entry.subject) : ""}
                            onChange={(e) => {
                                const subject = e.target.value ? JSON.parse(e.target.value) : null
                                handleChange(index, "subject", subject)
                            }}
                            disabled={isLoading}
                        >
                            <option value="">Fan tanlang...</option>
                            {subjects
                                .filter(sub => !formData.some((fd, i) => i !== index && fd.subject?._id === sub._id))
                                .map((subj) => (
                                    <option key={subj._id} value={JSON.stringify(subj)}>
                                        {subj.subjectName}
                                    </option>
                                ))}
                        </select>
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none top-7">
                            <FaBook className="text-gray-400" />
                        </div>
                    </div>

                    {/* O'qituvchi tanlash */}
                    {entry.subject && entry.teachers?.length > 0 && (
                        <div className="relative">
                            <div className="flex items-center mb-1">
                                <FaChalkboardTeacher className="text-indigo-500 mr-2" />
                                <label className="text-sm font-medium text-gray-700">O'qituvchi tanlang</label>
                            </div>
                            <select
                                className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition appearance-none bg-white"
                                value={entry.teacher ? JSON.stringify(entry.teacher) : ""}
                                onChange={(e) => {
                                    const teacher = e.target.value ? JSON.parse(e.target.value) : null
                                    handleChange(index, "teacher", teacher)
                                }}
                                disabled={isLoading}
                            >
                                <option value="">O'qituvchi tanlang...</option>
                                {entry.teachers.map(teacher => (
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

                    {/* Guruh tanlash */}
                    {entry.teacher && entry.groups?.length > 0 && (
                        <div className="relative">
                            <div className="flex items-center mb-1">
                                <FaUsers className="text-indigo-500 mr-2" />
                                <label className="text-sm font-medium text-gray-700">Guruh tanlang</label>
                            </div>
                            <select
                                className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition appearance-none bg-white"
                                value={entry.group ? JSON.stringify(entry.group) : ""}
                                onChange={(e) => {
                                    const group = e.target.value ? JSON.parse(e.target.value) : null
                                    handleChange(index, "group", group)
                                }}
                                disabled={isLoading}
                            >
                                <option value="">Guruh tanlang...</option>
                                {entry.groups.map(group => (
                                    <option key={group._id} value={JSON.stringify(group)}>
                                        {group.groupName}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none top-7">
                                <FaUsers className="text-gray-400" />
                            </div>
                        </div>
                    )}

                    {/* Narx kiritish */}
                    {entry.group && (
                        <div className="relative">
                            <div className="flex items-center mb-1">
                                <FaDollarSign className="text-indigo-500 mr-2" />
                                <label className="text-sm font-medium text-gray-700">Qo'shimcha narx</label>
                            </div>
                            <div className="relative">
                                <input
                                    type="number"
                                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition"
                                    value={entry.price}
                                    onChange={(e) => handlePriceChange(index, e.target.value)}
                                    placeholder="Qo'shimcha narx"
                                    disabled={isLoading}
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

    return (
        <div className="max-w-6xl mx-auto p-4">
            <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                    Qo'shimcha Fanlarni Biriktirish
                </h2>
                <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
                    Talaba uchun qo'shimcha fanlarni, o'qituvchilarni va guruhlarni tanlang
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {Array.from({ length: MAX_SUBJECTS }).map((_, idx) => renderSubjectBlock(idx))}
            </div>

            <div className="mt-6 p-6 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100">
                <h3 className="font-semibold text-indigo-800 text-lg mb-3 flex items-center">
                    <FaCalendarDay className="mr-2 text-indigo-600" />
                    Yakshanba uchun ro'yxatga olish
                </h3>
                <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={sundayRegistration}
                            onChange={handleSundayChange}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        <span className="ml-3 text-gray-700">Yakshanba uchun ro'yxatdan o'tkazish</span>
                    </label>
                </div>
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
                    disabled={isSubmitting || isLoading}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition shadow-lg flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
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
                            <FaCheck className="mr-2" />
                            Fanlarni Biriktirish
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}

export default AddSubjectAdd
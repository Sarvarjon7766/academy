import axios from 'axios'
import { useEffect, useState } from 'react'

const SubjectAdd = ({ teacherId, onSuccess }) => {
	const [subjects, setSubjects] = useState([])
	const [selectedSubjects, setSelectedSubjects] = useState([])
	const [error, setError] = useState(null)

	useEffect(() => {
		const checkTeacher = async () => {
			try {
				const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/teacher/check-subject/${teacherId}`)
				if (res.data.success && res.data.subjects.length !== 0) {
					const selectedIds = res.data.subjects.map(sub => sub._id)
					setSelectedSubjects(selectedIds) // faqat _id lar ro'yxati
				}
			} catch (error) {
				setError("O'qituvchini yuklab bo‘lmadi!")
			}
		}

		const fetchSubjects = async () => {
			try {
				const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/subject/getAll`)
				setSubjects(res.data.subject)
			} catch {
				setError("Fanlarni yuklab bo‘lmadi!")
			}
		}

		checkTeacher()
		fetchSubjects()
	}, [teacherId])


	// 🎯 Fan tanlashni boshqarish
	const toggleSubject = (id) => {
		setSelectedSubjects(prev =>
			prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
		)
	}

	// ✅ Saqlash tugmasi bosilganda
	const handleSave = async () => {
		try {
			const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/teacher/add-subjects`, {
				teacherId,
				subjectIds: selectedSubjects,
			})
			if (onSuccess && res.data.success) onSuccess()
		} catch (err) {
			setError("Fanlarni saqlab bo‘lmadi!")
		}
	}

	return (
		<div className="p-6 border rounded-xl shadow-lg bg-white">
			<h2 className="text-2xl font-bold text-indigo-700 mb-4">📚 O‘qituvchiga Fan Biriktirish</h2>
			{error && <p className="text-red-500 mb-3">{error}</p>}

			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
				{subjects.map((subject) => {
					const isSelected = selectedSubjects.includes(subject._id)
					return (
						<button
							key={subject._id}
							onClick={() => toggleSubject(subject._id)}
							className={`px-4 py-2 rounded-xl border text-sm font-medium transition duration-200
								${isSelected
									? 'bg-indigo-600 text-white border-indigo-700'
									: 'bg-gray-100 text-gray-800 hover:bg-indigo-100 border-gray-300'
								}`}
						>
							{subject.subjectName}
						</button>
					)
				})}
			</div>

			<button
				onClick={handleSave}
				className="bg-indigo-700 text-white px-6 py-2 rounded-lg hover:bg-indigo-800 transition"
			>
				✅ Saqlash
			</button>
		</div>
	)
}

export default SubjectAdd

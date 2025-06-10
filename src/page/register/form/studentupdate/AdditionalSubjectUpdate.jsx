import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const MAX_SUBJECTS = 3

const AdditionalSubjectUpdate = ({ student }) => {
	const navigate = useNavigate()
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
	const studentId = student._id

	useEffect(() => {
		const loadInitialData = async () => {
			try {
				// Fetch subjects
				const subjectRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/subject/getAll`)
				const allowed = ["Matematika", "Tarix", "Ona tili"]
				const filtered = subjectRes.data.subject.filter(s => allowed.includes(s.subjectName))
				setSubjects(filtered)

				// Fetch student's current subjects
				const studentRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/student/additional-subject/${studentId}`)
				if (studentRes.data.success && Array.isArray(studentRes.data.additionalSub)) {
					const additionalSub = studentRes.data.additionalSub
					const updatedForm = await Promise.all(
						additionalSub.slice(0, MAX_SUBJECTS).map(async (sub) => {
							let teachers = []
							let groups = []
							try {
								const tRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/teacher/subject/${sub._id}`)
								teachers = tRes.data.teachers || []
								const gRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/group/groups/${sub.teacher._id}/${sub._id}`)
								groups = gRes.data.groups || []
							} catch (err) {
								console.error("Teacher or group fetch error", err)
							}
							return {
								subject: {
									_id: sub._id,
									subjectName: sub.subjectName,
									additionalPrice: sub.additionalPrice
								},
								teacher: sub.teacher,
								group: sub.group,
								teachers,
								groups,
								price: sub.price || sub.additionalPrice || ''
							}
						})
					)

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
			} catch (err) {
				console.error(err)
				setError("Ma'lumotlarni yuklashda xatolik yuz berdi.")
			}
		}
		loadInitialData()
	}, [studentId])

	const handleChange = async (index, type, value) => {
		const newForm = [...formData]
		newForm[index][type] = value

		try {
			if (type === "subject") {
				newForm[index].teacher = null
				newForm[index].group = null
				newForm[index].price = value?.additionalPrice || ''
				const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/teacher/subject/${value._id}`)
				newForm[index].teachers = res.data.teachers || []
				newForm[index].groups = []
			}
			if (type === "teacher") {
				newForm[index].group = null
				const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/group/groups/${value._id}/${newForm[index].subject._id}`)
				newForm[index].groups = res.data.groups || []
			}
		} catch (err) {
			setError("Ma'lumotlarni yuklashda xatolik.")
			console.error(err)
		}

		setFormData(newForm)
	}

	const handlePriceChange = (index, value) => {
		const newForm = [...formData]
		newForm[index].price = value
		setFormData(newForm)
	}

	const handleSubmit = async () => {
		const valid = formData
			.filter(f => f.subject && f.teacher && f.group)
			.map(f => ({
				subjectId: f.subject._id,
				teacherId: f.teacher._id,
				groupId: f.group._id,
				price: Number(f.price) || 0
			}))

		if (valid.length === 0 && !sundayRegistration) {
			setError("Kamida bitta fan, o'qituvchi va guruh tanlang yoki Yakshanba uchun belgilang.")
			return
		}

		try {
			const payload = sundayRegistration
				? { sunday: true }
				: { subjects: valid, sunday: false }

			const res = await axios.put(
				`${import.meta.env.VITE_API_URL}/api/student/update-addition/${studentId}`,
				payload,
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
			setError("Yuborishda xatolik yuz berdi.")
			console.error(err)
		}
	}

	const renderSubjectBlock = (index) => {
		const entry = formData[index]
		return (
			<div key={index} className="p-4 border rounded shadow">
				<h3 className="text-indigo-700 font-semibold mb-2">Fan {index + 1}</h3>

				<select
					className="w-full p-2 border mb-2"
					value={entry.subject?._id || ""}
					onChange={e => {
						const sub = subjects.find(s => s._id === e.target.value)
						handleChange(index, "subject", sub || null)
					}}
				>
					<option value="">Fan tanlang</option>
					{subjects
						.filter(sub => !formData.some((f, i) => i !== index && f.subject?._id === sub._id))
						.map(sub => (
							<option key={sub._id} value={sub._id}>{sub.subjectName}</option>
						))}
				</select>

				{entry.teachers.length > 0 && (
					<>
						<h3 className="text-indigo-700 font-semibold mb-2">O'qituvchi</h3>
						<select
							className="w-full p-2 border mb-2"
							value={entry.teacher?._id || ""}
							onChange={e => {
								const teacher = entry.teachers.find(t => t._id === e.target.value)
								handleChange(index, "teacher", teacher || null)
							}}
						>
							<option value="">O'qituvchi tanlang</option>
							{entry.teachers.map(t => (
								<option key={t._id} value={t._id}>{t.fullName}</option>
							))}
						</select>
					</>
				)}

				{entry.groups.length > 0 && (
					<>
						<h3 className="text-indigo-700 font-semibold mb-2">Guruh</h3>
						<select
							className="w-full p-2 border mb-2"
							value={entry.group?._id || ""}
							onChange={e => {
								const group = entry.groups.find(g => g._id === e.target.value)
								handleChange(index, "group", group || null)
							}}
						>
							<option value="">Guruh tanlang</option>
							{entry.groups.map(g => (
								<option key={g._id} value={g._id}>{g.groupName}</option>
							))}
						</select>
					</>
				)}

				{entry.group && (
					<>
						<h3 className="text-indigo-700 font-semibold mb-2">Qo'shimcha narx</h3>
						<input
							type="number"
							className="w-full p-2 border"
							value={entry.price}
							onChange={e => handlePriceChange(index, e.target.value)}
						/>
					</>
				)}
			</div>
		)
	}

	return (
		<div className="max-w-6xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-md">
			<h2 className="text-2xl sm:text-3xl text-center text-indigo-800 font-extrabold mb-6">
				{student.fullName}ning qo'shimcha fanlarini yangilash
			</h2>

			{error && <div className="text-red-600 text-center mb-4">{error}</div>}

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{formData.map((_, i) => renderSubjectBlock(i))}
			</div>

			<div className="mt-6 flex items-center gap-4">
				<input type="checkbox" checked={sundayRegistration} onChange={(e) => setSundayRegistration(e.target.checked)} />
				<label>Faqat yakshanba uchun yoziladi</label>
			</div>

			<div className="mt-6 text-center">
				<button onClick={handleSubmit} className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">
					Yuborish
				</button>
			</div>
		</div>
	)
}

export default AdditionalSubjectUpdate

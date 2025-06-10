import axios from 'axios'
import { useEffect, useState } from 'react'

const ALLOWED_SUBJECTS = ["Matematika", "Tarix", "Ona tili"]

const SubjectAdd = ({ studentId, onclick }) => {
	const [subjects, setSubjects] = useState([])
	const [selections, setSelections] = useState([
		{ subject: null, teachers: [], teacher: null, groups: [], group: null, price: '' },
		{ subject: null, teachers: [], teacher: null, groups: [], group: null, price: '' }
	])
	const [error, setError] = useState(null)

	useEffect(() => {
		const fetchStudentSubject = async () => {
			try {
				const res = await axios.get(`http://localhost:4000/api/student/main-subject/${studentId}`)
				if (res.data.success) {
					const subjects = res.data.data.main_subjects

					if (!subjects || subjects.length === 0) {
						setSelections([
							{ subject: null, teachers: [], teacher: null, groups: [], group: null, price: '' },
							{ subject: null, teachers: [], teacher: null, groups: [], group: null, price: '' }
						])
						return
					}

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
			} catch (error) {
				console.error(error)
				setError("Fanlarni yuklab bo'lmadi!")
			}
		}
		fetchStudentSubject()
	}, [studentId])

	useEffect(() => {
		const fetchSubjects = async () => {
			try {
				const res = await axios.get("http://localhost:4000/api/subject/getAll")
				const subject = res.data.subject
				setSubjects(subject)
			} catch {
				setError("Fanlarni yuklab bo'lmadi!")
			}
		}
		fetchSubjects()
	}, [])

	const handleSubjectChange = async (index, subject) => {
		const updated = [...selections]
		updated[index].subject = subject
		updated[index].teacher = null
		updated[index].group = null
		updated[index].groups = []
		updated[index].price = subject?.mainPrice || ''

		if (subject) {
			try {
				const res = await axios.get(`http://localhost:4000/api/teacher/subject/${subject._id}`)
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
				const res = await axios.get(`http://localhost:4000/api/group/groups/${teacher._id}/${updated[index].subject._id}`)
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
		// Update price when group is selected (in case it wasn't set earlier)
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
		const selectedData = selections
			.filter(s => s.subject && s.teacher && s.group)
			.map(s => ({
				subjectId: s.subject._id,
				teacherId: s.teacher._id,
				groupId: s.group._id,
				price: s.price
			}))
		console.log(selectedData)

		if (selectedData.length === 0) {
			setError("Iltimos, kamida bitta fanga guruh va o'qituvchi tanlang.")
			return
		}

		try {
			setError(null)
			const res = await axios.put(
				`http://localhost:4000/api/student/add-main/${studentId}`,
				{ subjects: selectedData },
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
		const {
			subject,
			teachers,
			teacher,
			groups,
			group,
			price
		} = selections[index]

		return (
			<div className="p-4 rounded shadow border" key={index}>
				<h3 className="font-semibold text-indigo-700 mb-2">Fan {index + 1}</h3>

				<select
					className="border outline-indigo-700 p-2 w-full mb-2"
					value={subject ? JSON.stringify(subject) : ""}
					onChange={(e) => handleSubjectChange(index, e.target.value ? JSON.parse(e.target.value) : null)}
				>
					<option value="">Fan tanlang</option>
					{subjects
						.filter(sub => index === 0 || sub._id !== selections[0].subject?._id)
						.map(sub => (
							<option key={sub._id} value={JSON.stringify(sub)}>
								{sub.subjectName}
							</option>
						))}
				</select>

				{subject && (
					<>
						<h3 className="font-semibold text-indigo-700 mb-2">O'qituvchini tanlang</h3>
						<select
							className="border outline-indigo-700 p-2 w-full mb-2"
							value={teacher ? JSON.stringify(teacher) : ""}
							onChange={(e) => handleTeacherChange(index, e.target.value ? JSON.parse(e.target.value) : null)}
						>
							<option value="">O'qituvchi tanlang</option>
							{teachers.map(teacher => (
								<option key={teacher._id} value={JSON.stringify(teacher)}>
									{teacher.fullName}
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
							value={group ? JSON.stringify(group) : ""}
							onChange={(e) => handleGroupChange(index, e.target.value ? JSON.parse(e.target.value) : null)}
						>
							<option value="">Guruh tanlang</option>
							{groups.map(g => (
								<option key={g._id} value={JSON.stringify(g)}>
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

	return (
		<div className="mx-autop-6 sm:p-8 rounded-xl">
			<h2 className="text-2xl sm:text-3xl text-center text-indigo-800 font-extrabold mb-6">
				📖 Fanlarni biriktirish
			</h2>

			{error && (
				<div className="text-red-600 text-center mb-4">
					{error}
				</div>
			)}

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{[0, 1].map(renderSubjectBlock)}
			</div>

			<button
				onClick={handleSubmit}
				className="bg-indigo-600 text-white px-6 py-2 my-4 rounded hover:bg-indigo-700"
			>
				Biriktirish
			</button>
		</div>
	)
}

export default SubjectAdd
import axios from 'axios'
import { useEffect, useState, useCallback, useMemo } from 'react'
import { FaBook, FaChalkboardTeacher, FaUsers, FaDownload } from 'react-icons/fa'
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

	const fetchTeachers = useCallback(async () => {
		try {
			const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/teacher/getAll`)
			if (res.data.success) setTeachers(res.data.teachers)
		} catch (error) {
			console.error("O'qituvchilarni olishda xatolik:", error)
			toast.error("O'qituvchilarni olishda xatolik!")
		}
	}, [])

	const fetchAttendanceData = useCallback(async () => {
		try {
			setLoading(true)
			const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/teacher-attandance/getAll`)
			if (res.data.success) setAttendanceData(res.data.data)
		} catch (error) {
			console.error("Davomat ma'lumotlarini olishda xatolik:", error)
			toast.error("Davomat ma'lumotlarini olishda xatolik!")
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		fetchTeachers()
		fetchAttendanceData()
	}, [fetchTeachers, fetchAttendanceData])

	const handleTeacherChange = (e) => {
		const teacherId = e.target.value
		setSelectedTeacher(teacherId)
		setSelectedSubject('')
		setSelectedGroup('')
		setGroups([])

		const foundTeacher = teachers.find(t => t._id === teacherId)
		setSubjects(foundTeacher?.subjects || [])
	}

	const handleSubjectChange = async (e) => {
		const subjectId = e.target.value
		setSelectedSubject(subjectId)
		setSelectedGroup('')

		try {
			const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/group/get-techer-group`, {
				params: { subjectId, teacherId: selectedTeacher }
			})
			if (res.data.success) setGroups(res.data.groups)
		} catch (error) {
			console.error("Guruhlarni olishda xatolik:", error)
			toast.error("Guruhlarni olishda xatolik!")
		}
	}

	const handleSubmit = async () => {
		try {
			const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/teacher-attandance/attandanceAdd`, {
				teacher: selectedTeacher,
				subject: selectedSubject,
				group: selectedGroup
			})
			if (res.data.success) {
				toast.success(res.data.data?.message || "✅ Davomat qo‘shildi!")
				await fetchAttendanceData()
				setSelectedTeacher('')
				setSelectedSubject('')
				setSelectedGroup('')
				setSubjects([])
				setGroups([])
			} else {
				toast.warn(res.data.message || "⚠️ Bugun uchun davomat allaqachon mavjud.")
			}
		} catch (error) {
			console.error("Davomatni yuborishda xatolik:", error)
			toast.error("❌ Davomatni yuborishda xatolik!")
		}
	}

	const exportToExcel = () => {
		const worksheetData = attendanceData.map((item, index) => ({
			'#': index + 1,
			'Ism Familya': item.teacher?.fullName || '',
			'Fan': item.subject?.subjectName || '',
			'Guruh': item.group?.groupName || '',
			'Sana': formatDate(item.date)
		}))
		const worksheet = XLSX.utils.json_to_sheet(worksheetData)
		const workbook = XLSX.utils.book_new()
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Davomat')

		XLSX.writeFile(workbook, 'teacher_attendance.xlsx')
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

	return (
		<div className="mx-auto p-6 mt-10 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-2xl">
			<h2 className="text-2xl text-center font-bold text-indigo-600 mb-8">📊 O'qituvchi Davomati</h2>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
				{/* O'qituvchi */}
				<div>
					<label className="font-semibold text-gray-700 mb-1 flex items-center gap-2">
						<FaChalkboardTeacher className="text-indigo-500" /> O‘qituvchi:
					</label>
					<select value={selectedTeacher} onChange={handleTeacherChange} className="w-full px-4 py-2 mt-1 rounded-xl border border-indigo-300 focus:ring-2 focus:ring-indigo-400">
						<option value="">-- Tanlang --</option>
						{teachers.map(teacher => (
							<option key={teacher._id} value={teacher._id}>{teacher.fullName}</option>
						))}
					</select>
				</div>

				{/* Fan */}
				<div>
					<label className="font-semibold text-gray-700 mb-1 flex items-center gap-2">
						<FaBook className="text-indigo-500" /> Fan:
					</label>
					<select value={selectedSubject} onChange={handleSubjectChange} className="w-full px-4 py-2 mt-1 rounded-xl border border-indigo-300 focus:ring-2 focus:ring-indigo-400">
						<option value="">-- Tanlang --</option>
						{subjects.map(subject => (
							<option key={subject._id} value={subject._id}>{subject.subjectName}</option>
						))}
					</select>
				</div>

				{/* Guruh */}
				<div>
					<label className="font-semibold text-gray-700 mb-1 flex items-center gap-2">
						<FaUsers className="text-indigo-500" /> Guruh:
					</label>
					<select value={selectedGroup} onChange={e => setSelectedGroup(e.target.value)} className="w-full px-4 py-2 mt-1 rounded-xl border border-indigo-300 focus:ring-2 focus:ring-indigo-400">
						<option value="">-- Tanlang --</option>
						{groups.map(group => (
							<option key={group._id} value={group._id}>{group.groupName}</option>
						))}
					</select>
				</div>
			</div>

			{/* Submit Button */}
			{isSubmitEnabled && (
				<button onClick={handleSubmit} className="w-full lg:w-1/3 mx-auto block bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 rounded-xl transition mb-6">
					Davomatni yuborish
				</button>
			)}

			{/* Export Button */}
			<div className="text-right mb-4">
				<button onClick={exportToExcel} className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-xl shadow transition">
					<FaDownload /> Excelga yuklab olish
				</button>
			</div>

			{/* Attendance Table */}
			<div className="overflow-x-auto">
				<h3 className="text-xl font-bold text-gray-700 mb-4">📅 Davomat Jadvali</h3>
				<table className="w-full table-auto border-collapse shadow-md rounded-xl overflow-hidden">
					<thead className="bg-indigo-200 text-indigo-900">
						<tr>
							<th className="px-4 py-2 text-left">#</th>
							<th className="px-4 py-2 text-left">Ism Familya</th>
							<th className="px-4 py-2 text-left">Fan</th>
							<th className="px-4 py-2 text-left">Guruh</th>
							<th className="px-4 py-2 text-left">Sana</th>
						</tr>
					</thead>
					<tbody className="bg-white">
						{loading ? (
							<tr><td className="px-4 py-4 text-center" colSpan={5}>⏳ Yuklanmoqda...</td></tr>
						) : attendanceData.length === 0 ? (
							<tr><td className="px-4 py-4 text-center" colSpan={5}>⚠️ Davomat mavjud emas</td></tr>
						) : (
							attendanceData.map((item, index) => (
								<tr key={index} className="border-t">
									<td className="px-4 py-2">{index + 1}</td>
									<td className="px-4 py-2">{item.teacher?.fullName || "—"}</td>
									<td className="px-4 py-2">{item.subject?.subjectName || "—"}</td>
									<td className="px-4 py-2">{item.group?.groupName || "—"}</td>
									<td className="px-4 py-2">{formatDate(item.date)}</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			<ToastContainer position="top-right" autoClose={3000} />
		</div>
	)
}

export default TeacherAttendance

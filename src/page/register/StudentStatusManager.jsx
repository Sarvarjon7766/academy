import axios from 'axios'
import React, { useEffect, useState } from 'react'

const StudentStatusManager = () => {
	const [students, setStudents] = useState([])
	const [selectedId, setSelectedId] = useState('')
	const [selectedStudent, setSelectedStudent] = useState(null)
	const [comment, setComment] = useState('')

	// Talabalar ro'yxatini olish
	useEffect(() => {
		axios.get(`${import.meta.env.VITE_API_URL}/api/student/getAll`)
			.then(res => setStudents(res.data.students))
			.catch(err => alert("Talabalarni olishda xatolik: " + err.message))
	}, [])

	// Tanlangan talabani topish
	useEffect(() => {
		const student = students.find(s => s._id === selectedId)
		setSelectedStudent(student || null)
	}, [selectedId, students])

	const handleRemove = async () => {
		if (!selectedId) return alert("Iltimos, talabani tanlang!")

		try {
			const res = await axios.patch(`${import.meta.env.VITE_API_URL}/api/student/${selectedId}/status`, {
				status: 'removed',
				comment,
			})
			alert(res.data.message)
			setComment('')
			setSelectedId('')
		} catch (err) {
			alert("Xatolik yuz berdi: " + err?.response?.data?.message || err.message)
		}
	}

	return (
		<div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 py-10 px-4">
			<div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
				{/* Forma */}
				<div className="bg-white p-8 rounded-3xl shadow-2xl border border-blue-100">
					<h2 className="text-3xl font-extrabold text-blue-600 text-center mb-6">🎓 Talabani Safdan Chiqaring</h2>

					<div className="space-y-4">
						<select
							value={selectedId}
							onChange={(e) => setSelectedId(e.target.value)}
							className="w-full p-4 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
						>
							<option value="">Talabani tanlang</option>
							{students.map(student => (
								<option key={student._id} value={student._id}>
									{student.fullName} - {student.login}
								</option>
							))}
						</select>

						<textarea
							placeholder="📝 Izoh (ixtiyoriy)..."
							className="w-full p-4 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
							rows="4"
							value={comment}
							onChange={(e) => setComment(e.target.value)}
						/>

						<button
							onClick={handleRemove}
							className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white text-lg font-bold shadow-md hover:from-blue-600 hover:to-blue-700 transition"
						>
							✅ Safdan chiqarish
						</button>
					</div>
				</div>

				{/* Talaba haqida ma'lumot */}
				{selectedStudent ? (
					<div className="bg-white p-8 rounded-3xl shadow-2xl border border-blue-100">
						<h3 className="text-2xl font-extrabold text-blue-700 text-center mb-6">🧾 Talaba Ma'lumotlari</h3>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
							<div className="space-y-3">
								<p><span className="font-bold">👤 F.I.Sh:</span> {selectedStudent.fullName}</p>
								<p><span className="font-bold">📍 Manzili:</span> {selectedStudent.address}</p>
								<p><span className="font-bold">📞 Telefon:</span> {selectedStudent.phone}</p>
							</div>

							<div className="space-y-3">
								<p><span className="font-bold">🏫 Maktabi:</span> {selectedStudent.old_school}</p>
								<p><span className="font-bold">📚 Sinfi:</span> {selectedStudent.old_class}</p>
								<p><span className="font-bold">🔐 Login:</span> {selectedStudent.login}</p>
								<p><span className="font-bold">📌 Status:</span> <span className={`font-semibold ${selectedStudent.status === 'removed' ? 'text-red-500' : 'text-green-600'}`}>{selectedStudent.status}</span></p>
							</div>
						</div>

						{/* Izoh qismi */}
						{selectedStudent.comment && (
							<div className="bg-yellow-100 border-l-4 border-yellow-400 p-4 rounded-xl mt-6 text-yellow-800">
								<strong>📝 Izoh:</strong> {selectedStudent.comment}
							</div>
						)}

						{/* Guruhlar */}
						<div className="mt-8">
							<h4 className="text-xl font-bold text-center text-gray-800 mb-4">👥 Guruhlar</h4>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{selectedStudent.groups.map((group, index) => (
									<div
										key={index}
										className="p-4 rounded-xl border-2 border-blue-200 bg-blue-50 shadow-sm hover:shadow-md transition"
									>
										<p className="text-xs text-blue-400 mb-1">
											{group.type === 'main' ? '🔵 Asosiy guruh' : '🟢 Qoʻshimcha guruh'}
										</p>
										<p className="text-lg font-semibold">{group.group?.groupName || 'Nomaʼlum guruh'}</p>
									</div>
								))}
							</div>
						</div>
					</div>
				) : (
					<div className="flex items-center justify-center text-blue-400 italic text-lg">
						Talaba tanlanmagan...
					</div>
				)}
			</div>
		</div>
	)
}

export default StudentStatusManager

import axios from 'axios'
import React, { useEffect, useState } from "react"
import { FaUserCheck } from "react-icons/fa"
import { FiCheckCircle } from "react-icons/fi"

const AttendanceSunday = () => {
	const token = localStorage.getItem('token')
	const [isButton, setIsButton] = useState(false)
	const [students, setStudents] = useState([])
	const [show, setShow] = useState(false)
	const [message, setMessage] = useState(null)
	const [checkStudent, setCheckStudent] = useState(false)
	const [attendance, setAttendance] = useState({})
	const [isDate, setIsDate] = useState()

	useEffect(() => {
		const today = new Date()
		if (today.getDay() !== 0) {
			setShow(true)
			setIsDate(new Date().setHours(0, 0, 0, 0))
			axios.get(`${import.meta.env.VITE_API_URL}/api/student/getSunday`)
				.then(res => {
					if (res.data.success) {
						setStudents(res.data.data)
					} else {
						console.error(res.data.message || 'Xatolik yuz berdi')
					}
				})
				.catch(err => console.error('Xatolik:', err))
		} else {
			setShow(false)
			setMessage("Bugun kun yakshanba emas")
		}
	}, [])

	useEffect(() => {
		if (students.length > 0) {
			const initialAttendance = students.reduce((acc, student) => {
				acc[student._id] = { attended: false, grade: null }
				return acc
			}, {})
			setAttendance(initialAttendance)
		}
	}, [students])

	const markAttendance = (id) => {
		setAttendance((prev) => ({
			...prev,
			[id]: { attended: !prev[id]?.attended, grade: prev[id]?.grade }
		}))
		setIsButton(true)
	}

	useEffect(() => {
		if (checkStudent !== null) {
			const timer = setTimeout(() => {
				setCheckStudent(true)
			}, 3000)
			return () => clearTimeout(timer)
		}
	}, [checkStudent])

	const setAttendanceHandler = async () => {
		try {
			const headers = token ? { Authorization: `Bearer ${token}` } : {}
			const data = { attendance }
			const res = await axios.post(
				`${import.meta.env.VITE_API_URL}/api/attandance/create-sunday`,
				data,
				{ headers }
			)
			if (res.status === 200) {
				alert("Davomat saqlandi!")
			}
		} catch (error) {
			alert("Xatolik yuz berdi!")
		}
	}

	return (
		<div className="container mx-auto px-4 py-6">
			{/* Show alert if not Sunday */}
			{!show && (
				<div className="flex justify-center items-center min-h-[200px] px-4">
					<div className="w-full max-w-3xl bg-gradient-to-r from-yellow-50 via-red-100 to-pink-50 border-l-4 border-red-500 text-red-800 p-6 rounded-2xl shadow-xl flex items-start gap-4">
						<div className="flex-shrink-0 mt-1">
							<svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
						<div>
							<h1 className="text-2xl font-bold mb-1">Eslatma!</h1>
							<p className="text-lg">{message}</p>
						</div>
					</div>
				</div>
			)}

			{/* Attendance table */}
			{show && (
				<>
					{students.length !== 0 ? (
						<div className="bg-white shadow-lg rounded-xl p-4 overflow-x-auto">
							<h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-center text-indigo-600 mb-6">
								{isDate ? new Date(isDate).toLocaleDateString() : "Sana tanlanmagan"} - Davomat ro'yxati
							</h2>

							<table className="min-w-full table-auto border-collapse">
								<thead>
									<tr className="bg-indigo-100 text-indigo-700 text-sm sm:text-base">
										<th className="border p-3 text-left">№</th>
										<th className="border p-3 text-left">F.I.Sh</th>
										<th className="border p-3 text-center">Davomat</th>
									</tr>
								</thead>
								<tbody>
									{students.map((student, index) => (
										<tr key={student._id} className="hover:bg-gray-50 transition-colors text-sm sm:text-base">
											<td className="border p-3">{index + 1}</td>
											<td className="border p-3">{student.fullName}</td>
											<td className="border p-3 text-center">
												<button
													onClick={() => markAttendance(student._id)}
													className={`p-2 rounded-full transition duration-200 ${attendance[student._id]?.attended ? 'bg-green-100' : 'bg-gray-200 hover:bg-gray-300'}`}
												>
													{attendance[student._id]?.attended ? (
														<FaUserCheck size={20} className="text-green-600" />
													) : (
														<FiCheckCircle size={20} className="text-gray-500" />
													)}
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>

							{isButton && (
								<div className="text-center mt-6">
									<button
										onClick={setAttendanceHandler}
										className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-md shadow-md transition duration-300"
									>
										Yuborish
									</button>
								</div>
							)}
						</div>
					) : (
						<div className="text-center mt-10">
							<p className="text-lg text-gray-500">Talabalar ro'yxati topilmadi yoki ruxsat yo'q.</p>
						</div>
					)}
				</>
			)}
		</div>
	)
}

export default AttendanceSunday

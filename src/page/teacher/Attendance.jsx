import axios from 'axios'
import React, { useEffect, useState } from "react"
import { FaUserCheck } from "react-icons/fa"
import { FiCheckCircle } from "react-icons/fi"
import { useLocation, useNavigate } from "react-router-dom"

const Attendance = () => {
	const token = localStorage.getItem('token')
	const location = useLocation()
	const navigate = useNavigate()
	const { groupId, students } = location.state || {}
	const [permission, setPermission] = useState(false)
	const [isButton, setIsButton] = useState(false)
	const [checkStudent, setCheckStudent] = useState(false)
	const [attendance, setAttendance] = useState({})
	const [isDate, setIsDate] = useState()

	useEffect(() => {
		const fetchSubjects = async () => {
			if (!token) {
				navigate('/login')
				return
			} else if (!groupId) {
				navigate('/teacher')
				return
			} else {
				setPermission(true)
				setIsDate(new Date(Date.now()).setHours(0, 0, 0, 0))
			}
		}
		fetchSubjects()
	}, [token, navigate])

	useEffect(() => {
		if (students) {
			const initialAttendance = students.reduce((acc, student) => {
				acc[student.id] = { attended: false, grade: null }
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

	const setGrade = (id, e) => {
		setAttendance((prev) => ({
			...prev,
			[id]: { ...prev[id], grade: e.target.value }
		}))
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
			const gId = groupId ? { groupId: groupId } : {}
			const data = { attendance, gId }
			console.log(attendance)
			const res = await axios.post(
				`${import.meta.env.VITE_API_URL}/api/attandance/create`,
				data,
				{ headers }
			)
			if (res.status === 200) {
				alert(res.data.message)
				toLocation()
			}
			setPermission(false)
			toLocation()
		} catch (error) {
			alert("Xatolik yuz berdi!")
		}
	}

	const toLocation = () => {
		navigate('/teacher')
	}

	return (
		<div className="container mx-auto px-4 py-6">
			{groupId && permission && students.length !== 0 ? (
				<div className="bg-white shadow-lg rounded-xl p-4 overflow-x-auto">
					<h2 className="text-2xl sm:text-3xl font-bold text-center text-indigo-600 mb-6">
						{isDate ? new Date(isDate).toLocaleDateString() : "Sana tanlanmagan"} - Davomat ro'yxati
					</h2>

					<table className="w-full table-auto border-collapse">
						<thead>
							<tr className="bg-indigo-100 text-indigo-700">
								<th className="border p-3 text-left">№</th>
								<th className="border p-3 text-left">F.I.Sh</th>
								<th className="border p-3 text-center">Davomat</th>
								<th className="border p-3 text-center">Baho</th>
							</tr>
						</thead>
						<tbody>
							{students.map((student, index) => (
								<tr key={student.id} className="hover:bg-gray-50 transition-colors">
									<td className="border p-3">{index + 1}</td>
									<td className="border p-3">{student.studentName}</td>
									<td className="border p-3 text-center">
										<button
											onClick={() => markAttendance(student.id)}
											className={`p-2 rounded-full transition duration-200 ${attendance[student.id]?.attended ? 'bg-green-100' : 'bg-gray-200 hover:bg-gray-300'}`}
										>
											{attendance[student.id]?.attended ? (
												<FaUserCheck size={20} className="text-green-600" />
											) : (
												<FiCheckCircle size={20} className="text-gray-500" />
											)}
										</button>
									</td>
									<td className="border p-3 text-center">
										<input
											type="number"
											min="0"
											max="100"
											disabled={!attendance[student.id]?.attended}
											value={attendance[student.id]?.grade || ""}
											onChange={(e) => {
												let value = parseInt(e.target.value, 10)
												if (value < 0) value = 0
												if (value > 100) value = 100
												setGrade(student.id, { target: { value } })
											}}
											placeholder="Baho"
											className={`w-full sm:w-24 text-center p-2 rounded-md border shadow-sm transition duration-200 font-semibold text-gray-800
												${attendance[student.id]?.attended ?
													'bg-white border-green-400 focus:ring-2 focus:ring-green-300' :
													'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'}
											`}
										/>
									</td>
								</tr>
							))}
						</tbody>
					</table>

					{isButton && (
						<div className="text-center mt-6">
							<button
								onClick={setAttendanceHandler}
								className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-md shadow-md transition duration-300"
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
		</div>
	)
}

export default Attendance

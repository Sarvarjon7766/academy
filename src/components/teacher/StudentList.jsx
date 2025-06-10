import axios from 'axios'
import { saveAs } from "file-saver"
import React, { useEffect, useState } from "react"
import { LiaFileDownloadSolid } from "react-icons/lia"
import { useNavigate } from "react-router"
import * as XLSX from "xlsx"


const StudentList = () => {
	const token = localStorage.getItem('token')
	const navigate = useNavigate()
	const [subjects, setSubjects] = useState([])
	const [students, setStudents] = useState([])
	const [groups, setGroups] = useState([])
	const [studentList, setStudentlist] = useState([])
	const [subjectId, setSubjectId] = useState(null)
	const [groupId, setGroupId] = useState(null)
	const [isActive, setIsActive] = useState(null)
	const [isgrActive, setIsgrActive] = useState(null)


	const fetchData = async () => {
		try {
			const headers = token ? { Authorization: `Bearer ${token}` } : {}
			const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/teacher/getSubjects`, { headers })
			if (res.data.success) {
				console.log(res.data)
				setSubjects(res.data.subjects)
				setStudentlist(res.data.SubjectStudent)
				return
			} else {
				setIsAvailable(false)
			}
		} catch (error) {
			console.error("Error fetching data:", error)
		}
	}

	useEffect(() => {
		fetchData()
	}, [])

	useEffect(() => {
		if (!token) {
			navigate('/login')
		}
	}, [token, subjectId])
	useEffect(() => {
		const getchGroup = async () => {
			try {
				const headers = token ? { Authorization: `Bearer ${token}` } : {}
				if (subjectId) {
					try {
						const res = await axios.get(
							`http://localhost:4000/api/group/getGroupToStudent/${subjectId}`,
							{ headers }
						)

						if (res.status === 200) {
							setGroups(res.data.groups)
							console.log(res.data.students)
							setComments("")
						} else if (res.status === 404) {
							setComments(res.data.message || "Talabalar topilmadi")
							setStudents([])
						} else {
							console.warn("Noma'lum holat:", res.status)
						}
					} catch (error) {
						console.error("So‘rovda xatolik:", error)
						setComments("Xatolik yuz berdi")
						setStudents([])
					}
				} else {
					console.warn("subjectId topilmadi")
				}
			} catch (error) {
				console.error("Xatolik yuz berdi:", error)
			}
		}

		getchGroup()
	}, [subjectId, token])

	useEffect(() => {
		const selectedGroup = groups.find(group => group._id === groupId)
		if (selectedGroup) {
			setStudents(selectedGroup.students)
		} else {
			setStudents([]) // agar group topilmasa, bo'sh array beriladi
		}
	}, [groupId, groups])

	const handleDownload = () => {
		const workbook = XLSX.utils.book_new()

		Object.entries(studentList).forEach(([subject, students]) => {
			let data

			if (students.length === 0) {
				// Talaba yo‘q fan uchun
				data = [{ "#": "", "F.I.Sh": "O‘quvchisi yo‘q" }]
			} else {
				// Talabalar mavjud fan uchun
				data = students.map((name, index) => ({
					"#": index + 1,
					"F.I.Sh": name,
				}))
			}

			const worksheet = XLSX.utils.json_to_sheet(data)
			XLSX.utils.book_append_sheet(workbook, worksheet, subject)
		})

		// Excel faylni yaratish va yuklash
		const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
		const fileData = new Blob([excelBuffer], { type: "application/octet-stream" })
		saveAs(fileData, "student_list.xlsx")
	}




	return (
		<div className="w-full mx-auto pt-4 px-4">
			<h2 className="text-xl sm:text-2xl text-center font-bold text-indigo-700">
				O'quvchilar ro'yxati
			</h2>
			<hr className="border-t-2 border-blue-500 my-2" />
			<div className="flex flex-wrap justify-between gap-3 w-full">
				{/* Fanlar uchun tugmalar */}
				<div className="w-full sm:w-auto flex flex-wrap gap-3 justify-start">
					{subjects.map((subject) => (
						<button
							key={subject._id}
							onClick={() => {
								setIsActive(subject._id)
								setSubjectId(subject._id)
							}}

							className={`px-5 my-1 rounded-full shadow-md transition-all duration-200 w-full sm:w-auto font-semibold
					${isActive === subject._id
									? 'bg-blue-100 text-blue-800 border border-blue-400 hover:bg-blue-200' : 'bg-blue-600 text-white'
								}
				`}
						>
							{subject.subjectName}
						</button>
					))}
				</div>

				{/* Yuklab olish tugmasi */}
				<div className="w-full sm:w-auto flex justify-end sm:justify-center md:justify-end">
					<button
						onClick={() => {
							setIsActive(123)
							handleDownload()
						}}
						className="w-full sm:w-16 md:w-20 h-12 sm:h-14 px-4 py-2 rounded-full shadow-lg transition-all duration-200 font-semibold bg-green-600 hover:bg-green-700 text-white flex items-center justify-center"
					>
						<LiaFileDownloadSolid className="text-lg sm:text-xl md:text-2xl text-white" />
					</button>
				</div>
			</div>


			<hr className="border-t-2 border-blue-200 my-2" />

			{groups.length !== 0 && (
				<div>
					{groups.map((group) => (
						<button
							key={group._id}
							onClick={() => { setIsgrActive(group._id); setGroupId(group._id) }}
							className={`px-5 my-1 rounded-full shadow-md transition-all duration-200 w-full sm:w-auto font-semibold
									${isgrActive === group._id
									? 'bg-blue-100 text-blue-800 border border-blue-400 hover:bg-blue-200' : 'bg-blue-600 text-white'
								}
								`}
						>
							{group.groupName}
						</button>
					))}
				</div>
			)}

			<div className="w-full  mx-auto pt-4 px-4 sm:px-6 lg:px-8">
				{students.length !== 0 ? (
					<>
						<ul className="divide-y divide-gray-300 border border-gray-300 rounded-md overflow-x-auto">
							<li className="grid grid-cols-3  sm:grid-cols-[1fr_auto] bg-indigo-100 font-semibold px-4 py-2 text-sm sm:text-base">
								<span className="flex items-center gap-2 col-span-2 sm:col-span-1">
									<span>#</span>
									<span>F.I.Sh</span>
								</span>

							</li>
							{students.map((student, index) => (
								<li
									key={student._id}
									className="grid grid-cols-3 sm:grid-cols-[1fr_auto] items-center px-4 py-2 hover:bg-gray-300 text-sm sm:text-base"
								>
									<span className="flex items-center gap-2 col-span-2 sm:col-span-1">
										<span>{index + 1}.</span>
										<span>{student.fullName}</span>
									</span>

								</li>
							))}
						</ul>
					</>
				) : (
					<div className="text-red-500 text-center mt-5 font-semibold text-sm sm:text-base">
						{studentList ? (
							<div className="space-y-6 px-4 sm:px-8">
								{Object.entries(studentList).map(([subject, students]) => (
									<div
										key={subject}
										className="border border-gray-300 rounded-md overflow-x-auto mb-6"
									>
										<div className="bg-indigo-100 font-semibold px-4 py-3 text-sm sm:text-base text-indigo-700">
											{subject}
										</div>
										<ul className="divide-y divide-gray-300">
											{students.map((student, index) => (
												<li
													key={index}
													className="grid grid-cols-3 sm:grid-cols-[1fr_auto] items-center px-4 py-2 hover:bg-gray-100 text-sm sm:text-base"
												>
													<span className="flex items-center gap-2 col-span-2 sm:col-span-1 text-gray-800">
														<span>{index + 1}.</span>
														<span>{student}</span>
													</span>

												</li>
											))}
										</ul>
									</div>
								))}
							</div>

						) : (
							<p>Ma'lumotlar yo'q</p>
						)}
					</div>
				)}
			</div>
		</div>
	)
}

export default StudentList

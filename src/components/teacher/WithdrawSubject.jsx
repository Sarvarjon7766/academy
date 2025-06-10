import axios from 'axios'
import React, { useEffect, useState } from "react"
import { GoMoveToEnd } from "react-icons/go";


const WithdrawSubject = () => {
	const token = localStorage.getItem('token')
	const [subjects, setSubjects] = useState([])
	const [students, setStudents] = useState([])
	const [subjectId, setSubjectId] = useState(null)
	const [comments, setComments] = useState()
	const [isAvailable, setIsAvailable] = useState(true)
	const [isActive, setIsActive] = useState(null)

	const fetchData = async () => {
		try {
			const headers = token ? { Authorization: `Bearer ${token}` } : {}
			const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/teacher/getSubjects`, { headers })
			if (res.data.success) {
				setSubjects(res.data.subjects)
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


	const fetchStudent = async () => {
		try {
			const headers = token ? { Authorization: `Bearer ${token}` } : {}

			if (subjectId) {
				try {
					const res = await axios.get(
						`http://localhost:4000/api/group/getStudent/${subjectId}`,
						{ headers }
					)

					if (res.status === 200) {
						setStudents(res.data.students)
						console.log(res.data.students)
						setComments("") // eski commentni tozalash
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
	useEffect(() => {
		fetchStudent()
		fetchData()
	}, [subjectId, token])

	const [isModalOpen, setIsModalOpen] = useState(false)
	const [selectedStudent, setSelectedStudent] = useState(null)

	const handleOpenModal = (student) => {
		setSelectedStudent(student)
		setIsModalOpen(true)
		fetchStudent()
	}

	const handleCloseModal = () => {
		setSelectedStudent(null)
		setIsModalOpen(false)
		fetchData()
	}

	const handleConfirmDelete = () => {
		handleCloseModal()
		fetchStudent()
	}

	return (
		<div className="w-full mx-auto pt-4 px-4">
			<h2 className="text-xl sm:text-2xl text-center font-bold text-indigo-700">
				Fandan chiqarish
			</h2>
			<hr className="border-t-2 border-blue-500 my-2" />
			<div className="flex flex-wrap gap-3 justify-center">
				{subjects.map((subject) => (
					<button
						key={subject._id}
						onClick={() => { setIsActive(subject._id); setSubjectId(subject._id) }}
						className={`list-none px-4 py-2 border border-gray-300 rounded-full text-sm sm:text-base transition z-29 text-white 
              ${isActive === subject._id ? 'bg-indigo-700' : 'bg-blue-500 hover:bg-indigo-700'}`}
					>
						{subject.subjectName}
					</button>
				))}
			</div>
			<div className="w-full mx-auto pt-4 px-4">
				{students.length !== 0 ? (
					<>
						<ul className="divide-y divide-gray-300 border border-gray-300 rounded-md">
							<li className="grid grid-cols-3 bg-indigo-100 font-semibold px-4 py-2">
								<span>#</span>
								<span>F.I.Sh</span>
								<span>Ko'chirish</span>
							</li>
							{students.map((student, index) => (
								<li
									key={student._id}
									className="grid grid-cols-3 items-center px-4 py-2 hover:bg-gray-100"
								>
									<span>{index + 1}</span>
									<span>{student.fullName}</span>
									<span>
										<button
											onClick={() => handleOpenModal(student)}
											className="bg-transparent border-none outline-none text-red-600 hover:text-red-800 text-xl"
										>
											<GoMoveToEnd />
										</button>
									</span>
								</li>
							))}
						</ul>

						{/* Modal */}
						<DeleteModal
							isOpen={isModalOpen}
							onClose={handleCloseModal}
							onConfirm={handleConfirmDelete}
							studentName={selectedStudent?.fullName}

						/>
					</>
				) : (
					<h2 className="text-red-500 text-center mt-5 font-semibold">
						Hech qanday ma'lumot yo'q
					</h2>
				)}
			</div>
		</div>
	)
}

export default WithdrawSubject

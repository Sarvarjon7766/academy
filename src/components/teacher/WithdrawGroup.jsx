import axios from 'axios'
import React, { useEffect, useState } from "react"
import { GoMoveToEnd } from "react-icons/go"
import { useNavigate } from "react-router"
import RelocationModal from '../notes/RelocationModal'

const WithdrawGroup = () => {
	const token = localStorage.getItem('token')
	const navigate = useNavigate()
	const [subjects, setSubjects] = useState([])
	const [students, setStudents] = useState([])
	const [groups, setGroups] = useState([])
	const [subjectId, setSubjectId] = useState(null)
	const [groupId, setGroupId] = useState(null)
	const [isActive, setIsActive] = useState(null)
	const [isgrActive, setIsgrActive] = useState(null)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [selectedStudent, setSelectedStudent] = useState(null)
	const [permission, setPermission] = useState(false)

	const fetchData = async () => {
		try {
			const headers = token ? { Authorization: `Bearer ${token}` } : {}
			const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/teacher/getSubjects`, { headers })
			if (res.data.success) {
				setSubjects(res.data.subjects)
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
					const res = await axios.get(`http://localhost:4000/api/group/getGroupToStudent/${subjectId}`, { headers })
					if (res.status === 200) {
						setGroups(res.data.groups)
					} else {
						setStudents([])
					}
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
			setStudents([])
		}
	}, [groupId, groups])

	const handleOpenModal = (student) => {
		setSelectedStudent(student)
		setIsModalOpen(true)
	}

	const handleCloseModal = () => {
		setSelectedStudent(null)
		setIsModalOpen(false)
	}

	const handleConfirmDelete = () => {
		handleCloseModal()
	}

	if (!permission) {
		return (
			<div className="w-full mx-auto pt-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
				<div className="bg-white p-6 rounded-lg shadow-lg text-center">
					<h2 className="text-xl sm:text-2xl font-bold text-red-600 mb-4">
						Xizmatdan foydalanish vaqtincha ishchi holatda emas
					</h2>
				</div>
			</div>
		)
	}

	return (
		<div className="w-full mx-auto pt-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
			<h2 className="text-2xl sm:text-3xl text-center font-bold text-indigo-700 mb-6">
				O'quvchini guruhdan guruhga ko'chirish
			</h2>
			<hr className="border-t-2 border-blue-500 my-3 w-24 mx-auto" />

			<div className="flex flex-wrap gap-3 justify-center mb-5">
				{subjects.map((subject) => (
					<button
						key={subject._id}
						onClick={() => { setIsActive(subject._id); setSubjectId(subject._id) }}
						className={`px-5 py-2 rounded-lg shadow-lg transition-all duration-300 w-full sm:w-auto font-semibold
							${isActive === subject._id
								? 'bg-blue-100 text-blue-800 border border-blue-400 hover:bg-blue-200'
								: 'bg-blue-600 text-white hover:bg-blue-700'
							}
						`}
					>
						{subject.subjectName}
					</button>
				))}
			</div>

			{groups.length !== 0 ? (
				<div>
					{groups.map((group) => (
						<button
							key={group._id}
							onClick={() => { setIsgrActive(group._id); setGroupId(group._id) }}
							className={`px-5 my-2 rounded-lg shadow-lg transition-all duration-300 w-full sm:w-auto font-semibold
								${isgrActive === group._id
									? 'bg-blue-100 text-blue-800 border border-blue-400 hover:bg-blue-200'
									: 'bg-blue-600 text-white hover:bg-blue-700'
								}`}
						>
							{group.groupName}
						</button>
					))}
				</div>
			) : (<h2 className="text-red-500 text-center font-semibold">Guruh mavjud emas</h2>)}

			<div className="mt-6">
				{students.length !== 0 ? (
					<>
						<ul className="divide-y divide-gray-300 rounded-lg overflow-x-auto shadow-lg bg-white">
							<li className="grid grid-cols-3 sm:grid-cols-[1fr_2fr_auto] bg-indigo-100 font-semibold px-6 py-3 text-sm sm:text-base text-center text-indigo-800">
								<span>#</span>
								<span>F.I.Sh</span>
								<span>Ko'chirish</span>
							</li>
							{students.map((student, index) => (
								<li
									key={student._id}
									className="grid grid-cols-3 sm:grid-cols-[1fr_2fr_auto] items-center px-6 py-3 hover:bg-gray-100 cursor-pointer text-sm sm:text-base"
								>
									<span className="text-gray-700">{index + 1}.</span>
									<span className="text-gray-800 font-medium">{student.fullName}</span>
									<span className="text-center">
										<button
											onClick={() => handleOpenModal(student)}
											className="bg-transparent border-none outline-none text-green-600 hover:text-green-800 text-lg sm:text-xl transition duration-200 ease-in-out transform hover:scale-110"
										>
											<GoMoveToEnd />
										</button>
									</span>
								</li>
							))}
						</ul>
						<RelocationModal
							isOpen={isModalOpen}
							groupId={groupId}
							studentId={selectedStudent?._id}
							onClose={handleCloseModal}
							onConfirm={handleConfirmDelete}
							studentName={selectedStudent?.fullName}
						/>
					</>
				) : (
					<h2 className="text-red-500 text-center mt-5 font-semibold text-sm sm:text-base">
						Hech qanday ma'lumot yo'q
					</h2>
				)}
			</div>
		</div>
	)
}

export default WithdrawGroup
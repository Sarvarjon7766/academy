import axios from 'axios'
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { VscAdd } from "react-icons/vsc"
import { MdOutlineMenuBook } from "react-icons/md"
import { FaChalkboardTeacher } from "react-icons/fa"
import { BsPeopleFill } from "react-icons/bs"
import { IoMdAlert } from "react-icons/io"

const TeacherHome = () => {
	const navigate = useNavigate()
	const token = localStorage.getItem('token')
	const [subjects, setSubjects] = useState([])
	const [headers, setHeaders] = useState({})
	const [teacherId, setTeacherId] = useState()
	const [selectSubject, setSelectSubject] = useState()
	const [groups, setGroups] = useState([])
	const [isCreate, setIsCreate] = useState(false)
	const [apimessage, setApiMessage] = useState(null)
	const [checkStudent, setCheckStudent] = useState(null)
	const [formData, setFormData] = useState({ groupName: "" })

	useEffect(() => {
		const fetchSubjects = async () => {
			if (!token) {
				navigate('/login')
				return
			}
			try {
				const headers = { Authorization: `Bearer ${token}` }
				const res = await axios.get(`http://localhost:4000/api/teacher/getSubjects`, { headers })
				setTeacherId(res.data.teacherid)
			} catch (error) {
				if (error.response?.status === 401 || error.response?.status === 403) {
					navigate('/login')
				} else {
					console.error("API Error:", error)
				}
			}
		}
		fetchSubjects()
	}, [token, navigate])

	const fetchData = async () => {
		try {
			const headers = token ? { Authorization: `Bearer ${token}` } : {}
			const res = await axios.get(`http://localhost:4000/api/teacher/getSubjects`, { headers })
			setSubjects(res.data.subjects || [])
			setHeaders(headers)
		} catch (error) {
			console.error("Error fetching data:", error)
		}
	}
	useEffect(() => { fetchData() }, [])

	useEffect(() => {
		setApiMessage(null)
	}, [apimessage])

	useEffect(() => {
		if (checkStudent !== null) {
			const timer = setTimeout(() => {
				setCheckStudent(null)
				setApiMessage(null)
			}, 10000)
			return () => clearTimeout(timer)
		}
	}, [checkStudent, apimessage])

	const handleGroup = async (subject) => {
		try {
			const res = await axios.get(`http://localhost:4000/api/group/groups/${subject._id}`, { headers })
			if (res.data.groups.length !== 0) {
				setGroups(res.data.groups)
			} else {
				setApiMessage(res.data.message)
			}
			setSelectSubject(subject)
			setIsCreate(false)
		} catch (error) {
			console.error(error)
		}
	}

	const handleCreateGroup = async (subject, formDatas) => {
		try {
			const res = await axios.post(
				`http://localhost:4000/api/group/create-group/${subject._id}`,
				formDatas,
				{ headers }
			)
			if (res.data.success === false) {
				setApiMessage(res.data.message)
			}
			setSelectSubject([])
			setIsCreate(false)
			fetchData()
			handleGroup(subject)
			setApiMessage(res.data.message)
		} catch (error) {
			console.log(error)
		}
	}

	const handleAttandance = async (groupId) => {
		if (!groupId) {
			setCheckStudent("Guruh tanlanmagan!")
			return
		}
		try {
			const headers = token ? { Authorization: `Bearer ${token}` } : {}
			const [res, response] = await Promise.all([
				axios.get(`http://localhost:4000/api/group/groups-v3/${groupId}`),
				axios.get(`http://localhost:4000/api/attandance/checking/${groupId}`, { headers })
			])
			console.log(res.data)

			if (res.data.success && response.data.success) {
				navigate('/teacher/attendance', {
					state: {
						teacherId: teacherId,
						groupId,
						students: response.data.students
					}
				})
			} else {
				setCheckStudent(res.data.success ? response.data.message : res.data.message)
				setApiMessage(response.data.message)
			}
		} catch (error) {
			console.error('Xatolik yuz berdi:', error)
			setCheckStudent("Tarmoq xatosi yoki serverda muammo bor.")
		}
	}

	return (
		<div className="p-4 bg-gradient-to-br from-indigo-100 to-blue-100 min-h-screen">
			{checkStudent && (
				<div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 text-red-600 bg-white p-3 rounded-md  shadow-md">
					<IoMdAlert size={20} />
					{checkStudent}
				</div>
			)}

			<div className="max-w-6xl mx-auto p-6">
				<div className="flex items-center justify-center gap-3 mb-4">
					<FaChalkboardTeacher size={32} className="text-indigo-600" />
					<h1 className="text-3xl font-bold text-indigo-700">O'qituvchi Paneli</h1>
				</div>
				<hr className="border-t-4 border-blue-300 mb-10" />

				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
					{subjects.map((subject) => (
						<button key={subject._id} onClick={() => handleGroup(subject)} className="group p-4 bg-white border-none border-indigo-200 rounded-lg shadow hover:shadow-lg transition">
							<div className="flex flex-col items-center text-indigo-600">
								<MdOutlineMenuBook size={36} />
								<h2 className="mt-2 font-semibold text-center text-indigo-800">{subject.subjectName}</h2>
							</div>
						</button>
					))}
				</div>

				{selectSubject && (
					<div className="mt-10">
						<button onClick={() => setIsCreate(prev => !prev)} className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition mb-4">
							<VscAdd /> Guruh qo'shish
						</button>

						{isCreate && (
							<form onSubmit={(e) => { e.preventDefault(); handleCreateGroup(selectSubject, formData) }} className="space-y-4">
								<input
									type="text"
									name="groupName"
									placeholder="Guruh nomi"
									value={formData.groupName}
									onChange={(e) => setFormData({ groupName: e.target.value })}
									className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
									required
								/>
								<button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">
									Qo‘shish
								</button>
							</form>
						)}

						{groups.length > 0 && (
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
								{groups.map((group) => (
									<button key={group._id} onClick={() => handleAttandance(group._id)} className="p-4 bg-green-500 text-white rounded-lg shadow hover:shadow-lg transition text-center">
										<BsPeopleFill size={24} className="mx-auto mb-2" />
										<h4 className="font-semibold">{group.groupName}</h4>
									</button>
								))}
							</div>
						)}

						{apimessage && !isCreate && (
							<p className="mt-4 text-center text-blue-600">{apimessage}</p>
						)}
					</div>
				)}

				{!selectSubject && (
					<div className="text-center mt-10 text-indigo-700 text-xl font-medium">
						Birorta fanni tanlang
					</div>
				)}
			</div>
		</div>
	)
}

export default TeacherHome

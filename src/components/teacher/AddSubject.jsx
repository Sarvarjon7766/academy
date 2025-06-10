import axios from 'axios'
import React, { useEffect, useState } from "react"
const AddSubject = () => {
	const token = localStorage.getItem('token')
	const [subjects, setSubjects] = useState([])
	const [students, setStudents] = useState([])
	const [subjectId, setSubjectId] = useState(null)
	const [isAvailable, setIsAvailable] = useState(true)
	const [isActive, setIsActive] = useState(null)

	const fetchData = async () => {
		try {
			const headers = token ? { Authorization: `Bearer ${token}` } : {}
			const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/teacher/getSubjects`, { headers })
			if (res.data.success) {
				console.log(res.data.subjects)
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

	const fetchStudent = async () =>{
		try {
			const headers = token ? { Authorization: `Bearer ${token}` } : {}
			if(subjectId !== null){
				const res = await axios.get(`http://localhost:4000/api/group/getStudent/${subjectId}`, { headers })
				if(res.status === 200){
					setStudents(res.data.students)
				}else{

				}
			}else{
				console.error("subjectId fetching data:", subjectId)
			}
		} catch (error) {
			console.error("Error fetching data:", error)
		}
	}

	return (
		<div className="w-full  mx-auto pt-4 px-4">
			<h2 className="text-xl sm:text-2xl text-center font-bold text-indigo-700">
				Fanga qo'shish
			</h2>
			<hr className="border-t-2 border-blue-500 my-2" />
			<div className="flex flex-wrap gap-3 justify-center">
				{subjects.map((subject) => (
					<button
						key={subject._id}
						onClick={() => setIsActive(subject._id)}
						className={`list-none px-4 py-2 border border-gray-300 rounded-full text-sm sm:text-base transition z-29 text-white 
							${isActive === subject._id ? 'bg-indigo-700' : 'bg-blue-500 hover:bg-indigo-700'}`}
					>
						{subject.subjectName}
					</button>

				))}
			</div>
		</div>
	)
}

export default AddSubject
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaUsers } from "react-icons/fa"


const RegisterMessage = () => {
	const navigate = useNavigate()
	const [isMessage,setMessage] = useState([])
	const token = localStorage.getItem('token')

	const fetchData = useCallback(async () => {
		if (!token) {
			navigate("/login")
			return
		}
		try {
			const headers = token ? { Authorization: `Bearer ${token}` } : {}
			const res = await axios.get(`http://localhost:4000/api/message/getTeacher`, { headers })
			if (res.status === 200) {
				setMessage(res.data.messages)
			} else {
				navigate("/login")
			}
		} catch (error) {
			console.error("Xatolik yuz berdi:", error)
			navigate("/login")
		}
	}, [token, navigate])

	useEffect(() => {
		fetchData()
	}, [fetchData])

	const handleGroup = () => {
		fetchData()
	}
	const handlePersonal = async() => {
		try {
			const headers = token ? { Authorization: `Bearer ${token}` } : {}
			const res = await axios.get(`http://localhost:4000/api/message/personal`, { headers })
			if (res.status === 200) {
				setMessage(res.data.messages)
			} else {
				navigate("/login")
			}
		} catch (error) {
			console.error("Xatolik yuz berdi:", error)
			navigate("/login")
		}
	}

	const whoIsText = (who_is) => {
		switch (who_is) {
			case 1: return "O'qituvchilar";
			case 2: return "O'quvchilar";
			case 3: return "Ota-onalar";
			case 4: return "Hamma uchun";
			default: return "Noma'lum";
		}
	};

	return (
		<div className="p-3 bg-gray-100 min-h-screen">
			<h1 className="text-3xl text-center font-bold text-indigo-700 mb-4">Xabarlar</h1>
			<div className='flex gap-3 justify-center'>
				<button
					className="flex items-center justify-center p-2 bg-blue-500 text-white rounded-full shadow-md w-10 h-10 hover:bg-blue-600 transition"
					onClick={() => handleGroup()}
					aria-label="Umumiy eslatmalar"
				>
					<FaUsers size={16} />
				</button>
				<button
					className="flex items-center justify-center p-2 bg-blue-500 text-white rounded-full shadow-md w-10 h-10 hover:bg-blue-600 transition"
					onClick={() => handlePersonal()}
					aria-label="Sizning eslatmalaringiz"
				>
					<FaUser size={16} />
				</button>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
			{isMessage.length > 0 ? (
					isMessage.map((msg) => (
						<div key={msg._id} className="bg-white border p-6 my-4 rounded-lg shadow-md">
							<h3 className="text-xl font-bold mb-2">{msg.messageName}</h3>
							<p className="text-sm text-gray-600 mb-4">{msg.messageTitle}</p>
							<p className="text-sm text-gray-500"><strong>Kim uchun:</strong> {whoIsText(msg.who_is)}</p>
							<p className="text-sm text-gray-500"><strong>Sana:</strong> {new Date(msg.sent_date).toLocaleString()}</p>
							{/* <div className="mt-4 flex justify-between">
								<button onClick={() => handleEditMessage(msg)} className="bg-green-600  hover:bg-green-800 text-white px-4 py-2 rounded-md">Yangilash</button>
								<button onClick={() => handleDeleteMessage(msg._id)} className="bg-red-600  hover:bg-red-800 text-white px-4 py-2 rounded-md">O'chirish</button>
							</div> */}
						</div>
					))
				) : (
					<p className="text-center text-gray-500 col-span-full">Mos keladigan xabarlar topilmadi.</p>
				)}
			</div>

		</div>
	)
}

export default RegisterMessage

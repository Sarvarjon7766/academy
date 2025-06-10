import axios from 'axios'
import React, { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'

const RelocationModal = ({ isOpen, groupId, studentId, onClose, onConfirm, studentName }) => {
	const navigate = useNavigate()
	const token = localStorage.getItem('token')
	const [groups, setGroups] = useState([])
	const [comment, setComments] = useState(null)
	const [groupName, setGroupName] = useState(null)
	const [selectedGroupId, setSelectedGroupId] = useState(null)

	useEffect(() => {
		if (!token) {
			navigate('/login')
		}
	}, [token])

	useEffect(() => {
		const getSubject = async () => {
			try {
				if (!groupId) return
				const headers = token ? { Authorization: `Bearer ${token}` } : {}

				const res = await axios.get(
					`${import.meta.env.VITE_API_URL}/api/group/getSubject/${groupId}`,
					{ headers }
				)

				if (res.status === 200) {
					setGroups(res.data.groups)
					setGroupName(res.data.groupName)
					setComments(null)
				} else if (res.status === 404) {
					setComments(res.data.message || "Fan topilmadi")
					setGroups([])
				}
			} catch (error) {
				console.error("So‘rovda xatolik:", error)
				setComments("Xatolik yuz berdi")
				setGroups([])
			}
		}

		getSubject()
	}, [groupId, token])

	const RelocationHandler = async () => {
		try {
			if (studentId && groupId && selectedGroupId) {
				const headers = token ? { Authorization: `Bearer ${token}` } : {}
				const res = await axios.post(
					`http://localhost:4000/api/group/relocation-group/${groupId}/${studentId}/${selectedGroupId}`,
					{},
					{ headers }
				)
				if(res.status === 200){
					setComments(res.data.message)
					onClose()
				}else{
					isOpen()
				}
			} else {
				setComments("Iltimos, barcha ma'lumotlarni to'liq tanlang")
			}
		} catch (error) {
			console.error("So‘rovda xatolik:", error)
			setComments("Xatolik yuz berdi")
		}
	}


	const handleOutsideClick = (e) => {
		if (e.target.id === "modal-overlay") {
			onClose()
		}
	}

	return (
		isOpen && (
			<div
				id="modal-overlay"
				className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
				onClick={handleOutsideClick}
			>
				<div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-3xl animate-fadeIn">
					<h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
						{studentName} ni boshqa guruhga ko‘chirish
					</h2>

					<div className="flex flex-col md:flex-row gap-6 mb-6">
						<div className="w-full md:w-1/2">
							<h3 className="text-md font-medium text-gray-600 mb-2">Talabaning Dastlabki Guruhi</h3>
							<p className="text-lg font-semibold text-gray-800 bg-gray-100 rounded p-3">
								{groupName || 'Noma’lum'}
							</p>
						</div>
						<div className="w-full md:w-1/2">
							<label className="block text-md font-medium text-gray-600 mb-2">
								Yangi guruhni tanlang
							</label>
							<select
								className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"

								onChange={(e) => setSelectedGroupId(e.target.value)}
							>
								<option value="">Guruhni tanlang</option>
								{groups.map(group => (
									<option key={group._id} value={group._id}>
										{group.groupName}
									</option>
								))}
							</select>
						</div>
					</div>

					{comment && (
						<div className="text-red-500 mb-4 text-sm font-medium">
							{comment}
						</div>
					)}

					<div className="flex justify-end gap-4 mt-6">
						<button
							onClick={onClose}
							className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium"
						>
							Bekor qilish
						</button>
						<button
							onClick={() => { onConfirm(); RelocationHandler() }}
							className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
						>
							Ha, ko‘chirish
						</button>
					</div>
				</div>
			</div>
		)
	)
}

export default RelocationModal

import axios from "axios"
import { useCallback, useEffect, useState } from "react"
import { FaBell, FaUser, FaUsers } from "react-icons/fa"
import { IoMdTime } from "react-icons/io"
import { RiGroupFill } from "react-icons/ri"
import { useNavigate } from "react-router-dom"

const RegisterMessage = () => {
	const navigate = useNavigate()
	const [messages, setMessages] = useState([])
	const [filteredMessages, setFilteredMessages] = useState([])
	const [searchTerm, setSearchTerm] = useState("")
	const [activeTab, setActiveTab] = useState("group")
	const [isLoading, setIsLoading] = useState(true)
	const token = localStorage.getItem("token")

	const fetchData = useCallback(async () => {
		if (!token) {
			navigate("/login")
			return
		}
		try {
			setIsLoading(true)
			const headers = token ? { Authorization: `Bearer ${token}` } : {}
			const res = await axios.get(
				`${import.meta.env.VITE_API_URL}/api/message/getTeacher`,
				{ headers }
			)
			if (res.status === 200) {
				setMessages(res.data.messages)
				setFilteredMessages(res.data.messages)
			} else {
				navigate("/login")
			}
		} catch (error) {
			console.error("Xatolik yuz berdi:", error)
			navigate("/login")
		} finally {
			setIsLoading(false)
		}
	}, [token, navigate])

	useEffect(() => {
		fetchData()
	}, [fetchData])

	useEffect(() => {
		const results = messages.filter(
			(msg) =>
				msg.messageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
				msg.messageTitle.toLowerCase().includes(searchTerm.toLowerCase())
		)
		setFilteredMessages(results)
	}, [searchTerm, messages])

	const handleGroup = () => {
		setActiveTab("group")
		fetchData()
	}

	const handlePersonal = async () => {
		setActiveTab("personal")
		try {
			setIsLoading(true)
			const headers = token ? { Authorization: `Bearer ${token}` } : {}
			const res = await axios.get(
				`${import.meta.env.VITE_API_URL}/api/message/personal`,
				{ headers }
			)
			if (res.status === 200) {
				setMessages(res.data.messages)
				setFilteredMessages(res.data.messages)
			} else {
				navigate("/login")
			}
		} catch (error) {
			console.error("Xatolik yuz berdi:", error)
			navigate("/login")
		} finally {
			setIsLoading(false)
		}
	}

	const whoIsText = (who_is) => {
		switch (who_is) {
			case 1:
				return "O'qituvchilar"
			case 2:
				return "O'quvchilar"
			case 3:
				return "Ota-onalar"
			case 4:
				return "Hamma uchun"
			default:
				return "Noma'lum"
		}
	}

	const whoIsIcon = (who_is) => {
		switch (who_is) {
			case 1:
				return <FaUser className="text-purple-500" />
			case 2:
				return <FaUser className="text-blue-500" />
			case 3:
				return <FaUser className="text-green-500" />
			case 4:
				return <RiGroupFill className="text-yellow-500" />
			default:
				return <FaUser className="text-gray-500" />
		}
	}

	const formatDate = (dateString) => {
		const options = {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		}
		return new Date(dateString).toLocaleDateString('uz-UZ', options)
	}

	return (
		<div className="p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
			<div className="max-w-6xl mx-auto">

				{/* Tab Navigation */}
				<div className="flex justify-center mb-8">
					<div className="inline-flex rounded-full bg-white border border-gray-200 p-1 shadow-sm">
						<button
							className={`flex items-center px-6 py-2 rounded-full transition-all ${activeTab === "group"
									? "bg-indigo-500 text-white shadow-sm font-medium"
									: "bg-white text-gray-600 hover:text-indigo-500"
								}`}
							onClick={handleGroup}
						>
							<FaUsers className="mr-2" />
							Umumiy xabarlar
						</button>
						<button
							className={`flex items-center px-6 py-2 rounded-full transition-all ${activeTab === "personal"
									? "bg-indigo-500 text-white shadow-sm font-medium"
									: "bg-white text-gray-600 hover:text-indigo-500"
								}`}
							onClick={handlePersonal}
						>
							<FaUser className="mr-2" />
							Shaxsiy xabarlar
						</button>
					</div>
				</div>

				{/* Messages Grid */}
				{isLoading ? (
					<div className="flex justify-center items-center h-64">
						<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
					</div>
				) : filteredMessages.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{filteredMessages.map((msg) => (
							<div
								key={msg._id}
								className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
							>
								<div className="p-6">
									<div className="flex justify-between items-start mb-3">
										<h3 className="text-xl font-bold text-gray-800 line-clamp-2">
											{msg.messageName}
										</h3>
										<div className="flex-shrink-0 ml-2">
											{whoIsIcon(msg.who_is)}
										</div>
									</div>
									<p className="text-gray-600 mb-4 line-clamp-3">
										{msg.messageTitle}
									</p>
									<div className="flex items-center text-sm text-gray-500 mb-2">
										<IoMdTime className="mr-1" />
										<span>{formatDate(msg.sent_date)}</span>
									</div>
									<div className="flex items-center text-sm text-gray-500">
										<span className="px-2 py-1 bg-gray-100 rounded-full">
											{whoIsText(msg.who_is)}
										</span>
									</div>
								</div>
								{/* <div className="px-6 py-3 bg-gray-50 flex justify-end space-x-2">
                  <button
                    onClick={() => handleEditMessage(msg)}
                    className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition"
                  >
                    Tahrirlash
                  </button>
                  <button
                    onClick={() => handleDeleteMessage(msg._id)}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition"
                  >
                    O'chirish
                  </button>
                </div> */}
							</div>
						))}
					</div>
				) : (
					<div className="text-center py-12">
						<div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
							<FaBell className="text-gray-400 text-3xl" />
						</div>
						<h3 className="text-xl font-medium text-gray-700 mb-2">
							Xabarlar topilmadi
						</h3>
						<p className="text-gray-500">
							{searchTerm
								? "Qidiruv bo'yicha hech narsa topilmadi"
								: "Hozircha xabarlar mavjud emas"}
						</p>
					</div>
				)}
			</div>
		</div>
	)
}

export default RegisterMessage
import axios from 'axios'
import { useEffect, useState } from 'react'

const RoomAttachment = ({ studentId, onHotelChange }) => {
	const [rooms, setRooms] = useState([])
	const [error, setError] = useState("")
	const [selectedRoom, setSelectedRoom] = useState(null)
	const [selectedBedIndex, setSelectedBedIndex] = useState(null)
	const [isModalOpen, setIsModalOpen] = useState(false)

	const fetchRooms = async () => {
		try {
			const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/room/getAll`)
			if (res.data.success) {
				setRooms(res.data.data)
				console.log(res.data.data)
				setError("")
			} else {
				setError(res.data.message || "Xatolik yuz berdi")
			}
		} catch (error) {
			console.error("Xona ma'lumotlarini olishda xatolik:", error)
			setError("Xona ma'lumotlarini olishda xatolik yuz berdi.")
		}
	}

	useEffect(() => {
		fetchRooms()
	}, [])

	const handleBedClick = (room, bedIndex) => {
		if (room.beds[bedIndex].includes("bo'sh")) {
			setSelectedRoom(room)
			console.log(room)
			setSelectedBedIndex(bedIndex)
			setIsModalOpen(true)
		}
	}

	const handleAssignBed = async () => {
		try {
			const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/room/add-hotel/${studentId}`, {
				roomNumber: selectedRoom.roomNumber,
				bedIndex: selectedBedIndex,
			})
			if (res.data.success) {
				setIsModalOpen(false)
				fetchRooms()
				onHotelChange()

			} else {
				alert(res.data.message)
			}
		} catch (err) {
			console.error("Biriktirishda xatolik:", err)
			alert("Yotoqqa biriktirishda xatolik yuz berdi.")
		}
	}

	return (
		<div >
			<div className="flex justify-center items-center gap-4 p-4 sm:p-6">
				<h1 className="text-xl sm:text-3xl font-extrabold text-blue-700 text-center">
					🏨 Xonalarni Boshqarish
				</h1>
			</div>
			{error && (
				<div className="text-red-600 text-center text-sm sm:text-base font-semibold">
					{error}
				</div>
			)}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
				{rooms.length > 0 ? (
					rooms.map(room => (
						<div key={room._id} className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-all p-4 sm:p-6 flex flex-col justify-between">
							<div className="mb-4">
								<div className="flex items-center justify-between mb-3">
									<h2 className="text-lg sm:text-xl font-bold text-blue-800">
										Xona #{room.roomNumber}
									</h2>
									<span className="bg-blue-100 text-blue-700 text-xs sm:text-sm font-semibold px-3 py-1 rounded-full shadow">
										{room.roomCapacity} kishi
									</span>
								</div>

								<div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
									<p className="text-sm sm:text-base font-semibold text-blue-900 mb-2 flex items-center gap-2">
										🛏 <span>Yotoqlar:</span>
									</p>
									{room.beds.length > 0 ? (
										<ol className="list-decimal ml-5 space-y-1 text-sm">
											{room.beds.map((bed, index) => (
												<li key={index}>
													<div
														onClick={() => handleBedClick(room, index)}
														className={`px-3 py-2 rounded-md font-medium shadow-sm cursor-pointer hover:scale-105 transition-all duration-200
       													 ${bed.includes("bo'sh")
																? 'bg-green-100 text-green-700'
																: 'bg-blue-100 text-blue-700 cursor-not-allowed'
															}`}
													>
														{bed}
													</div>
												</li>
											))}

										</ol>
									) : (
										<p className="italic text-gray-400">Yotoq mavjud emas</p>
									)}
								</div>
							</div>
						</div>
					))
				) : (
					<div className="text-center text-gray-500 italic col-span-full">
						🔍 Xonalar mavjud emas
					</div>
				)}
			</div>

			{/* MODAL */}
			{isModalOpen && selectedRoom && (
				<div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
					<div className="bg-white p-6 rounded-xl max-w-md w-full space-y-4 shadow-2xl">
						<h2 className="text-xl font-bold text-blue-800 text-center">Yotoqni biriktirish</h2>
						<p className="text-gray-700 text-sm text-center">
							<strong>{selectedRoom.roomNumber}</strong><br />
							Yotoq-Joy: <strong>{selectedBedIndex + 1}</strong><br />
						</p>
						<div className="flex justify-center gap-4 mt-4">
							<button
								className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
								onClick={handleAssignBed}
							>
								Biriktirish
							</button>
							<button
								className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
								onClick={() => setIsModalOpen(false)}
							>
								Bekor qilish
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default RoomAttachment

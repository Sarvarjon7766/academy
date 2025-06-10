import axios from 'axios'
import React, { useState } from 'react'
import { IoAddCircleOutline } from "react-icons/io5"

const AddRooms = ({ onchange }) => {
	const [showModal, setShowModal] = useState(false)
	const token = localStorage.getItem('token')
	const [roomNumber, setRoomNumber] = useState('')
	const [roomCapacity, setRoomCapacity] = useState('')
	const [error, setError] = useState("")

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/room/create`, {
				number: roomNumber,
				capacity: roomCapacity
			}, {
				headers: {
					"Content-Type": "application/json"
				}
			})

			if (res.data.success) {
				setShowModal(false)
				setRoomNumber('')
				setRoomCapacity('')
				setError("")
				onchange()
			} else {
				setError(res.data.message)
			}
		} catch (error) {
			console.error("Xona qo‘shishda xatolik:", error)
			setError("Xona qo‘shishda xatolik yuz berdi.")
		}
	}

	return (
		<div>
			{/* Add Button */}
			<button
				onClick={() => setShowModal(true)}
				className="bg-green-600 text-white p-3 rounded-full hover:bg-green-700 shadow-lg transition duration-200 ease-in-out"
				title="Yangi xona qo'shish"
			>
				<IoAddCircleOutline size={22} />
			</button>

			{/* Modal */}
			{showModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
					<div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 relative animate-fade-in-down">
						{/* Close Button */}
						<button
							onClick={() => setShowModal(false)}
							className="absolute top-3 right-3 text-gray-500 bg-white hover:text-red-600 text-base px-2 py-1 rounded-full"
						>
							&times;
						</button>


						{/* Title */}
						<h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-center text-blue-700 mb-6">
							🏨 Yangi xona qo‘shish
						</h2>


						{/* Form */}
						<form onSubmit={handleSubmit} className="space-y-4">
							<input
								type="text"
								placeholder="Xona raqami"
								value={roomNumber}
								onChange={(e) => setRoomNumber(e.target.value)}
								className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
								required
							/>
							<input
								type="number"
								placeholder="Necha kishilik"
								value={roomCapacity}
								onChange={(e) => setRoomCapacity(e.target.value)}
								min={1}
								max={10}
								className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
								required
							/>

							{/* Error */}
							{error && <div className="text-red-600 text-sm text-center">{error}</div>}

							{/* Submit */}
							<button
								type="submit"
								className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
							>
								💾 Saqlash
							</button>
						</form>
					</div>
				</div>
			)}
		</div>
	)
}

export default AddRooms

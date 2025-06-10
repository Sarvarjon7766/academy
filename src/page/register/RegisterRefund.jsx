import axios from 'axios'
import { useEffect, useState } from 'react'

const RegisterRefund = () => {
	const [students, setStudents] = useState([])
	const [selectedStudentId, setSelectedStudentId] = useState('')
	const [date, setDate] = useState('')
	const [monthly, setMonthly] = useState([])

	// Modal uchun qo‘shimcha statelar
	const [showModal, setShowModal] = useState(false)
	const [selectedMonthData, setSelectedMonthData] = useState(null)
	const [customAmount, setCustomAmount] = useState('')

	useEffect(() => {
		const fetchStudents = async () => {
			try {
				const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/student/getAll`)
				if (res.data.success) {
					setStudents(res.data.students)
				}
			} catch (error) {
				console.error('Talabalarni olishda xatolik:', error)
			}
		}

		fetchStudents()
	}, [])

	const handleStudentChange = (e) => {
		setSelectedStudentId(e.target.value)
		setDate('')
	}

	const handleDateChange = (e) => {
		setDate(e.target.value)
	}

	const handlerCheck = async () => {
		try {
			const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/attandance/calculate`, {
				params: {
					studentId: selectedStudentId,
					date
				}
			})

			if (res.data.success) {
				const months = res.data.result

				const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/payment/calculate`, {
					months,
					studentId: selectedStudentId
				})

				if (response.data.success) {
					setMonthly(response.data.data)
				}
			}
		} catch (error) {
			console.error(error)
		}
	}

	const handleCardClick = (monthData) => {
		if (monthData.refundableAmount === 0) return
		setSelectedMonthData(monthData)
		setCustomAmount(String(monthData.refundableAmount))
		setShowModal(true)
	}

	const handleModalClose = () => {
		setShowModal(false)
		setCustomAmount('')
		setSelectedMonthData(null)
	}

	const handleConfirmRefund = async () => {
		try {
			const year = selectedMonthData.month.split('-')[0]
			const month = selectedMonthData.month.split('-')[1]

			const payload = {
				studentId: selectedStudentId,
				year: Number(year),
				month:Number(month),
				amountPaid: selectedMonthData.amountPaid,
				amountDue: selectedMonthData.amountDue,
				status: "To'lanmoqda",
				daysAttended: selectedMonthData.daysAttended,
				totalDaysinMonth: selectedMonthData.totalDays,
				refundableAmount: Number(customAmount),
				paymentDate: new Date(),
				balance:true
			}

			const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/payment/balance`, payload)

			if (res.data.success) {
				alert("✅ To‘lov muvaffaqiyatli amalga oshirildi.")
				handleModalClose()
			} else {
				alert("❌ Xatolik yuz berdi!")
			}
		} catch (error) {
			console.error(error)
			alert("❌ Server bilan ulanishda xatolik!")
		}
	}

	const renderRefundCards = () => {
		return monthly.map((monthData, index) => {
			const dailyRate = monthData.amountDue / monthData.totalDays
			const costForAttended = dailyRate * monthData.daysAttended
			const refundableAmount = monthData.refundableAmount

			const isClickable = refundableAmount !== 0

			return (
				<div
					key={index}
					onClick={() => isClickable && handleCardClick(monthData)}
					className={`cursor-pointer bg-white hover:shadow-xl transition-all duration-300 rounded-2xl p-6 border 
						${refundableAmount > 0
							? 'border-green-300 hover:border-green-500'
							: refundableAmount < 0
								? 'border-red-300 hover:border-red-500'
								: 'border-gray-200 cursor-default'
						}`}
				>
					<h3 className="text-xl font-bold mb-4 text-indigo-700">📅 Oy: {monthData.month}</h3>
					<ul className="space-y-1 text-gray-700">
						<li><strong>Oylik to‘lov:</strong> {monthData.amountDue.toLocaleString()} so‘m</li>
						<li><strong>Kunlik to‘lov:</strong> {dailyRate.toFixed(2)} so‘m</li>
						<li><strong>Foydalanilgan kunlar uchun:</strong> {costForAttended.toFixed(2)} so‘m</li>
						<li><strong>To‘langan summa:</strong> {monthData.amountPaid.toLocaleString()} so‘m</li>
						<li><strong>Davomat:</strong> {monthData.daysAttended} kun / {monthData.totalDays} kun</li>
					</ul>

					<div className="mt-3 text-lg font-semibold">
						{monthData.daysAttended < 3 ? (
							<p className="text-yellow-600">⚠️ Faqat {monthData.daysAttended} kun qatnashgan — to‘liq qaytariladi: {refundableAmount.toLocaleString()} so‘m</p>
						) : refundableAmount > 0 ? (
							<p className="text-green-600">🔙 Qaytarilishi kerak: {refundableAmount.toLocaleString()} so‘m</p>
						) : refundableAmount < 0 ? (
							<p className="text-red-600">💸 Qarzdorlik: {Math.abs(refundableAmount).toLocaleString()} so‘m</p>
						) : (
							<p className="text-gray-600">✅ Hisob to‘liq</p>
						)}
					</div>
				</div>
			)
		})
	}

	return (
		<div className="max-w-6xl mx-auto px-6 py-10">
			<h2 className="text-4xl font-bold text-center mb-10 text-indigo-600">📄 Talabalar To‘lov Qaytarish</h2>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">🎓 Talabani tanlang</label>
					<select
						className="w-full px-4 py-3 border border-gray-300 rounded-lg"
						value={selectedStudentId}
						onChange={handleStudentChange}
					>
						<option value="" disabled>Talabani tanlang</option>
						{students.map((student) => (
							<option key={student._id} value={student._id}>
								{student.fullName || `${student.firstName} ${student.lastName}`}
							</option>
						))}
					</select>
				</div>

				{selectedStudentId && (
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">🗓 Sana</label>
						<input
							type="date"
							value={date}
							onChange={handleDateChange}
							className="w-full px-4 py-3 border border-gray-300 rounded-lg"
						/>
					</div>
				)}

				<div>
					<button
						onClick={handlerCheck}
						className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg"
					>
						✅ Hisoblash
					</button>
				</div>
			</div>

			{monthly.length > 0 && (
				<div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
					{renderRefundCards()}
				</div>
			)}

			{/* Modal oynasi */}
			{showModal && (
				<div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-md">
						<h2 className="text-xl font-semibold mb-4 text-indigo-700">💰 Qaytariladigan summani kiriting</h2>

						<input
							type="number"
							value={customAmount}
							onChange={(e) => setCustomAmount(e.target.value)}
							className="w-full mb-4 px-4 py-2 border rounded-md"
							placeholder="Masalan: 150000"
						/>

						<div className="flex justify-end gap-3">
							<button
								onClick={handleModalClose}
								className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
							>
								Bekor qilish
							</button>
							<button
								onClick={handleConfirmRefund}
								className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
							>
								Tasdiqlash
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default RegisterRefund

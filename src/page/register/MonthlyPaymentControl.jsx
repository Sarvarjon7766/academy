import axios from 'axios'
import { saveAs } from 'file-saver'
import { useEffect, useRef, useState } from 'react'
import { FaCalendarAlt, FaFileExcel, FaFilter, FaHistory, FaInfoCircle, FaMoneyBillWave, FaPercent, FaSearch, FaTrash, FaUser } from 'react-icons/fa'
import * as XLSX from 'xlsx'

const MonthlyPaymentControl = () => {
	const [year, setYear] = useState(new Date().getFullYear())
	const [month, setMonth] = useState(new Date().getMonth() + 1)
	const [payments, setPayments] = useState([])
	const [filteredPayments, setFilteredPayments] = useState([])
	const [searchName, setSearchName] = useState('')
	const [filterPercentage, setFilterPercentage] = useState('')
	const [paymentStatus, setPaymentStatus] = useState('all')
	const [selectedPayment, setSelectedPayment] = useState(null)
	const [paymentHistory, setPaymentHistory] = useState([])
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [loading, setLoading] = useState(false)
	const [historyLoading, setHistoryLoading] = useState(false)
	const modalRef = useRef(null)

	// To'lov ma'lumotlarini yuklash
	useEffect(() => {
		const fetchData = async () => {
			setLoading(true)
			try {
				const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/payment/getPaymants`, {
					params: { year, month },
				})
				if (res.data.success) {
					setPayments(res.data.payments)
					setFilteredPayments(res.data.payments)
				}
			} catch (error) {
				console.error('Xatolik:', error)
			} finally {
				setLoading(false)
			}
		}
		fetchData()
	}, [year, month])

	// Filtrlash funksiyasi
	useEffect(() => {
		let result = [...payments]

		// Ism bo'yicha filter
		if (searchName) {
			const searchTerm = searchName.toLowerCase()
			result = result.filter(pay =>
				pay.student?.fullName?.toLowerCase().includes(searchTerm)
			)
		}

		// To'lov foizi bo'yicha filter
		if (filterPercentage) {
			const percentage = parseFloat(filterPercentage)
			if (!isNaN(percentage)) {
				result = result.filter(pay => {
					const paidPercentage = (pay.amount_paid / pay.amount_due) * 100
					return paidPercentage < percentage
				})
			}
		}

		// To'lov holati bo'yicha filter
		if (paymentStatus !== 'all') {
			result = result.filter(pay => {
				const paidPercentage = (pay.amount_paid / pay.amount_due) * 100

				if (paymentStatus === 'paid') return paidPercentage >= 100
				if (paymentStatus === 'partial') return paidPercentage > 0 && paidPercentage < 100
				if (paymentStatus === 'unpaid') return paidPercentage === 0

				return true
			})
		}

		setFilteredPayments(result)
	}, [searchName, filterPercentage, paymentStatus, payments])

	// Modal tashqarisiga bosilganda yopish
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (modalRef.current && !modalRef.current.contains(event.target)) {
				closeModal()
			}
		}

		if (isModalOpen) {
			document.addEventListener('mousedown', handleClickOutside)
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [isModalOpen])

	// Talaba to'lov tarixini yuklash
	const fetchPaymentHistory = async (payment) => {
		setHistoryLoading(true)
		try {
			const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/payment/history`, {
				params: { payment }
			})

			if (res.data.success) {
				setPaymentHistory(res.data.paymentlogs)
			}
		} catch (error) {
			console.error("To'lov tarixini olishda xatolik:", error)
		} finally {
			setHistoryLoading(false)
		}
	}

	// Modalni ochish
	const openPaymentModal = (payment) => {
		setSelectedPayment(payment)
		fetchPaymentHistory(payment)
		setIsModalOpen(true)
	}

	// Modalni yopish
	const closeModal = () => {
		setIsModalOpen(false)
		setSelectedPayment(null)
		setPaymentHistory([])
	}

	// Format currency
	const formatCurrency = (value) => {
		if (!value) return '0 so\'m'
		return new Intl.NumberFormat('uz-UZ').format(value) + ' so\'m'
	}

	// Format date
	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString('uz-UZ', {
			day: '2-digit',
			month: 'long',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		})
	}

	// To'lov foizini hisoblash
	const calculatePaymentPercentage = (amountPaid, amountDue) => {
		if (amountDue === 0) return 0
		return Math.round((amountPaid / amountDue) * 100)
	}

	// Status rangini aniqlash
	const getStatusColor = (percentage) => {
		if (percentage === 0) return 'bg-red-100 text-red-800'
		if (percentage < 50) return 'bg-orange-100 text-orange-800'
		if (percentage < 100) return 'bg-yellow-100 text-yellow-800'
		return 'bg-green-100 text-green-800'
	}

	// Excelga yuklab olish
	const exportToExcel = (type = 'all') => {
		let dataToExport = []

		// Export qilinadigan ma'lumotlarni tayyorlash
		if (type === 'all') {
			dataToExport = payments.map(pay => ({
				'Talaba': pay.student?.fullName || 'Noma\'lum',
				'Manzil': pay.student?.address || '',
				'Telefon': pay.student?.phone || '',
				'Jami To\'lov': pay.amount_due,
				'To\'langan': pay.amount_paid,
				'Qolgan': pay.amount_due - pay.amount_paid,
				'Foiz': calculatePaymentPercentage(pay.amount_paid, pay.amount_due),
				'Holat': calculatePaymentPercentage(pay.amount_paid, pay.amount_due) === 0
					? "To'lanmagan"
					: calculatePaymentPercentage(pay.amount_paid, pay.amount_due) < 100
						? "Qisman to'langan"
						: "To'liq to'langan"
			}))
		} else {
			dataToExport = filteredPayments.map(pay => ({
				'Talaba': pay.student?.fullName || 'Noma\'lum',
				'Manzil': pay.student?.address || '',
				'Telefon': pay.student?.phone || '',
				'Jami To\'lov': pay.amount_due,
				'To\'langan': pay.amount_paid,
				'Qolgan': pay.amount_due - pay.amount_paid,
				'Foiz': calculatePaymentPercentage(pay.amount_paid, pay.amount_due),
				'Holat': calculatePaymentPercentage(pay.amount_paid, pay.amount_due) === 0
					? "To'lanmagan"
					: calculatePaymentPercentage(pay.amount_paid, pay.amount_due) < 100
						? "Qisman to'langan"
						: "To'liq to'langan"
			}))
		}

		// Excel ish kitobini yaratish
		const worksheet = XLSX.utils.json_to_sheet(dataToExport)
		const workbook = XLSX.utils.book_new()
		XLSX.utils.book_append_sheet(workbook, worksheet, "To'lovlar")

		// Faylni saqlash
		const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
		const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })

		// Fayl nomini belgilash
		let fileName = `To'lovlar_${year}-${month}`
		if (type !== 'all') fileName += `_${type}`

		saveAs(data, `${fileName}.xlsx`)
	}

	// Filtrlarni tozalash
	const clearFilters = () => {
		setSearchName('')
		setFilterPercentage('')
		setPaymentStatus('all')
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
			<div className="mx-auto">
				<div className="bg-white  p-6 mb-8 overflow-hidden">
					{/* Sarlavha va filtrlash */}
					<div className="flex flex-wrap justify-between items-center mb-6 pb-4 border-b border-gray-200">
						<div>
							<h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
								<div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-3 rounded-xl mr-4">
									<FaMoneyBillWave className="text-2xl" />
								</div>
								Oylik To'lovlar Nazorati
							</h1>
							<p className="text-gray-600">
								{year}-yil {month}-oy uchun to'lovlar monitoringi
							</p>
						</div>

						<div className="flex gap-2 mt-4 md:mt-0">
							<button
								onClick={() => exportToExcel('all')}
								className="bg-gradient-to-r from-green-600 to-emerald-700 text-white px-4 py-2 rounded-lg flex items-center hover:opacity-90 transition"
							>
								<FaFileExcel className="mr-2" /> Umumiy Excel
							</button>

							<button
								onClick={clearFilters}
								className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 py-2 rounded-lg flex items-center hover:opacity-90 transition"
							>
								<FaTrash className="mr-2" /> Filtrlarni tozalash
							</button>
						</div>
					</div>

					{/* Asosiy filtrlash paneli */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
						<div>
							<label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
								<FaSearch className="mr-2 text-blue-500" />
								Talaba ismi bo'yicha qidirish
							</label>
							<input
								type="text"
								value={searchName}
								onChange={(e) => setSearchName(e.target.value)}
								placeholder="Talaba ismini kiriting..."
								className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>

						<div>
							<label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
								<FaPercent className="mr-2 text-blue-500" />
								To'lov foizi bo'yicha filter
							</label>
							<div className="flex">
								<div className="relative flex-grow">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<FaPercent className="text-gray-400" />
									</div>
									<input
										type="number"
										value={filterPercentage}
										onChange={(e) => setFilterPercentage(e.target.value)}
										placeholder="Masalan: 65% dan kam to'lash"
										className="pl-10 w-full border border-gray-300 rounded-l-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
										min="0"
										max="100"
									/>
								</div>
								<button
									onClick={() => setFilterPercentage('')}
									className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-3 rounded-r-lg transition"
								>
									Tozalash
								</button>
							</div>
						</div>

						<div>
							<label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
								<FaFilter className="mr-2 text-blue-500" />
								To'lov holati bo'yicha filter
							</label>
							<select
								value={paymentStatus}
								onChange={(e) => setPaymentStatus(e.target.value)}
								className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								<option value="all">Barcha to'lovlar</option>
								<option value="paid">To'liq to'langanlar</option>
								<option value="partial">Qisman to'langanlar</option>
								<option value="unpaid">To'lanmaganlar</option>
							</select>
						</div>

						<div className="grid grid-cols-2 gap-3">
							<div>
								<label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
									<FaCalendarAlt className="mr-2 text-blue-500" />
									Yil
								</label>
								<input
									type="number"
									value={year}
									onChange={(e) => setYear(Number(e.target.value))}
									className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
									min={2000}
									max={2100}
								/>
							</div>

							<div>
								<label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
									<FaCalendarAlt className="mr-2 text-blue-500" />
									Oy
								</label>
								<select
									value={month}
									onChange={(e) => setMonth(Number(e.target.value))}
									className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
								>
									{[
										{ value: 1, name: "Yanvar" }, { value: 2, name: "Fevral" },
										{ value: 3, name: "Mart" }, { value: 4, name: "Aprel" },
										{ value: 5, name: "May" }, { value: 6, name: "Iyun" },
										{ value: 7, name: "Iyul" }, { value: 8, name: "Avgust" },
										{ value: 9, name: "Sentabr" }, { value: 10, name: "Oktabr" },
										{ value: 11, name: "Noyabr" }, { value: 12, name: "Dekabr" }
									].map(({ value, name }) => (
										<option key={value} value={value}>{name}</option>
									))}
								</select>
							</div>
						</div>
					</div>

					{/* Jadval ustidagi ma'lumotlar va export tugmalari */}
					<div className="flex flex-wrap justify-between items-center mb-4">
						<div className="text-sm text-gray-600 mb-2 md:mb-0">
							Jami: <span className="font-bold">{filteredPayments.length}</span> ta to'lov
							{filterPercentage && ` (${filterPercentage}% dan kam to'langan)`}
							{paymentStatus !== 'all' && ` (${paymentStatus === 'paid' ? "To'liq to'langan" : paymentStatus === 'partial' ? "Qisman to'langan" : "To'lanmagan"})`}
						</div>

						<div className="flex gap-2">
							<button
								onClick={() => exportToExcel('paid')}
								className="bg-gradient-to-r from-green-600 to-emerald-700 text-white px-3 py-1.5 rounded-lg text-sm flex items-center hover:opacity-90 transition"
							>
								<FaFileExcel className="mr-1" /> Yuklash
							</button>
						</div>
					</div>

					{/* Jadval qismi */}
					{loading ? (
						<div className="flex justify-center items-center h-64">
							<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
							<span className="ml-3 text-gray-600">Ma'lumotlar yuklanmoqda...</span>
						</div>
					) : filteredPayments.length === 0 ? (
						<div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-12 text-center border-2 border-dashed border-blue-200">
							<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
								<FaSearch className="text-xl" />
							</div>
							<h3 className="text-xl font-semibold text-gray-700 mb-2">To'lovlar topilmadi</h3>
							<p className="text-gray-600 max-w-md mx-auto">
								{filterPercentage
									? `${filterPercentage}% dan kam to'langan talabalar topilmadi`
									: paymentStatus !== 'all'
										? `${paymentStatus === 'paid' ? "To'liq to'langan" : paymentStatus === 'partial' ? "Qisman to'langan" : "To'lanmagan"} talabalar topilmadi`
										: `${year}-yil ${month}-oy uchun to'lovlar mavjud emas`
								}
							</p>
						</div>
					) : (
						<div className="overflow-x-auto rounded-2xl shadow-lg border border-blue-100">
							<table className="min-w-full bg-white">
								<thead className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
									<tr>
										<th className="py-4 px-6 text-left text-sm font-semibold">Talaba</th>
										<th className="py-4 px-6 text-left text-sm font-semibold">Manzil</th>
										<th className="py-4 px-6 text-left text-sm font-semibold">Telefon</th>
										<th className="py-4 px-6 text-left text-sm font-semibold">Jami To'lov</th>
										<th className="py-4 px-6 text-left text-sm font-semibold">To'langan</th>
										<th className="py-4 px-6 text-left text-sm font-semibold">Qolgan</th>
										<th className="py-4 px-6 text-left text-sm font-semibold">Foiz</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-100">
									{filteredPayments.map((payment) => {
										const percentage = calculatePaymentPercentage(payment.amount_paid, payment.amount_due)
										const statusColor = getStatusColor(percentage)
										const progressColor = percentage === 0 ? 'bg-red-500' :
											percentage < 50 ? 'bg-orange-500' :
												percentage < 100 ? 'bg-yellow-500' : 'bg-green-500'

										return (
											<tr
												key={payment._id}
												className="hover:bg-blue-50 cursor-pointer transition"
												onClick={() => openPaymentModal(payment)}
											>
												<td className="py-4 px-6">
													<div className="flex items-center">
														<div className="bg-gradient-to-br from-blue-100 to-indigo-100 border-2 border-dashed border-blue-200 rounded-xl w-10 h-10 flex items-center justify-center mr-3">
															<FaUser className="text-blue-500" />
														</div>
														<div className="font-medium text-gray-900">
															{payment.student?.fullName || 'Noma\'lum'}
														</div>
													</div>
												</td>
												<td className="py-4 px-6 text-sm text-gray-600 max-w-xs truncate">
													{payment.student?.address || 'Manzil mavjud emas'}
												</td>
												<td className="py-4 px-6 text-sm text-gray-600">
													{payment.student?.phone || 'Telefon yo\'q'}
												</td>
												<td className="py-4 px-6 font-semibold text-gray-900">
													{formatCurrency(payment.amount_due)}
												</td>
												<td className="py-4 px-6 text-green-600 font-semibold">
													{formatCurrency(payment.amount_paid)}
												</td>
												<td className="py-4 px-6 text-orange-600 font-semibold">
													{formatCurrency(payment.amount_due - payment.amount_paid)}
												</td>
												<td className="py-4 px-6">
													<div className="flex items-center">
														<div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
															<div
																className={`h-2.5 rounded-full ${progressColor}`}
																style={{ width: `${percentage}%` }}
															></div>
														</div>
														<span className="text-sm font-medium">{percentage}%</span>
													</div>
												</td>
											</tr>
										)
									})}
								</tbody>
							</table>
						</div>
					)}
				</div>

				{isModalOpen && (
					<div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-2 sm:p-4 z-50 backdrop-blur-sm">
						<div
							ref={modalRef}
							className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden transform transition-all duration-300 scale-95 animate-popup"
						>
							<div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 sm:p-6 text-white">
								<div className="flex justify-between items-center">
									<div>
										<h2 className="text-xl sm:text-2xl font-bold flex items-center">
											<div className="bg-white text-blue-600 p-1 sm:p-2 rounded-xl mr-2 sm:mr-3">
												<FaUser className="text-lg sm:text-xl" />
											</div>
											<span className="truncate max-w-[150px] sm:max-w-none">
												{selectedPayment.student?.fullName}
											</span>
										</h2>
										<p className="text-blue-100 mt-1 text-sm sm:text-base">
											{selectedPayment.student?.phone || 'Telefon mavjud emas'}
										</p>
									</div>
									<button
										onClick={closeModal}
										className="text-white bg-indigo-500 hover:text-gray-200 text-xl sm:text-2xl"
									>
										&times;
									</button>
								</div>
								<div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
									<div className="bg-blue-500/30 p-2 sm:p-3 rounded-lg">
										<p className="text-xs sm:text-sm opacity-90">Manzil</p>
										<p className="font-semibold text-xs sm:text-sm truncate">
											{selectedPayment.student?.address || 'Mavjud emas'}
										</p>
									</div>
									<div className="bg-blue-500/30 p-2 sm:p-3 rounded-lg">
										<p className="text-xs sm:text-sm opacity-90">Oylik to'lov</p>
										<p className="font-semibold text-xs sm:text-sm">
											{formatCurrency(selectedPayment.amount_due)}
										</p>
									</div>
									<div className="bg-blue-500/30 p-2 sm:p-3 rounded-lg">
										<p className="text-xs sm:text-sm opacity-90">Tanlangan oy</p>
										<p className="font-semibold text-xs sm:text-sm">
											{year}-yil {month}-oy
										</p>
									</div>
								</div>
							</div>

							<div className="p-4 sm:p-6 overflow-y-auto max-h-[55vh] sm:max-h-[60vh]">
								<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
									<h3 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center">
										<FaHistory className="mr-2 text-blue-600" />
										To'lov Tarixi
									</h3>
								</div>

								{historyLoading ? (
									<div className="flex flex-col sm:flex-row justify-center items-center py-8 sm:py-12 gap-3">
										<div className="animate-spin rounded-full h-8 sm:h-10 w-8 sm:w-10 border-t-2 border-b-2 border-blue-500"></div>
										<span className="text-gray-600 text-sm sm:text-base">
											To'lov tarixi yuklanmoqda...
										</span>
									</div>
								) : paymentHistory.length === 0 ? (
									<div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 sm:p-8 text-center border-2 border-dashed border-blue-200">
										<div className="inline-flex items-center justify-center w-12 sm:w-16 h-12 sm:h-16 rounded-full bg-blue-100 text-blue-600 mb-3 sm:mb-4">
											<FaInfoCircle className="text-lg sm:text-xl" />
										</div>
										<p className="text-gray-600 text-sm sm:text-base">
											Talabaning to'lov tarixi mavjud emas
										</p>
									</div>
								) : (
									<div className="overflow-x-auto rounded-xl border border-gray-200">
										<div className="min-w-[600px] sm:min-w-0">
											<table className="min-w-full bg-white">
												<thead className="bg-gray-100">
													<tr>
														<th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-gray-700">Sana</th>
														<th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-gray-700">Summa</th>
														<th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-gray-700">Izoh</th>
													</tr>
												</thead>
												<tbody className="divide-y divide-gray-200">
													{paymentHistory.map((payment) => (
														<tr key={payment._id} className="hover:bg-blue-50 transition">
															<td className="py-2 sm:py-3 px-2 sm:px-4">
																<div className="text-xs sm:text-sm font-medium text-gray-900">
																	{formatDate(payment.paidAt)}
																</div>
																<div className="text-xs text-gray-500">
																	{new Date(payment.paidAt).toLocaleTimeString('uz-UZ', {
																		hour: '2-digit',
																		minute: '2-digit'
																	})}
																</div>
															</td>
															<td className="py-2 sm:py-3 px-2 sm:px-4">
																<div className="text-xs sm:text-sm font-semibold text-green-600">
																	{formatCurrency(payment.amount)}
																</div>
															</td>
															<td className="py-2 sm:py-3 px-2 sm:px-4">
																<div className="text-xs sm:text-sm text-gray-700 max-w-[200px] truncate sm:max-w-none">
																	{payment.comment || 'Izoh mavjud emas'}
																</div>
																<div className="text-xs text-gray-500 mt-1 hidden sm:block">
																	{new Date(payment.createdAt).toLocaleDateString('uz-UZ')} yaratilgan
																</div>
															</td>
														</tr>
													))}
												</tbody>
											</table>
										</div>
									</div>
								)}
							</div>

							<div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 sm:px-6 py-3 sm:py-4 border-t border-blue-200 flex flex-col sm:flex-row justify-between items-center gap-2">
								<div className="text-xs sm:text-sm text-gray-600">
									Jami to'lovlar: {paymentHistory.length} ta
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

export default MonthlyPaymentControl
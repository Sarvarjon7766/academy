import axios from "axios"
import { useCallback, useEffect, useMemo, useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import { FaDownload, FaMoneyBillWave } from "react-icons/fa"
import { utils, writeFileXLSX } from "xlsx"

// Constants
const monthNames = [
	"Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
	"Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"
]

const MonthlyReport = () => {
	const now = new Date()
	const currentYear = now.getFullYear()
	const currentMonth = now.getMonth() + 1

	const [data, setData] = useState([])
	const [activeTeacher, setActiveTeacher] = useState(null)
	const [shareOfSalary, setShareOfSalary] = useState(0)
	const [selectedYear, setSelectedYear] = useState(currentYear)
	const [selectedMonth, setSelectedMonth] = useState(currentMonth)
	const [isLoading, setIsLoading] = useState(false)
	const [modalOpen, setModalOpen] = useState(false)
	const [modalData, setModalData] = useState(null)
	const [paymentAmount, setPaymentAmount] = useState("")

	// Memoized check for future months
	const isFutureMonth = useMemo(() => {
		return selectedYear > currentYear ||
			(selectedYear === currentYear && selectedMonth >= currentMonth)
	}, [selectedYear, selectedMonth, currentYear, currentMonth])

	// Fetch teacher salary data
	useEffect(() => {
		if (isFutureMonth) {
			setData([])
			return
		}

		const fetchData = async () => {
			setIsLoading(true)
			try {
				const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/teacher/teacher-selery`, {
					params: { year: selectedYear, month: selectedMonth },
				})
				setData(res.data.data)
			} catch (err) {
				console.error("Xatolik:", err)
				toast.error("Ma'lumotlarni yuklashda xatolik yuz berdi")
			} finally {
				setIsLoading(false)
			}
		}

		fetchData()
	}, [selectedYear, selectedMonth, isFutureMonth])

	// Toggle teacher details
	const toggleTeacher = useCallback((teacher) => {
		setActiveTeacher(prev => prev === teacher.teacherId ? null : teacher.teacherId)
		setShareOfSalary(teacher.share_of_salary)
	}, [])

	// Calculate salary calculation
	const calculateHisoblanma = useCallback((student, validDaysLength, shareValue) => {
		if (!student.attendance) return 0

		const attendance = student.attendance
		const kelganCount = attendance.filter(a => a.Status === "Kelgan").length
		const kelmaganCount = attendance.filter(a => a.Status === "Kelmagan").length
		const kelmaganKechirilgan = Math.min(2, kelmaganCount)
		const tolanadiganDarslar = kelganCount + kelmaganKechirilgan

		if (validDaysLength === 0 || tolanadiganDarslar === 0) return 0

		const fullUlush = student.price * shareValue
		const hisoblanma = (fullUlush / validDaysLength) * tolanadiganDarslar

		return parseFloat(hisoblanma.toFixed(2))
	}, [])

	// Export to Excel
	const exportToExcel = useCallback((teacher) => {
		const wb = utils.book_new()

		teacher.subjects.forEach((subject) => {
			const ws = {}
			const merges = []
			const cols = []
			let colOffset = 0
			let maxRowCount = 0

			subject.groups.forEach((group) => {
				const groupDatesSet = new Set()
				group.students.forEach((student) => {
					student.attendance.forEach((att) => {
						const d = new Date(att.date)
						const day = String(d.getDate()).padStart(2, "0")
						if (["Kelgan", "Kelmagan", "Ustoz"].includes(att.Status)) {
							groupDatesSet.add(day)
						}
					})
				})

				const validDays = Array.from(groupDatesSet).sort((a, b) => Number(a) - Number(b))
				const headers = ["№", "Ism Familiya", "Oyligi", "Ulushi", ...validDays, "Darslar soni", "Hisoblanma", "To'lov"]
				const startCol = colOffset

				merges.push({ s: { r: 0, c: startCol }, e: { r: 0, c: startCol + headers.length - 1 } })
				ws[utils.encode_cell({ r: 0, c: startCol })] = {
					v: `Guruh: ${group.groupName} (${monthNames[selectedMonth - 1]} ${selectedYear})`,
					s: { font: { bold: true } }
				}

				headers.forEach((header, i) => {
					ws[utils.encode_cell({ r: 1, c: startCol + i })] = { v: header }
					cols[startCol + i] = { wch: header.length + 2 }
				})

				let totalSalary = 0, totalShare = 0, totalHisoblanma = 0, totalTulov = 0

				group.students.forEach((student, rowIdx) => {
					const hisoblanma = calculateHisoblanma(student, validDays.length, shareOfSalary)
					const ulush = parseFloat((student.price * shareOfSalary).toFixed(2))
					const tulov = parseFloat((student.price * shareOfSalary) - hisoblanma).toFixed(2)

					totalSalary += parseFloat(student.price || 0)
					totalShare += ulush
					totalHisoblanma += hisoblanma
					totalTulov += parseFloat(tulov)

					const row = [
						rowIdx + 1,
						student.fullName,
						Number(student.price) || "",
						ulush,
						...validDays.map(day => {
							const match = student.attendance.find(a => new Date(a.date).getDate() === Number(day))
							return match?.Status === "Kelgan" ? "+" :
								match?.Status === "Kelmagan" ? "-" :
									match?.Status === "Ustoz" ? "k" :
										match?.Status === "Ishtirok etmagan" ? "y" : ""
						}),
						validDays.length,
						hisoblanma.toFixed(2),
						tulov
					]

					row.forEach((val, i) => {
						ws[utils.encode_cell({ r: rowIdx + 2, c: startCol + i })] = { v: val }
					})
				})

				const totalRow = group.students.length + 2
				ws[utils.encode_cell({ r: totalRow, c: startCol + 2 })] = { v: totalSalary.toFixed(2), s: { font: { bold: true } } }
				ws[utils.encode_cell({ r: totalRow, c: startCol + 3 })] = { v: totalShare.toFixed(2), s: { font: { bold: true } } }
				ws[utils.encode_cell({ r: totalRow, c: startCol + headers.length - 2 })] = { v: totalHisoblanma.toFixed(2), s: { font: { bold: true } } }
				ws[utils.encode_cell({ r: totalRow, c: startCol + headers.length - 1 })] = { v: totalTulov.toFixed(2), s: { font: { bold: true } } }

				colOffset += headers.length + 2
				maxRowCount = Math.max(maxRowCount, totalRow + 1)
			})

			ws["!merges"] = merges
			ws["!ref"] = `A1:${utils.encode_cell({ r: maxRowCount, c: colOffset })}`
			ws["!cols"] = cols
			utils.book_append_sheet(wb, ws, subject.subjectName.slice(0, 31))
		})

		writeFileXLSX(wb, `${teacher.teacherName} - ${monthNames[selectedMonth - 1]} ${selectedYear}.xlsx`)
		toast.success("Excel fayli muvaffaqiyatli yuklab olindi!")
	}, [calculateHisoblanma, shareOfSalary, selectedMonth, selectedYear])

	// Handle payment saving
	const handleSavePayment = async () => {
		if (!paymentAmount || isNaN(paymentAmount)) {
			toast.error("Iltimos, to'lov summasini kiriting")
			return
		}

		try {
			await axios.post(`${import.meta.env.VITE_API_URL}/api/payment/save`, {
				teacherId: modalData.teacherId,
				amount: Number(paymentAmount),
				year: selectedYear,
				month: selectedMonth,
			})

			toast.success("To'lov muvaffaqiyatli saqlandi!")
			setModalOpen(false)
			setPaymentAmount("")
		} catch (err) {
			console.error(err)
			toast.error("Xatolik yuz berdi")
		}
	}

	// Format currency
	const formatCurrency = (amount) => {
		return amount?.toLocaleString("ru-RU").replace(/,/g, ' ') || "0"
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4 md:p-6">
			<Toaster position="top-right" />

			<div className="mx-auto">
				{/* Date Selectors */}
				<div className="bg-white rounded-xl shadow-md p-4 mb-8 flex flex-col sm:flex-row gap-4">
					<div className="w-full sm:w-1/2">
						<label className="block text-sm font-medium text-gray-700 mb-1">Yilni tanlang</label>
						<select
							value={selectedYear}
							onChange={(e) => setSelectedYear(+e.target.value)}
							className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
						>
							{Array.from({ length: 6 }, (_, i) => currentYear - 2 + i).map((y) => (
								<option key={y} value={y}>{y}</option>
							))}
						</select>
					</div>

					<div className="w-full sm:w-1/2">
						<label className="block text-sm font-medium text-gray-700 mb-1">Oyni tanlang</label>
						<select
							value={selectedMonth}
							onChange={(e) => setSelectedMonth(+e.target.value)}
							className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
						>
							{monthNames.map((name, i) => (
								<option key={i} value={i + 1}>{name}</option>
							))}
						</select>
					</div>
				</div>

				{/* Loading State */}
				{isLoading && (
					<div className="flex justify-center py-12">
						<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
					</div>
				)}

				{/* Future Month Message */}
				{!isLoading && isFutureMonth && (
					<div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center mb-8">
						<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 mb-4">
							<svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
							</svg>
						</div>
						<h3 className="text-xl font-semibold text-gray-800 mb-2">Eslatma</h3>
						<p className="text-gray-600 max-w-md mx-auto">
							Faqat hozirgi oydan oldingi oylarning hisoblanmasi ko'rish mumkin.Hozirgi va Kelasi oylar uchun Oylik hisoblanmasi hisoblanmagan
						</p>
					</div>
				)}

				{/* Teacher Cards */}
				{!isLoading && !isFutureMonth && data.map((teacher) => (
					<TeacherCard
						key={teacher.teacherId}
						teacher={teacher}
						activeTeacher={activeTeacher}
						toggleTeacher={toggleTeacher}
						shareOfSalary={shareOfSalary}
						exportToExcel={exportToExcel}
						setModalData={setModalData}
						setModalOpen={setModalOpen}
						selectedMonth={selectedMonth}
						selectedYear={selectedYear}
						calculateHisoblanma={calculateHisoblanma}
					/>
				))}

				{/* Payment Modal */}
				{modalOpen && modalData && (
					<PaymentModal
						modalData={modalData}
						setModalOpen={setModalOpen}
						paymentAmount={paymentAmount}
						setPaymentAmount={setPaymentAmount}
						handleSavePayment={handleSavePayment}
						formatCurrency={formatCurrency}
					/>
				)}
			</div>
		</div>
	)
}

// Teacher Card Component
const TeacherCard = ({
	teacher,
	activeTeacher,
	toggleTeacher,
	shareOfSalary,
	exportToExcel,
	setModalData,
	setModalOpen,
	selectedMonth,
	selectedYear,
	calculateHisoblanma
}) => {
	const isActive = activeTeacher === teacher.teacherId

	return (
		<div className={`bg-white rounded-xl shadow-md overflow-hidden mb-6 transition-all duration-300 ${isActive ? "ring-2 ring-indigo-500" : ""}`}>
			<div
				className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 cursor-pointer hover:bg-indigo-50 transition-colors"
				onClick={() => toggleTeacher(teacher)}
			>
				<div className="flex-1">
					<div className="flex items-center">
						<div className="bg-indigo-100 p-2 rounded-lg mr-3">
							<svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
							</svg>
						</div>
						<div>
							<h3 className="text-lg font-semibold text-gray-800">{teacher.teacherName}</h3>
							<p className="text-sm text-gray-600">Oylik hisoblanma: <span className="font-medium">{formatCurrency(teacher.totalCalculated)} so'm</span></p>
						</div>
					</div>
				</div>

				<div className="flex items-center space-x-2 mt-3 sm:mt-0">
					<button
						onClick={(e) => {
							e.stopPropagation()
							setModalData(teacher)
							setModalOpen(true)
						}}
						className="flex items-center text-sm bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-200 transition-colors"
					>
						<FaMoneyBillWave className="mr-1" /> To'lov
					</button>

					{isActive && (
						<button
							onClick={(e) => {
								e.stopPropagation()
								exportToExcel(teacher)
							}}
							className="flex items-center text-sm bg-green-100 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-200 transition-colors"
						>
							<FaDownload className="mr-1" /> Excel
						</button>
					)}

					<div className={`transform transition-transform ${isActive ? "rotate-180" : ""}`}>
						<svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
						</svg>
					</div>
				</div>
			</div>

			{isActive && (
				<div className="border-t p-4 bg-gray-50">
					{teacher.subjects.map((subject) => (
						<div key={subject.subjectId} className="mb-6 last:mb-0">
							<div className="flex items-center mb-3">
								<div className="bg-purple-100 p-1.5 rounded-md mr-2">
									<svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
									</svg>
								</div>
								<h4 className="text-md font-medium text-gray-800">{subject.subjectName}</h4>
							</div>

							{subject.groups.map((group) => (
								<GroupTable
									key={group.groupId}
									group={group}
									shareOfSalary={shareOfSalary}
									calculateHisoblanma={calculateHisoblanma}
								/>
							))}
						</div>
					))}
				</div>
			)}
		</div>
	)
}

// Group Table Component
const GroupTable = ({ group, shareOfSalary, calculateHisoblanma }) => {
	// Calculate valid days for the group
	const validDays = useMemo(() => {
		const groupDatesSet = new Set()
		group.students.forEach((student) => {
			student.attendance?.forEach((att) => {
				const d = new Date(att.date)
				const day = String(d.getDate()).padStart(2, "0")
				if (["Kelgan", "Kelmagan", "Ustoz"].includes(att.Status)) {
					groupDatesSet.add(day)
				}
			})
		})
		return Array.from(groupDatesSet).sort((a, b) => Number(a) - Number(b))
	}, [group])

	return (
		<div className="mb-6 border rounded-lg overflow-hidden bg-white">
			<div className="bg-gray-100 px-4 py-2 border-b">
				<h5 className="font-medium text-gray-700">Guruh: {group.groupName}</h5>
			</div>

			<div className="overflow-x-auto">
				<table className="min-w-full text-sm">
					<thead>
						<tr className="bg-indigo-50 text-indigo-800">
							<th className="px-3 py-2 text-left border">#</th>
							<th className="px-3 py-2 text-left border">Ism Familiya</th>
							<th className="px-3 py-2 text-center border">Oyligi</th>
							<th className="px-3 py-2 text-center border">Ulushi</th>
							{validDays.map((day) => (
								<th key={day} className="px-2 py-2 text-center border">{day}</th>
							))}
							<th className="px-3 py-2 text-center border">Darslar</th>
							<th className="px-3 py-2 text-center border">Hisoblanma</th>
							<th className="px-3 py-2 text-center border">Ushlanma</th>
						</tr>
					</thead>
					<tbody>
						{group.students.map((student, idx) => {
							const hisoblanma = calculateHisoblanma(student, validDays.length, shareOfSalary)
							const tulov = ((student.price * shareOfSalary) - hisoblanma).toFixed(2)

							return (
								<tr key={student.studentId} className="hover:bg-gray-50 even:bg-gray-50">
									<td className="px-3 py-2 border text-gray-600">{idx + 1}</td>
									<td className="px-3 py-2 border font-medium">{student.fullName}</td>
									<td className="px-3 py-2 border text-center">{formatCurrency(student.price)}</td>
									<td className="px-3 py-2 border text-center">{formatCurrency(student.price * shareOfSalary)}</td>

									{validDays.map((day) => {
										const match = student.attendance?.find((a) => new Date(a.date).getDate() === Number(day))
										let statusSymbol = ""
										let statusClass = ""

										if (match) {
											switch (match.Status) {
												case "Kelgan":
													statusSymbol = "+"
													statusClass = "text-green-800 bg-green-100"
													break
												case "Kelmagan":
													statusSymbol = "-"
													statusClass = "text-red-800 bg-red-100"
													break
												case "Ustoz":
													statusSymbol = "k"
													statusClass = "text-red-800 bg-red-200" // Red background for Ustoz
													break
												case "Ishtirok etmagan":
													statusSymbol = "y"
													statusClass = "text-green-800 bg-green-200" // Green background for Ishtirok etmagan
													break
												default:
													statusSymbol = ""
											}
										}

										return (
											<td
												key={day}
												className={`px-2 py-2 border text-center font-bold ${statusClass} rounded-md`}
											>
												{statusSymbol}
											</td>
										)
									})}

									<td className="px-3 py-2 border text-center">{validDays.length}</td>
									<td className="px-3 py-2 border text-center font-medium text-green-700">{formatCurrency(hisoblanma)}</td>
									<td className="px-3 py-2 border text-center font-medium text-red-700">{formatCurrency(tulov)}</td>
								</tr>
							)
						})}
					</tbody>
				</table>
			</div>
		</div>
	)
}

// Payment Modal Component
const PaymentModal = ({
	modalData,
	setModalOpen,
	paymentAmount,
	setPaymentAmount,
	handleSavePayment,
	formatCurrency
}) => {
	const debt = modalData.totalCalculated - (modalData.avans || 0) - (modalData.paid || 0)

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
			<div className="bg-white rounded-xl shadow-xl w-full max-w-md relative">
				<div className="p-6">
					<div className="absolute top-4 right-4">
						<button
							onClick={() => setModalOpen(false)}
							className="text-gray-500 hover:text-gray-800 transition-colors"
						>
							<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
							</svg>
						</button>
					</div>

					<div className="text-center mb-6">
						<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-4">
							<FaMoneyBillWave className="w-8 h-8 text-indigo-600" />
						</div>
						<h2 className="text-2xl font-bold text-gray-800">To'lov Tafsilotlari</h2>
						<p className="text-gray-600 mt-1">{modalData.teacherName}</p>
					</div>

					<div className="space-y-4 mb-6">
						<div className="flex justify-between items-center pb-2 border-b">
							<span className="text-gray-600">Jami oylik:</span>
							<span className="font-semibold">{formatCurrency(modalData.totalCalculated)} so'm</span>
						</div>

						<div className="flex justify-between items-center pb-2 border-b">
							<span className="text-gray-600">Avans:</span>
							<span className="font-semibold">{formatCurrency(modalData.avans || 0)} so'm</span>
						</div>

						<div className="flex justify-between items-center pb-2 border-b">
							<span className="text-gray-600">To'langan:</span>
							<span className="font-semibold text-green-600">{formatCurrency(modalData.paid || 0)} so'm</span>
						</div>

						<div className="flex justify-between items-center">
							<span className="text-gray-600">Qarzdorlik:</span>
							<span className={`font-semibold ${debt > 0 ? 'text-red-600' : 'text-green-600'}`}>
								{formatCurrency(debt)} so'm
							</span>
						</div>
					</div>

					<div className="mb-6">
						<label className="block text-sm font-medium text-gray-700 mb-2">
							To'lov summasi (so'm)
						</label>
						<div className="relative">
							<input
								type="number"
								value={paymentAmount}
								onChange={(e) => setPaymentAmount(e.target.value)}
								className="w-full border border-gray-300 rounded-lg px-4 py-3 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
								placeholder="Masalan: 1000000"
							/>
							<span className="absolute right-3 top-3 text-gray-500">so'm</span>
						</div>
					</div>

					<button
						onClick={handleSavePayment}
						className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg shadow-md transition-colors flex items-center justify-center"
					>
						<FaMoneyBillWave className="mr-2" /> To'lovni Saqlash
					</button>
				</div>
			</div>
		</div>
	)
}

// Helper function to format currency
const formatCurrency = (amount) => {
	if (amount === undefined || amount === null) return "0"
	return amount.toLocaleString("ru-RU").replace(/,/g, ' ')
}

export default MonthlyReport
import axios from "axios"
import { useEffect, useState } from "react"
import { FaDownload } from "react-icons/fa6"
import { utils, writeFileXLSX } from "xlsx"

const monthNames = [
	"Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
	"Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"
]

const MonthlyReport = () => {
	const now = new Date()
	const currentYear = now.getFullYear()
	const month = now.getMonth()
	const currentMonth = now.getMonth() + 1

	const [data, setData] = useState([])
	const [activeTeacher, setActiveTeacher] = useState(null)
	const [shareOfSalary, setShareOfSalary] = useState(0)
	const [selectedYear, setSelectedYear] = useState(currentYear)
	const [selectedMonth, setSelectedMonth] = useState(month)

	useEffect(() => {
		const isFutureMonth =
			selectedYear > currentYear ||
			(selectedYear === currentYear && selectedMonth >= currentMonth)

		if (isFutureMonth) {
			setData([])
			return
		}

		axios
			.get(`${import.meta.env.VITE_API_URL}/api/teacher/teacher-selery`, {
				params: { year: selectedYear, month: selectedMonth },
			})
			.then((res) => {
				setData(res.data.data)
				console.log(res.data.data)
			})
			.catch((err) => console.error("Xatolik:", err))
	}, [selectedYear, selectedMonth])

	const toggleTeacher = (teacher) => {
		setActiveTeacher(activeTeacher === teacher.teacherId ? null : teacher.teacherId)
		setShareOfSalary(teacher.share_of_salary)
	}

	const calculateHisoblanma = (student, validDaysLength, shareValue) => {
		const attendance = student.attendance || []

		// Statuslar bo‘yicha ajratish
		const kelganCount = attendance.filter(a => a.Status === "Kelgan").length
		const kelmaganCount = attendance.filter(a => a.Status === "Kelmagan").length
		const ustozCount = attendance.filter(a => a.Status === "Ustoz").length
		const ishtirokEtmaganCount = attendance.filter(a => a.Status === "Ishtirok etmagan").length

		// "Kelmagan" 2tasi kechiriladi
		const kelmaganKechirilgan = Math.min(2, kelmaganCount)

		// Haqiqiy hisobga olinadigan darslar soni
		const tolanadiganDarslar = kelganCount + kelmaganKechirilgan

		const fullUlush = student.price * shareValue

		if (validDaysLength === 0 || tolanadiganDarslar === 0) return 0

		const hisoblanma = (fullUlush / validDaysLength) * tolanadiganDarslar

		return parseFloat(hisoblanma.toFixed(2))
	}


	const exportToExcel = (teacher) => {
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
					const hisoblanma = parseFloat(calculateHisoblanma(student, validDays.length, shareOfSalary))
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
							return match?.Status === "Kelgan" ? "+" : match?.Status === "Kelmagan" ? "-" : match?.Status === "Ustoz" ? "k" : match?.Status === "Ishtirok etmagan" ? "y" : ""
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
	}


	return (
		<div className="p-4 min-h-screen bg-gradient-to-r from-blue-50 to-purple-100">
			<div className="max-w-7xl mx-auto">
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
					<select value={selectedYear} onChange={(e) => setSelectedYear(+e.target.value)} className="border rounded px-4 py-2 shadow bg-white">
						{Array.from({ length: 6 }, (_, i) => currentYear - 2 + i).map((y) => (
							<option key={y} value={y}>{y}</option>
						))}
					</select>
					<select value={selectedMonth} onChange={(e) => setSelectedMonth(+e.target.value)} className="border rounded px-4 py-2 shadow bg-white">
						{monthNames.map((name, i) => (
							<option key={i} value={i + 1}>{name}</option>
						))}
					</select>
				</div>

				{(selectedYear > currentYear || (selectedYear === currentYear && selectedMonth >= currentMonth)) ? (
					<p className="text-red-600 text-center font-semibold">
						Hozirgi oy yoki kelajak oy uchun ma’lumot mavjud emas.
					</p>
				) : data.map((teacher) => (
					<div key={teacher.teacherId} className="bg-white shadow-md rounded-lg mb-8 p-6 transition duration-300 hover:shadow-xl">
						<div className="flex flex-col sm:flex-row justify-between items-center gap-4 cursor-pointer" onClick={() => toggleTeacher(teacher)}>
							<h2 className="text-xl font-bold text-blue-800 relative">
								<span className="inline-block">
									{teacher.teacherName}
									<span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-300 rounded-full animate-pulse"></span>
								</span>
								{teacher.totalCalculated && (
									<span className="ml-3 text-sm text-green-700 bg-green-100 px-3 py-1 rounded-full border border-green-300">
										{teacher.totalCalculated.toLocaleString("ru-RU").replace(/,/g, ' ')} so‘m
									</span>
								)}
							</h2>
							{activeTeacher === teacher.teacherId && (
								<button onClick={(e) => { e.stopPropagation(); exportToExcel(teacher) }} className="bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 rounded shadow hover:scale-105 transition-transform">
									<FaDownload className="inline mr-2" /> Excel
								</button>
							)}
						</div>

						{activeTeacher === teacher.teacherId && teacher.subjects.map((subject) => (
							<div key={subject.subjectId} className="mt-6">
								<h3 className="text-lg font-semibold text-purple-800 mb-4">📘 {subject.subjectName}</h3>
								{subject.groups.map((group) => {
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

									return (
										<div key={group.groupId} className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
											<h4 className="text-center font-semibold text-gray-700 mb-2">📖 Guruh: {group.groupName}</h4>
											<div className="overflow-x-auto">
												<table className="min-w-full text-sm text-gray-800">
													<thead>
														<tr className="bg-blue-100 text-blue-800">
															<th className="px-2 py-1 border">№</th>
															<th className="px-2 py-1 border">Ism Familiya</th>
															<th className="px-2 py-1 border">Oyligi</th>
															<th className="px-2 py-1 border">Ulushi</th>
															{validDays.map((day) => (
																<th key={day} className="px-2 py-1 border">{day}</th>
															))}
															<th className="px-2 py-1 border">Darslar</th>
															<th className="px-2 py-1 border">Hisoblanma</th>
															<th className="px-2 py-1 border">Ushlanma</th>
														</tr>
													</thead>
													<tbody>
														{group.students.map((student, idx) => {
															const attendanceMarks = validDays.map((day) => {
																const match = student.attendance.find((a) => new Date(a.date).getDate() === Number(day))
																return match?.Status === "Kelgan" ? "+" : match?.Status === "Kelmagan" ? "-" : match?.Status === "Ustoz" ? "k" : match?.Status === "Ishtirok etmagan" ? "y" : ""
															})
															const hisoblanma = calculateHisoblanma(student, validDays.length, shareOfSalary)
															const tulov = ((student.price * shareOfSalary) - hisoblanma).toFixed(2)
															return (
																<tr key={student.studentId} className="hover:bg-gray-50">
																	<td className="border px-2 py-1 text-center">{idx + 1}</td>
																	<td className="border px-2 py-1 whitespace-nowrap">{student.fullName}</td>
																	<td className="border px-2 py-1 text-center">{student.price}</td>
																	<td className="border px-2 py-1 text-center">{(student.price * shareOfSalary).toFixed(2)}</td>
																	{attendanceMarks.map((mark, i) => (
																		<td key={i} className="border px-2 py-1 text-center">{mark}</td>
																	))}
																	<td className="border px-2 py-1 text-center">{validDays.length}</td>
																	<td className="border px-2 py-1 text-center">{hisoblanma.toLocaleString('ru-RU').replace(/,/g, ' ')}</td>
																	<td className="border px-2 py-1 text-center">{tulov}</td>
																</tr>
															)
														})}
													</tbody>
												</table>
											</div>
										</div>
									)
								})}
							</div>
						))}
					</div>
				))}
			</div>
		</div>
	)
}

export default MonthlyReport
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
				setData(res.data.data);
				console.log(res.data.data)
			})
			.catch((err) => console.error("Xatolik:", err))
	}, [selectedYear, selectedMonth])

	const toggleTeacher = (teacher) => {
		setActiveTeacher(activeTeacher === teacher.teacherId ? null : teacher.teacherId)
		setShareOfSalary(teacher.share_of_salary)
	}

	const calculateHisoblanma = (student, validDaysLength, shareValue) => {
		const attendance = student.attendance
		let hisoblanmaydiganDarslar = 0

		const kelmaganCount = attendance.filter((a) => a.Status === "Kelmagan").length
		if (kelmaganCount > 2) {
			hisoblanmaydiganDarslar += kelmaganCount
		}

		const ustozCount = attendance.filter((a) => a.Status === "Ustoz").length
		hisoblanmaydiganDarslar += ustozCount

		const statusYoqlari = attendance.filter((a) => !a.Status).length
		hisoblanmaydiganDarslar += statusYoqlari

		if (hisoblanmaydiganDarslar === 0 || validDaysLength === 0) return "0.00"

		const deduction = student.price * shareValue - ((student.price * shareValue) / validDaysLength) * hisoblanmaydiganDarslar
		return deduction.toFixed(2)
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
							return match?.Status === "Kelgan" ? "+" : match?.Status === "Kelmagan" ? "-" : match?.Status === "Ustoz" ? "k" : match?.Status === "Ishtirok etmagan" ? "y":""
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
		<div className="p-4 space-y-6">
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
				<select value={selectedYear} onChange={(e) => setSelectedYear(+e.target.value)} className="border rounded px-3 py-2">
					{Array.from({ length: 6 }, (_, i) => currentYear - 2 + i).map((y) => (
						<option key={y} value={y}>{y}</option>
					))}
				</select>
				<select value={selectedMonth} onChange={(e) => setSelectedMonth(+e.target.value)} className="border rounded px-3 py-2">
					{monthNames.map((name, i) => (
						<option key={i} value={i + 1}>{name}</option>
					))}
				</select>
			</div>
			{(selectedYear > currentYear || (selectedYear === currentYear && selectedMonth >= currentMonth)) ? (
				<p className="text-red-600 text-center font-semibold">
					Hozirgi oy yoki kelajak oy uchun ma’lumot mavjud emas.
				</p>
			):data.map((teacher) => (
				<div key={teacher.teacherId} className="border rounded bg-white shadow p-4">
					<div className="flex justify-between items-center cursor-pointer" onClick={() => toggleTeacher(teacher)}>
						<h2 className="font-bold text-lg">{teacher.teacherName}</h2>
						{activeTeacher === teacher.teacherId && (
							<button onClick={(e) => { e.stopPropagation(); exportToExcel(teacher) }} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2">
								<FaDownload />
							</button>
						)}
					</div>
					{activeTeacher === teacher.teacherId && teacher.subjects.map((subject) => (
						<div key={subject.subjectId} className="mt-4">
							<h3 className="text-md font-semibold mb-2">{subject.subjectName}</h3>
							{subject.groups.map((group) => {
								let totalHisoblanma = 0
								let totalTulov = 0
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
									<div key={group.groupId} className="border p-4 rounded-lg bg-gray-50 mb-4">
										<h4 className="text-center font-medium mb-2">Guruh: {group.groupName}</h4>
										<div className="overflow-x-auto w-full">
											<table className="min-w-full border text-sm">
												<thead>
													<tr className="bg-gray-200">
														<th className="border px-2 py-1">№</th>
														<th className="border px-2 py-1">Ism Familiya</th>
														<th className="border px-2 py-1">Oyligi</th>
														<th className="border px-2 py-1">Ulushi</th>
														{validDays.map((day) => (
															<th key={day} className="border px-2 py-1">{day}</th>
														))}
														<th className="border px-2 py-1">Darslar soni</th>
														<th className="border px-2 py-1">Hisoblanma</th>
														<th className="border px-2 py-1">Ushlanma</th>
													</tr>
												</thead>
												<tbody>
													{group.students.map((student, idx) => {
														const attendanceMarks = validDays.map((day) => {
															const match = student.attendance.find((a) => {
																const d = new Date(a.date)
																return String(d.getDate()).padStart(2, "0") === day
															})
															return match?.Status === "Kelgan" ? "+" : match?.Status === "Kelmagan" ? "-" : match?.Status === "Ustoz" ? "k" : match?.Status === "Ishtirok etmagan" ? "y":""
														})
														const hisoblanma = calculateHisoblanma(student, validDays.length, shareOfSalary)
														const tulov = ((student.price * shareOfSalary) - hisoblanma).toFixed(2)
														totalHisoblanma += parseFloat(hisoblanma || 0)
														totalTulov += parseFloat(tulov || 0)
														return (
															<tr key={student.studentId}>
																<td className="border px-2 py-1 text-center">{idx + 1}</td>
																<td className="border px-2 py-1 whitespace-nowrap">{student.fullName}</td>
																<td className="border px-2 py-1 text-center">{student.price}</td>
																<td className="border px-2 py-1 text-center">{(student.price * shareOfSalary).toFixed(2)}</td>
																{attendanceMarks.map((mark, i) => (
																	<td key={i} className="border px-2 py-1 text-center">{mark}</td>
																))}
																<td className="border px-2 py-1 text-center">{validDays.length}</td>
																<td className="border px-2 py-1 text-center">{(hisoblanma).toLocaleString('ru-RU').replace(/,/g, ' ')}</td>
																<td className="border px-2 py-1 text-center">{tulov}</td>
															</tr>
														)
													})}
												</tbody>
											</table>
											<div className="flex flex-col sm:flex-row justify-end gap-4 mt-3 pr-2">
												<p className="text-right text-gray-700 font-semibold text-base bg-gray-100 px-4 py-2 rounded shadow">
													{totalHisoblanma.toLocaleString('ru-RU').replace(/,/g, ' ')} so‘m
												</p>
												<p className="text-right text-gray-700 font-semibold text-base bg-gray-100 px-4 py-2 rounded shadow">
													{totalTulov.toLocaleString('ru-RU').replace(/,/g, ' ')} so‘m
												</p>
											</div>

										</div>
									</div>
								)
							})}
						</div>
					))}
				</div>
			))}
		</div>
	)
}

export default MonthlyReport
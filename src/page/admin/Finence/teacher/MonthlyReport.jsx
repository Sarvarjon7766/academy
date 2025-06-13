import axios from "axios"
import { useEffect, useState } from "react"
import { FaDownload } from "react-icons/fa6"
import { utils, writeFileXLSX } from "xlsx"

const MonthlyReport = () => {
	const now = new Date()
	const currentYear = now.getFullYear()
	const currentMonth = now.getMonth() + 1

	const [data, setData] = useState([])
	const [activeTeacher, setActiveTeacher] = useState(null)
	const [selectedYear, setSelectedYear] = useState(currentYear)
	const [selectedMonth, setSelectedMonth] = useState(currentMonth)

	const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate()
	const days = Array.from({ length: daysInMonth }, (_, i) => String(i + 1).padStart(2, "0"))

	useEffect(() => {
		axios
			.get(`${import.meta.env.VITE_API_URL}/api/teacher/teacher-selery`, {
				params: {
					year: selectedYear,
					month: selectedMonth,
				},
			})
			.then((res) => setData(res.data.data))
			.catch((err) => console.error("Xatolik:", err))
	}, [selectedYear, selectedMonth]) // filter o'zgarganda qayta chaqirish uchun

	const toggleTeacher = (id) => {
		setActiveTeacher(activeTeacher === id ? null : id)
	}

	const exportToExcel = (teacher) => {
		const wb = utils.book_new()

		teacher.subjects.forEach((subject) => {
			const ws = {}
			const merges = []
			const cols = []
			let colOffset = 0
			let maxRowCount = 0

			const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString().padStart(2, "0"))

			const borderStyle = {
				top: { style: "thin" },
				bottom: { style: "thin" },
				left: { style: "thin" },
				right: { style: "thin" },
			}

			subject.groups.forEach((group) => {
				const startCol = colOffset
				const headers = ["№", "Ism Familiya", "Oyligi", ...currentMonthDays, "Hisoblanma", "To'lov qilingan"]

				const mergeRange = {
					s: { r: 0, c: startCol },
					e: { r: 0, c: startCol + headers.length - 1 },
				}

				ws[utils.encode_cell(mergeRange.s)] = {
					v: `Guruh: ${group.groupName} (${selectedYear}-${String(selectedMonth).padStart(2, "0")})`,
					s: { font: { bold: true }, alignment: { horizontal: "center" }, border: borderStyle },
				}
				merges.push(mergeRange)

				headers.forEach((header, i) => {
					const cell = utils.encode_cell({ r: 1, c: startCol + i })
					ws[cell] = {
						v: header,
						s: { font: { bold: true }, alignment: { horizontal: "center" }, border: borderStyle },
					}
					cols[startCol + i] = { wch: header.length }
				})

				group.students.forEach((student, rowIdx) => {
					const rowNumber = rowIdx + 1
					const monthlyFee = student.fee != null ? student.fee.toString() : ""
					const paymentStatus = student.paymentStatus || ""

					const attendanceMarks = currentMonthDays.map((day) => {
						const fullDate = new Date(`${selectedYear}-${String(selectedMonth).padStart(2, "0")}-${day}`)
						const att = student.attendance?.find((a) => {
							const attDate = new Date(a.date)
							return (
								attDate.getFullYear() === fullDate.getFullYear() &&
								attDate.getMonth() === fullDate.getMonth() &&
								attDate.getDate() === fullDate.getDate()
							)
						})
						return att?.Status === "Kelgan" ? "+" : "-"
					})

					const row = [
						rowNumber.toString(),
						student.fullName || "",
						monthlyFee,
						...attendanceMarks,
						"",
						paymentStatus.toString(),
					]

					row.forEach((val, i) => {
						const cell = utils.encode_cell({ r: rowIdx + 2, c: startCol + i })
						ws[cell] = { v: val, s: { border: borderStyle } }
						const width = val.toString().length
						if (!cols[startCol + i] || cols[startCol + i].wch < width) {
							cols[startCol + i] = { wch: width }
						}
					})
				})

				colOffset += headers.length + 2
				maxRowCount = Math.max(maxRowCount, group.students.length + 2)
			})

			ws["!merges"] = merges
			ws["!ref"] = `A1:${utils.encode_cell({ r: maxRowCount, c: colOffset })}`
			ws["!cols"] = cols

			utils.book_append_sheet(wb, ws, subject.subjectName.slice(0, 31))
		})

		writeFileXLSX(wb, `${teacher.teacherName}.xlsx`)
	}

	const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear - 2 + i)
	const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1)

	return (
		<div className="w-full p-4 space-y-6">
			{/* Filter */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
				<div>
					<label className="block text-sm font-medium mb-1">Yil</label>
					<select
						value={selectedYear}
						onChange={(e) => setSelectedYear(Number(e.target.value))}
						className="w-full border px-3 py-2 rounded-md"
					>
						{yearOptions.map((y) => (
							<option key={y} value={y}>{y}</option>
						))}
					</select>
				</div>
				<div>
					<label className="block text-sm font-medium mb-1">Oy</label>
					<select
						value={selectedMonth}
						onChange={(e) => setSelectedMonth(Number(e.target.value))}
						className="w-full border px-3 py-2 rounded-md"
					>
						{monthOptions.map((m) => (
							<option key={m} value={m}>{String(m).padStart(2, '0')}</option>
						))}
					</select>
				</div>
			</div>

			{/* O'qituvchilar */}
			{data.map((teacher) => (
				<div key={teacher.teacherId} className="border rounded-xl bg-white shadow p-5 space-y-4">
					<div
						className="cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-3"
						onClick={() => toggleTeacher(teacher.teacherId)}
					>
						<h2 className="text-xl font-bold">{teacher.teacherName}</h2>
						<div className="flex flex-wrap gap-2">
							{teacher.subjects.map((subject) => (
								<span
									key={subject.subjectId}
									className="bg-blue-600 text-white text-xs md:text-sm px-3 py-1 rounded-full"
								>
									{subject.subjectName}
								</span>
							))}
						</div>
					</div>

					{activeTeacher === teacher.teacherId && (
						<div className="space-y-6">
							{/* Fan va Guruhlar */}
							{teacher.subjects.map((subject) => (
								<div
									key={subject.subjectId}
									className="flex flex-col border border-blue-300 bg-blue-50 p-4 rounded-lg w-full max-w-7xl mx-auto"
								>
									<div className="flex items-center justify-between border-b pb-1 mb-3">
										<h3 className="text-lg font-semibold text-blue-700 text-center w-full">
											{subject.subjectName}
										</h3>
										<button
											onClick={(e) => {
												e.stopPropagation()
												exportToExcel(teacher)
											}}
											className="ml-4 text-sm text-white bg-green-600 hover:underline flex items-center gap-1"
										>
											<FaDownload />
										</button>
									</div>


									{subject.groups.map((group) => (
										<div key={group.groupId} className="mb-4 bg-white p-4 border rounded-lg">
											<h4 className="text-center font-medium mb-2 border-b pb-1">
												Guruh: {group.groupName}
											</h4>

											{group.students.length > 0 ? (
												<div className="w-full overflow-x-auto">
													<table className="min-w-max table-auto border-collapse border text-sm w-full">
														<thead className="bg-gray-100">
															<tr>
																<th className="border px-2 py-1">№</th>
																<th className="border px-2 py-1">Ism Familiya</th>
																<th className="border px-2 py-1">Oyligi</th>
																{days.map((day) => (
																	<th key={day} className="border px-2 py-1 text-[10px]">{day}</th>
																))}
																<th className="border px-2 py-1">Hisoblanma</th>
																<th className="border px-2 py-1">To'lov qilingan</th>
															</tr>
														</thead>
														<tbody>
															{group.students.map((student, idx) => (
																<tr key={student.studentId}>
																	<td className="border px-2 py-1 text-center">{idx + 1}</td>
																	<td className="border px-2 py-1">{student.fullName}</td>
																	<td className="border px-2 py-1">{student.fee || ""}</td>
																	{days.map((day) => {
																		const fullDate = new Date(`${selectedYear}-${String(selectedMonth).padStart(2, "0")}-${day}`)
																		const att = student.attendance?.find(a => {
																			const attDate = new Date(a.date)
																			return (
																				attDate.getFullYear() === fullDate.getFullYear() &&
																				attDate.getMonth() === fullDate.getMonth() &&
																				attDate.getDate() === fullDate.getDate()
																			)
																		})
																		const mark = att?.Status === "Kelgan" ? "+" : "-"
																		const markClass = mark === "+" ? "text-green-600 font-bold" : "text-red-500"
																		return (
																			<td key={day} className={`border px-2 py-1 text-center ${markClass}`}>
																				{mark}
																			</td>
																		)
																	})}
																	<td className="border px-2 py-1"></td>
																	<td className="border px-2 py-1">{student.paymentStatus || ""}</td>
																</tr>
															))}
														</tbody>
													</table>
												</div>
											) : (
												<p className="text-sm text-gray-500">Talabalar yo‘q</p>
											)}
										</div>
									))}
								</div>
							))}
						</div>
					)}
				</div>
			))}
		</div>
	)
}

export default MonthlyReport

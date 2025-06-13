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
	const [shareOfSalary, setShareOfSalary] = useState(0)
	const [selectedYear, setSelectedYear] = useState(currentYear)
	const [selectedMonth, setSelectedMonth] = useState(currentMonth)

	useEffect(() => {
		axios
			.get(`${import.meta.env.VITE_API_URL}/api/teacher/teacher-selery`, {
				params: { year: selectedYear, month: selectedMonth },
			})
			.then((res) => setData(res.data.data))
			.catch((err) => console.error("Xatolik:", err))
	}, [selectedYear, selectedMonth])

	const toggleTeacher = (teacher) => {
		setActiveTeacher(activeTeacher === teacher.teacherId ? null : teacher.teacherId)
		setShareOfSalary(teacher.share_of_salary)
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
						if (att.Status === "Kelgan" || att.Status === "Kelmagan") {
							groupDatesSet.add(day)
						}
					})
				})
				const validDays = Array.from(groupDatesSet).sort((a, b) => Number(a) - Number(b))
				const headers = ["\u2116", "Ism Familiya", "Oyligi", "Ulushi", ...validDays, "Darslar soni", "Hisoblanma", "To'lov"]
				const startCol = colOffset
				merges.push({ s: { r: 0, c: startCol }, e: { r: 0, c: startCol + headers.length - 1 } })
				ws[utils.encode_cell({ r: 0, c: startCol })] = { v: `Guruh: ${group.groupName}`, s: { font: { bold: true } } }
				headers.forEach((header, i) => {
					ws[utils.encode_cell({ r: 1, c: startCol + i })] = { v: header }
					cols[startCol + i] = { wch: header.length + 2 }
				})
				group.students.forEach((student, rowIdx) => {
					const row = [
						rowIdx + 1,
						student.fullName,
						student.price || "",
						(student.price * shareOfSalary).toFixed(2),
						...validDays.map((day) => {
							const match = student.attendance.find((a) => new Date(a.date).getDate() === Number(day))
							return match?.Status === "Kelgan" ? "+" : match?.Status === "Kelmagan" ? "-" : ""
						}),
						validDays.length,
						"",
						student.paymentStatus || "",
					]
					row.forEach((val, i) => {
						ws[utils.encode_cell({ r: rowIdx + 2, c: startCol + i })] = { v: val }
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

	return (
		<div className="p-4 space-y-6">
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
				<select value={selectedYear} onChange={(e) => setSelectedYear(+e.target.value)} className="border rounded px-3 py-2">
					{Array.from({ length: 6 }, (_, i) => currentYear - 2 + i).map((y) => <option key={y} value={y}>{y}</option>)}
				</select>
				<select value={selectedMonth} onChange={(e) => setSelectedMonth(+e.target.value)} className="border rounded px-3 py-2">
					{Array.from({ length: 12 }, (_, i) => i + 1).map((m) => <option key={m} value={m}>{String(m).padStart(2, '0')}</option>)}
				</select>
			</div>
			{data.map((teacher) => (
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
								const groupDatesSet = new Set()
								group.students.forEach((student) => {
									student.attendance.forEach((att) => {
										const d = new Date(att.date)
										const day = String(d.getDate()).padStart(2, "0")
										if (att.Status === "Kelgan" || att.Status === "Kelmagan") {
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
														<th className="border px-2 py-1">To'lov</th>
													</tr>
												</thead>
												<tbody>
													{group.students.map((student, idx) => {
														const attendanceMarks = validDays.map((day) => {
															const match = student.attendance.find((a) => {
																const d = new Date(a.date)
																return String(d.getDate()).padStart(2, "0") === day
															})
															return match?.Status === "Kelgan" ? "+" : match?.Status === "Kelmagan" ? "-" : ""
														})
														return (
															<tr key={student.studentId}>
																<td className="border px-2 py-1 text-center">{idx + 1}</td>
																<td className="border px-2 py-1 whitespace-nowrap">{student.fullName}</td>
																<td className="border px-2 py-1 text-center">{student.price}</td>
																<td className="border px-2 py-1 text-center">{(student.price * shareOfSalary).toFixed(2)}</td>
																{attendanceMarks.map((mark, i) => (
																	<td key={i} className="border px-2 py-1 text-center">{mark}</td>
																))}
																<td className="border px-2 py-1 text-center">{attendanceMarks.length}</td>
																<td className="border px-2 py-1 text-center"></td>
																<td className="border px-2 py-1 text-center">{student.paymentStatus || ""}</td>
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
	)
}

export default MonthlyReport
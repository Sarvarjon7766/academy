import axios from "axios"
import { useEffect, useState } from "react"
import { FaDownload } from "react-icons/fa6"
import { utils } from "xlsx"
import { writeFileXLSX } from "xlsx"


const MonthlyReport = () => {
	const [data, setData] = useState([])
	const [activeTeacher, setActiveTeacher] = useState(null)
	const [loadingId, setLoadingId] = useState(null) // Yangi: yuklanayotgan teacher ID

	useEffect(() => {
		axios.get(`${import.meta.env.VITE_API_URL}/api/teacher/teacher-selery`)
			.then((res) => setData(res.data.data))
			.catch((err) => console.error("Xatolik:", err))
	}, [])

	const toggleTeacher = (id) => {
		setActiveTeacher(activeTeacher === id ? null : id)
	}

	const exportToExcel = (teacher) => {
		const wb = utils.book_new()

		teacher.subjects.forEach((subject) => {
			const ws = {}
			const merges = []
			let colOffset = 0
			let maxRowCount = 0

			subject.groups.forEach((group) => {
				const startCol = colOffset
				const headers = ["Talaba ismi", "Telefon", "ID", "Holati"]

				// Guruh nomi (1-qatordagi merged cell)
				const mergeRange = {
					s: { r: 0, c: startCol },
					e: { r: 0, c: startCol + headers.length - 1 },
				}
				ws[utils.encode_cell(mergeRange.s)] = {
					v: `Guruh: ${group.groupName}`,
					s: {
						fill: { fgColor: { rgb: "ADD8E6" } },
						font: { bold: true },
						alignment: { horizontal: "center" },
					},
				}
				merges.push(mergeRange)

				// Header row
				headers.forEach((header, i) => {
					const cell = utils.encode_cell({ r: 1, c: startCol + i })
					ws[cell] = { v: header }
				})

				// Student data
				group.students.forEach((student, rowIdx) => {
					const row = [
						student.fullName || "",
						student.phone || "",
						student.studentId || "",
						student.status || "",
					]
					row.forEach((val, i) => {
						const cell = utils.encode_cell({ r: rowIdx + 2, c: startCol + i })
						ws[cell] = { v: val }
					})
				})

				colOffset += headers.length + 2
				maxRowCount = Math.max(maxRowCount, group.students.length + 2)
			})

			ws["!merges"] = merges
			ws["!ref"] = `A1:${utils.encode_cell({ r: maxRowCount, c: colOffset })}`
			utils.book_append_sheet(wb, ws, subject.subjectName.slice(0, 31))
		})

		writeFileXLSX(wb, `${teacher.teacherName}.xlsx`)
	}

	return (
		<div className="mx-auto p-6 space-y-6">
			{data.map((teacher) => (
				<div key={teacher.teacherId} className="border rounded-lg shadow bg-white p-6">
					<div
						className="cursor-pointer flex justify-between items-center"
						onClick={() => toggleTeacher(teacher.teacherId)}
					>
						<h2 className="text-xl font-bold text-gray-800">{teacher.teacherName}</h2>
						<div className="flex flex-wrap gap-2">
							{teacher.subjects.map((subject) => (
								<span
									key={subject.subjectId}
									className="bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-sm"
								>
									{subject.subjectName}
								</span>
							))}
						</div>
					</div>

					{activeTeacher === teacher.teacherId && (
						<div className="mt-6 space-y-6">
							<div className="flex justify-end mb-4">
								<button
									onClick={() => exportToExcel(teacher)}
									disabled={loadingId === teacher.teacherId}
									className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-md shadow flex items-center gap-2"
								>
									<FaDownload />
								</button>
							</div>

							{teacher.subjects.map((subject) => (
								<div
									key={subject.subjectId}
									className="bg-blue-50 border border-blue-200 p-5 rounded-lg shadow-inner"
								>
									<h3 className="text-lg font-bold text-blue-700 text-center mb-4 border-b pb-2">
										{subject.subjectName}
									</h3>

									{subject.groups.map((group) => (
										<div
											key={group.groupId}
											className="bg-white border rounded-md shadow-sm p-4 mb-4"
										>
											<h4 className="text-md font-semibold text-gray-700 mb-3 text-center border-b pb-1">
												Guruh: {group.groupName}
											</h4>

											{group.students.length > 0 ? (
												<table className="w-full text-left border border-gray-300">
													<thead>
														<tr className="bg-gray-200 text-gray-700">
															<th className="px-4 py-2 border">Talaba ismi</th>
														</tr>
													</thead>
													<tbody>
														{group.students.map((student) => (
															<tr key={student.studentId} className="hover:bg-gray-50">
																<td className="px-4 py-2 border">{student.fullName}</td>
															</tr>
														))}
													</tbody>
												</table>
											) : (
												<p className="text-sm text-gray-500 text-center italic">
													Talabalar mavjud emas
												</p>
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

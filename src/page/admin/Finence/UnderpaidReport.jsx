import { saveAs } from "file-saver"
import { useState } from 'react'
import { FaDownload } from 'react-icons/fa'
import * as XLSX from "xlsx"

const UnderpaidReport = () => {
	const students = [
		{ fullName: "Sarvar Egamberdiyev", amountPaid: 1800000, paidAmount: 1500000, debt: 300000, year: 2025, month: 6 },
		{ fullName: "Ali Valiyev", amountPaid: 2000000, paidAmount: 2000000, debt: 0, year: 2025, month: 6 },
		{ fullName: "Aziza Karimova", amountPaid: 1800000, paidAmount: 1000000, debt: 800000, year: 2025, month: 5 },
		{ fullName: "Sherzod Sobirov", amountPaid: 1700000, paidAmount: 1700000, debt: 0, year: 2025, month: 6 },
	]

	const currentYear = new Date().getFullYear()
	const currentMonth = new Date().getMonth() + 1
	const [selectedYear, setSelectedYear] = useState(currentYear)
	const [selectedMonth, setSelectedMonth] = useState(currentMonth)

	const years = Array.from({ length: 11 }, (_, i) => 2020 + i)
	const months = [
		{ value: 1, label: "Yanvar" }, { value: 2, label: "Fevral" }, { value: 3, label: "Mart" },
		{ value: 4, label: "Aprel" }, { value: 5, label: "May" }, { value: 6, label: "Iyun" },
		{ value: 7, label: "Iyul" }, { value: 8, label: "Avgust" }, { value: 9, label: "Sentabr" },
		{ value: 10, label: "Oktabr" }, { value: 11, label: "Noyabr" }, { value: 12, label: "Dekabr" }
	]

	const filtered = students.filter(
		s => s.year === selectedYear && s.month === selectedMonth
	)

	const totalAmount = filtered.reduce((sum, s) => sum + s.amountPaid, 0)
	const totalPaid = filtered.reduce((sum, s) => sum + s.paidAmount, 0)
	const totalDebt = filtered.reduce((sum, s) => sum + s.debt, 0)

	// Excel yuklash funksiyasi
	const downloadExcel = () => {
		const wb = XLSX.utils.book_new()
		const ws_data = [
			["#", "F.I.SH", "To‘lash kerak", "To‘langan", "Qoldiq (qarz)"],
			...filtered.map((s, i) => [
				i + 1,
				s.fullName,
				s.amountPaid,
				s.paidAmount,
				s.debt
			]),
			["", "Umumiy", totalAmount, totalPaid, totalDebt]
		]

		const ws = XLSX.utils.aoa_to_sheet(ws_data)

		// Jadval o'lchamini aniqlash
		const range = XLSX.utils.decode_range(ws["!ref"])

		for (let R = 1; R <= filtered.length; ++R) {
			for (let C = 0; C <= 4; ++C) {
				const cell = ws[XLSX.utils.encode_cell({ r: R, c: C })]
				if (!cell) continue

				// Chegaralarni qo‘shish
				cell.s = {
					border: {
						top: { style: "thin", color: { rgb: "000000" } },
						bottom: { style: "thin", color: { rgb: "000000" } },
						left: { style: "thin", color: { rgb: "000000" } },
						right: { style: "thin", color: { rgb: "000000" } }
					}
				}

				// Ranglar
				if (C === 4 && cell.v > 0) {
					// Qoldiq mavjud bo‘lsa - QIZIL
					cell.s.fill = { fgColor: { rgb: "FFCDD2" } }
				}

				if (C === 3 && cell.v > 0) {
					// To‘langan bo‘lsa - YASHIL
					cell.s.fill = { fgColor: { rgb: "C8E6C9" } }
				}
			}
		}

		// Umumiy qatoriga ham chegara va bold style
		const totalRow = filtered.length + 1
		for (let C = 0; C <= 4; ++C) {
			const cell = ws[XLSX.utils.encode_cell({ r: totalRow, c: C })]
			if (!cell) continue
			cell.s = {
				font: { bold: true },
				border: {
					top: { style: "thin", color: { rgb: "000000" } },
					bottom: { style: "thin", color: { rgb: "000000" } },
					left: { style: "thin", color: { rgb: "000000" } },
					right: { style: "thin", color: { rgb: "000000" } }
				},
				fill: { fgColor: { rgb: "BBDEFB" } }
			}
		}

		XLSX.utils.book_append_sheet(wb, ws, "Hisobot")

		const excelBuffer = XLSX.write(wb, {
			bookType: "xlsx",
			type: "array",
			cellStyles: true // Faqat pullik versiyada to‘liq ishlaydi
		})
		const blob = new Blob([excelBuffer], {
			type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
		})
		saveAs(blob, `Hisobot_${selectedYear}_${selectedMonth}.xlsx`)
	}
	return (
		<div className=" mx-auto p-6">
			<div className="flex flex-wrap gap-4 mb-6">
				<select
					className="border rounded-lg px-4 py-2 shadow-sm"
					value={selectedYear}
					onChange={(e) => setSelectedYear(parseInt(e.target.value))}
				>
					{years.map((y) => (
						<option key={y} value={y}>{y}</option>
					))}
				</select>

				<select
					className="border rounded-lg px-4 py-2 shadow-sm"
					value={selectedMonth}
					onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
				>
					{months.map((m) => (
						<option key={m.value} value={m.value}>{m.label}</option>
					))}
				</select>

				<button
					className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition"
					onClick={downloadExcel}
				>
					<FaDownload />
				</button>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-white text-center">
				<div className="bg-indigo-600 rounded-lg py-4 shadow-md">
					<h3 className="text-lg">Umumiy To‘lash</h3>
					<p className="text-2xl font-bold">{totalAmount.toLocaleString()} so'm</p>
				</div>
				<div className="bg-green-600 rounded-lg py-4 shadow-md">
					<h3 className="text-lg">Umumiy To‘langan</h3>
					<p className="text-2xl font-bold">{totalPaid.toLocaleString()} so'm</p>
				</div>
				<div className="bg-red-600 rounded-lg py-4 shadow-md">
					<h3 className="text-lg">Umumiy Qarz</h3>
					<p className="text-2xl font-bold">{totalDebt.toLocaleString()} so'm</p>
				</div>
			</div>
			<div className="overflow-x-auto bg-white rounded-xl shadow-lg">
				<table className="min-w-full text-sm text-left border-collapse">
					<thead className="bg-gray-200 text-gray-800 font-semibold uppercase text-xs">
						<tr>
							<th className="py-3 px-4 border-b">#</th>
							<th className="py-3 px-4 border-b">F.I.SH</th>
							<th className="py-3 px-4 border-b">To‘lash kerak</th>
							<th className="py-3 px-4 border-b">To‘langan</th>
							<th className="py-3 px-4 border-b">Qoldiq (qarz)</th>
						</tr>
					</thead>
					<tbody>
						{filtered.map((s, i) => (
							<tr
								key={i}
								className={i % 2 === 0 ? "bg-gray-50 hover:bg-gray-100" : "bg-white hover:bg-gray-100"}
							>
								<td className="py-2 px-4 border-b">{i + 1}</td>
								<td className="py-2 px-4 border-b font-medium">{s.fullName}</td>
								<td className="py-2 px-4 border-b text-indigo-700">{s.amountPaid.toLocaleString()} so'm</td>
								<td className="py-2 px-4 border-b text-green-600">{s.paidAmount.toLocaleString()} so'm</td>
								<td className="py-2 px-4 border-b text-red-500">{s.debt.toLocaleString()} so'm</td>
							</tr>
						))}
						{filtered.length === 0 && (
							<tr>
								<td colSpan="5" className="text-center py-6 text-gray-500">Ma'lumot topilmadi</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default UnderpaidReport

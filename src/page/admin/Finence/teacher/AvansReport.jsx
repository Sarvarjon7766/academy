import axios from 'axios'
import { useEffect, useMemo, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const AvansReport = () => {
	const now = new Date()
	const [teachers, setTeachers] = useState([])
	const [avansList, setAvansList] = useState([])
	const [selectedTeacher, setSelectedTeacher] = useState(null)
	const [maxAvans, setMaxAvans] = useState(null)
	const [avansRemaining, setAvansRemaining] = useState(0)
	const [loading, setLoading] = useState(true)
	const [formData, setFormData] = useState({
		teacherId: '',
		teacherName: '',
		amount: '',
		note: ''
	})

	const [selectedYear, setSelectedYear] = useState(now.getFullYear())
	const [selectedMonth, setSelectedMonth] = useState(now.getMonth()) // 0-based

	const isCurrentMonth = selectedMonth === now.getMonth() && selectedYear === now.getFullYear()

	const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - 2 + i)
	const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr']

	// Dastlabki yuklash
	useEffect(() => {
		const fetchData = async () => {
			try {
				const [teacherRes, avansRes] = await Promise.all([
					axios.get(`${import.meta.env.VITE_API_URL}/api/teacher/getAll`),
					axios.get(`${import.meta.env.VITE_API_URL}/api/avans/getAll`)
				])
				if (teacherRes.data.success) setTeachers(teacherRes.data.teachers)
				if (avansRes.data.success) setAvansList(avansRes.data.avanses)
			} catch (err) {
				console.error('Yuklashda xatolik:', err)
			} finally {
				setLoading(false)
			}
		}
		fetchData()
	}, [])

	// Filterlangan avanslar
	const filteredAvansList = useMemo(() => {
		return avansList.filter(avans => {
			const d = new Date(avans.date)
			return d.getFullYear() === selectedYear && d.getMonth() === selectedMonth
		})
	}, [avansList, selectedMonth, selectedYear])

	// Limitni yangilash
	useEffect(() => {
		if (!selectedTeacher) return

		const fetchLimit = async () => {
			try {
				const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/teacher/teachermonth-selery`, {
					params: {
						year: selectedYear,
						month: selectedMonth + 1,
						teacherId: selectedTeacher
					}
				})
				if (res.data.success) {
					const max = res.data.data.maxAvans || 1500000
					setMaxAvans(max)
					const total = filteredAvansList
						.filter(a => a.teacherId === selectedTeacher)
						.reduce((sum, a) => sum + a.amount, 0)
					setAvansRemaining(max - total)
				}
			} catch (err) {
				console.error('Limitni olishda xatolik:', err)
			}
		}
		fetchLimit()
	}, [selectedTeacher, selectedMonth, selectedYear, filteredAvansList])

	const handleChange = e => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const handleAddAvans = async e => {
		e.preventDefault()
		const { teacherId, amount } = formData
		const selectedT = teachers.find(t => t._id === teacherId)
		if (!teacherId || !amount) return toast.warning("O'qituvchi va summa tanlanishi kerak!")

		const newAvans = {
			teacherId,
			teacherName: selectedT.fullName,
			amount: parseInt(amount),
			note: formData.note,
			date: new Date().toISOString()
		}

		try {
			const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/avans/create`, newAvans)
			if (res.data.success) {
				setAvansList(prev => [...prev, res.data.avans])
				setFormData({ teacherId: '', teacherName: '', amount: '', note: '' })
				toast.success("Avans muvaffaqiyatli qo‘shildi!")
			}
		} catch (err) {
			console.error("Avans saqlashda xatolik:", err)
			toast.error("Saqlashda xatolik yuz berdi.")
		}
	}

	const groupedAvans = useMemo(() => {
		return filteredAvansList.reduce((acc, curr) => {
			if (!curr.teacherName) return acc
			if (!acc[curr.teacherName]) acc[curr.teacherName] = []
			acc[curr.teacherName].push(curr)
			return acc
		}, {})
	}, [filteredAvansList])

	return (
		<div className="p-4 max-w-6xl mx-auto">
			<ToastContainer position="top-right" autoClose={3000} />

			{/* Filter */}
			<div className="flex flex-wrap gap-4 justify-center mb-6">
				<select
					className="border px-4 py-2 rounded shadow"
					value={selectedMonth}
					onChange={e => setSelectedMonth(Number(e.target.value))}
				>
					{months.map((m, idx) => (
						<option key={idx} value={idx}>{m}</option>
					))}
				</select>
				<select
					className="border px-4 py-2 rounded shadow"
					value={selectedYear}
					onChange={e => setSelectedYear(Number(e.target.value))}
				>
					{years.map(y => <option key={y} value={y}>{y}</option>)}
				</select>
			</div>

			{/* Form */}
			<form onSubmit={handleAddAvans} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
				<select
					name="teacherId"
					value={formData.teacherId}
					onChange={(e) => {
						handleChange(e)
						setSelectedTeacher(e.target.value)
					}}
					className="border px-3 py-2 rounded shadow"
				>
					<option value="">🧑‍🏫 O‘qituvchini tanlang</option>
					{teachers.map(t => (
						<option key={t._id} value={t._id}>{t.fullName}</option>
					))}
				</select>

				<input
					type="number"
					name="amount"
					value={formData.amount}
					onChange={handleChange}
					disabled={!isCurrentMonth || avansRemaining <= 0}
					placeholder={
						!isCurrentMonth
							? "🚫 Avans faqat joriy oyda"
							: avansRemaining <= 0
								? "🚫 Limitga yetilgan"
								: `💡 Limit: ${avansRemaining?.toLocaleString('ru-RU')} so‘m`
					}
					className="border px-3 py-2 rounded shadow"
				/>

				<input
					type="text"
					name="note"
					value={formData.note}
					onChange={handleChange}
					disabled={!isCurrentMonth}
					placeholder="📝 Izoh (ixtiyoriy)"
					className="border px-3 py-2 rounded shadow"
				/>

				<button
					type="submit"
					disabled={!isCurrentMonth || avansRemaining <= 0}
					className={`sm:col-span-3 text-white py-2 rounded shadow transition-all ${(!isCurrentMonth || avansRemaining <= 0)
						? 'bg-gray-400 cursor-not-allowed opacity-50'
						: 'bg-blue-600 hover:bg-blue-700'
						}`}
				>
					💾 Avans qo‘shish
				</button>
			</form>

			{/* Jadval */}
			{loading ? (
				<p className="text-center text-gray-500">⏳ Yuklanmoqda...</p>
			) : Object.keys(groupedAvans).length === 0 ? (
				<p className="text-center text-gray-500">📭 Avanslar mavjud emas</p>
			) : (
				Object.entries(groupedAvans).map(([teacher, list]) => {
					const total = list.reduce((sum, a) => sum + a.amount, 0)
					return (
						<div key={teacher} className="mb-6 border rounded-lg p-4 bg-white shadow">
							<h3 className="text-lg font-semibold mb-2 text-blue-700 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
								<span className="break-words">{teacher}</span>
								<span className="text-xs sm:text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full border border-green-300 inline-block whitespace-nowrap">
									💰 {total.toLocaleString('ru-RU')} so‘m
								</span>
							</h3>

							<div className="overflow-x-auto">
								<table className="min-w-full text-sm border text-center">
									<thead className="bg-gray-100 text-gray-700">
										<tr>
											<th className="border px-2 py-1">#</th>
											<th className="border px-2 py-1">Summasi</th>
											<th className="border px-2 py-1">Sana</th>
											<th className="border px-2 py-1">Izoh</th>
										</tr>
									</thead>
									<tbody>
										{list.map((avans, index) => (
											<tr key={avans._id} className="hover:bg-gray-50">
												<td className="border px-2 py-1">{index + 1}</td>
												<td className="border px-2 py-1">{avans.amount.toLocaleString('ru-RU')}</td>
												<td className="border px-2 py-1">
													{new Date(avans.date).toLocaleDateString('uz-UZ', {
														day: '2-digit', month: '2-digit', year: 'numeric'
													})}
												</td>
												<td className="border px-2 py-1">{avans.note || '-'}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					)
				})
			)}
		</div>
	)
}

export default AvansReport

import React, { useEffect, useState } from 'react'

const mockAvansData = [
	{
		id: 1,
		teacherName: 'Aliyev Dilmurod',
		amount: 700000,
		date: '2025-06-10T00:00:00.000Z',
		note: 'Iyun oyi uchun avans'
	},
	{
		id: 2,
		teacherName: 'Xoliqova Shaxnoza',
		amount: 500000,
		date: '2025-06-12T00:00:00.000Z',
		note: ''
	},
	{
		id: 3,
		teacherName: 'Karimov Zafar',
		amount: 650000,
		date: '2025-06-14T00:00:00.000Z',
		note: 'To‘lovdan oldingi avans'
	}
]

const AvansReport = () => {
	const [avansData, setAvansData] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		// API o'rniga local mock ma'lumotlar ishlatilmoqda
		const fetchAvans = async () => {
			try {
				// Simulyatsiya qilish uchun setTimeout
				setTimeout(() => {
					setAvansData(mockAvansData)
					setLoading(false)
				}, 500)
			} catch (error) {
				console.error("Avans ma'lumotlarini olishda xatolik:", error)
				setLoading(false)
			}
		}

		fetchAvans()
	}, [])

	return (
		<div className="p-4">
			<h2 className="text-xl font-bold mb-4">Avans Hisobotlari</h2>

			{loading ? (
				<p>Yuklanmoqda...</p>
			) : avansData.length === 0 ? (
				<p>Hech qanday avans ma’lumotlari yo‘q.</p>
			) : (
				<div className="overflow-x-auto">
					<table className="min-w-full border text-sm">
						<thead>
							<tr className="bg-gray-200">
								<th className="border px-2 py-1">№</th>
								<th className="border px-2 py-1">O'qituvchi</th>
								<th className="border px-2 py-1">Avans summasi (so‘m)</th>
								<th className="border px-2 py-1">Sana</th>
								<th className="border px-2 py-1">Izoh</th>
							</tr>
						</thead>
						<tbody>
							{avansData.map((avans, index) => (
								<tr key={avans.id || index}>
									<td className="border px-2 py-1 text-center">{index + 1}</td>
									<td className="border px-2 py-1">{avans.teacherName}</td>
									<td className="border px-2 py-1 text-right">{avans.amount.toLocaleString('ru-RU')}</td>
									<td className="border px-2 py-1 text-center">{new Date(avans.date).toLocaleDateString()}</td>
									<td className="border px-2 py-1">{avans.note || '-'}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	)
}

export default AvansReport

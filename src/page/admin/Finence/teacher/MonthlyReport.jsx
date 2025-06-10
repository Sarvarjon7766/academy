import axios from 'axios'
import { useEffect, useState } from 'react'

const MonthlyReport = () => {
	const years = [2023, 2024, 2025]
	const months = [
		{ value: 1, label: 'Yanvar' }, { value: 2, label: 'Fevral' }, { value: 3, label: 'Mart' },
		{ value: 4, label: 'Aprel' }, { value: 5, label: 'May' }, { value: 6, label: 'Iyun' },
		{ value: 7, label: 'Iyul' }, { value: 8, label: 'Avgust' }, { value: 9, label: 'Sentabr' },
		{ value: 10, label: 'Oktabr' }, { value: 11, label: 'Noyabr' }, { value: 12, label: 'Dekabr' }
	]
	const currentYear = new Date().getFullYear()
	const currentMonth = new Date().getMonth() + 1

	const [year, setYear] = useState(currentYear)
	const [month, setMonth] = useState(currentMonth)

	const [selectedTeacher, setSelectedTeacher] = useState(null)
	const [isLoading, setIsLoading] = useState(false)

	const teachers = [
		{ id: 1, fullName: 'Aliyev Alisher', calculated: 5000000, paid: 4000000 },
		{ id: 2, fullName: 'Karimova Dilnoza', calculated: 6000000, paid: 6000000 },
		{ id: 3, fullName: 'Toshpulatov Sherzod', calculated: 4500000, paid: 3000000 },
		{ id: 4, fullName: 'Abdullayeva Zulfiya', calculated: 5500000, paid: 5500000 },
		{ id: 5, fullName: 'Yusupov Bahodir', calculated: 4800000, paid: 3000000 },
		{ id: 6, fullName: 'Rahimova Malika', calculated: 5200000, paid: 4500000 },
	]

	useEffect(() => {
		const fetchStatistiks = async()=>{
			const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/statistics/teacher-payment`,{
				params:{
					year,month
				}
			})
			if(res.data.success){
				console.log(res.data)
			}
		}
		fetchStatistiks()
	}, [year,month])
	// Simulate loading
	useEffect(() => {
		if (selectedTeacher) {
			setIsLoading(true)
			const timer = setTimeout(() => {
				setIsLoading(false)
			}, 800)
			return () => clearTimeout(timer)
		}
	}, [selectedTeacher])

	const handleFilterChange = () => {
		// In a real app, this would fetch data
		setIsLoading(true)
		setTimeout(() => setIsLoading(false), 1000)
	}

	const formatCurrency = (amount) => {
		return amount.toLocaleString('uz-UZ') + ' soʻm'
	}

	const getBalanceStatus = (balance) => {
		if (balance === 0) return 'bg-green-100 text-green-800'
		if (balance > 0) return 'bg-amber-100 text-amber-800'
		return 'bg-red-100 text-red-800'
	}

	return (
		<div className="min-h-screen  p-4 md:p-6">
			<div className=" mx-auto">
				{/* Filters Section */}
				<div className=" rounded-2xl shadow-lg p-6 mb-8">
					<div className="flex flex-wrap gap-4 items-center justify-between">
						<div className="flex flex-wrap gap-4">
							<div className="flex flex-col">
								<label className="text-gray-600 text-sm mb-1">Yilni tanlang</label>
								<div className="relative">
									<select
										className="appearance-none bg-none border border-gray-300 rounded-xl px-4 py-3 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-32"
										value={year}
										onChange={(e) => {
											setYear(parseInt(e.target.value))
											handleFilterChange()
										}}
									>
										{years.map((y) => (
											<option key={y} value={y}>{y}</option>
										))}
									</select>
									<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
										<svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
											<path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
										</svg>
									</div>
								</div>
							</div>

							<div className="flex flex-col">
								<label className="text-gray-600 text-sm mb-1">Oyni tanlang</label>
								<div className="relative">
									<select
										className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-3 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-40"
										value={month}
										onChange={(e) => {
											setMonth(parseInt(e.target.value))
											handleFilterChange()
										}}
									>
										{months.map((m) => (
											<option key={m.value} value={m.value}>{m.label}</option>
										))}
									</select>
									<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
										<svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
											<path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
										</svg>
									</div>
								</div>
							</div>
						</div>

						<div className="flex items-center">
							<div className="bg-blue-100 text-blue-800 rounded-xl px-4 py-2 flex items-center">
								<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
									<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
								</svg>
								<span className="font-medium">{months.find(m => m.value === month)?.label}, {year}</span>
							</div>
						</div>
					</div>
				</div>

				{/* Stats Summary */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
					<div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
						<div className="flex justify-between items-start">
							<div>
								<p className="text-sm opacity-80">Jami hisoblangan</p>
								<h3 className="text-2xl font-bold mt-1">
									{formatCurrency(teachers.reduce((sum, t) => sum + t.calculated, 0))}
								</h3>
							</div>
							<div className="bg-white bg-opacity-20 p-3 rounded-xl">
								<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
								</svg>
							</div>
						</div>
					</div>

					<div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white">
						<div className="flex justify-between items-start">
							<div>
								<p className="text-sm opacity-80">Jami to'langan</p>
								<h3 className="text-2xl font-bold mt-1">
									{formatCurrency(teachers.reduce((sum, t) => sum + t.paid, 0))}
								</h3>
							</div>
							<div className="bg-white bg-opacity-20 p-3 rounded-xl">
								<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>
						</div>
					</div>

					<div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl shadow-lg p-6 text-white">
						<div className="flex justify-between items-start">
							<div>
								<p className="text-sm opacity-80">Umumiy qoldiq</p>
								<h3 className="text-2xl font-bold mt-1">
									{formatCurrency(teachers.reduce((sum, t) => sum + (t.calculated - t.paid), 0))}
								</h3>
							</div>
							<div className="bg-white bg-opacity-20 p-3 rounded-xl">
								<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
								</svg>
							</div>
						</div>
					</div>
				</div>

				{/* Teachers Table */}
				<div className="bg-white rounded-2xl shadow-lg overflow-hidden">
					<div className="overflow-x-auto">
						<table className="min-w-full">
							<thead className="bg-gray-50">
								<tr>
									<th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">F.I.Sh.</th>
									<th className="py-4 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hisoblangan</th>
									<th className="py-4 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">To'langan</th>
									<th className="py-4 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Qoldiq</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{teachers.map((t) => {
									const balance = t.calculated - t.paid
									return (
										<tr
											key={t.id}
											className="hover:bg-blue-50 transition-colors cursor-pointer"
											onClick={() => setSelectedTeacher(t)}
										>
											<td className="py-4 px-6 whitespace-nowrap">
												<div className="flex items-center">
													<div className="bg-blue-100 text-blue-800 rounded-full w-10 h-10 flex items-center justify-center mr-3">
														<span className="font-medium">{t.fullName.split(' ').map(n => n[0]).join('')}</span>
													</div>
													<div>
														<div className="font-medium text-gray-900">{t.fullName}</div>
														<div className="text-sm text-gray-500">ID: {t.id}</div>
													</div>
												</div>
											</td>
											<td className="py-4 px-6 whitespace-nowrap text-right font-medium text-gray-900">
												{formatCurrency(t.calculated)}
											</td>
											<td className="py-4 px-6 whitespace-nowrap text-right">
												<span className="font-medium text-green-600">{formatCurrency(t.paid)}</span>
											</td>
											<td className="py-4 px-6 whitespace-nowrap text-right">
												<span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${getBalanceStatus(balance)}`}>
													{formatCurrency(balance)}
												</span>
											</td>
										</tr>
									)
								})}
							</tbody>
						</table>
					</div>
				</div>

				{/* Modal */}
				{selectedTeacher && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
						<div
							className="bg-white rounded-2xl shadow-xl w-full max-w-md transform transition-all duration-300 scale-95 opacity-0"
							style={{
								animation: 'modalIn 0.3s forwards',
								transformOrigin: 'center'
							}}
						>
							<div className="p-6">
								<div className="flex justify-between items-start">
									<div>
										<h2 className="text-2xl font-bold text-gray-800">O'qituvchi ma'lumotlari</h2>
										<p className="text-gray-600 text-sm">{months.find(m => m.value === month)?.label}, {year}</p>
									</div>
									<button
										className="text-gray-500 hover:text-gray-700 text-2xl bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
										onClick={() => setSelectedTeacher(null)}
									>
										&times;
									</button>
								</div>

								<div className="mt-6 border-t border-gray-200 pt-6">
									<div className="flex items-center mb-6">
										<div className="bg-blue-100 text-blue-800 rounded-full w-16 h-16 flex items-center justify-center mr-4">
											<span className="font-medium text-xl">
												{selectedTeacher.fullName.split(' ').map(n => n[0]).join('')}
											</span>
										</div>
										<div>
											<h3 className="text-xl font-bold">{selectedTeacher.fullName}</h3>
											<p className="text-gray-600">ID: {selectedTeacher.id}</p>
										</div>
									</div>

									<div className="space-y-4">
										<div className="flex justify-between items-center">
											<span className="text-gray-600">Hisoblangan summa:</span>
											<span className="font-bold">{formatCurrency(selectedTeacher.calculated)}</span>
										</div>

										<div className="flex justify-between items-center">
											<span className="text-gray-600">To'langan summa:</span>
											<span className="font-bold text-green-600">{formatCurrency(selectedTeacher.paid)}</span>
										</div>

										<div className="flex justify-between items-center pt-4 border-t border-gray-200">
											<span className="text-gray-600">Qoldiq:</span>
											<span className={`font-bold px-3 py-1 rounded-full ${getBalanceStatus(selectedTeacher.calculated - selectedTeacher.paid)}`}>
												{formatCurrency(selectedTeacher.calculated - selectedTeacher.paid)}
											</span>
										</div>
									</div>

									<div className="mt-8">
										<div className="h-2 bg-gray-200 rounded-full overflow-hidden">
											<div
												className="h-full bg-blue-500 rounded-full transition-all duration-700"
												style={{
													width: `${Math.min(100, (selectedTeacher.paid / selectedTeacher.calculated) * 100)}%`
												}}
											></div>
										</div>
										<div className="flex justify-between mt-2 text-sm text-gray-600">
											<span>To'lanish darajasi</span>
											<span>{Math.round((selectedTeacher.paid / selectedTeacher.calculated) * 100)}%</span>
										</div>
									</div>

									<div className="mt-6 flex space-x-3">
										<button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-xl transition-colors">
											To'lov qilish
										</button>
										<button
											className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-xl transition-colors"
											onClick={() => setSelectedTeacher(null)}
										>
											Yopish
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>

			<style jsx>{`
        @keyframes modalIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        tr:nth-child(even) {
          background-color: #f9fafb;
        }
      `}</style>
		</div>
	)
}

export default MonthlyReport
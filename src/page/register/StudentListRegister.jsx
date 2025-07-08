// src/components/StudentList.jsx
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FiSearch, FiUser, FiPhone, FiMapPin, FiCalendar, FiDollarSign, FiBook, FiPlusCircle, FiEdit2, FiX } from 'react-icons/fi'

const StudentListRegister = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const [students, setStudents] = useState([])
	const [filteredStudents, setFilteredStudents] = useState([])
	const [searchTerm, setSearchTerm] = useState('')
	const [selectedOption, setSelectedOption] = useState('')
	const [selectedStudent, setSelectedStudent] = useState(null)
	const [modalOpen, setModalOpen] = useState(false)
	const [loading, setLoading] = useState(true)
	const { student } = location.state || {}

	useEffect(() => {
		if (student) {
			setSelectedStudent(student)
			setModalOpen(true)
		}
	}, [student])

	useEffect(() => {
		const fetchStudents = async () => {
			try {
				setLoading(true)
				const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/student/getAll`)
				if (res.data.success) {
					setStudents(res.data.students)
					setFilteredStudents(res.data.students)
				}
			} catch (error) {
				console.error(error)
			} finally {
				setLoading(false)
			}
		}
		fetchStudents()
	}, [])

	const handleSearch = (e) => {
		const value = e.target.value.toLowerCase()
		setSearchTerm(value)

		const filtered = students.filter((student) =>
			student.fullName.toLowerCase().includes(value) ||
			student.phone.toLowerCase().includes(value) ||
			student.address?.toLowerCase().includes(value)
		)
		setFilteredStudents(filtered)
	}

	const openModal = (student) => {
		setSelectedStudent(student)
		setModalOpen(true)
	}

	const closeModal = () => {
		setSelectedStudent(null)
		setModalOpen(false)
	}
	
	const updateHandler = () => {
		if (!selectedOption) return
		navigate('/register/student-update', {
			state: {
				student: selectedStudent,
				section: selectedOption,
			},
		})
	}

	const calculateMonthlyPayment = (student) => {
		if (!student) return 0
		let total = 0

		if (student.main_subjects?.length > 0) {
			total += student.main_subjects.reduce((sum, subj) => sum + (subj.price || 0), 0)
		}

		if (student.additionalSubjects?.length > 0) {
			total += student.additionalSubjects.reduce((sum, subj) => sum + (subj.price || 0), 0)
		}

		if (student.hostel?.hostelPrice) total += student.hostel.hostelPrice
		if (student.product?.productPrice) total += student.product.productPrice
		if (student.transport?.transportPrice) total += student.transport.transportPrice

		return total
	}

	const getStatusColor = (status) => {
		switch (status) {
			case 'active': return 'bg-green-500'
			case 'pending': return 'bg-yellow-500'
			case 'inactive': return 'bg-gray-500'
			case 'archived': return 'bg-red-500'
			default: return 'bg-blue-500'
		}
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6">
			<div className="mx-auto">
				<div className="mb-8 text-center">
					<h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
						Talabalar Boshqaruvi
					</h1>
					<p className="text-gray-600 max-w-2xl mx-auto">
						Barcha talabalar ro'yxati va ularning to'liq ma'lumotlari
					</p>
				</div>

				{/* Search and Stats Bar */}
				<div className="bg-white rounded-2xl shadow-lg p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
					<div className="relative w-full md:w-1/2">
						<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
							<FiSearch size={20} />
						</div>
						<input
							type="text"
							placeholder="Talaba ismi, telefon yoki manzil bo'yicha qidirish..."
							className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
							value={searchTerm}
							onChange={handleSearch}
						/>
					</div>
					
					<div className="flex items-center space-x-4">
						<div className="text-center">
							<div className="text-2xl font-bold text-blue-600">{students.length}</div>
							<div className="text-sm text-gray-600">Jami talaba</div>
						</div>
					</div>
				</div>

				{/* Student List */}
				<div className="bg-white rounded-2xl shadow-lg overflow-hidden">
					{loading ? (
						<div className="flex justify-center items-center py-20">
							<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
						</div>
					) : filteredStudents.length === 0 ? (
						<div className="text-center py-12">
							<div className="text-gray-400 mb-4">Talaba topilmadi</div>
							<button 
								className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
								onClick={() => setSearchTerm('')}
							>
								Filterni tozalash
							</button>
						</div>
					) : (
						<div className="overflow-x-auto">
							<table className="min-w-full divide-y divide-gray-200">
								<thead className="bg-gray-50">
									<tr>
										<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Talaba</th>
										<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Telefon</th>
										<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Manzil</th>
										<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Holati</th>
										<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To'lov</th>

									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{filteredStudents.map((student) => (
										<tr 
											key={student._id} 
											className="hover:bg-blue-50 transition cursor-pointer"
											onClick={() => openModal(student)}
										>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="flex items-center">
													<div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
														<FiUser className="text-blue-600" />
													</div>
													<div className="ml-4">
														<div className="text-sm font-medium text-gray-900">{student.fullName}</div>
														<div className="text-sm text-gray-500 sm:hidden">{student.phone}</div>
													</div>
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
												{student.phone}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
												<div className="flex items-center">
													<FiMapPin className="mr-1 text-gray-400" size={14} />
													{student.address || 'Mavjud emas'}
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(student.status)} text-white`}>
													{student.status === 'active' ? 'Faol' : 
													 student.status === 'pending' ? 'Kutilmoqda' : 
													 student.status === 'archived' ? 'Arxivlangan' : 'Noma\'lum'}
												</span>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
												<div className="font-medium">{calculateMonthlyPayment(student).toLocaleString()} so'm</div>
											</td>
										 
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>
			</div>

			{/* Student Detail Modal */}
			{modalOpen && selectedStudent && (
				<div className="fixed inset-0 z-50 overflow-y-auto">
					<div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
						<div 
							className="fixed inset-0 transition-opacity bg-black bg-opacity-70" 
							onClick={closeModal}
							aria-hidden="true"
						></div>
						
						<span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
						
						<div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
							<div className="absolute top-4 right-4">
								<button
									onClick={closeModal}
									className="bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full p-2 transition"
								>
									<FiX size={20} />
								</button>
							</div>
							
							<div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
								<h3 className="text-2xl font-bold">
									{selectedStudent.fullName}
								</h3>
								<p className="flex items-center mt-1">
									<span className={`w-3 h-3 rounded-full mr-2 ${getStatusColor(selectedStudent.status)}`}></span>
									{selectedStudent.status === 'active' ? 'Faol talaba' : 
									 selectedStudent.status === 'pending' ? 'Kutilmoqda' : 
									 selectedStudent.status === 'archived' ? 'Arxivlangan' : 'Noma\'lum holat'}
								</p>
							</div>
							
							<div className="px-6 py-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									{/* Personal Information */}
									<div className="bg-gray-50 p-4 rounded-xl">
										<h4 className="font-semibold text-lg text-gray-800 mb-3 flex items-center">
											<FiUser className="mr-2 text-blue-500" />
											Shaxsiy ma'lumotlar
										</h4>
										<div className="space-y-3">
											<div className="flex">
												<span className="w-1/3 text-gray-600">Telefon:</span>
												<span className="w-2/3 font-medium">{selectedStudent.phone}</span>
											</div>
											<div className="flex">
												<span className="w-1/3 text-gray-600">Manzil:</span>
												<span className="w-2/3">{selectedStudent.address || 'Mavjud emas'}</span>
											</div>
											<div className="flex">
												<span className="w-1/3 text-gray-600">Tug'ilgan sana:</span>
												<span className="w-2/3">{new Date(selectedStudent.date_of_birth).toLocaleDateString()}</span>
											</div>
											<div className="flex">
												<span className="w-1/3 text-gray-600">Jinsi:</span>
												<span className="w-2/3">{selectedStudent.gender}</span>
											</div>
										</div>
									</div>
									
									{/* Education Information */}
									<div className="bg-gray-50 p-4 rounded-xl">
										<h4 className="font-semibold text-lg text-gray-800 mb-3 flex items-center">
											<FiBook className="mr-2 text-purple-500" />
											Ta'lim ma'lumotlari
										</h4>
										<div className="space-y-3">
											<div className="flex">
												<span className="w-1/3 text-gray-600">Maktab:</span>
												<span className="w-2/3">{selectedStudent.old_school || 'Mavjud emas'}</span>
											</div>
											<div className="flex">
												<span className="w-1/3 text-gray-600">Sinf:</span>
												<span className="w-2/3">{selectedStudent.old_class || 'Mavjud emas'}</span>
											</div>
											<div className="flex">
												<span className="w-1/3 text-gray-600">Login:</span>
												<span className="w-2/3 font-mono">{selectedStudent.login}</span>
											</div>
											<div className="flex">
												<span className="w-1/3 text-gray-600">Oylik to'lov:</span>
												<span className="w-2/3 font-bold text-blue-600">
													{calculateMonthlyPayment(selectedStudent).toLocaleString()} so'm
												</span>
											</div>
										</div>
									</div>
								</div>
								
								{/* Subjects */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
									<div className="bg-blue-50 p-4 rounded-xl">
										<h4 className="font-semibold text-lg text-gray-800 mb-3 flex items-center">
											<FiBook className="mr-2 text-blue-600" />
											Asosiy fanlar
										</h4>
										{selectedStudent.main_subjects?.length > 0 ? (
											<ul className="space-y-2">
												{selectedStudent.main_subjects.map(subj => (
													<li key={subj._id} className="flex justify-between items-center bg-white p-3 rounded-lg">
														<span className="font-medium">{subj.subjectId.subjectName}</span>
														<span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
															{subj.price.toLocaleString()} so'm
														</span>
													</li>
												))}
											</ul>
										) : (
											<p className="text-gray-500 italic">Asosiy fanlar mavjud emas</p>
										)}
									</div>
									
									<div className="bg-purple-50 p-4 rounded-xl">
										<h4 className="font-semibold text-lg text-gray-800 mb-3 flex items-center">
											<FiPlusCircle className="mr-2 text-purple-600" />
											Qo'shimcha fanlar
										</h4>
										{selectedStudent.additionalSubjects?.length > 0 ? (
											<ul className="space-y-2">
												{selectedStudent.additionalSubjects.map(subj => (
													<li key={subj._id} className="flex justify-between items-center bg-white p-3 rounded-lg">
														<span className="font-medium">{subj.subjectId.subjectName}</span>
														<span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
															{subj.price.toLocaleString()} so'm
														</span>
													</li>
												))}
											</ul>
										) : (
											<p className="text-gray-500 italic">Qo'shimcha fanlar mavjud emas</p>
										)}
									</div>
								</div>
								
								{/* Groups */}
								<div className="mt-6 bg-gray-50 p-4 rounded-xl">
									<h4 className="font-semibold text-lg text-gray-800 mb-3 flex items-center">
										<FiUser className="mr-2 text-indigo-500" />
										Guruhlar
									</h4>
									{selectedStudent.groups?.length > 0 ? (
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
											{selectedStudent.groups.map(gr => (
												<div key={gr._id} className="bg-white p-3 rounded-lg border-l-4 border-indigo-500">
													<div className="font-medium">{gr.group.groupName}</div>
													<div className="text-sm text-gray-600 mt-1">
														<span className={`px-2 py-0.5 rounded-full text-xs ${
															gr.type === 'main' 
																? 'bg-blue-100 text-blue-800' 
																: 'bg-purple-100 text-purple-800'
														}`}>
															{gr.type === 'main' ? "Asosiy guruh" : "Qo'shimcha guruh"}
														</span>
													</div>
													<div className="text-sm text-gray-600 mt-2 flex items-center">
														<FiUser className="mr-1" size={14} />
														{gr.teacherId.fullName}
													</div>
												</div>
											))}
										</div>
									) : (
										<p className="text-gray-500 italic">Guruhlar mavjud emas</p>
									)}
								</div>
								
								{/* Actions */}
								<div className="mt-6 bg-gray-50 p-4 rounded-xl">
									<h4 className="font-semibold text-lg text-gray-800 mb-3">
										Talaba ma'lumotlarini yangilash
									</h4>
									<div className="flex flex-col sm:flex-row gap-3">
										<select
											className="flex-grow border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
											value={selectedOption}
											onChange={(e) => setSelectedOption(e.target.value)}
										>
											<option value="">Bo'limni tanlang...</option>
											<option value={0}>Shaxsiy ma'lumotlar</option>
											<option value={1}>Asosiy fanlar</option>
											<option value={2}>Qo'shimcha fanlar</option>
											<option value={3}>Qo'shimcha xizmatlar</option>
											<option value={4}>Talabani arxivlash</option>
										</select>
										
										<button
											onClick={updateHandler}
											disabled={!selectedOption}
											className={`px-6 py-2 rounded-xl font-medium text-white transition ${
												selectedOption 
													? 'bg-blue-600 hover:bg-blue-700' 
													: 'bg-gray-400 cursor-not-allowed'
											}`}
										>
											Yangilash
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default StudentListRegister
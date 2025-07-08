import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const DeleteStudent = ({ student }) => {
	const navigate = useNavigate()
	const [showConfirmation, setShowConfirmation] = useState(false)
	const [isArchiving, setIsArchiving] = useState(false)
	const [archiveSuccess, setArchiveSuccess] = useState(false)

	const handleArchive = async () => {
		setIsArchiving(true)
		try {
			const res = await axios.delete(`${import.meta.env.VITE_API_URL}/api/student/student-archived/${student._id}`)
			if (res.data.success) {
				setArchiveSuccess(true)
				setTimeout(() => {
					navigate('/register/student-list')
				}, 2000)
			}
		} catch (error) {
			console.error(error)
		} finally {
			setIsArchiving(false)
		}
	}

	const handleBack = () => {
		navigate('/register/student-list')
	}

	return (
		<div className="min-h-screen py-10 px-4">
			<div className="mx-auto">


				{/* Talaba ma'lumot kartasi */}
				<div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-10 border border-purple-100">
					{/* Kartaning ustki qismi */}
					<div className="bg-gradient-to-r from-purple-600 to-indigo-700 py-6 px-8 text-white">
						<div className="flex flex-col md:flex-row items-center justify-between">
							<div className="flex items-center mb-4 md:mb-0">
								<div className="bg-indigo-800 rounded-full p-3 mr-4">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
									</svg>
								</div>
								<div>
									<h2 className="text-2xl font-bold">{student.fullName}</h2>
									<p className="text-indigo-200">{student.group?.name || "Guruh mavjud emas"}</p>
								</div>
							</div>
						</div>
					</div>

					{/* Ma'lumotlar qismi */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
						<div className="space-y-4">
							<InfoItem
								icon={
									<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
									</svg>
								}
								label="Tug'ilgan sana"
								value={new Date(student.date_of_birth).toLocaleDateString()}
							/>

							<InfoItem
								icon={
									<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
									</svg>
								}
								label="Manzil"
								value={student.address || "Mavjud emas"}
							/>

							<InfoItem
								icon={
									<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
									</svg>
								}
								label="Ro'yxatga olingan"
								value={new Date(student.createdAt).toLocaleString()}
							/>
						</div>

						<div className="space-y-4">
							<InfoItem
								icon={
									<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
									</svg>
								}
								label="Jinsi"
								value={student.gender}
							/>

							<InfoItem
								icon={
									<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
									</svg>
								}
								label="Telefon"
								value={student.phone || "Mavjud emas"}
							/>

							<InfoItem
								icon={
									<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
									</svg>
								}
								label="Login"
								value={student.login}
							/>
						</div>
					</div>

					{/* Tugmalar qismi */}
					<div className="border-t border-gray-100 px-8 py-6 bg-gray-50">
						<div className="flex flex-col sm:flex-row justify-end gap-4">
							<button
								onClick={() => setShowConfirmation(true)}
								className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-lg font-medium flex items-center justify-center hover:shadow-lg transition-shadow"
							>
								<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
								</svg>
								Arxivga qo'shish
							</button>
						</div>
					</div>
				</div>

				{/* Arxivlash tasdiq modali */}
				{showConfirmation && (
					<div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
						<div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
							<div className="bg-gradient-to-r from-amber-500 to-yellow-600 p-6 text-white text-center">
								<div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
									</svg>
								</div>
								<h3 className="text-xl font-bold">Talabani arxivlash</h3>
								<p className="mt-2 text-amber-100">Ushbu amalni ortga qaytarib bo'lmaydi</p>
							</div>

							<div className="p-6">
								<p className="text-gray-700 text-center">
									Rostan ham <span className="font-bold text-amber-600">{student.fullName}</span> ismli talabani arxivga qo'shmoqchimisiz?
								</p>

								<div className="mt-8 flex justify-center gap-4">
									<button
										onClick={() => setShowConfirmation(false)}
										className="px-5 py-2 border bg-green-400 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
									>
										Bekor qilish
									</button>

									<button
										onClick={handleArchive}
										disabled={isArchiving || archiveSuccess}
										className="px-5 py-2 bg-red-500 rounded-lg font-medium flex items-center disabled:opacity-75"
									>
										{isArchiving ? (
											<>
												<svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
													<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
													<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
												</svg>
												Jarayonda...
											</>
										) : archiveSuccess ? (
											<>
												<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
												</svg>
												Muvaffaqiyatli!
											</>
										) : (
											"Arxivlash"
										)}
									</button>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Arxivlash muvaffaqiyatli xabari */}
				{archiveSuccess && (
					<div className="fixed bottom-6 right-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-lg shadow-xl flex items-center animate-fadeIn">
						<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						<span>{student.fullName} arxivga muvaffaqiyatli qo'shildi!</span>
					</div>
				)}
			</div>
		</div>
	)
}

// Ma'lumot elementlari uchun komponent
const InfoItem = ({ icon, label, value }) => (
	<div className="flex items-start">
		<div className="flex-shrink-0 mt-1 text-purple-600">
			{icon}
		</div>
		<div className="ml-3">
			<div className="text-sm font-medium text-gray-500">{label}</div>
			<div className="mt-1 font-medium text-gray-900">{value}</div>
		</div>
	</div>
)

export default DeleteStudent
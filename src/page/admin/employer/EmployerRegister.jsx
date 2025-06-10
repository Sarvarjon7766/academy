import axios from 'axios'
import { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const EmployerRegister = () => {
	const [formData, setFormData] = useState({
		fullName: '',
		login: "",
		password: "",
		date_of_birth: '',
		gender: '',
		address: '',
		phone: '',
		position: '',
		salary: '',
		share_of_salary: '',
	})

	const handleChange = (e) => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()

		try {
			const salary = formData.salary ? Number(formData.salary) : 0
			const share_of_salary = formData.share_of_salary ? Number(formData.share_of_salary) : 0

			const dataToSend = {
				fullName: formData.fullName,
				login: formData.login,
				password: formData.password,
				date_of_birth: formData.date_of_birth || null,
				gender: formData.gender,
				address: formData.address,
				photo: null,
				phone: formData.phone,
				position: formData.position,
				salary,
				share_of_salary,
			}

			const res = await axios.post(
				`${import.meta.env.VITE_API_URL}/api/employer/create`,
				dataToSend,
				{
					headers: { 'Content-Type': 'application/json' },
				}
			)

			// serverdan kelgan javobni tekshirish
			if (res.data && res.data.message) {
				// Agar serverdan xatolik yoki ogohlantirish xabari bo'lsa
				toast.success(res.data.message)
			} else {
				toast.success('Ro\'yxatdan o\'tish muvaffaqiyatli!')
			}

			setFormData({
				fullName: '',
				login: '',
				password: '',
				date_of_birth: '',
				gender: '',
				address: '',
				phone: '',
				position: '',
				salary: '',
				share_of_salary: '',
			})

		} catch (error) {
			// serverdan kelgan xatolikni aniqlash
			if (error.response && error.response.data && error.response.data.message) {
				toast.error(error.response.data.message)
			} else {
				toast.error('Xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.')
			}
			console.error('Xatolik:', error)
		}
	}

	return (
		<div className="w-full bg-gradient-to-br from-indigo-50 to-blue-100 min-h-screen py-10 px-4">
			<div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
				<h2 className="text-3xl font-bold text-center text-blue-700 mb-8">👨‍💼 Xodimlar registratsiyasi</h2>
				<form onSubmit={handleSubmit} className="space-y-6">
					{/* To'liq Ism */}
					<div>
						<label className="block mb-2 font-semibold" htmlFor="fullName">To‘liq Ism <span className="text-red-600">*</span></label>
						<input
							id="fullName"
							name="fullName"
							type="text"
							required
							value={formData.fullName}
							onChange={handleChange}
							className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
							placeholder="Ismingizni kiriting"
						/>
					</div>

					{/* Tug'ilgan Sana va Jinsi */}
					<div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
						<div className="flex-1">
							<label className="block mb-2 font-semibold" htmlFor="date_of_birth">Tug‘ilgan Sana</label>
							<input
								id="date_of_birth"
								name="date_of_birth"
								type="date"
								value={formData.date_of_birth}
								onChange={handleChange}
								className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
							/>
						</div>
						<div className="flex-1">
							<label className="block mb-2 font-semibold" htmlFor="gender">Jinsi</label>
							<select
								id="gender"
								name="gender"
								value={formData.gender}
								onChange={handleChange}
								className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
							>
								<option value="">Jinsni tanlang</option>
								<option value="erkak">Erkak</option>
								<option value="ayol">Ayol</option>
							</select>
						</div>
					</div>

					{/* Manzil va Telefon */}
					<div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
						<div className="flex-1">
							<label className="block mb-2 font-semibold" htmlFor="address">Manzil</label>
							<input
								id="address"
								name="address"
								type="text"
								value={formData.address}
								onChange={handleChange}
								className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
								placeholder="Manzilingizni kiriting"
							/>
						</div>
						<div className="flex-1">
							<label className="block mb-2 font-semibold" htmlFor="phone">Telefon</label>
							<input
								id="phone"
								name="phone"
								type="tel"
								value={formData.phone}
								onChange={handleChange}
								className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
								placeholder="+998 90 123 45 67"
							/>
						</div>
					</div>

					{/* Lavozim va Ish Haq (yoki foiz) */}
					<div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
						<div className="flex-1">
							<label className="block mb-2 font-semibold" htmlFor="position">Lavozim <span className="text-red-600">*</span></label>
							<input
								id="position"
								name="position"
								type="text"
								required
								value={formData.position}
								onChange={handleChange}
								className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
								placeholder="Lavozimingizni kiriting"
							/>
						</div>
						<div className="flex-1">
							<label className="block mb-2 font-semibold" htmlFor="salary">Ish Haqi</label>
							<input
								id="salary"
								name="salary"
								type="number"
								min="0"
								value={formData.salary}
								onChange={handleChange}
								className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
								placeholder="oyligini kiriting"
							/>
						</div>
					</div>

					{/* Foiz ulushi */}
					<div className="flex-1 max-w-md">
						<label className="block mb-2 font-semibold" htmlFor="share_of_salary">Foiz Ulushi</label>
						<input
							id="share_of_salary"
							name="share_of_salary"
							type="number"
							min="0"
							value={formData.share_of_salary}
							onChange={handleChange}
							className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
							placeholder="foiz ulushini kiriting"
						/>
					</div>

					{/* Login va Parol */}
					<div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
						<div className="flex-1">
							<label className="block mb-2 font-semibold" htmlFor="login">Login <span className="text-red-600">*</span></label>
							<input
								id="login"
								name="login"
								type="text"
								required
								value={formData.login}
								onChange={handleChange}
								className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
								placeholder="Login kiriting"
							/>
						</div>
						<div className="flex-1">
							<label className="block mb-2 font-semibold" htmlFor="password">Parol</label>
							<input
								id="password"
								name="password"
								type="password"
								value={formData.password}
								onChange={handleChange}
								className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
								placeholder="Parolni kiriting"
							/>
						</div>
					</div>

					<button
						type="submit"
						className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition"
					>
						Ro‘yxatdan o‘tish
					</button>
				</form>
			</div>

			{/* ToastContainer qayerda bo‘lsa ham bo‘ladi */}
			<ToastContainer
				position="top-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>
		</div>
	)
}

export default EmployerRegister

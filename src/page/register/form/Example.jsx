import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Example = () => {
	const token = localStorage.getItem('token')
	const navigate = useNavigate()

	useEffect(() => {
		if (!token) {
			navigate('/login')
		}
	}, [])

	const handleChange = (e) => {
		console.log(e.target.name, e.target.value)
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		console.log('Form yuborildi')
	}

	return (
		<div className="max-w-6xl mx-auto p-6">
			<form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md border p-6">
				<h2 className="text-2xl font-semibold mb-6 text-center text-indigo-700">Ro'yxatdan o'tish</h2>

				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
					{/* To'liq ism familiyasi */}
					<div className="flex flex-col">
						<label htmlFor="fullName" className="mb-1 text-sm font-medium text-gray-700">To'liq ism familiyasi</label>
						<input
							type="text"
							id="fullName"
							name="fullName"
							placeholder="Ismingiz va familiyangiz"
							onChange={handleChange}
							className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
						/>
					</div>

					{/* Tug'ilgan kun */}
					<div className="flex flex-col">
						<label htmlFor="date_of_birth" className="mb-1 text-sm font-medium text-gray-700">Tug'ilgan kun</label>
						<input
							type="date"
							id="date_of_birth"
							name="date_of_birth"
							onChange={handleChange}
							className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
						/>
					</div>

					{/* Jinsi */}
					<div className="flex flex-col">
						<label htmlFor="gender" className="mb-1 text-sm font-medium text-gray-700">Jinsi</label>
						<select
							id="gender"
							name="gender"
							onChange={handleChange}
							className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
						>
							<option value="">Tanlang</option>
							<option value="erkak">Erkak</option>
							<option value="ayol">Ayol</option>
						</select>
					</div>

					{/* Manzili */}
					<div className="flex flex-col">
						<label htmlFor="address" className="mb-1 text-sm font-medium text-gray-700">Manzili</label>
						<input
							type="text"
							id="address"
							name="address"
							placeholder="To'liq manzil"
							onChange={handleChange}
							className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
						/>
					</div>

					{/* Maktab */}
					<div className="flex flex-col">
						<label htmlFor="old_school" className="mb-1 text-sm font-medium text-gray-700">Maktabingiz</label>
						<input
							type="text"
							id="old_school"
							name="old_school"
							placeholder="Maktab nomi"
							onChange={handleChange}
							className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
						/>
					</div>

					{/* Sinf */}
					<div className="flex flex-col">
						<label htmlFor="old_class" className="mb-1 text-sm font-medium text-gray-700">Sinfingiz</label>
						<input
							type="text"
							id="old_class"
							name="old_class"
							placeholder="Sinf nomi"
							onChange={handleChange}
							className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
						/>
					</div>

					{/* Telefon */}
					<div className="flex flex-col">
						<label htmlFor="phone" className="mb-1 text-sm font-medium text-gray-700">Telefon raqam</label>
						<input
							type="text"
							id="phone"
							name="phone"
							placeholder="+998901234567"
							onChange={handleChange}
							className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
						/>
					</div>

					{/* Login */}
					<div className="flex flex-col">
						<label htmlFor="login" className="mb-1 text-sm font-medium text-gray-700">Login</label>
						<input
							type="text"
							id="login"
							name="login"
							placeholder="Login"
							onChange={handleChange}
							className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
						/>
					</div>

					{/* Parol */}
					<div className="flex flex-col">
						<label htmlFor="password" className="mb-1 text-sm font-medium text-gray-700">Parol</label>
						<input
							type="password"
							id="password"
							name="password"
							placeholder="Parol"
							onChange={handleChange}
							className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
						/>
					</div>
				</div>

				{/* Submit tugmasi */}
				<div className="flex justify-center mt-8">
					<button
						type="submit"
						className="bg-indigo-600 text-white font-semibold px-6 py-2 rounded hover:bg-indigo-700 transition duration-300"
					>
						Yuborish
					</button>
				</div>
			</form>
		</div>
	)
}

export default Example

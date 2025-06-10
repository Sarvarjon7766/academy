import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const DeleteStudent = ({ student }) => {
	const navigate = useNavigate()
	const handleArchive = async () => {
		alert(`${student.fullName} arxivga qo‘shildi!`)
		try {
			const res = await axios.delete(`http://localhost:4000/api/student/student-archived/${student._id}`)
			if (res.data.success) (
				navigate('/register/student-list')
			)
		} catch (error) {
			console.error(error)
		}
	}

	const handleBack = () => {
		navigate('/register/student-list')
	}

	return (
		<div className="max-w-3xl mx-auto mt-16 p-8 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 rounded-2xl shadow-xl">
			<h2 className="text-3xl font-extrabold text-center text-purple-900 mb-10 tracking-wide drop-shadow-lg">
				Talaba to‘liq ma’lumotlari
			</h2>

			{/* Ma'lumotlar */}
			<div className="space-y-6 text-purple-900 text-lg font-medium">
				<p><span className="font-extrabold">To‘liq ism:</span> {student.fullName}</p>
				<p><span className="font-extrabold">Tug‘ilgan sana:</span> {new Date(student.date_of_birth).toLocaleDateString()}</p>
				<p><span className="font-extrabold">Jinsi:</span> {student.gender}</p>
				<p><span className="font-extrabold">Manzil:</span> {student.address}</p>
				<p><span className="font-extrabold">Telefon:</span> {student.phone}</p>
				<p><span className="font-extrabold">Login:</span> {student.login}</p>
				{student.group && <p><span className="font-extrabold">Guruh:</span> {student.group.name}</p>}
				{student.createdAt && (
					<p><span className="font-extrabold">Ro‘yxatga olingan:</span> {new Date(student.createdAt).toLocaleString()}</p>
				)}
			</div>

			{/* Tugmalar */}
			<div className="mt-14 flex flex-col sm:flex-row justify-center gap-6">
				<button
					onClick={handleArchive}
					className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold rounded-xl shadow-lg hover:scale-105 transform transition duration-300 hover:shadow-2xl"
					title="Talabani arxivga qo‘shish"
				>
					Arxivga qo‘shish
				</button>

				<button
					onClick={handleBack}
					className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-gray-500 to-gray-700 text-white font-bold rounded-xl shadow-lg hover:scale-105 transform transition duration-300 hover:shadow-2xl"
					title="Orqaga qaytish"
				>
					Orqaga qaytish
				</button>
			</div>
		</div>
	)
}

export default DeleteStudent

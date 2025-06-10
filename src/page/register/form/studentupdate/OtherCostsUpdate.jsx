import axios from "axios";
import { useEffect, useState } from "react";
import AddRooms from "./AddRooms";

const OtherCostsUpdate = ({ student }) => {
	const [selectedHostel, setSelectedHostel] = useState(false);
	const [rooms, setRooms] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [xizmatlar, setXizmatlar] = useState({
		yotoqxona: [],
		mahsulot: [],
		transport: [],
	});

	const studentId = student._id;

	useEffect(() => {
		const fetchServices = async () => {
			setLoading(true);
			setError("");

			try {
				const [hostelRes, productRes, transportRes] = await Promise.all([
					axios.get("http://localhost:4000/api/hostel/getAll"),
					axios.get("http://localhost:4000/api/product/getAll"),
					axios.get("http://localhost:4000/api/transport/getAll"),
				]);

				const selectedIds = {
					hostel: student.hostel?._id,
					product: student.product?._id,
					transport: student.transport?._id,
				};

				setXizmatlar({
					yotoqxona: hostelRes.data.hostels.map(item => ({
						...item,
						tanlangan: item._id === selectedIds.hostel,
						turi: "yotoqxona",
						narx: item.hostelPrice,
					})),
					mahsulot: productRes.data.products.map(item => ({
						...item,
						tanlangan: item._id === selectedIds.product,
						turi: "mahsulot",
						narx: item.productPrice,
					})),
					transport: transportRes.data.transports.map(item => ({
						...item,
						tanlangan: item._id === selectedIds.transport,
						turi: "transport",
						narx: item.transportPrice,
					})),
				});
			} catch (err) {
				setError("Xizmat ma'lumotlari yuklanmadi");
			} finally {
				setLoading(false);
			}
		};

		if (studentId) {
			fetchServices();
		}
	}, [studentId]);

	const toggleSelection = (type, id) => {
		setXizmatlar(prev => ({
			...prev,
			[type]: prev[type].map(item =>
				item._id === id ? { ...item, tanlangan: !item.tanlangan } : item
			),
		}));
	};

	const handleSubmit = async () => {
		setError("");
		setSuccess("");

		const selectedServices = {
			hostel: xizmatlar.yotoqxona.filter(item => item.tanlangan),
			mahsulot: xizmatlar.mahsulot.filter(item => item.tanlangan),
			transport: xizmatlar.transport.filter(item => item.tanlangan),
		};

		try {
			const res = await axios.put(
				`http://localhost:4000/api/student/other-cost-update/${studentId}`,
				{
					xizmatlar: selectedServices,
				}
			);

			if (res.data.success) {
				setSelectedHostel(res.data.isHostel)
				setSuccess("Xizmatlarga muvaffaqiyatli yozildingiz");
			} else {
				setError(res.data.message || "Noma'lum xatolik yuz berdi");
			}
		} catch {
			setError("Ro'yxatdan o'tishda xatolik yuz berdi");
		}
	};

	const allServices = [
		...xizmatlar.mahsulot,
		...xizmatlar.transport,
		...xizmatlar.yotoqxona,
	];

	if (selectedHostel) {
		return <AddRooms onHostel={() => setSelectedHostel(false)} studentId={student._id} />;
	}

	return (
		<div className="max-w-3xl mx-auto p-4 bg-white rounded-lg shadow-lg border border-gray-200">
			<h2 className="text-xl text-center font-bold p-4 text-indigo-400">
			{student.fullName}ning	qo'shimcha Xizmatlarni yangilash
			</h2>

			{error && (
				<div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4 text-sm">
					{error}
				</div>
			)}

			{success && (
				<div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded mb-4 text-sm">
					{success}
				</div>
			)}

			{loading ? (
				<div className="text-center py-6">
					<div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
					<p className="mt-3 text-gray-600">Ma'lumotlar yuklanmoqda...</p>
				</div>
			) : (
				<div className="space-y-3">
					{allServices.length > 0 ? (
						allServices.map(service => (
							<div
								key={service._id}
								className={`p-4 border rounded-lg flex items-start cursor-pointer transition-all ${
									service.tanlangan
										? "bg-blue-50 border-blue-400 shadow-sm"
										: "hover:bg-gray-50 border-gray-200"
								}`}
								onClick={() => toggleSelection(service.turi, service._id)}
							>
								<div className="flex-shrink-0 mr-3 mt-1">
									<div
										className={`w-5 h-5 rounded border flex items-center justify-center ${
											service.tanlangan
												? "bg-blue-600 border-blue-600"
												: "border-gray-400"
										}`}
									>
										{service.tanlangan && (
											<svg
												className="w-3 h-3 text-white"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={3}
													d="M5 13l4 4L19 7"
												/>
											</svg>
										)}
									</div>
								</div>

								<div className="flex-1">
									<div className="flex justify-between items-start">
										<h4 className="font-medium text-gray-800">
											{service.hostelName ||
												service.productName ||
												service.transportName}
										</h4>
										{service.narx && (
											<span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm font-medium">
												{service.narx.toLocaleString("uz-UZ", {
													style: "currency",
													currency: "UZS",
												})}
											</span>
										)}
									</div>
									<p className="text-sm text-gray-600 mt-1.5">
										{service.description}
									</p>
								</div>
							</div>
						))
					) : (
						<div className="text-center py-8 border border-dashed rounded-lg bg-gray-50">
							<div className="text-gray-400 mb-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-12 w-12 mx-auto"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1}
										d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
							<p className="text-gray-500">Hech qanday xizmat topilmadi</p>
						</div>
					)}
				</div>
			)}

			<div className="flex justify-end gap-3 mt-6 pt-4 border-t">
				<button
					onClick={handleSubmit}
					className="px-5 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm"
				>
					Yangilash
				</button>
			</div>
		</div>
	);
};

export default OtherCostsUpdate;

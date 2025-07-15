import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { FiDownload, FiUser } from 'react-icons/fi';
import { FaBed, FaHotel } from 'react-icons/fa';

const RegisterHostel = () => {
	const [rooms, setRooms] = useState([]);
	const [error, setError] = useState("");
	const [stats, setStats] = useState({ totalRooms: 0, totalBeds: 0, occupiedBeds: 0 });

	const fetchRooms = async () => {
		try {
			const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/room/getAll`);
			if (res.data.success) {
				setRooms(res.data.data);
				setError("");
				
				// Calculate stats
				const totalRooms = res.data.data.length;
				let totalBeds = 0;
				let occupiedBeds = 0;
				
				res.data.data.forEach(room => {
					totalBeds += room.roomCapacity;
					room.beds.forEach(bed => {
						if (!bed.includes("bo'sh")) occupiedBeds++;
					});
				});
				
				setStats({ totalRooms, totalBeds, occupiedBeds });
			} else {
				setError(res.data.message || "Xatolik yuz berdi");
			}
		} catch (error) {
			console.error("Xona ma'lumotlarini olishda xatolik:", error);
			setError("Xona ma'lumotlarini olishda xatolik yuz berdi.");
		}
	};

	useEffect(() => {
		fetchRooms();
	}, []);

	const downloadExcel = () => {
		if (rooms.length === 0) {
			alert("Xonalar mavjud emas");
			return;
		}
	
		const data = [];
	
		rooms.forEach(room => {
			let roomData = {
				"Xona Raqami": room.roomNumber,
				"Sig‘im": room.roomCapacity,
			};
	
			let emptyBedsCount = 0;
			roomData["Bo'sh joylar soni"] = 0;
	
			room.beds.forEach((bed, index) => {
				const bedLabel = `Yotoq-joy ${index + 1}`;
				const isEmpty = bed.includes("bo'sh");
				roomData[bedLabel] = isEmpty ? "bo'sh" : bed;
	
				if (isEmpty) emptyBedsCount++;
			});
	
			roomData["Bo'sh joylar soni"] = emptyBedsCount;
			data.push(roomData);
		});
	
		const ws = XLSX.utils.json_to_sheet(data);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, "Xonalar");
		XLSX.writeFile(wb, "xonalar_ma'lumotlari.xlsx");
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6">
			<div className="mx-auto space-y-6 sm:space-y-8">
				{/* Header */}
				<div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-4 sm:p-6 text-white overflow-hidden">
					<div className="flex flex-col md:flex-row justify-between items-center gap-6">
						<div className="flex items-center gap-4">
							<div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
								<FaHotel className="text-3xl" />
							</div>
							<div>
								<h1 className="text-2xl sm:text-3xl font-bold">Xonalarni Ko'rish</h1>
								<p className="opacity-90 mt-1">Xonalar va yotoq joylarni ko'rish tizimi</p>
							</div>
						</div>
						
						<div className="flex gap-3">
							<button
								onClick={downloadExcel}
								className="flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-full font-medium shadow-md transition-all"
								title="Excel faylini yuklab olish"
							>
								<FiDownload className="text-lg" />
								<span className="hidden sm:inline">Yuklab olish</span>
							</button>
						</div>
					</div>
				</div>

				{/* Stats Section */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="bg-white rounded-2xl p-5 shadow-md border border-blue-100 flex items-center gap-4">
						<div className="bg-blue-100 p-3 rounded-xl">
							<FaHotel className="text-blue-600 text-xl" />
						</div>
						<div>
							<div className="text-2xl font-bold text-blue-700">{stats.totalRooms}</div>
							<div className="text-gray-600">Jami xonalar</div>
						</div>
					</div>
					
					<div className="bg-white rounded-2xl p-5 shadow-md border border-indigo-100 flex items-center gap-4">
						<div className="bg-indigo-100 p-3 rounded-xl">
							<FaBed className="text-indigo-600 text-xl" />
						</div>
						<div>
							<div className="text-2xl font-bold text-indigo-700">{stats.totalBeds}</div>
							<div className="text-gray-600">Jami yotoqlar</div>
						</div>
					</div>
					
					<div className="bg-white rounded-2xl p-5 shadow-md border border-green-100 flex items-center gap-4">
						<div className="bg-green-100 p-3 rounded-xl">
							<FiUser className="text-green-600 text-xl" />
						</div>
						<div>
							<div className="text-2xl font-bold text-green-700">{stats.occupiedBeds}</div>
							<div className="text-gray-600">Band qilingan</div>
						</div>
					</div>
				</div>

				{/* Room List */}
				<div className="grid gap-6 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{rooms.length > 0 ? (
						rooms.map(room => (
							<div
								key={room._id}
								className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 transition-all hover:shadow-xl"
							>
								<div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white">
									<div className="flex justify-between items-center">
										<h2 className="text-xl font-bold flex items-center gap-2">
											<FaHotel className="text-yellow-300" />
											{room.roomNumber}
										</h2>
										<span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
											{room.roomCapacity} kishi
										</span>
									</div>
								</div>
								
								<div className="p-4">
									<div className="flex justify-between items-center mb-4">
										<div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
											Bo'sh joylar: {room.beds.filter(bed => bed.includes("bo'sh")).length}
										</div>
									</div>
									
									<div className="space-y-3">
										<h3 className="font-medium text-gray-700 flex items-center gap-2">
											<FaBed className="text-indigo-600" /> Yotoq holatlari:
										</h3>
										<div className="space-y-2">
											{room.beds.map((bed, index) => (
												<div 
													key={index} 
													className={`p-3 rounded-lg flex justify-between items-center ${
														bed.includes("bo'sh") 
															? 'bg-green-50 border border-green-200' 
															: 'bg-indigo-50 border border-indigo-200'
													}`}
												>
													<div className="flex items-center gap-2">
														<div className={`w-3 h-3 rounded-full ${
															bed.includes("bo'sh") ? 'bg-green-500' : 'bg-indigo-500'
														}`}></div>
														<span className={bed.includes("bo'sh") ? 'text-green-700' : 'text-indigo-700'}>
															Yotoq {index + 1}
														</span>
													</div>
													<span className={bed.includes("bo'sh") ? 'text-green-600 font-medium' : 'text-indigo-600 font-medium'}>
														{bed}
													</span>
												</div>
											))}
										</div>
									</div>
								</div>
							</div>
						))
					) : (
						<div className="col-span-full bg-white rounded-2xl shadow-md p-8 text-center">
							<div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
								<FaHotel className="text-indigo-600 text-2xl" />
							</div>
							<h3 className="text-xl font-medium text-gray-800 mb-2">Xonalar mavjud emas</h3>
							<p className="text-gray-600">Ko'rsatish uchun xonalar topilmadi</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default RegisterHostel;
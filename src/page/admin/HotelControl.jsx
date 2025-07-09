import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { FiDownload, FiPlus, FiTrash2, FiEdit, FiUser, FiUsers, FiPrinter } from 'react-icons/fi';
import { FaBed, FaHotel, FaRegCalendarAlt } from 'react-icons/fa';

const AddRooms = ({ onchange }) => {
  const [roomNumber, setRoomNumber] = useState('');
  const [roomCapacity, setRoomCapacity] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/room/create`, {
        roomNumber,
        roomCapacity,
        beds: Array(parseInt(roomCapacity)).fill("bo'sh")
      });
      if (res.data.success) {
        setMessage({ text: 'Xona muvaffaqiyatli qoʻshildi!', success: true });
        setRoomNumber('');
        setRoomCapacity('');
        onchange();
        setTimeout(() => {
          setIsModalOpen(false);
          setMessage(null);
        }, 2000);
      }
    } catch (error) {
      setMessage({ text: 'Xona qoʻshishda xatolik yuz berdi', success: false });
      console.error('Xatolik:', error);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-2 rounded-full font-medium shadow-lg transition-all"
      >
        <FiPlus className="text-lg" />
        <span className="hidden sm:inline">Yangi xona</span>
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <FaHotel /> Yangi xona qo'shish
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-white hover:text-gray-200"
                >
                  <FiPlus className="transform rotate-45 text-xl" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              {message && (
                <div className={`mb-4 p-3 rounded-lg ${message.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {message.text}
                </div>
              )}
              
              <div className="mb-4">
                <label className=" text-gray-700 mb-2 flex items-center gap-2">
                  <FiEdit /> Xona raqami
                </label>
                <input
                  type="text"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  className="w-full p-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masalan: 101"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className=" text-gray-700 mb-2 flex items-center gap-2">
                  <FiUsers /> Sig'imi (kishi)
                </label>
                <input
                  type="number"
                  value={roomCapacity}
                  onChange={(e) => setRoomCapacity(e.target.value)}
                  min="1"
                  max="10"
                  className="w-full p-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masalan: 4"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 rounded-lg font-medium shadow-md transition-all"
              >
                Xonani qo'shish
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

const HotelControl = () => {
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newBedStatus, setNewBedStatus] = useState([]);
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

  const handleEditRoom = (room) => {
    setSelectedRoom(room);
    setNewBedStatus([...room.beds]);
    setIsEditModalOpen(true);
  };

  const handleDeleteRoom = async (roomId) => {
    if (window.confirm("Haqiqatan ham bu xonani o'chirmoqchimisiz?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/room/delete/${roomId}`);
        fetchRooms();
      } catch (error) {
        console.error("Xonani o'chirishda xatolik:", error);
      }
    }
  };

  const handleUpdateRoom = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/room/update/${selectedRoom._id}`, {
        beds: newBedStatus
      });
      fetchRooms();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Xonani yangilashda xatolik:", error);
    }
  };

  const toggleBedStatus = (index) => {
    const updatedStatus = [...newBedStatus];
    updatedStatus[index] = updatedStatus[index].includes("bo'sh") 
      ? "" 
      : "bo'sh";
    setNewBedStatus(updatedStatus);
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
                <h1 className="text-2xl sm:text-3xl font-bold">Xonalarni Boshqarish</h1>
                <p className="opacity-90 mt-1">Xonalar va yotoq joylarni boshqarish tizimi</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <AddRooms onchange={fetchRooms} />
              
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
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditRoom(room)}
                        className="p-2 bg-blue-100 rounded-lg text-blue-600 hover:bg-blue-200"
                        title="Tahrirlash"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteRoom(room._id)}
                        className="p-2 bg-red-100 rounded-lg text-red-600 hover:bg-red-200"
                        title="O'chirish"
                      >
                        <FiTrash2 size={16} />
                      </button>
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
              <p className="text-gray-600">Yangi xona qo'shish uchun "Yangi xona" tugmasini bosing</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Room Modal */}
      {isEditModalOpen && selectedRoom && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <FiEdit /> {selectedRoom.roomNumber} xonasini tahrirlash
                </h3>
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-white hover:text-gray-200"
                >
                  <FiPlus className="transform rotate-45 text-xl" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <FaBed className="text-indigo-600" /> Yotoq holatlarini o'zgartirish:
                </h4>
                <div className="space-y-3">
                  {newBedStatus.map((bed, index) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded-lg flex justify-between items-center cursor-pointer transition-colors ${
                        bed.includes("bo'sh") 
                          ? 'bg-green-50 border border-green-200 hover:bg-green-100' 
                          : 'bg-indigo-50 border border-indigo-200 hover:bg-indigo-100'
                      }`}
                      onClick={() => toggleBedStatus(index)}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          bed.includes("bo'sh") ? 'bg-green-500' : 'bg-indigo-500'
                        }`}></div>
                        <span>Yotoq {index + 1}</span>
                      </div>
                      <span className={bed.includes("bo'sh") ? 'text-green-600 font-medium' : 'text-indigo-600 font-medium'}>
                        {bed.includes("bo'sh") ? "Bo'sh" : "Band"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={handleUpdateRoom}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 rounded-lg font-medium shadow-md transition"
                >
                  Saqlash
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelControl;
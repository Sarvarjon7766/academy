import axios from 'axios'
import React, { useEffect, useState } from 'react'
import * as XLSX from 'xlsx' // xlsx kutubxonasini import qilamiz
import { FiDownload } from "react-icons/fi";
import AddRooms from './rooms/AddRooms'

const HotelControl = () => {
  const [rooms, setRooms] = useState([])
  const [error, setError] = useState("")

  const fetchRooms = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/room/getAll")
      if (res.data.success) {
        setRooms(res.data.data)
        setError("")
      } else {
        setError(res.data.message || "Xatolik yuz berdi")
      }
    } catch (error) {
      console.error("Xona ma'lumotlarini olishda xatolik:", error)
      setError("Xona ma'lumotlarini olishda xatolik yuz berdi.")
    }
  }

  useEffect(() => {
    fetchRooms()
  }, [])

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
  
      // Bo'sh joylar soni ni shu yerda, sig'imdan keyin joylashtiramiz
      roomData["Bo'sh joylar soni"] = 0; // vaqtinchalik, keyin yangilanadi
  
      // Har bir yotoq-joyni index bo'yicha qo‘shamiz
      room.beds.forEach((bed, index) => {
        const bedLabel = `Yotoq-joy ${index + 1}`;
        const isEmpty = bed.includes("bo'sh");
        roomData[bedLabel] = isEmpty ? "bo'sh" : bed;
  
        if (isEmpty) emptyBedsCount++;
      });
  
      // Endi bo'sh joylar sonini yangilaymiz
      roomData["Bo'sh joylar soni"] = emptyBedsCount;
  
      data.push(roomData);
    });
  
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Xonalar");
    XLSX.writeFile(wb, "xonalar_ma'lumotlari.xlsx");
  };
  


  return (
    <div className="bg-gradient-to-br from-blue-100 via-white to-blue-50 min-h-screen p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-10">
        {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white shadow-lg p-4 sm:p-6 rounded-xl border border-blue-200">
            {/* Sarlavha */}
            <h1 className="text-2xl sm:text-4xl font-extrabold text-blue-700 text-center sm:text-left w-full sm:w-auto">
              🏨 Xonalarni Boshqarish
            </h1>

            {/* AddRooms va Yuklab olish tugmasi yonma-yon */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-end">
              <AddRooms onchange={fetchRooms} />

              {/* Yuklab olish tugmasi (icon bilan) */}
              <button
                onClick={downloadExcel}
                className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow transition-colors"
                title="Excel faylini yuklab olish"
              >
                <FiDownload size={22} />
              </button>
            </div>
          </div>


          {/* Error message
          {error && (
            <div className="text-red-600 text-center text-base sm:text-lg font-semibold">
              {error}
            </div>
          )} */}



          {/* Room List */}
          <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {rooms.length > 0 ? (
              rooms.map(room => (
                <div
                  key={room._id}
                  className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-all p-4 sm:p-6 relative"
                >
                  {/* Xona raqami va sig‘imi */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2 sm:gap-0">
                    <h2 className="text-xl sm:text-2xl  font-bold text-blue-800">
                      {room.roomNumber}
                    </h2>
                    <span className="bg-blue-100 text-blue-700 text-xs sm:text-sm font-semibold px-4 py-1 rounded-full shadow text-center w-fit">
                      {room.roomCapacity} kishi
                    </span>
                  </div>

                  {/* Yotoqlar */}
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                    <p className="text-base sm:text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
                      🛏 <span>Yotoqlar:</span>
                    </p>
                    {room.beds.length > 0 ? (
                      <ol className="list-decimal ml-5 space-y-2 text-sm">
                        {room.beds.map((bed, index) => (
                          <li key={index}>
                            <div
                              className={`px-3 py-2 rounded-lg font-medium ${bed.includes("bo'sh")
                                ? 'bg-green-100 text-green-700'
                                : 'bg-blue-100 text-blue-700'
                                } shadow-sm`}
                            >
                              {bed}
                            </div>
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <div className="italic text-gray-400">
                        Yotoq mavjud emas
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 italic col-span-full">
                🔍 Xonalar mavjud emas
              </div>
            )}
          </div>
        </div>
      </div>
      )
}

      export default HotelControl

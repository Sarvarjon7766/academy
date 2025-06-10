import axios from 'axios'
import React, { useEffect, useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

const StudentAttendanceChart = () => {
  const token = localStorage.getItem('token')
  const currentMonth = new Date().getMonth() + 1
  const [isData, setIsData] = useState([])
  const [selectedYear, setSelectedYear] = useState(new Date().toLocaleDateString("en-US", { year: "numeric" }))
  const [isOpenYear, setIsOpenYear] = useState(false)
  const [isOpenMonth, setIsOpenMonth] = useState(false)
  const [isAvailable, setIsAvailable] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState('Oyni tanlang')
  const [selectedMonthNumber, setSelectedMonthNumber] = useState(currentMonth)

  const currentYear = new Date().getFullYear()
  const years = [...Array(7)].map((_, i) => currentYear - 6 + i)

  const months = [
    { name: "Yanvar", value: 1 }, { name: "Fevral", value: 2 }, { name: "Mart", value: 3 },
    { name: "Aprel", value: 4 }, { name: "May", value: 5 }, { name: "Iyun", value: 6 },
    { name: "Iyul", value: 7 }, { name: "Avgust", value: 8 }, { name: "Sentabr", value: 9 },
    { name: "Oktabr", value: 10 }, { name: "Noyabr", value: 11 }, { name: "Dekabr", value: 12 },
  ]

  const fetchData = async () => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/attandance/search-lowachieving/${selectedYear}/${selectedMonthNumber}`,
        { headers }
      )
      if (res.status === 200) {
        if (res.data.data.length !== 0) {
          const newData = res.data.data.map(datas => ({
            name: datas.fullName,
            ortacha_natija: datas.ortacha_score,
            darsdagi_faollik: datas.darsdagi_faollik
          }))
          setIsData(newData)
          setIsAvailable(true)
        } else {
          setIsAvailable(false)
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [selectedYear, selectedMonthNumber])

  return (
    <div className="w-full bg-white p-5 shadow-lg rounded-2xl my-4 border border-gray-200">
      <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">
        📊 O'quvchilarning Faollik Grafikasi
      </h2>

      <div className="flex justify-center gap-4 mb-6 flex-wrap">
        {/* Year Selector */}
        <div className="relative">
          <button
            onClick={() => {
              setIsOpenYear(!isOpenYear)
              setIsOpenMonth(false)
            }}
            className="w-36 py-2 px-4 rounded-xl border bg-indigo-50 text-indigo-700 font-medium hover:bg-indigo-100 focus:ring-2 focus:ring-indigo-300 transition-all duration-200"
          >
            {selectedYear}
          </button>
          {isOpenYear && (
            <div className="absolute mt-2 w-36 bg-white border rounded-xl shadow-lg z-10 max-h-40 overflow-y-auto">
              {years.map((year) => (
                <div
                  key={year}
                  onClick={() => {
                    setSelectedYear(year)
                    setIsOpenYear(false)
                  }}
                  className="px-4 py-2 hover:bg-indigo-100 cursor-pointer"
                >
                  {year}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Month Selector */}
        <div className="relative">
          <button
            onClick={() => {
              setIsOpenMonth(!isOpenMonth)
              setIsOpenYear(false)
            }}
            className="w-36 py-2 px-4 rounded-xl border bg-indigo-50 text-indigo-700 font-medium hover:bg-indigo-100 focus:ring-2 focus:ring-indigo-300 transition-all duration-200"
          >
            {selectedMonth}
          </button>
          {isOpenMonth && (
            <div className="absolute mt-2 w-36 bg-white border rounded-xl shadow-lg z-10 max-h-40 overflow-y-auto">
              {months.map((month) => (
                <div
                  key={month.value}
                  onClick={() => {
                    setSelectedMonth(month.name)
                    setSelectedMonthNumber(month.value)
                    setIsOpenMonth(false)
                  }}
                  className="px-4 py-2 hover:bg-indigo-100 cursor-pointer"
                >
                  {month.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <h3 className="text-lg text-center font-semibold text-gray-700 mb-6">
        ⚠️ E'tibor talab qiladigan o'quvchilar
      </h3>

      {isAvailable ? (
        <div className="rounded-lg border border-gray-100 shadow-inner p-2 bg-gray-50">
          <ResponsiveContainer width="100%" height={isData.length * 50}>
            <BarChart data={isData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={150} tick={{ fontWeight: "bold", fontSize: 14 }} />
              <Tooltip />
              <Bar dataKey="ortacha_natija" fill="#EF4444" radius={[10, 10, 10, 10]} />
              <Bar dataKey="darsdagi_faollik" fill="#6366F1" radius={[10, 10, 10, 10]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="text-center mt-6 text-red-600 font-medium">
          Bu sanada hech qanday ma'lumot yo'q
        </div>
      )}
    </div>
  )
}

export default StudentAttendanceChart

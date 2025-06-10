import axios from 'axios'
import React, { useEffect, useState } from "react"
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

const GradeChart = () => {
  const token = localStorage.getItem('token')
  const [isData, setIsData] = useState([])
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [isOpen, setIsOpen] = useState(false)

  const currentYear = new Date().getFullYear()
  const years = [...Array(7)].map((_, i) => currentYear - 6 + i)

  const fetchData = async () => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/attandance/search-attandance/${selectedYear}`,
        { headers }
      )

      if (res.status === 200) {
        const monthNames = [
          "Yan", "Fev", "Mar", "Apr", "May", "Iyn",
          "Iyl", "Avg", "Sen", "Okt", "Noy", "Dek"
        ]

        const newData = res.data.data.map(datas => {
          let ball
          if (datas.ortacha_score > 86) {
            ball = 5
          } else if (datas.ortacha_score > 70) {
            ball = 4
          } else if (datas.ortacha_score > 60) {
            ball = 3
          } else {
            ball = 2
          }

          return {
            name: monthNames[datas.oy - 1],
            ortacha_natija: ball,
            kelganlar_soni: datas.kelganlar_soni,
            kelmaganlar_soni: datas.kelmaganlar_soni,
          }
        })

        setIsData(newData)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [selectedYear])

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 my-4 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-indigo-600">
          Talabalar oylik nazorati
        </h3>

        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-32 px-4 py-2 border rounded-lg bg-white text-gray-700 shadow-sm hover:bg-gray-100 focus:ring-2 focus:ring-indigo-500"
          >
            {selectedYear}
          </button>

          {isOpen && (
            <div className="absolute mt-1 w-32 border bg-white shadow-lg rounded-lg overflow-y-auto max-h-40 z-10 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
              {years.map((year) => (
                <div
                  key={year}
                  onClick={() => {
                    setSelectedYear(year)
                    setIsOpen(false)
                  }}
                  className={`px-4 py-2 cursor-pointer hover:bg-indigo-100 transition duration-150 ${
                    selectedYear === year ? 'bg-indigo-50 font-semibold' : ''
                  }`}
                >
                  {year}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={isData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 13 }} />
            <YAxis tick={{ fontSize: 13 }} />
            <Tooltip
              wrapperStyle={{ fontSize: '13px' }}
              contentStyle={{ backgroundColor: '#f3f4f6', borderRadius: '8px' }}
            />
            <Line
              type="monotone"
              dataKey="ortacha_natija"
              stroke="#10B981"
              strokeWidth={3}
              dot={{ r: 4 }}
              name="Baholar"
            />
            <Line
              type="monotone"
              dataKey="kelganlar_soni"
              stroke="#4F46E5"
              strokeWidth={3}
              dot={{ r: 4 }}
              name="Kelganlar"
            />
            <Line
              type="monotone"
              dataKey="kelmaganlar_soni"
              stroke="#EF4444"
              strokeWidth={3}
              dot={{ r: 4 }}
              name="Kelmaganlar"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default GradeChart

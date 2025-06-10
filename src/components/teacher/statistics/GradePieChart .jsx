import axios from 'axios'
import React, { useEffect, useState } from "react"
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts"

const COLORS = ['#4F46E5', '#F97316'] // Indigo va Orange

const GradePieChart = () => {
  const [isData, setIsData] = useState({})
  const [isAvailable, setIsAvailable] = useState(true)
  const token = localStorage.getItem('token')

  const fetchData = async () => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/group/search-group-student`,
        { headers }
      )
      if (res.data.success) {
        setIsData(res.data.data)
        setIsAvailable(true)
      } else {
        setIsAvailable(false)
      }
    } catch (error) {
      console.error('Error fetching data:', error.response ? error.response.data : error.message)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const chartData = Object.entries(isData).map(([gender, value]) => ({
    name: gender === "erkak" ? "O'g'il bolalar" : "Qiz bolalar",
    value
  }))

  return (
    <div className="w-full bg-white p-6 shadow-xl rounded-2xl my-4">
      <h2 className="text-center text-xl font-bold text-gray-800 mb-4">
        🎓 Talabalarning Gender Taqsimoti
      </h2>

      {isAvailable ? (
        <div className="flex flex-col items-center justify-center">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <h3 className="text-red-500 text-center mt-5 font-semibold">
          Hech qanday ma'lumot topilmadi
        </h3>
      )}
    </div>
  )
}

export default GradePieChart

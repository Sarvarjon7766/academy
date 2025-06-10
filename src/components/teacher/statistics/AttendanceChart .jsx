import axios from 'axios'
import React, { useEffect, useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts'

const TotalStudent = () => {
  const token = localStorage.getItem('token')
  const [groups, setGroups] = useState([])

  const fetchData = async () => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      const res = await axios.get(`http://localhost:4000/api/group/search-group`, { headers })

      if (res.status === 200) {
        const newAttendanceDates = res.data.groups.map(group => ({
          name: group.subject,
          talabalar: group.totalStudents
        }))
        setGroups(newAttendanceDates)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 border-l-4 border-indigo-500 hover:shadow-xl transition-all duration-300 ease-in-out">
      <div className="mb-4">
        <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold text-center text-indigo-600">
          Fanlar bo‘yicha talabalar soni
        </h3>
        <div className="w-20 mx-auto mt-1 border-b-4 border-blue-400 rounded-full" />
      </div>

      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={groups} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              dataKey="name"
              type="category"
              tick={{ fontSize: 13, fontWeight: 600 }}
              width={110}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              wrapperStyle={{ fontSize: '13px' }}
              contentStyle={{ backgroundColor: '#f1f5f9', borderRadius: '8px', borderColor: '#cbd5e1' }}
            />
            <Bar dataKey="talabalar" barSize={18} radius={[0, 8, 8, 0]}>
              {groups.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.talabalar === 0 ? '#22c55e' : '#6366f1'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default TotalStudent

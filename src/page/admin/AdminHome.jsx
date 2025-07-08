import axios from 'axios'
import { useEffect, useState } from "react"
import { Link } from 'react-router-dom'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend
} from "recharts"

// Moved static data outside component
const COLORS = ["#10B981", "#EF4444", "#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

const AdminHome = () => {
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    employees: 0,
    subjects: 0
  })
  
  const [paymentStats, setPaymentStats] = useState([
    { name: "To'langan", value: 0 },
    { name: 'Qisman to‘langan', value: 0 },
    { name: "Qarzdor", value: 0 },
  ])
  
  const [dynamicData, setDynamicData] = useState({
    studentGrowth: [],
    teacherActivity: [],
    groupDistribution: [],
    attendanceStats: [],
    subjectHours: []
  })

  // Consolidated API calls
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, paymentRes, dynamicRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/statistics/getStatistiks`),
          // axios.get(`${import.meta.env.VITE_API_URL}/api/payment/monthly-check`),
          // axios.get(`${import.meta.env.VITE_API_URL}/api/statistics/dashboard-data`)
        ])
        console.log(statsRes.data)
        if (statsRes.data.success) {
          setStats({
            students: statsRes.data.student,
            teachers: statsRes.data.teacher,
            employees: statsRes.data.employer,
            subjects: statsRes.data.subject
          })
        }

        if (paymentRes.data.success) {
          const { paidStudents, partialStudents, completelyUnpaidStudents } = paymentRes.data
          setPaymentStats([
            { name: "To'langan", value: paidStudents },
            { name: 'Qisman to‘langan', value: partialStudents },
            { name: 'Qarzdor', value: completelyUnpaidStudents }
          ])
        }

        if (dynamicRes.data.success) {
          setDynamicData({
            studentGrowth: dynamicRes.data.studentGrowth,
            teacherActivity: dynamicRes.data.teacherActivity,
            groupDistribution: dynamicRes.data.groupDistribution,
            attendanceStats: dynamicRes.data.attendanceStats,
            subjectHours: dynamicRes.data.subjectHours
          })
        }
      } catch (error) {
        console.error('Xatolik yuz berdi:', error)
      }
    }
    
    fetchData()
  }, [])

  // Chart components for better organization
  const StudentGrowthChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={dynamicData.studentGrowth}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="oy" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="oquvchilar"
          name="O'quvchilar soni"
          stroke="#6366F1"
          strokeWidth={3}
          dot={{ r: 6 }}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )

  const PaymentPieChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={paymentStats}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {paymentStats.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value} ta`, "O'quvchilar"]} />
      </PieChart>
    </ResponsiveContainer>
  )

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-indigo-700 mb-6 text-center">
          Statistika
        </h1>

        {/* Statistic Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link to="/admin/student">
            <div className="bg-white p-4 rounded-lg shadow text-center hover:bg-gray-100 cursor-pointer transition-all">
              <h2 className="text-xl font-semibold text-blue-600">O‘quvchilar</h2>
              <p className="text-3xl font-bold">{stats.students}</p>
            </div>
          </Link>

          <Link to="/admin/teacher">
            <div className="bg-white p-4 rounded-lg shadow text-center hover:bg-gray-100 cursor-pointer transition-all">
              <h2 className="text-xl font-semibold text-green-600">O‘qituvchilar</h2>
              <p className="text-3xl font-bold">{stats.teachers}</p>
            </div>
          </Link>

          <Link to="/admin/employer">
            <div className="bg-white p-4 rounded-lg shadow text-center hover:bg-gray-100 cursor-pointer transition-all">
              <h2 className="text-xl font-semibold text-yellow-600">Xodimlar</h2>
              <p className="text-3xl font-bold">{stats.employees}</p>
            </div>
          </Link>

          <Link to="/admin/subject">
            <div className="bg-white p-4 rounded-lg shadow text-center hover:bg-gray-100 cursor-pointer transition-all">
              <h2 className="text-xl font-semibold text-red-600">Fanlar</h2>
              <p className="text-3xl font-bold">{stats.subjects}</p>
            </div>
          </Link>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* O‘quvchilar o‘sish grafigi */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">O‘quvchilar O‘sish Statistikasi</h2>
            <StudentGrowthChart />
          </div>

          {/* To‘lovlar statistikasi */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">To‘lovlar Statistikasi</h2>
            <PaymentPieChart />
          </div>
        </div>

        {/* O‘qituvchilar faolligi */}
        <div className="mt-8 bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-bold text-indigo-700 mb-4">O‘qituvchilar Faolligi</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dynamicData.teacherActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ism" />
              <YAxis name="Darslar soni" />
              <Tooltip />
              <Legend />
              <Bar dataKey="darslar" name="O'tilgan darslar" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Qo‘shimcha kichik grafiklar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Other charts using dynamicData would go here */}
        </div>
      </div>
    </div>
  )
}

export default AdminHome
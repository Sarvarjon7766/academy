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
} from "recharts"

const studentGrowthData = [
  { oy: "Yanvar", oquvchilar: 20 },
  { oy: "Fevral", oquvchilar: 35 },
  { oy: "Mart", oquvchilar: 50 },
  { oy: "Aprel", oquvchilar: 65 },
  { oy: "May", oquvchilar: 80 },
  { oy: "Iyun", oquvchilar: 95 },
]

const teacherActivityData = [
  { ism: "Ali", darslar: 10 },
  { ism: "Vali", darslar: 15 },
  { ism: "Sami", darslar: 8 },
]



const COLORS = ["#10B981", "#EF4444", "#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

const studentsGrowth = [
  { month: "Yan", students: 120 },
  { month: "Fev", students: 140 },
  { month: "Mar", students: 180 },
  { month: "Apr", students: 200 },
  { month: "May", students: 220 },
]

const paymentStats = [
  { month: "Yan", paid: 800000, unpaid: 200000 },
  { month: "Fev", paid: 850000, unpaid: 150000 },
  { month: "Mar", paid: 900000, unpaid: 100000 },
  { month: "Apr", paid: 950000, unpaid: 50000 },
  { month: "May", paid: 1000000, unpaid: 0 },
]

const groupDistribution = [
  { name: "Ingliz tili", value: 400 },
  { name: "Matematika", value: 300 },
  { name: "Fizika", value: 200 },
  { name: "Tarix", value: 100 },
]

const attendanceStats = [
  { day: "Dush", attendance: 85 },
  { day: "Sesh", attendance: 88 },
  { day: "Chor", attendance: 90 },
  { day: "Pay", attendance: 80 },
  { day: "Jum", attendance: 87 },
]

const teacherActivity = [
  { teacher: "Ali", activity: 90 },
  { teacher: "Vali", activity: 75 },
  { teacher: "Sami", activity: 60 },
  { teacher: "Karim", activity: 85 },
]

const subjectHours = [
  { subject: "Ingliz", hours: 50 },
  { subject: "Matematika", hours: 65 },
  { subject: "Fizika", hours: 40 },
  { subject: "Tarix", hours: 30 },
]

const AdminHome = () => {


  const [students, setStudents] = useState(0)
  const [teachers, setTeachers] = useState(0)
  const [employees, setEmployees] = useState(0)
  const [subjects, setSubjects] = useState(0)
  const [paymentStatsData, setPaymentStatsData] = useState([
    { name: "To'langan", value: 0 },
    { name: 'Qisman to‘langan', value: 0 },
    { name: "Qarzdor", value: 0 },
  ])


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/statistics/getStatistiks`)
        if (res.data.success) {
          setStudents(res.data.student)
          setTeachers(res.data.teacher)
          setEmployees(res.data.employer)
          setSubjects(res.data.subject)
        }
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [])
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/payment/monthly-check`)

        if (res.data.success) {
          const {
            paidStudents,
            partialStudents,
            completelyUnpaidStudents
          } = res.data

          setPaymentStatsData([
            { name: "To'langan", value: paidStudents },
            { name: 'Qisman to‘langan', value: partialStudents },
            { name: 'Qarzdor', value: completelyUnpaidStudents }
          ])
        }
      } catch (error) {
        console.error('Talabalarni olishda xatolik:', error)
      }
    }

    fetchStudents()
  }, [])




  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-indigo-700 mb-6 text-center">
          Statistika
        </h1>

        {/* Statistic Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link to="/admin/student">
            <div className="bg-white p-4 rounded-lg shadow text-center hover:bg-gray-100 cursor-pointer">
              <h2 className="text-xl font-semibold text-blue-600">O‘quvchilar</h2>
              <p className="text-3xl font-bold">{students}</p>
            </div>
          </Link>

          <Link to="/admin/teacher">
            <div className="bg-white p-4 rounded-lg shadow text-center hover:bg-gray-100 cursor-pointer">
              <h2 className="text-xl font-semibold text-green-600">O‘qituvchilar</h2>
              <p className="text-3xl font-bold">{teachers}</p>
            </div>
          </Link>

          <Link to="/admin/employer">
            <div className="bg-white p-4 rounded-lg shadow text-center hover:bg-gray-100 cursor-pointer">
              <h2 className="text-xl font-semibold text-yellow-600">Xodimlar</h2>
              <p className="text-3xl font-bold">{employees}</p>
            </div>
          </Link>

          <Link to="/admin/subject">
            <div className="bg-white p-4 rounded-lg shadow text-center hover:bg-gray-100 cursor-pointer">
              <h2 className="text-xl font-semibold text-red-600">Fanlar</h2>
              <p className="text-3xl font-bold">{subjects}</p>
            </div>
          </Link>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* O‘quvchilar o‘sish grafigi */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">O‘quvchilar O‘sish Statistikasi</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={studentGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="oy" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="oquvchilar"
                  stroke="#6366F1"
                  strokeWidth={3}
                  dot={{ r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* To‘lovlar statistikasi */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">To‘lovlar Statistikasi</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentStatsData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {paymentStatsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* O‘qituvchilar faolligi */}
        <div className="mt-8 bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-bold text-indigo-700 mb-4">O‘qituvchilar Faolligi</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={teacherActivityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ism" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="darslar" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Qo‘shimcha kichik grafiklar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-2">O‘quvchilar O‘sishi</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={studentsGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="students" stroke="#6366f1" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-2">To‘lovlar Statistikasi</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={paymentStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="paid" fill="#22c55e" />
                <Bar dataKey="unpaid" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-2">Guruhlar Taqsimoti</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={groupDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  label
                >
                  {groupDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-2">Davomat Statistikasi</h2>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={attendanceStats}>
                <defs>
                  <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="attendance"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorAtt)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-2">O‘qituvchilar Faolligi</h2>

            <ResponsiveContainer width="100%" height={250}>
              <RadarChart outerRadius={80} data={teacherActivity}>
                <PolarGrid />
                <PolarAngleAxis dataKey="teacher" />
                <Radar
                  name="Faollik"
                  dataKey="activity"
                  stroke="#f97316"
                  fill="#fb923c"
                  fillOpacity={0.6}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-2">Fan Soatlari</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={subjectHours} layout="vertical" margin={{ left: 50 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="subject" type="category" />
                <Tooltip />
                <Bar dataKey="hours" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminHome

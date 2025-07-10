import { useEffect, useState } from 'react'
import { FaCalendarAlt, FaChartPie, FaExclamationTriangle, FaMoneyBillWave } from 'react-icons/fa'

import axios from 'axios'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis, YAxis,
} from 'recharts'

import MonthlyPaymentControl from '../../register/MonthlyPaymentControl'
import UnderpaidReport from './UnderpaidReport'

const barData = [
  { month: 'Yanvar', amount: 4000 },
  { month: 'Fevral', amount: 3000 },
  { month: 'Mart', amount: 2000 },
  { month: 'Aprel', amount: 2780 },
  { month: 'May', amount: 1890 },
  { month: 'Iyun', amount: 2390 },
  { month: 'Iyul', amount: 3490 },
]

const lineData = [
  { week: 'Hafta 1', amount: 1000 },
  { week: 'Hafta 2', amount: 1500 },
  { week: 'Hafta 3', amount: 1200 },
  { week: 'Hafta 4', amount: 1700 },
]

const partialPaidStudents = [
  { name: 'Saidova Gulnoza', group: '103-G', paid: 1500000, debt: 1500000 },
  { name: 'Shukurov Jamshid', group: '104-G', paid: 1800000, debt: 1200000 },
]

const debtStudents = [
  { name: 'Ergashev Azamat', group: '105-G', paid: 0, debt: 3000000 },
  { name: 'Toirova Nigora', group: '106-G', paid: 500000, debt: 2500000 },
]

const COLORS = ['#22c55e', '#facc15', '#ef4444']

const StudentFinance = () => {
  const now = new Date()
  const [activeTab, setActiveTab] = useState('summary')
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [pieData, setPieData] = useState([
    { name: 'To‘liq to‘langan', value: 0, bg: 'bg-green-100', text: 'text-green-700' },
    { name: 'Qisman to‘langan', value: 0, bg: 'bg-yellow-100', text: 'text-yellow-700' },
    { name: 'Kechiktirilgan', value: 0, bg: 'bg-red-100', text: 'text-red-700' }
  ])

  const years = Array.from({ length: 11 }, (_, i) => 2020 + i)
  const months = [
    { value: 1, label: "Yanvar" }, { value: 2, label: "Fevral" }, { value: 3, label: "Mart" },
    { value: 4, label: "Aprel" }, { value: 5, label: "May" }, { value: 6, label: "Iyun" },
    { value: 7, label: "Iyul" }, { value: 8, label: "Avgust" }, { value: 9, label: "Sentabr" },
    { value: 10, label: "Oktabr" }, { value: 11, label: "Noyabr" }, { value: 12, label: "Dekabr" }
  ]

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/payment/monthly-check`, {
          params: { year, month }
        })

        if (res.data.success) {
          const {
            paidStudents,
            partialStudents,
            completelyUnpaidStudents
          } = res.data

          setPieData([
            { name: 'To‘liq to‘langan', value: paidStudents, bg: 'bg-green-100', text: 'text-green-700' },
            { name: 'Qisman to‘langan', value: partialStudents, bg: 'bg-yellow-100', text: 'text-yellow-700' },
            { name: 'Kechiktirilgan', value: completelyUnpaidStudents, bg: 'bg-red-100', text: 'text-red-700' }
          ])
        }
      } catch (error) {
        console.error('Talabalarni olishda xatolik:', error)
      }
    }

    fetchStudents()
  }, [year, month])


  return (
    <div className="p-4 bg-white rounded-lg shadow-md  min-h-screen mx-auto space-y-10">
      <h2 className="text-3xl text-center font-bold mb-6 text-indigo-700">Talabalar Moliyaviy Hisobotlari</h2>

      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => setActiveTab('summary')}
          className={`flex items-center gap-2 px-4 py-2 rounded ${activeTab === 'summary' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          <FaChartPie />
          Umumiy
        </button>

        <button
          onClick={() => setActiveTab('monthly-report')}
          className={`flex items-center gap-2 px-4 py-2 rounded ${activeTab === 'monthly-report' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          <FaCalendarAlt />
          Oylik hisobot
        </button>
      </div>

      {activeTab === 'summary' && (
        <>
          <div className="flex flex-wrap gap-4 mb-6">
            <select
              className="border rounded-lg px-4 py-2 shadow-sm"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
            >
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>

            <select
              className="border rounded-lg px-4 py-2 shadow-sm"
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value))}
            >
              {months.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
            {pieData.map((item, index) => (
              <div key={index} className={`${item.bg} p-6 rounded-lg shadow`}>
                <h3 className={`text-lg font-semibold ${item.text} mb-2`}>{item.name} soni</h3>
                <p className="text-3xl font-bold">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="text-xl font-semibold mb-4 text-center">To‘lov holatlari foizi</h4>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="text-xl font-semibold mb-4 text-center">Oylar bo‘yicha to‘lovlar miqdori</h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="text-xl font-semibold mb-4 text-center">Haftalar bo‘yicha to‘lovlar</h4>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={lineData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="amount" stroke="#10b981" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {activeTab === 'monthly-report' && (<MonthlyPaymentControl />)}
    </div>
  )
}

export default StudentFinance

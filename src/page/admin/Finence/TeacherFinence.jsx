import { useState } from 'react'
import { FaChartPie, FaCalendarAlt, FaMoneyBillWave, FaExclamationTriangle } from 'react-icons/fa'
import {GeneralReport,MonthlyReport,AvansReport} from './teacher/index'

const TeacherFinence = () => {
  const [activeTab, setActiveTab] = useState('general')

  return (
    <div>
      <h2 className='text-3xl text-center font-bold mb-6 text-indigo-700 p-2 m-2'>
        O'qituvchilarning Moliyaviy hisobotlari
      </h2>
      <div className="flex flex-wrap gap-4 p-2">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 px-4 py-2 rounded ${activeTab === 'general' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
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

        <button
          onClick={() => setActiveTab('avans-report')}
          className={`flex items-center gap-2 px-4 py-2 rounded ${activeTab === 'avans-report' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          <FaMoneyBillWave />
          Avans hisobotlari
        </button>
      </div>
			{activeTab === 'general' && (
        <div className="mt-6 p-2 m-2">
          {/* Teacherlarning Umumiy ma'lumotlari */}
          <GeneralReport />
        </div>
      )}
			{activeTab === 'monthly-report' && (
        <div className="mt-6 p-2 m-2">
          {/* Teacherlarning Umumiy ma'lumotlari */}
          <MonthlyReport />
        </div>
      )}
			{activeTab === 'avans-report' && (
        <div className="mt-6 p-2 m-2">
          {/* Teacherlarning Umumiy ma'lumotlari */}
          <AvansReport />
        </div>
      )}

    </div>
  )
}

export default TeacherFinence

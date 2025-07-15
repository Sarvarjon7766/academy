import axios from 'axios'
import React from "react"
import {
  TotalStudent,
  GradeChart,
  GradePieChart,
  StudentAttendanceChart,
  StudentGradeChart,
  SubjectGroupChart
} from './statistics/index'

const Statistics = () => {
  const token = localStorage.getItem('token')

  return (
    <div className="w-full mx-auto pt-4 px-2 sm:px-6">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
          Statistika
        </h2>
        <p className="text-gray-600 mt-1">Fanlar, baholar va davomat bo‘yicha umumiy ma’lumot</p>
        <hr className="border-t-4 border-blue-400 mt-3 w-24 mx-auto rounded" />
      </div>

      {/* Grid va kolonkalar sonini har xil ekran o‘lchamlariga moslashtirish */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-4">
          <TotalStudent />
        </div>
        <div className="p-4">
          <GradeChart />
        </div>
        <div className="p-4">
          <StudentAttendanceChart />
        </div>
        {/* <div className="p-4">
          <GradePieChart />
        </div> */}
        {/* <div className="p-4">
          <StudentGradeChart />
        </div> */}
        {/* <div className="p-4">
          <SubjectGroupChart />
        </div> */}
      </div>
    </div>
  )
}

export default Statistics

import React, { useEffect, useState } from "react"
import { FaChartBar, FaUserEdit, FaUsers } from 'react-icons/fa'
import { useNavigate } from "react-router-dom"
import { AddGroup, Statistics, WithdrawGroup, StudentList } from '../../components/teacher/index'

const TeacherSubject = () => {
  const token = localStorage.getItem('token')
  const [isActive, setIsActive] = useState('active')
  const [activeTab, setActiveTab] = useState('active')

  const buttons = [
    { id: 'active', icon: FaChartBar, title: 'Statistika' },
    { id: 'WithdrawGroup', icon: FaUserEdit, title: 'O‘quvchini ko‘chirish' },
    { id: 'studentList', icon: FaUsers, title: 'O‘quvchilar ro‘yxati' },
  ]

  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      navigate('/login')
    }
  }, [token, navigate])

  const handleLocation = (id) => {
    setIsActive(id)
    setActiveTab(id)
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-indigo-700 drop-shadow-md">Talabalar boshqaruvi</h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">Kerakli bo‘limni tanlang va boshqaring</p>
      </div>

      <div className="flex justify-center mb-10">
        <div className="flex flex-wrap gap-4 justify-center">
          {buttons.map(({ id, icon: Icon, title }) => (
            <button
              key={id}
              onClick={() => handleLocation(id)}
              className={`w-13 h-13 sm:w-15 sm:h-avto rounded-full flex items-center justify-center border 
              transition-all duration-300 transform hover:scale-105 shadow-md
              ${activeTab === id
                ? 'bg-white border-blue-500 text-blue-600 shadow-lg'
                : 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700'}`}
              title={title}
            >
              <Icon className="text-xl sm:text-xl" />
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 transition-all duration-300">
        {isActive === 'active' && <Statistics />}
        {isActive === 'WithdrawGroup' && <WithdrawGroup />}
        {isActive === 'studentList' && <StudentList />}
      </div>
    </div>
  )
}

export default TeacherSubject

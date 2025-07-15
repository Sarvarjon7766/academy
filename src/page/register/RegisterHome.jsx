import {
  FaArrowRight,
  FaExclamationTriangle,
  FaMoneyBillWave,
  FaMoneyCheckAlt,
  FaUserMinus,
  FaUserPlus,
  FaUsers
} from 'react-icons/fa'
import { Link } from 'react-router-dom'

const RegisterHome = () => {
  const buttons = [
    {
      icon: <FaUserPlus />,
      title: "Student registratsiya",
      link: '/register/student-register',
      color: "bg-gradient-to-r from-indigo-500 to-purple-500"
    },
    {
      icon: <FaUserMinus />,
      title: "Studentni chiqarish",
      link: '/register/student-status-manager',
      color: "bg-gradient-to-r from-rose-500 to-pink-500"
    },
    {
      icon: <FaMoneyBillWave />,
      title: "Oylik to'lov",
      link: '/register/student-payment',
      color: "bg-gradient-to-r from-emerald-500 to-teal-500"
    },

    {
      icon: <FaUsers />,
      title: "Talabalar ro'yxati",
      link: '/register/student-list',
      color: "bg-gradient-to-r from-sky-500 to-blue-500"
    },
    {
      icon: <FaExclamationTriangle />,
      title: "Oylik qarzdorlik",
      link: '/register/monthly-debts',
      color: "bg-gradient-to-r from-yellow-500 to-amber-500"
    }
  ]

  return (
    <div className="w-full bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 min-h-screen p-6 sm:p-10">
      <div className="mx-auto">


        {/* Enhanced card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {buttons.map((btn, index) => (
            <Link
              to={btn.link}
              key={index}
              className="group relative flex flex-col justify-between p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out overflow-hidden"
            >
              {/* Gradient accent */}
              <div className={`absolute top-0 left-0 w-full h-2 ${btn.color}`}></div>

              <div className="flex items-start gap-5 mb-6">
                <div className={`${btn.color} text-white p-3 rounded-xl text-xl transition-transform duration-300 group-hover:scale-105`}>
                  {btn.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-700 mt-1">
                  {btn.title}
                </h3>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 group-hover:text-indigo-500 transition-colors">
                  Kirish
                </span>
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 group-hover:bg-indigo-100 transition-colors">
                  <FaArrowRight className="text-indigo-500 text-sm transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Stats footer
        <div className="mt-16 bg-white rounded-2xl shadow-sm p-6 max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4">
              <div className="text-2xl font-bold text-indigo-600">1,240</div>
              <div className="text-sm text-gray-600">Jami talabalar</div>
            </div>
            <div className="p-4">
              <div className="text-2xl font-bold text-emerald-600">94%</div>
              <div className="text-sm text-gray-600">To'lovlar</div>
            </div>
            <div className="p-4">
              <div className="text-2xl font-bold text-amber-600">28</div>
              <div className="text-sm text-gray-600">Yangi talabalar</div>
            </div>
            <div className="p-4">
              <div className="text-2xl font-bold text-rose-600">12</div>
              <div className="text-sm text-gray-600">Chiqarilganlar</div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default RegisterHome
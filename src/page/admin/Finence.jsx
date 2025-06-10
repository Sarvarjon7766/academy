import axios from 'axios'
import {
  AlertTriangle,
  Banknote,
  BarChart3,
  Calendar,
  DollarSign,
  FileText,
  TrendingUp,
  Users
} from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  BenefitsFinence,
  CashJournal,
  DebtorsReport,
  ExpenseReport,
  MonthlyFinence,
  StudentFinence,
  TeacherFinence,
  YearlyFinence
} from './Finence/index'

const Finence = () => {
  const [isAvailable, setIsAvailable] = useState('finence')
  const [students, setStudents] = useState([])

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/student/getAll')
        if (res.data.success) {
          setStudents(res.data.students)
        }
      } catch (error) {
        console.error('Talabalarni olishda xatolik:', error)
      }
    }
    fetchStudents()
  }, [])

  const sections = [
    {
      title: 'Talabalarning oylik to‘lovlari',
      description: 'Har bir o‘quvchi uchun oylik to‘lovlar ro‘yxati.',
      color: 'from-green-400 to-green-600',
      icon: <Users className='w-8 h-8 text-white' />,
      route: 'studentfinence',
      number_of_students: students?.length

    },
    {
      title: 'O‘qituvchilarning oylik maoshlari',
      description: 'Har bir o‘qituvchi uchun oylik maoshlar ro‘yxati.',
      color: 'from-blue-400 to-blue-600',
      icon: <BarChart3 className='w-8 h-8 text-white' />,
      route: 'teacherfinence'
    },
    {
      title: 'Oylik umumiy daromad',
      description: 'Har oyda tushgan umumiy mablag‘lar statistikasi.',
      color: 'from-indigo-400 to-indigo-600',
      icon: <DollarSign className='w-8 h-8 text-white' />,
      route: 'monthlyfinence'
    },
    {
      title: 'Yillik umumiy daromad',
      description: 'Yil davomida tushgan mablag‘lar umumiy ko‘rinishda.',
      color: 'from-purple-400 to-purple-600',
      icon: <Calendar className='w-8 h-8 text-white' />,
      route: 'yearlyfinence'
    },
    {
      title: 'Foyda va zarar hisobotlari',
      description: 'Oylik/yillik daromad va xarajatlar tahlili.',
      color: 'from-red-400 to-red-600',
      icon: <TrendingUp className='w-8 h-8 text-white' />,
      route: 'profitfinence',
      colSpan: true
    },
    {
      title: 'Kassa: Kirim va chiqimlar',
      description: 'Kundalik kirim va chiqimlar jurnali.',
      color: 'from-orange-400 to-orange-600',
      icon: <FileText className='w-8 h-8 text-white' />,
      route: 'cashjournal'
    },
    {
      title: 'Xarajatlar tahlili',
      description: 'Markaz xarajatlarini kategoriya bo‘yicha tahlil.',
      color: 'from-yellow-400 to-yellow-600',
      icon: <Banknote className='w-8 h-8 text-white' />,
      route: 'expensereport'
    },
    {
      title: 'Qarzdor talabalar',
      description: 'To‘lov muddati o‘tgan talabalar ro‘yxati.',
      color: 'from-rose-400 to-rose-600',
      icon: <AlertTriangle className='w-8 h-8 text-white' />,
      route: 'debtorsreport'
    }
  ]

  return (
    <div>
      {isAvailable === 'finence' && (
        <div className='p-6 min-h-screen bg-gradient-to-br from-gray-50 to-white'>
          <h1 className='text-4xl text-center font-bold text-indigo-700 mb-10 drop-shadow'>📊 Moliyaviy Hisobotlar</h1>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            {sections.map((section, index) => (
              <div
                key={index}
                onClick={() => setIsAvailable(section.route)}
                className={`bg-gradient-to-br ${section.color} text-white rounded-2xl p-6 shadow-xl hover:scale-[1.02] hover:rotate-[0.3deg] hover:shadow-2xl transition-all duration-300 cursor-pointer ${section.colSpan ? 'md:col-span-2' : ''}`}
              >
                <div className='flex items-center gap-4 mb-3'>
                  <div className='bg-white/20 rounded-full p-2'>{section.icon}</div>
                  <h2 className='text-2xl font-semibold'>{section.title}</h2>
                </div>
                {section.number_of_students && <h2><span className='font-bold'>Jami talabalar soni</span> {section.number_of_students} ta</h2>}
                <p className='text-sm opacity-90'>{section.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {isAvailable === 'studentfinence' && <StudentFinence />}
      {isAvailable === 'teacherfinence' && <TeacherFinence />}
      {isAvailable === 'monthlyfinence' && <MonthlyFinence />}
      {isAvailable === 'yearlyfinence' && <YearlyFinence />}
      {isAvailable === 'profitfinence' && <BenefitsFinence />}
      {isAvailable === 'cashjournal' && <CashJournal />}
      {isAvailable === 'expensereport' && <ExpenseReport />}
      {isAvailable === 'debtorsreport' && <DebtorsReport />}
    </div>
  )
}

export default Finence

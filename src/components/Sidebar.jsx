import {
  BookOpen,
  Calendar,
  CheckCircle,
  CirclePlus,
  CirclePlusIcon,
  ClipboardList,
  CreditCard,
  FileBarChart2,
  FileText,
  GraduationCap,
  Home,
  Landmark,
  ListChecks,
  LogOut,
  Megaphone,
  MessageCircle,
  RefreshCcw,
  UserCircle,
  UserPlus,
  Users,
  Wallet
} from 'lucide-react'
import { Link } from 'react-router-dom'

const Sidebar = ({ isOpen, toggleSidebar, role }) => {
  const iconMap = {
    'Asosiy': <Home className="w-5 h-5 mr-2" />,
    'Registratsiya': <UserPlus className="w-5 h-5 mr-2" />,
    'Registratsiya student': <UserPlus className="w-5 h-5 mr-2" />,
    "Registratsiya o'qituvchi": <UserPlus className="w-5 h-5 mr-2" />,
    "O'quvchilar": <GraduationCap className="w-5 h-5 mr-2" />,
    "O'qituvchilar": <UserCircle className="w-5 h-5 mr-2" />,
    "Xodimlar": <UserCircle className="w-5 h-5 mr-2" />,
    "Qo'shimcha xizmatalar": <CirclePlusIcon className="w-5 h-5 mr-2" />,
    'Moliya': <Wallet className="w-5 h-5 mr-2" />,
    'Xabarlar': <MessageCircle className="w-5 h-5 mr-2" />,
    "E'lonlar": <Megaphone className="w-5 h-5 mr-2" />,
    "Murojaatlar": <FileText className="w-5 h-5 mr-2" />,
    "Yotoqxona Nazorati": <FileText className="w-5 h-5 mr-2" />,
    'Profil': <UserCircle className="w-5 h-5 mr-2" />,
    'Talabalar boshqaruvi': <BookOpen className="w-5 h-5 mr-2" />,
    'Baholash': <FileBarChart2 className="w-5 h-5 mr-2" />,
    'Kurslar': <BookOpen className="w-5 h-5 mr-2" />,
    'Davomat': <ClipboardList className="w-5 h-5 mr-2" />,
    'Baholar': <FileBarChart2 className="w-5 h-5 mr-2" />,
    'Dars jadval': <Calendar className="w-5 h-5 mr-2" />,
    "To'lovlar": <CreditCard className="w-5 h-5 mr-2" />,
    'Farzandlarim': <Users className="w-5 h-5 mr-2" />,
    'Davomatlari': <ClipboardList className="w-5 h-5 mr-2" />,
    'Dars jadvali': <Calendar className="w-5 h-5 mr-2" />,
    'Imtihon': <CheckCircle className="w-5 h-5 mr-2" />,
    'Talaba registratsiya': <UserPlus className="w-5 h-5 mr-2" />,
    'Registratsiya hodimlar': <UserPlus className="w-5 h-5 mr-2" />,
    "To'lov qaytarish": <RefreshCcw className="w-5 h-5 mr-2" />,
    'Talaba holati': <CheckCircle className="w-5 h-5 mr-2" />,
    "Yotoqxona": <Landmark className="w-5 h-5 mr-2" />,
    'Chiqish': <LogOut className="w-5 h-5 mr-2" />,
    'Yakshanba': <ListChecks className="w-5 h-5 mr-2" />,
    "O'qituvchilar Davomati": <ListChecks className="w-5 h-5 mr-2" />
  }
  const menuItems = {
    admin: [
      { name: 'Asosiy', link: '/admin' },
      { name: 'Registratsiya student', link: '/admin/student-register' },
      { name: "Registratsiya o'qituvchi", link: '/admin/teacher-register' },
      { name: "Registratsiya hodimlar", link: '/admin/employer-register' },
      { name: "O'quvchilar", link: '/admin/student' },
      { name: "O'qituvchilar", link: '/admin/teacher' },
      { name: "Xodimlar", link: '/admin/employer' },
      { name: "O'qituvchilar Davomati", link: '/admin/teacher-attandance' },
      { name: "Yotoqxona Nazorati", link: '/admin/hotel-control' },
      { name: "Qo'shimcha xizmatalar", link: '/admin/subject' },

      { name: 'Moliya', link: '/admin/finence' },
      { name: 'Xabarlar', link: '/admin/message' },
      { name: "E'lonlar", link: '/admin/ads' },
      { name: "Murojaatlar", link: '/admin/application' },

      { name: 'Chiqish', link: '/login' }
    ],
    teacher: [
      { name: 'Asosiy', link: '/teacher' },
      { name: 'Profil', link: '/teacher/profile' },
      { name: 'Talabalar boshqaruvi', link: '/teacher/subject' },
      { name: 'Baholash', link: '/teacher/grade' },
      { name: 'Chiqish', link: '/login' }
    ],
    student: [
      { name: 'Asosiy', link: '/student' },
      { name: 'Profil', link: '/student/profile' },
      { name: 'Kurslar', link: '/student/subject' },
      { name: 'Davomat', link: '/student/attendance' },
      { name: 'Baholar', link: '/student/grade' },
      { name: 'Dars jadval', link: '/student/schedule' },
      { name: "To'lovlar", link: '/student/payments' },
      { name: 'Chiqish', link: '/login' }
    ],
    parent: [
      { name: 'Asosiy', link: '/parent' },
      { name: 'Profil', link: '/parent/profile' },
      { name: 'Farzandlarim', link: '/parent/children-manage' },
      { name: 'Davomatlari', link: '/parent/children-attendence' },
      { name: 'Dars jadvali', link: '/parent/children-schedule' },
      { name: 'Imtihon', link: '/parent/children-exam' },
      { name: "To'lovlar", link: '/parent/payments' },
      { name: 'Xabarlar', link: '/parent/message' },
      { name: 'Chiqish', link: '/login' }
    ],
    register: [
      { name: 'Asosiy', link: '/register' },
      { name: 'Talaba registratsiya', link: '/register/student-register' },
      { name: "Yakshanba", link: '/register/attandance-sunday' },
      { name: 'Talaba holati', link: '/register/student-active' },
      { name: "Yotoqxona", link: '/register/hostel' },
      { name: 'Chiqish', link: '/login' }
    ]
  }

  const currentMenu = menuItems[role] || []

  return (
    <div
      className={`fixed inset-y-0 left-0 z-30 w-78 bg-indigo-700 shadow-lg transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}
    >
      <div className="p-4 border-b flex justify-between items-center">
        <h1 className="text-3xl text-white font-bold">Dashboard</h1>
        <button
          onClick={toggleSidebar}
          className="p-2 bg-indigo-700 text-white rounded-md md:hidden"
        >
          ✕
        </button>
      </div>

      {/* Scrollable Menu */}
      <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-64px)]">
        {currentMenu.map((item, index) => (
          <Link
            key={index}
            to={item.link}
            onClick={toggleSidebar}
            className="flex items-center px-4 py-2 rounded-lg text-white hover:bg-white hover:text-indigo-700 transition"
          >
            {iconMap[item.name]}
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar

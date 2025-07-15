import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import LoginPage from './page/Login'
import { AdminDashboard, AdminHome, Ads, Applications, Finence, HotelControl, Message, ParentsManage, Registration, Subject, TeachersManage,StudentsRegisterAdmin } from './page/admin/index.js'
import { Home } from './site/'

import StudentList from './page/admin/StudentList.jsx'
import TeacherAttandance from './page/admin/teacher/TeacherAttandance.jsx'
import { EmployerList, EmployerRegister } from './page/admin/employer/index.js'
import TeacherRegister from './page/admin/teacher/TeacherRegister.jsx'
import Registrator from './page/admin/Registrator.jsx'
import RegisterList from './page/admin/RegisterList.jsx'
import { AttandanseSunday, RegisterDashboard, RegisterHome, RegisterHostel, RegisterMessage, RegisterPayment, RegisterProfile, RegisterRefund, StudentsRegister, StudentStatusManager, UpdateStudent,StudentListRegister,MonthlyPaymentControl,StudentActive } from './page/register/index.js'
import { Attendance, Grades, Schedule, TeacherDashboard, TeacherHome, TeacherMessage, TeacherProfile, TeacherSubject } from './page/teacher/index.js'


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<AdminHome />} />
          <Route path="registration" element={<Registration />} />
          <Route path="parent" element={<ParentsManage />} />
          <Route path="student" element={<StudentList />} />
          <Route path="student-register" element={<StudentsRegisterAdmin />} />
          <Route path="student-update" element={<UpdateStudent />} />
          <Route path="teacher" element={<TeachersManage />} />
          <Route path="teacher-register" element={<TeacherRegister />} />
          <Route path="employer-register" element={<EmployerRegister />} />
          <Route path="employer" element={<EmployerList />} />
          <Route path="register" element={<RegisterList />} />
          <Route path="subject" element={<Subject />} />
          <Route path="finence" element={<Finence />} />
          <Route path="messages" element={<Message />} />
          <Route path="ads" element={<Ads />} />
          <Route path="application" element={<Applications />} />
          <Route path="hotel-control" element={<HotelControl />} />
          <Route path="teacher-attandance" element={<TeacherAttandance />} />
          <Route path="profile" element={<TeacherProfile />} />
          <Route path="message" element={<TeacherMessage />} />
          <Route path="registrator-register" element={<Registrator />} />
        </Route>
        <Route path="/teacher" element={<TeacherDashboard />}>
          <Route index element={<TeacherHome />} />
          <Route path="profile" element={<TeacherProfile />} />
          <Route path="subject" element={<TeacherSubject />} />
          <Route path="grade" element={<Grades />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="message" element={<TeacherMessage />} />
        </Route>
        <Route path="/register" element={<RegisterDashboard />}>
          <Route index element={<RegisterHome />} />
          <Route path="profile" element={<RegisterProfile />} />
          <Route path="student-register" element={<StudentsRegister />} />
          <Route path="student-update" element={<UpdateStudent />} />
          <Route path="student-status-manager" element={<StudentStatusManager />} />
          <Route path="student-payment" element={<RegisterPayment />} />
          <Route path="monthly-debts" element={<MonthlyPaymentControl />} />
          <Route path="student-refund" element={<RegisterRefund />} />
          <Route path="student-list" element={<StudentListRegister />} />
          <Route path="student-active" element={<StudentActive />} />
          <Route path="hostel" element={<RegisterHostel />} />
          <Route path="message" element={<RegisterMessage />} />
          <Route path="attandance-sunday" element={<AttandanseSunday />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App

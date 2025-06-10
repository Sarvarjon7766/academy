import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import {Home} from './site/'
import LoginPage from './page/Login'
import TeacherDashboard from './page/TeacherPage';
import AdminDashboard from './page/AdminDashboard';
import ParentDashboard from './page/ParentPage';
import StudentDashboard from './page/StudentPage'
import AdminHome from './page/admin/adminHome'
import adminSubject from './page/admin/adminSubject'
import KKK from './component/KKK';

const App = () => {
  return (
    <Router>
      <Routes>
			<Route path='/' element={<Home />} />
			<Route path='/login' element={<LoginPage />} />
			<Route  path='/admin' element={<AdminDashboard />}>
        <Route index element={<AdminHome />} />
        <Route path='/admin-subject' element={<adminSubject />} />
			</Route>
			<Route  path='/teacher' element={<TeacherDashboard />}>
        <Route index element={<AdminHome />} />
        <Route path='/teacher-subject' element={<adminSubject />} />
			</Route>
      </Routes>
    </Router>
  )
}

export default App


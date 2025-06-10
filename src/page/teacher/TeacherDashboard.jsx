import React, { useEffect } from 'react';
import Layout from '../../components/Layout';
import { useNavigate } from 'react-router-dom';

const TeacherDashboard = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    console.log(token)
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  if (!token) return null;

  return (
    <Layout role="teacher">
      <div className='flex-1 bg-gray-50 overflow-y-auto m-0 p-0'>
			</div>
    </Layout>
  );
};

export default TeacherDashboard;

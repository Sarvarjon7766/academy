import React, { useEffect } from 'react';
import Layout from '../../components/Layout';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  if (!token) return null;

  return (
    <Layout role="admin">
      <div className='p-4 flex-1 bg-gray-50 overflow-auto'>

      </div>
    </Layout>
  );
};

export default AdminDashboard;

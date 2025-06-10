import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Logo from '../assets/logo.jpg';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(null);
  const [dataError, setDataError] = useState('');

  useEffect(() => {
    if (dataError) {
      const timer = setTimeout(() => setDataError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [dataError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let url;
      if (role === 1) url = `${import.meta.env.VITE_API_URL}/api/teacher/login`;
      else if (role === 2) url = `${import.meta.env.VITE_API_URL}/api/register/login`;
      else if (role === 3) url = `${import.meta.env.VITE_API_URL}/api/parent/login`;
      else {
        setDataError("Noto'g'ri rol tanladingiz");
        return;
      }

      const student = await axios.post(url, { login, password });
      const { data } = student;

      if (student.status === 200 && data.token) {
        localStorage.setItem('token', data.token);

        if (role === 1) {
          if (data.isAdmin) navigate('/admin');
          else navigate('/teacher');
        } else if (role === 2) {
          navigate('/register');
        }
      } else {
        setDataError("Login yoki parol noto'g'ri!");
      }
    } catch (error) {
      setDataError(error.response?.data?.message || "Server bilan bog'liq xatolik!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full">
        <div className="flex flex-col items-center mb-6">
          <img src={Logo} alt="Logo" className="w-24 h-24 rounded-full border-4 border-blue-200 shadow-md mb-2" />
          <h1 className="text-2xl font-bold text-gray-800 text-center">Bulung'ur Akademiyasi</h1>
          <p className="text-sm text-gray-500 text-center mt-1">Tizimga kirish</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="login" className="block text-sm font-medium text-gray-700">Login</label>
            <input
              id="login"
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="Loginni kiriting"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-sm"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Parol</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Parolingizni kiriting"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-sm"
            />
          </div>
          <div className="flex justify-center gap-3 mt-2">
            <button
              type="button"
              onClick={() => setRole(1)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                role === 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              } hover:bg-blue-400 transition`}
            >
              O'qituvchi
            </button>
            <button
              type="button"
              onClick={() => setRole(2)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                role === 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              } hover:bg-blue-400 transition`}
            >
              Registrator
            </button>
          </div>
          {dataError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md text-sm">
              {dataError}
            </div>
          )}
          <button
            type="submit"
            disabled={!role}
            className="w-full bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 transition"
          >
            Kirish
          </button>
        </form>
        <div className="text-center mt-4">
          <a href="#" className="text-sm text-blue-500 hover:underline">Parolni unutdingizmi?</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

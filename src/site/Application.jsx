import React, { useState } from 'react';
import axios from 'axios';

const Application = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    message: ''
  });
  const [responseMessage, setResponseMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const numericValue = value.replace(/\D/g, '').slice(0, 9);
      setFormData({ ...formData, [name]: numericValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponseMessage('');
    setErrorMessage('');

    if (!formData.fullName || !formData.phone || !formData.message) {
      setErrorMessage("Iltimos, barcha maydonlarni to'ldiring.");
      return;
    }

    if (formData.phone.length !== 9) {
      setErrorMessage("Telefon raqami kamida 9 ta raqamdan iborat bo'lishi kerak.");
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/application/create`, formData);
      setResponseMessage(response.data.message);
      setFormData({ fullName: '', phone: '', message: '' });

      setTimeout(() => {
        setResponseMessage('');
      }, 3000);
    } catch (error) {
      setResponseMessage('Xatolik yuz berdi! Iltimos qayta urining.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-xl rounded-2xl shadow-xl p-10 border-t-4 border-blue-600 animate-fade-in"
      >
        <h2 className="text-3xl font-bold text-blue-700 text-center mb-2">Ariza qoldiring</h2>
        <p className="text-center text-gray-600 mb-6">Biz siz bilan iloji boricha tez bog'lanamiz</p>

        <div className="space-y-5">
          <div>
            <label htmlFor="fullName" className="block text-gray-700 font-semibold mb-1">
              Ism Familiyangiz
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ismingiz va familiyangiz"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-gray-700 font-semibold mb-1">
              Telefon raqami
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="97 XXX XX XX"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-gray-700 font-semibold mb-1">
              Qo'shimcha ma'lumot
            </label>
            <textarea
              id="message"
              name="message"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Xabaringizni shu yerga yozing..."
              rows="4"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          >
            Yuborish
          </button>

          {responseMessage && (
            <p className="text-center text-green-600 font-medium mt-4">{responseMessage}</p>
          )}
          {errorMessage && (
            <p className="text-center text-red-600 font-medium mt-4">{errorMessage}</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Application;

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaImages, FaSave, FaTimes } from 'react-icons/fa';

function Ads() {
  const [ads, setAds] = useState([]);
  const [showForm, setShowForm] = useState(true);
  const [editingAdId, setEditingAdId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    photo: null,
    existingPhoto: '',
  });
  const [message, setMessage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = () => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/ads/getAll`)
      .then((response) => {
        setAds(response.data.alldata);
      })
      .catch((error) => {
        console.error('Xatolik:', error);
        setMessage({ text: 'E\'lonlarni olishda xatolik yuz berdi.', success: false });
      });
  };

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'photo' && files && files[0]) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, photo: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append('title', formData.title);
    form.append('description', formData.description);
    form.append('photo', formData.photo || formData.existingPhoto);
    form.append('oldPhoto', formData.existingPhoto);

    if (editingAdId) {
      axios.put(`${import.meta.env.VITE_API_URL}/api/ads/update/${editingAdId}`, form)
        .then((response) => {
          setAds(ads.map(ad => (ad._id === editingAdId ? response.data.updatedAd : ad)));
          setMessage({ text: 'E\'lon muvaffaqiyatli yangilandi!', success: true });
          resetForm();
          fetchAds();
        })
        .catch((error) => {
          console.error('Xatolik:', error);
          setMessage({ text: 'E\'lonni yangilashda xatolik yuz berdi.', success: false });
        });
    } else {
      axios.post(`${import.meta.env.VITE_API_URL}/api/ads/create`, form)
        .then((response) => {
          setAds([...ads, response.data.newAd]);
          setMessage({ text: 'E\'lon muvaffaqiyatli joylandi!', success: true });
          resetForm();
          fetchAds();
        })
        .catch((error) => {
          console.error('Xatolik:', error);
          setMessage({ text: 'E\'lon yaratishda xatolik yuz berdi.', success: false });
        });
    }
  };

  const handleDelete = (adId, photo) => {
    if (window.confirm("Haqiqatan ham bu e'lonni o'chirmoqchimisiz?")) {
      axios.delete(`${import.meta.env.VITE_API_URL}/api/ads/delete/${adId}`, { data: { photo: photo } })
        .then(() => {
          setAds((prevAds) => prevAds.filter(ad => ad._id !== adId));
          setMessage({ text: 'E\'lon muvaffaqiyatli o\'chirildi!', success: true });
          fetchAds();
        })
        .catch((error) => {
          console.error('Xatolik:', error);
          setMessage({ text: 'E\'lonni o\'chirishda xatolik yuz berdi.', success: false });
        });
    }
  };

  const handleEdit = (adId) => {
    const adToEdit = ads.find(ad => ad._id === adId);
    setFormData({
      title: adToEdit.title,
      description: adToEdit.description,
      photo: null,
      existingPhoto: adToEdit.photo || '',
    });
    setPreviewUrl(adToEdit.photo ? `${import.meta.env.VITE_API_URL}${adToEdit.photo}` : '');
    setEditingAdId(adId);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      photo: null,
      existingPhoto: '',
    });
    setPreviewUrl('');
    setEditingAdId(null);
  };

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('uz-UZ', options);
  };

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    }
  }, [message]);

  return (
    <div className="mx-auto px-4 py-8">


      {/* Alert Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-xl ${
          message.success 
            ? "bg-green-100 border border-green-300 text-green-700" 
            : "bg-red-100 border border-red-300 text-red-700"
        }`}>
          {message.text}
        </div>
      )}

      {/* Toggle buttons */}
      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => { setShowForm(true); resetForm(); }}
          className={`flex items-center gap-2 py-3 px-6 rounded-full font-medium transition-all shadow-lg ${
            showForm
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          <FaPlus />
          {editingAdId ? "Tahrirlashni bekor qilish" : "Yangi e'lon"}
        </button>
        <button
          onClick={() => setShowForm(false)}
          className={`flex items-center gap-2 py-3 px-6 rounded-full font-medium transition-all shadow-lg ${
            !showForm
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          <FaImages />
          Barcha e'lonlar
        </button>
      </div>

      {/* Form */}
      {showForm ? (
        <div className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl shadow-xl border border-indigo-100 overflow-hidden mb-14">
          <div className="p-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
          
          <div className="p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-indigo-800 flex items-center gap-2">
                <FaPlus className="text-indigo-600" />
                {editingAdId ? "E'lonni tahrirlash" : "Yangi e'lon qo'shish"}
              </h2>
              {editingAdId && (
                <button 
                  onClick={resetForm}
                  className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200"
                >
                  <FaTimes />
                </button>
              )}
            </div>
            
            <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="relative z-0">
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleFormChange}
                      className="block py-3 px-4 w-full text-sm bg-transparent rounded-lg border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
                      placeholder=" "
                      required
                    />
                    <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-indigo-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3">
                      E'lon sarlavhasi
                    </label>
                  </div>
                  
                  <div className="relative z-0 mt-6">
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      rows="4"
                      className="block py-3 px-4 w-full text-sm bg-transparent rounded-lg border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
                      placeholder=" "
                      required
                    ></textarea>
                    <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-indigo-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3">
                      E'lon tafsilotlari
                    </label>
                  </div>
                </div>
                
                <div>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 h-full flex flex-col items-center justify-center">
                    {previewUrl || formData.existingPhoto ? (
                      <>
                        <img 
                          src={previewUrl || `${import.meta.env.VITE_API_URL}${formData.existingPhoto}`} 
                          alt="Preview" 
                          className="max-h-52 object-contain mb-4"
                        />
                        <label className="cursor-pointer bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg font-medium hover:bg-indigo-200 transition-colors">
                          <span>Rasmni almashtirish</span>
                          <input
                            type="file"
                            name="photo"
                            onChange={handleFormChange}
                            className="hidden"
                            accept="image/*"
                          />
                        </label>
                      </>
                    ) : (
                      <div className="text-center">
                        <div className="bg-indigo-100 p-4 rounded-full mb-4">
                          <FaImages className="text-indigo-600 text-xl" />
                        </div>
                        <p className="text-gray-500 mb-3">E'lon uchun rasm</p>
                        <label className="cursor-pointer bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg font-medium hover:bg-indigo-200 transition-colors">
                          <span>Rasm tanlash</span>
                          <input
                            type="file"
                            name="photo"
                            onChange={handleFormChange}
                            className="hidden"
                            accept="image/*"
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <button
                  type="submit"
                  className={`flex items-center gap-2 py-3 px-8 rounded-full font-medium transition-all shadow-lg ${
                    editingAdId 
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                      : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                  } text-white`}
                >
                  {editingAdId ? <FaEdit /> : <FaPlus />}
                  {editingAdId ? "E'lonni yangilash" : "E'lonni joylash"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        // Ads Grid
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-indigo-800 flex items-center gap-2">
              <FaImages className="text-indigo-600" />
              Barcha e'lonlar ({ads.length})
            </h2>
          </div>
          
          {ads.length === 0 ? (
            <div className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl shadow-xl border border-indigo-100 overflow-hidden py-16 text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaImages className="text-indigo-600 text-2xl" />
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">E'lonlar topilmadi</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Yangi e'lon qo'shish uchun "Yangi e'lon" tugmasini bosing
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {ads.map((ad) => (
                <div
                  key={ad._id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-transform hover:scale-[1.02]"
                >
                  <div className="h-56 overflow-hidden">
                    <img
                      src={`${import.meta.env.VITE_API_URL}${ad.photo}`}
                      alt={ad.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <div className="p-5 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-2">{ad.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">{ad.description}</p>
                      <p className="text-xs text-gray-400">
                        {formatDate(ad.sent_date)}
                      </p>
                    </div>
                    <div className="flex justify-between mt-6 space-x-3">
                      <button
                        onClick={() => handleEdit(ad._id)}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2"
                      >
                        <FaEdit /> Tahrirlash
                      </button>
                      <button
                        onClick={() => handleDelete(ad._id, ad.photo)}
                        className="flex-1 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2"
                      >
                        <FaTrash /> O'chirish
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Ads;
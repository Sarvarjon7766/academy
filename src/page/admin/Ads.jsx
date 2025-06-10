import axios from 'axios'
import React, { useEffect, useState } from 'react'

function Ads() {
  const [ads, setAds] = useState([])
  const [showForm, setShowForm] = useState(true)
  const [editingAdId, setEditingAdId] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    photo: null,
    existingPhoto: '',
  })
  const [message, setMessage] = useState(null)

  useEffect(() => {
    fetchAds()
  }, [])

  const fetchAds = () => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/ads/getAll`)
      .then((response) => {
        setAds(response.data.alldata)
      })
      .catch((error) => {
        console.error('Xatolik:', error)
        setMessage({ text: 'E\'lonlarni olishda xatolik yuz berdi.', success: false })
      })
  }

  const handleFormChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'photo') {
      setFormData((prev) => ({ ...prev, photo: files ? files[0] : null }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const form = new FormData()
    form.append('title', formData.title)
    form.append('description', formData.description)
    form.append('photo', formData.photo || formData.existingPhoto)
    form.append('oldPhoto', formData.existingPhoto)

    if (editingAdId) {
      axios.put(`${import.meta.env.VITE_API_URL}/api/ads/update/${editingAdId}`, form)
        .then((response) => {
          setAds(ads.map(ad => (ad._id === editingAdId ? response.data.updatedAd : ad)))
          setMessage({ text: 'E\'lon muvaffaqiyatli yangilandi!', success: true })
          resetForm()
          fetchAds()
        })
        .catch((error) => {
          console.error('Xatolik:', error)
          setMessage({ text: 'E\'lonni yangilashda xatolik yuz berdi.', success: false })
        })
    } else {
      axios.post(`${import.meta.env.VITE_API_URL}/api/ads/create`, form)
        .then((response) => {
          setAds([...ads, response.data.newAd])
          setMessage({ text: 'E\'lon muvaffaqiyatli joylandi!', success: true })
          resetForm()
          fetchAds()
        })
        .catch((error) => {
          console.error('Xatolik:', error)
          setMessage({ text: 'E\'lon yaratishda xatolik yuz berdi.', success: false })
        })
    }
  }

  const handleDelete = (adId, photo) => {
    axios.delete(`${import.meta.env.VITE_API_URL}/api/ads/delete/${adId}`, { data: { photo: photo } })
      .then(() => {
        setAds((prevAds) => prevAds.filter(ad => ad._id !== adId))
        setMessage({ text: 'E\'lon muvaffaqiyatli o\'chirildi!', success: true })
        fetchAds()
      })
      .catch((error) => {
        console.error('Xatolik:', error)
        setMessage({ text: 'E\'lonni o\'chirishda xatolik yuz berdi.', success: false })
      })
  }

  const handleEdit = (adId) => {
    const adToEdit = ads.find(ad => ad._id === adId)
    setFormData({
      title: adToEdit.title,
      description: adToEdit.description,
      photo: null,
      existingPhoto: adToEdit.photo || '',
    })
    setEditingAdId(adId)
    setShowForm(true)
    fetchAds()
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      photo: null,
      existingPhoto: '',
    })
    setEditingAdId(null)
  }

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' }
    return new Date(date).toLocaleDateString('uz-UZ', options)
  }

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    }
  }, [message])

  return (
    <div className="container mx-auto p-4">
      {/* Toggle buttons */}
      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => { setShowForm(true); resetForm() }}
          className={`py-2 px-6 text-sm font-semibold rounded-full transition duration-300 shadow-md ${showForm
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
              : 'bg-gray-100 text-gray-800 hover:bg-blue-500 hover:text-white'
            }`}
        >
          E'lon yaratish
        </button>
        <button
          onClick={() => setShowForm(false)}
          className={`py-2 px-6 text-sm font-semibold rounded-full transition duration-300 shadow-md ${!showForm
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
              : 'bg-gray-100 text-gray-800 hover:bg-blue-500 hover:text-white'
            }`}
        >
          E'lonlar ro'yxati
        </button>
      </div>

      {/* Form */}
      {showForm ? (
        <div className="flex justify-center">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-xl border border-blue-100">
            <h2 className="text-2xl font-semibold text-center text-indigo-600 mb-6">
              {editingAdId ? "E'lonni tahrirlash" : "Yangi e'lon qo'shish"}
            </h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-5">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                placeholder="E'lon sarlavhasi"
                className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                placeholder="E'lon tafsilotlari"
                className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <input
                type="file"
                name="photo"
                onChange={handleFormChange}
                className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {formData.existingPhoto && !formData.photo && (
                <p className="text-sm text-gray-500">Joriy rasm saqlanadi.</p>
              )}
              <button
                type="submit"
                className="bg-indigo-600 text-white py-2 px-6 rounded-full w-full hover:bg-indigo-700 font-semibold"
              >
                {editingAdId ? "E'lonni yangilash" : "Yuborish"}
              </button>
            </form>
          </div>
        </div>
      ) : (
        // Cards section
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads.length > 0 ? (
            ads.map((ad) => (
              <div
                key={ad._id}
                className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden transition-transform hover:scale-[1.01]"
              >
                <img
                  src={`http://localhost:4000${ad.photo}`}
                  alt={ad.title}
                  className="w-full h-60 object-cover"
                />
                <div className="p-5 flex flex-col justify-between h-full">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{ad.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{ad.description}</p>
                    <p className="text-xs text-gray-400">Sana: {formatDate(ad.sent_date)}</p>
                  </div>
                  <div className="flex justify-between mt-4 space-x-2">
                    <button
                      onClick={() => handleEdit(ad._id)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm py-2 rounded-lg font-medium"
                    >
                      O'zgartirish
                    </button>
                    <button
                      onClick={() => handleDelete(ad._id, ad.photo)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm py-2 rounded-lg font-medium"
                    >
                      O'chirish
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 col-span-full">E'lonlar mavjud emas.</p>
          )}
        </div>
      )}

      {/* Alert Message */}
      {message && (
        <div
          className={`mt-6 text-center px-4 py-3 rounded-lg font-medium ${message.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
        >
          {message.text}
        </div>
      )}
    </div>

  )
}

export default Ads

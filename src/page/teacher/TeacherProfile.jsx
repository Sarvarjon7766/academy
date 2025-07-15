import axios from "axios"
import React, { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"


const TeacherProfile = () => {
  const token = localStorage.getItem("token")
  const navigate = useNavigate()
  const [user, setUser] = useState({})
  const [inputValue, setInputValue] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const fetchData = useCallback(async () => {
    if (!token) {
      navigate("/login")
      return
    }

    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/teacher/getOne`, { headers })

      if (res.status === 200) {
        setUser(res.data.user)
      } else {
        navigate("/login")
      }
    } catch (error) {
      console.error("Xatolik yuz berdi:", error)
      navigate("/login")
    }
  }, [token, navigate])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleSelect = (e) => {
    setInputValue(e.target.checked)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert("Parollar mos kelmadi!")
      return
    }

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/teacher/changePassword/${user._id}`,
        { password },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (res.status === 200) {
        alert(`${res.data.message}`)
        setPassword("")
        setConfirmPassword("")
        setInputValue(false)
      }
    } catch (error) {
      console.error("Xatolik:", error)
      alert("Parolni o'zgartirishda xatolik yuz berdi!")
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <h1 className="text-3xl text-center font-bold text-indigo-700 mb-6">👤 Shaxsiy Profil</h1>
      <div className="border-t-2 border-indigo-500 w-24 mx-auto mb-10"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
                    {user.image ? (
            <img
              src={user.image}
              alt="Teacher"
              className="w-36 h-36 object-cover rounded-full border-4 border-indigo-300 shadow-md"
            />
          ) : (
            <div className="w-36 h-36 rounded-full border-4 border-indigo-300 bg-indigo-100 flex items-center justify-center shadow-md">
              <span className="text-4xl font-bold text-indigo-800">
                {user.fullName
                  ? user.fullName
                      .split(' ')
                      .map(n => n[0])
                      .join('')
                      .slice(0, 2)
                  : 'T'}
              </span>
            </div>
          )}
          <h2 className="text-xl font-semibold text-blue-700 mt-4">{user.fullName || "Noma'lum"}</h2>
          <div className="mt-6 w-full space-y-2">
            <p className="text-gray-700"><span className="font-semibold text-indigo-600">📞 Telefon:</span> {user.phone || "Noma'lum"}</p>
            <p className="text-gray-700"><span className="font-semibold text-indigo-600">🎂 Tug'ilgan sana:</span> {user.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString() : "Noma'lum"}</p>
            <p className="text-gray-700"><span className="font-semibold text-indigo-600">🚻 Jins:</span> {user.gender || "Noma'lum"}</p>
            <p className="text-gray-700"><span className="font-semibold text-indigo-600">📍 Manzil:</span> {user.address || "Noma'lum"}</p>
            <p className="text-gray-700 mb-4"><span className="font-semibold text-indigo-600">🔐 Login:</span> {user.login || "Noma'lum"}</p>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" onChange={handleSelect} className="form-checkbox h-4 w-4 text-indigo-600" />
              <span className="text-gray-600">Parolni o'zgartirish</span>
            </label>
          </div>
        </div>

        {inputValue && (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-indigo-600 mb-4">🔒 Parolni o'zgartirish</h2>
            <label className="block mb-2 text-sm font-medium text-gray-700">Yangi parol</label>
            <input
              type="password"
              placeholder="Parol ..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 mb-4"
            />

            <label className="block mb-2 text-sm font-medium text-gray-700">Parolni tasdiqlang</label>
            <input
              type="password"
              placeholder="Parol ..."
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 mb-6"
            />

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-md transition duration-300"
            >
              ✅ Saqlash
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default TeacherProfile

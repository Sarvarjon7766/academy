import axios from "axios"
import React, { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
// import photo from '../../../../backend/static/0b47bf00-52d1-41a9-ab70-d08b03fbd6f0.jpg'

const RegisterProfile = () => {
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
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/register/getOne`, { headers })
			console.log(res.data)

      if (res.status === 200) {
        setUser(res.data.data)
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
    <div className="w-full  mx-auto  p-6">
      <h1 className="text-2xl sm:text-3xl text-center font-bold text-indigo-700 mb-4">Shaxsiy Panel</h1>
      <hr class="border-t-3 border-blue-500 my-4 mb-12" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6">

        <div className="bg-white p-4 rounded-lg shadow-md">
        
          <h3 className="text-lg font-bold text-blue-600">{user.fullName || "Noma'lum"}</h3>
          <p className="text-gray-600"><span className='font-bold text-blue-600'>Telefon:</span> {user.phone || "Noma'lum"}</p>
          <p className="text-gray-600">
            <span className='font-bold text-blue-600'>Tug'ilgan sana:</span> {user.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString() : "Noma'lum"}
          </p>
          <p className="text-gray-600"><span className='font-bold text-blue-600'>Jins:</span> {user.gender || "Noma'lum"}</p>
          <p className="text-gray-600"><span className='font-bold text-blue-600'>Manzil</span> {user.address || "Noma'lum"}</p>
          <p className="text-gray-600 mb-3"><span className='font-bold text-blue-600'>Login:</span> {user.login || "Noma'lum"}</p>

          <div className="flex">
            <input type="checkbox" onChange={handleSelect} className="mr-2" />
            <p className="text-gray-600">Parolni o'zgartirish</p>
          </div>
        </div>
        {inputValue && (
          <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md">
            <label className="block text-gray-600 font-medium mb-1">Parolni kiriting</label>
            <input
              type="password"
              placeholder="Parol ..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
            />

            <label className="block text-gray-600 font-medium mb-1">Parolni qayta kiriting</label>
            <input
              type="password"
              placeholder="Parol ..."
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mb-6"
            />

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition duration-300"
            >
              Tasdiqlash
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default RegisterProfile

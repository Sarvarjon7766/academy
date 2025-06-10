import axios from "axios"
import React, { useEffect, useState } from "react"

const MessageForm = () => {
  const [formData, setFormData] = useState({
    messageName: "",
    messageTitle: "",
    who_is: 0,
    teacher: ""
  })
  const [messages, setMessages] = useState([])
  const [filteredMessages, setFilteredMessages] = useState([])
  const [teacher, setTeacher] = useState([])
  const [message, setMessage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isWho, setWhoIs] = useState(false)
  const [editId, setEditId] = useState(null)

  useEffect(() => {
    fetchMessages()
    fetchTeacher()
  }, [])

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [message])

  const fetchTeacher = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/teacher/getAll`)
      setTeacher(res.data.teachers)
    } catch (error) {}
  }

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/message/getAll`)
      setMessages(response.data.messages)
      setFilteredMessages(response.data.messages)
    } catch (error) {
      console.error("Xatolik:", error)
    }
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      if (editId) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/message/update/${editId}`, formData)
        setMessage("Xabar muvaffaqiyatli yangilandi!")
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/message/create`, formData)
        setMessage("Xabar muvaffaqiyatli yuborildi!")
      }
      setFormData({ messageName: "", messageTitle: "", who_is: 0, teacher: "" })
      setEditId(null)
      fetchMessages()
      setWhoIs(false)
    } catch (error) {
      console.error("Xatolik:", error)
      setMessage("Xabar yuborishda xatolik yuz berdi.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditMessage = (msg) => {
    setFormData({ 
      messageName: msg.messageName, 
      messageTitle: msg.messageTitle, 
      who_is: msg.who_is, 
      teacher: msg.teacher || "" 
    })
    setEditId(msg._id)
  }

  const handleDeleteMessage = async (messageId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/message/delete/${messageId}`)
      fetchMessages()
    } catch (error) {
      console.error("Xatolik:", error)
    }
  }

  const handleSelect = () => {
    setWhoIs(prev => !prev)
  }

  const whoIsText = (who_is) => {
    switch (who_is) {
      case 1: return "O'qituvchilar"
      case 2: return "O'quvchilar"
      case 3: return "Ota-onalar"
      case 4: return "Hamma uchun"
      default: return "O'qituvchiga"
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">📩 Xabar Yuborish</h2>
      {message && <div className="text-center text-green-600 font-medium mb-4">{message}</div>}
      <form onSubmit={handleSendMessage} className="bg-gradient-to-r from-indigo-50 to-white shadow-xl rounded-2xl p-6 mb-10 border">
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block font-semibold mb-1">Xabar Nomi:</label>
            <input type="text" name="messageName" value={formData.messageName} onChange={handleInputChange} className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block font-semibold mb-1">Kimlarga Yuborish:</label>
            {!isWho ? (
              <select name="who_is" value={formData.who_is} onChange={handleInputChange} className="w-full border p-2 rounded-md" required>
                <option value="">Tanlang</option>
                <option value="1">O'qituvchilar</option>
                <option value="2">O'quvchilar</option>
                <option value="3">Ota-onalar</option>
                <option value="4">Hamma uchun</option>
              </select>
            ) : (
              <select name="teacher" value={formData.teacher} onChange={handleInputChange} className="w-full border p-2 rounded-md" required>
                <option value="">O'qituvchini tanlang</option>
                {teacher && teacher.map((t, i) => (
                  <option key={i} value={t._id}>{t.fullName}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div className="my-4">
          <input type="checkbox" onChange={handleSelect} className="mr-2" />
          <span className="text-gray-700">O'qituvchiga maxsus yuborish</span>
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Xabar Matni:</label>
          <textarea name="messageTitle" value={formData.messageTitle} onChange={handleInputChange} rows="4" className="w-full border p-2 rounded-md" required></textarea>
        </div>

        <button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition-all duration-300 w-full">
          {isLoading ? "Yuborilmoqda..." : editId ? "Yangilash" : "Yuborish"}
        </button>
      </form>

      <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">📃 Xabarlar Ro'yxati</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMessages.length > 0 ? (
          filteredMessages.map((msg) => (
            <div key={msg._id} className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 transition hover:shadow-xl">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{msg.messageName}</h3>
              <p className="text-gray-600 mb-3">{msg.messageTitle}</p>
              <p className="text-sm text-gray-500"><strong>Kim uchun:</strong> {whoIsText(msg.who_is)}</p>
              <p className="text-sm text-gray-500"><strong>Sana:</strong> {new Date(msg.sent_date).toLocaleString()}</p>
              <div className="mt-4 flex justify-between">
                <button onClick={() => handleEditMessage(msg)} className="bg-green-500 hover:bg-green-700 text-white px-4 py-1.5 rounded-md">✏️ Yangilash</button>
                <button onClick={() => handleDeleteMessage(msg._id)} className="bg-red-500 hover:bg-red-700 text-white px-4 py-1.5 rounded-md">🗑️ O'chirish</button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">Xabarlar mavjud emas.</p>
        )}
      </div>
    </div>
  )
}

export default MessageForm

import axios from 'axios'
import { useEffect, useMemo, useState } from 'react'

const RegisterPayment = () => {
  const [students, setStudents] = useState([])
  const [selectedStudentId, setSelectedStudentId] = useState('')
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [paymentInfo, setPaymentInfo] = useState(null)
  const [amountDue, setAmountDue] = useState(null)
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  // Tanlangan talaba obyektini olish
  const selectedStudent = useMemo(() => {
    return students.find((student) => student._id === selectedStudentId)
  }, [selectedStudentId, students])

  // Talabalar ro'yxatini olish
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/student/getAll')
        if (res.data.success) {
          setStudents(res.data.students)
        }
      } catch (error) {
        console.error('Talabalarni olishda xatolik:', error)
      }
    }
    fetchStudents()
  }, [])

  // To'lov ma'lumotlarini olish (selectedStudentId, year yoki month o'zgarganda)
  useEffect(() => {
    const fetchPaymentInfo = async () => {
      if (!selectedStudentId || !year || !month) {
        setPaymentInfo(null)
        return
      }
      try {
        const res = await axios.get('http://localhost:4000/api/payment/check', {
          params: { studentId: selectedStudentId, year, month },
        })
        setPaymentInfo(res.data.payment || null)
        setAmountDue(res.data.amountDue)
        setAmount('') // To'lov summasini har safar yangilanishda tozalash
      } catch (error) {
        console.error("To'lov ma'lumotini olishda xatolik:", error)
        setPaymentInfo(null)
        setAmount('')
      }
    }
    fetchPaymentInfo()
  }, [selectedStudentId, year, month])

  // Qoldiqni hisoblash
  const remainingAmount = paymentInfo ? paymentInfo.amountDue - paymentInfo.amountPaid : null

  // To'lovni yuborish funksiyasi
  const handlePaymentSubmit = async () => {
    const payAmount = Number(amount)
    if (!amount || isNaN(payAmount) || payAmount <= 0) {
      alert("Iltimos, to'lov summasini to'g'ri kiriting")
      return
    }
    if (remainingAmount !== null && payAmount > remainingAmount) {
      alert(`To'lov summasi qoldiqdan katta bo'lishi mumkin emas. Qoldiq: ${remainingAmount.toLocaleString()} so'm`)
      return
    }
    if (remainingAmount === 0) {
      alert("To'lov allaqachon to'liq amalga oshirilgan")
      return
    }
    try {
      setLoading(true)
      const res = await axios.post('http://localhost:4000/api/payment/pay', {
        studentId: selectedStudentId,
        year,
        month,
        amount: payAmount,
        amountDue: selectedStudent?.amountDue || selectedStudent?.monthly_payment || 0,
      })

      if (res.data.success) {
        alert("To'lov muvaffaqiyatli amalga oshirildi!")
        setAmount('')
        // To'lov ma'lumotlarini yangilash
        const resCheck = await axios.get('http://localhost:4000/api/payment/check', {
          params: { studentId: selectedStudentId, year, month },
        })
        setPaymentInfo(resCheck.data.payment || null)
      } else {
        alert("To'lovni amalga oshirishda xatolik yuz berdi")
      }
    } catch (error) {
      console.error("To'lovni amalga oshirishda xatolik:", error)
      alert("To'lovni amalga oshirishda xatolik yuz berdi")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        📄 Talabalar To‘lov Ro‘yxati
      </h2>

      <div className="bg-white shadow-xl rounded-lg p-6 space-y-6">
        {/* Talabani tanlash */}
        <div className="space-y-6 bg-white p-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">🎓 Talabani tanlang</label>
          <select
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
          >
            <option value="" disabled>Talabani tanlang</option>
            {students.map((student) => (
              <option key={student._id} value={student._id}>
                {student.fullName || `${student.firstName} ${student.lastName}`}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">📅 Yilni tanlang</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                min={2000}
                max={2100}
                placeholder="Masalan: 2025"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">📆 Oy</label>
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              >
                {[ 
                  { value: 1, name: "Yanvar" }, { value: 2, name: "Fevral" }, { value: 3, name: "Mart" },
                  { value: 4, name: "Aprel" }, { value: 5, name: "May" }, { value: 6, name: "Iyun" },
                  { value: 7, name: "Iyul" }, { value: 8, name: "Avgust" }, { value: 9, name: "Sentabr" },
                  { value: 10, name: "Oktabr" }, { value: 11, name: "Noyabr" }, { value: 12, name: "Dekabr" }
                ].map(({value, name}) => (
                  <option key={value} value={value}>{name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* To'lov ma'lumoti */}
        {paymentInfo ? (
          <div className="bg-green-50 p-5 rounded-lg border border-green-200 shadow-sm">
            <h4 className="text-lg font-semibold text-green-700 mb-3">To‘lov Tafsilotlari</h4>
            <ul className="space-y-2 text-gray-700">
              <li><strong>Yil:</strong> {paymentInfo.year}</li>
              <li><strong>Oy:</strong> {paymentInfo.month}</li>
              <li><strong>Jami To'lov:</strong> {paymentInfo.amountDue.toLocaleString()} so'm</li>
              <li><strong>To‘langan:</strong> {paymentInfo.amountPaid.toLocaleString()} so'm</li>
              <li><strong>Qoldiq:</strong> {(paymentInfo.amountDue - paymentInfo.amountPaid).toLocaleString()} so'm</li>
              <li><strong>Status:</strong> {paymentInfo.status}</li>
              <li><strong>Sana:</strong> {paymentInfo.paymentDate ? new Date(paymentInfo.paymentDate).toLocaleDateString() : 'Noma’lum'}</li>
            </ul>

            {remainingAmount > 0 ? (
              <div className="mt-4 flex flex-col sm:flex-row gap-4">
                <input
                  type="number"
                  placeholder="To‘lash summasi"
                  className="flex-1 px-4 py-2 border rounded focus:ring focus:outline-none"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="1"
                  max={remainingAmount}
                />
                <button
                  onClick={handlePaymentSubmit}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded transition disabled:opacity-50"
                >
                  {loading ? "⏳ Yuborilmoqda..." : "💸 To'lov qilish"}
                </button>
              </div>
            ) : (
              <p className="text-green-700 mt-4 font-medium">✅ Barcha to‘lovlar amalga oshirilgan</p>
            )}
          </div>
        ) : selectedStudentId ? (
          <div className="bg-yellow-50 p-5 rounded-lg border border-yellow-200 shadow-sm">
            <p className="text-yellow-700 font-medium mb-2">🚫 Hali to‘lov qilinmagan</p>
            <p><strong>To‘lov summasi:</strong> {amountDue ? amountDue.toLocaleString() : 'Noma’lum'} so‘m</p>
            <div className="mt-4 flex flex-col sm:flex-row gap-4">
              <input
                type="number"
                placeholder="To‘lash summasi"
                className="flex-1 px-4 py-2 border rounded focus:ring focus:outline-none"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
              />
              <button
                onClick={handlePaymentSubmit}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded transition disabled:opacity-50"
              >
                {loading ? "⏳ Yuborilmoqda..." : "💳 To'lov qilish"}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Talabani tanlang va yil, oyni belgilang</p>
        )}
      </div>
    </div>
  )
}

export default RegisterPayment

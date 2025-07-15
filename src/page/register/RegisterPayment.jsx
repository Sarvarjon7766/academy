import axios from 'axios'
import { useEffect, useMemo, useState } from 'react'
import { FaUserGraduate, FaCalendarAlt, FaMoneyBillWave, FaInfoCircle, FaArrowLeft } from 'react-icons/fa'

const RegisterPayment = () => {
  const [students, setStudents] = useState([])
  const [selectedStudentId, setSelectedStudentId] = useState('')
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [paymentInfo, setPaymentInfo] = useState(null)
  const [amountDue, setAmountDue] = useState(null)
  const [amount, setAmount] = useState('')
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // Tanlangan talaba obyektini olish
  const selectedStudent = useMemo(() => {
    return students.find((student) => student._id === selectedStudentId)
  }, [selectedStudentId, students])

  // Talabalar ro'yxatini olish
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/student/getAll`)
        if (res.data.success) {
          setStudents(res.data.students)
        }
      } catch (error) {
        console.error('Talabalarni olishda xatolik:', error)
        setErrorMessage('Talabalarni yuklashda xatolik yuz berdi')
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
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/payment/check`, {
          params: { studentId: selectedStudentId, year, month },
        })
        console.log(res.data)
        setPaymentInfo(res.data.payment || null)
        setAmountDue(res.data.payment.amount_due)
        setAmount('') // To'lov summasini har safar yangilanishda tozalash
        setErrorMessage('')
      } catch (error) {
        console.error("To'lov ma'lumotini olishda xatolik:", error)
        setPaymentInfo(null)
        setAmount('')
        setErrorMessage('To\'lov ma\'lumotlarini yuklashda xatolik yuz berdi')
      }
    }
    fetchPaymentInfo()
  }, [selectedStudentId, year, month])

  // Qoldiqni hisoblash
  const remainingAmount = paymentInfo ? paymentInfo.amount_due - paymentInfo.amount_paid : null

  // To'lovni yuborish funksiyasi
  const handlePaymentSubmit = async () => {
    const payAmount = Number(amount)
    if (!amount || isNaN(payAmount) || payAmount <= 0) {
      setErrorMessage("Iltimos, to'lov summasini to'g'ri kiriting")
      return
    }
    if (remainingAmount !== null && payAmount > remainingAmount) {
      setErrorMessage(`To'lov summasi qoldiqdan katta bo'lishi mumkin emas. Qoldiq: ${remainingAmount.toLocaleString()} so'm`)
      return
    }
    if (remainingAmount === 0) {
      setErrorMessage("To'lov allaqachon to'liq amalga oshirilgan")
      return
    }
    try {
      setLoading(true)
      setErrorMessage('')
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/payment/pay`, {
        studentId: selectedStudentId,
        year,
        month,
        amount: payAmount,
        amountDue: paymentInfo.amount_due,
        comment:comment,
        payment:paymentInfo._id
      })

      if (res.data.success) {
        setSuccessMessage("To'lov muvaffaqiyatli amalga oshirildi!")
        setAmount('')
        setComment('')
        // To'lov ma'lumotlarini yangilash
        const resCheck = await axios.get(`${import.meta.env.VITE_API_URL}/api/payment/check`, {
          params: { studentId: selectedStudentId, year, month },
        })
        setPaymentInfo(resCheck.data.payment || null)
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('')
        }, 3000)
      } else {
        setErrorMessage("To'lovni amalga oshirishda xatolik yuz berdi")
      }
    } catch (error) {
      console.error("To'lovni amalga oshirishda xatolik:", error)
      setErrorMessage("To'lovni amalga oshirishda xatolik yuz berdi")
    } finally {
      setLoading(false)
    }
  }

  // Format currency
  const formatCurrency = (value) => {
    return value?.toLocaleString('uz-UZ', {
      style: 'currency',
      currency: 'UZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }) || '0 so\'m'
  }

  return (
    <div className="mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <button 
          className="flex items-center bg-indigo-400 text-white hover:text-white mr-4"
          onClick={() => window.history.back()}
        >
          <FaArrowLeft className="mr-2" /> Orqaga
        </button>
        <h2 className="text-3xl font-bold text-gray-800 flex items-center">
          To'lovlar Boshqaruvi
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left panel - Student selection */}
        <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaUserGraduate className="mr-2 text-indigo-600" />
              Talaba Ma'lumotlari
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Talabani tanlang</label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
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
              </div>
              
              {selectedStudent && (
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500">Familiya Ism</p>
                      <p className="font-medium">{selectedStudent.fullName || `${selectedStudent.firstName} ${student.lastName}`}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Telefon</p>
                      <p className="font-medium">{selectedStudent.phone || 'Mavjud emas'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Guruh</p>
                      <p className="font-medium">{selectedStudent.group || 'Mavjud emas'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Oylik to'lov</p>
                      <p className="font-medium text-green-600">
                        {formatCurrency(paymentInfo?.amount_due || selectedStudent?.monthly_payment)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaCalendarAlt className="mr-2 text-indigo-600" />
              To'lov Davri
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Yil</label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  min={2000}
                  max={2100}
                  placeholder="Masalan: 2025"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Oy</label>
                <select
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
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
        </div>
        
        {/* Right panel - Payment information */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FaInfoCircle className="mr-2 text-indigo-600" />
            To'lov Holati
          </h3>
          
          {successMessage && (
            <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
              {successMessage}
            </div>
          )}
          
          {errorMessage && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {errorMessage}
            </div>
          )}
          
          {paymentInfo ? (
            <div className="space-y-5">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-bold text-gray-800">
                      {new Date(year, month - 1).toLocaleDateString('uz-UZ', { month: 'long', year: 'numeric' })}
                    </h4>
                    <p className={`text-sm font-semibold ${paymentInfo.status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {paymentInfo.status === 'paid' ? 'To\'liq to\'langan' : 'Qisman to\'langan'}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Jami to'lov</p>
                    <p className="text-xl font-bold text-blue-600">{formatCurrency(paymentInfo.amount_due)}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-600">To'langan</span>
                    <span className="text-sm font-medium text-gray-600">
                      {formatCurrency(paymentInfo.amount_paid)} / {formatCurrency(paymentInfo.amount_due)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${(paymentInfo.amountPaid / paymentInfo.amountDue) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">To'langan summa</p>
                    <p className="text-lg font-semibold text-green-600">{formatCurrency(paymentInfo.amount_paid)}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Qolgan summa</p>
                    <p className="text-lg font-semibold text-orange-500">{formatCurrency(remainingAmount)}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Oxirgi to'lov sanasi</p>
                  <p className="font-medium">
                    {paymentInfo.updatedAt ? 
                      new Date(paymentInfo.updatedAt).toLocaleDateString('uz-UZ', { 
                        day: '2-digit', 
                        month: 'long', 
                        year: 'numeric' 
                      }) : 
                      'Mavjud emas'
                    }
                  </p>
                </div>
              </div>
              
              {remainingAmount > 0 && (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Qo'shimcha to'lov</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">To'lov summasi (so'm)</label>
                      <input
                        type="number"
                        placeholder={remainingAmount}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        min="1"
                        max={remainingAmount}
                      />
                      <label className="block text-sm font-medium text-gray-700 mb-1">Izoh</label>
                      <input
                        type="text"
                        placeholder="Eslatma qo'shish"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                    </div>
                    
                    <button
                      onClick={handlePaymentSubmit}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-all duration-300 disabled:opacity-70 flex items-center justify-center"
                    >
                      {loading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          To'lov amalga oshirilmoqda...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <FaMoneyBillWave className="mr-2" />
                          To'lovni tasdiqlash
                        </span>
                      )}
                    </button>
                    
                    <p className="text-sm text-gray-500 mt-2">
                      Maksimal to'lov miqdori: {formatCurrency(remainingAmount)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : selectedStudentId ? (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-5 border border-yellow-200">
              <div className="text-center py-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 text-yellow-600 mb-4">
                  <FaMoneyBillWave className="text-xl" />
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-2">To'lov mavjud emas</h4>
                <p className="text-gray-600 mb-4">
                  <span className="font-semibold">{new Date(year, month - 1).toLocaleDateString('uz-UZ', { month: 'long', year: 'numeric' })}</span> oyi uchun to'lov qilinmagan
                </p>
                
                <div className="mb-6 p-4 bg-white rounded-lg border border-yellow-100">
                  <p className="text-sm text-gray-500">To'lov miqdori</p>
                  <p className="text-2xl font-bold text-yellow-600">{formatCurrency(amountDue)}</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">To'lov summasi (so'm)</label>
                    <input
                      type="number"
                      placeholder="To'lash summasi"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      min="1"
                    />
                  </div>
                  
                  <button
                    onClick={handlePaymentSubmit}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-all duration-300 disabled:opacity-70 flex items-center justify-center"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        To'lov amalga oshirilmoqda...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <FaMoneyBillWave className="mr-2" />
                        To'lovni boshlash
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-200 text-gray-500 mb-4">
                <FaUserGraduate className="text-xl" />
              </div>
              <h4 className="text-xl font-semibold text-gray-700 mb-2">Talabani tanlang</h4>
              <p className="text-gray-500">
                To'lov ma'lumotlarini ko'rish uchun talaba, yil va oyni tanlang
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RegisterPayment
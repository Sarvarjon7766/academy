import axios from 'axios'
import { useEffect, useState } from 'react'

const Shunchaki = ({ studentId, onExit }) => {
  const [student, setStudent] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchStudent = async () => {
      if (!studentId) {
        setError("Talaba ID topilmadi.")
        return
      }
      setLoading(true)
      setError("")
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/student/getAll`)
        if (res.data.success && res.data.students) {
          const found = res.data.students.find(stu => stu._id === studentId)
          if (found) {
            setStudent(found)
          } else {
            setError("Talaba topilmadi.")
            setStudent(null)
          }
        } else {
          setError("Talabalar ro'yxati olinmadi.")
          setStudent(null)
        }
      } catch (err) {
        console.error(err)
        setError("Server bilan bog'lanishda xatolik yuz berdi.")
        setStudent(null)
      } finally {
        setLoading(false)
      }
    }
    fetchStudent()
  }, [studentId])

  const calculateMonthlyPayment = (student) => {
    if (!student) return 0
    let total = 0

    // Asosiy fanlar
    if (student.main_subjects?.length > 0) {
      total += student.main_subjects.reduce((sum, subj) => sum + (subj.price || 0), 0)
    }

    // Qo‘shimcha fanlar
    if (student.additionalSubjects?.length > 0) {
      total += student.additionalSubjects.reduce((sum, subj) => sum + (subj.price || 0), 0)
    }

    // Xizmatlar (hostel, product, transport)
    if (student.hostel?.hostelPrice) total += student.hostel.hostelPrice
    if (student.product?.productPrice) total += student.product.productPrice
    if (student.transport?.transportPrice) total += student.transport.transportPrice

    return total
  }

  if (loading) {
    return <div className="text-center mt-10 text-xl">Yuklanmoqda...</div>
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-600 font-semibold">
        {error}
        <div className="mt-4">
          <button
            onClick={onExit}
            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded"
          >
            Orqaga
          </button>
        </div>
      </div>
    )
  }

  if (!student) {
    return null // Yoki "Ma'lumot yo'q" deb chiqarsiz
  }

  return (
    <div className="mx-auto p-6 space-y-10 min-h-screen max-w-5xl">

      {/* Talaba Ma'lumotlari */}
      <div className="text-center">
        <h2 className="text-4xl font-extrabold text-blue-700">🎓 Talaba Profili</h2>
        <p className="text-gray-600 mt-1">Shaxsiy va moliyaviy maʼlumotlar</p>
      </div>

      {/* Bo‘lim: Shaxsiy va Aloqa */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-blue-500">
          <h3 className="text-xl font-bold text-blue-600 mb-4">🧍‍♂️ Shaxsiy Maʼlumotlar</h3>
          <p className="text-base leading-relaxed text-gray-800 mb-2"><b>Ismi:</b> {student.fullName}</p>
          <p className="text-base leading-relaxed text-gray-800 mb-2">
            <b>Tug‘ilgan kuni:</b> {student.date_of_birth ? new Date(student.date_of_birth).toLocaleDateString('uz-UZ') : '—'}
          </p>
          <p className="text-base leading-relaxed text-gray-800 mb-2"><b>Jinsi:</b> {student.gender || '—'}</p>
          <p className="text-base leading-relaxed text-gray-800 mb-2"><b>Maktabi:</b> {student.old_school || '—'}</p>
          <p className="text-base leading-relaxed text-gray-800 mb-2"><b>Sinfi:</b> {student.old_class || '—'}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-purple-500">
          <h3 className="text-xl font-bold text-purple-600 mb-4">📞 Aloqa</h3>
          <p className="text-base leading-relaxed text-gray-800 mb-2"><b>Telefon:</b> {student.phone || "—"}</p>
          <p className="text-base leading-relaxed text-gray-800 mb-2"><b>Manzil:</b> {student.address || "—"}</p>
        </div>
      </div>

      {/* Login va To‘lov */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-indigo-500">
          <h3 className="text-xl font-bold text-indigo-600 mb-4">🔐 Kirish Maʼlumotlari</h3>
          <p className="text-base leading-relaxed text-gray-800 mb-2"><b>Login:</b> {student.login || "—"}</p>
          <p className="text-base leading-relaxed text-gray-800 mb-2"><b>Parol:</b> {student.password || "—"}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-green-500">
          <h3 className="text-xl font-bold text-green-600 mb-4">💵 Oylik To‘lov</h3>
          <p className="text-base leading-relaxed text-gray-800 mb-2">
            <b>Oylik to‘lovi:</b> {calculateMonthlyPayment(student).toLocaleString()} so‘m
          </p>
        </div>
      </div>

      {/* Fanlar */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-blue-50 p-6 rounded-2xl shadow-md">
          <h3 className="text-center text-blue-700 font-bold text-lg mb-3">📘 Asosiy Fanlar</h3>
          {student.main_subjects?.length > 0 ? student.main_subjects.map((subj, idx) => (
            <div key={idx} className="border-b py-2">
              <p className="font-semibold">{subj.subjectId?.subjectName || "—"}</p>
              <p>Narxi: {subj.price?.toLocaleString() || "—"} so‘m</p>
            </div>
          )) : <p className="text-sm text-gray-500">Asosiy fanlar yo‘q</p>}
        </div>

        <div className="bg-purple-50 p-6 rounded-2xl shadow-md">
          <h3 className="text-center text-purple-700 font-bold text-lg mb-3">📗 Qo‘shimcha Fanlar</h3>
          {student.additionalSubjects?.length > 0 ? student.additionalSubjects.map((subj, idx) => (
            <div key={idx} className="border-b py-2">
              <p className="font-semibold">{subj.subjectId?.subjectName || "—"}</p>
              <p>Narxi: {subj.price?.toLocaleString() || "—"} so‘m</p>
            </div>
          )) : <p className="text-sm text-gray-500">Qo‘shimcha fanlar yo‘q</p>}
        </div>
      </div>

      {/* Xizmatlar */}
      <div className="bg-green-50 p-6 rounded-2xl shadow-md">
        <h3 className="text-xl font-bold text-green-700 text-center mb-4">🛎 Qo‘shimcha Xizmatlar</h3>
        <div className="grid sm:grid-cols-3 gap-4 text-center">
          <div>
            <p className="font-semibold">Turar joy xarajatlari</p>
            <p>{student.hostel?.hostelName || "—"}</p>
            <p>{student.hostel?.hostelPrice ? student.hostel.hostelPrice.toLocaleString() + " so'm" : "—"}</p>
          </div>
          <div>
            <p className="font-semibold">Ovqatlanish xarajatlari</p>
            <p>{student.product?.productName || "—"}</p>
            <p>{student.product?.productPrice ? student.product.productPrice.toLocaleString() + " so'm" : "—"}</p>
          </div>
          <div>
            <p className="font-semibold">Qatnov</p>
            <p>{student.transport?.transportName || "—"}</p>
            <p>{student.transport?.transportPrice ? student.transport.transportPrice.toLocaleString() + " so'm" : "—"}</p>
          </div>
        </div>
      </div>

      {/* Tugma */}
      <div className="flex justify-center">
        <button
          onClick={onExit}
          className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-xl text-lg font-semibold shadow-lg transition"
        >
          ✅ Yakunlash
        </button>
      </div>
    </div>
  )
}

export default Shunchaki

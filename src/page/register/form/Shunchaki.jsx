import axios from 'axios'
import { useEffect, useState } from 'react'
import { FaBed, FaBirthdayCake, FaBook, FaBus, FaCheck, FaLock, FaMapMarkerAlt, FaMoneyBillWave, FaPhone, FaPlus, FaSchool, FaUserGraduate, FaUtensils, FaVenusMars } from 'react-icons/fa'

const Shunchaki = ({ studentId, onExit }) => {
  const [student, setStudent] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStudent = async () => {
      if (!studentId) {
        setError("Talaba ID topilmadi.")
        setLoading(false)
        return
      }

      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/student/getAll`)
        if (res.data.success && res.data.students) {
          const found = res.data.students.find(stu => stu._id === studentId)
          console.log(found)
          if (found) {
            setStudent(found)
          } else {
            setError("Talaba topilmadi.")
          }
        } else {
          setError("Talabalar ro'yxati olinmadi.")
        }
      } catch (err) {
        console.error(err)
        setError("Server bilan bog'lanishda xatolik yuz berdi.")
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

    // Qo'shimcha fanlar
    if (student.additionalSubjects?.length > 0) {
      total += student.additionalSubjects.reduce((sum, subj) => sum + (subj.price || 0), 0)
    }

    // Xizmatlar
    if (student.hostel?.hostelPrice) total += student.hostel.hostelPrice
    if (student.product?.productPrice) total += student.product.productPrice
    if (student.transport?.transportPrice) total += student.transport.transportPrice

    return total
  }

  const InfoCard = ({ title, icon, children }) => (
    <div className="bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg border border-gray-100">
      <div className="flex items-center mb-4">
        {icon}
        <h3 className="text-xl font-bold text-gray-800 ml-3">{title}</h3>
      </div>
      {children}
    </div>
  )

  const InfoItem = ({ icon, label, value }) => (
    <div className="flex items-start mb-3">
      <div className="text-indigo-600 mt-1 mr-3">{icon}</div>
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="font-medium text-gray-800">{value || "—"}</p>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-6"></div>
        <p className="text-lg text-gray-700">Talaba ma'lumotlari yuklanmoqda...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 flex items-center">
          <FaTimes className="mr-2" />
          {error}
        </div>
        <div className="flex justify-center">
          <button
            onClick={onExit}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition"
          >
            Orqaga qaytish
          </button>
        </div>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg mb-6">
          Talaba ma'lumotlari topilmadi
        </div>
        <button
          onClick={onExit}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition"
        >
          Orqaga qaytish
        </button>
      </div>
    )
  }

  const monthlyPayment = calculateMonthlyPayment(student)

  const handleFinal = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/payment/register-history`, {
        student:student._id,
        amount_due:monthlyPayment,
        amount_paid:0,
        isPaid:false,
        details:[]
       })
       console.log(res.data)
      if(res.data.success){
        onExit()
      }else{
        alert("Xatolik")
      }
    } catch (error) {

    }
  }
  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="text-center mb-10">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-6 inline-block mb-6">
          <h1 className="text-3xl md:text-4xl font-bold flex items-center justify-center">
            <FaUserGraduate className="mr-3" />
            Talaba Profili
          </h1>
          <p className="mt-2 opacity-90">Ro'yxatdan o'tish jarayoni muvaffaqiyatli yakunlandi</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Talaba rasmi va asosiy ma'lumotlar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-32 mx-auto mb-4 flex items-center justify-center">
              <FaUserGraduate className="text-4xl text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{student.fullName}</h2>

            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 mb-4">
              <h3 className="font-bold text-gray-700 mb-1">Oylik To'lov</h3>
              <p className="text-2xl font-bold text-indigo-700">
                {monthlyPayment.toLocaleString()} so'm
              </p>
            </div>
          </div>
        </div>

        {/* Shaxsiy ma'lumotlar */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoCard
              title="Shaxsiy Maʼlumotlar"
              icon={<FaUserGraduate className="text-indigo-600 text-xl" />}
            >
              <InfoItem
                icon={<FaBirthdayCake />}
                label="Tug'ilgan kun"
                value={student.date_of_birth ? new Date(student.date_of_birth).toLocaleDateString('uz-UZ') : null}
              />
              <InfoItem
                icon={<FaVenusMars />}
                label="Jinsi"
                value={student.gender}
              />
              <InfoItem
                icon={<FaSchool />}
                label="Oldingi maktab"
                value={student.old_school}
              />
              <InfoItem
                icon={<FaSchool />}
                label="Oldingi sinf"
                value={student.old_class}
              />
            </InfoCard>

            <InfoCard
              title="Aloqa Maʼlumotlari"
              icon={<FaPhone className="text-blue-600 text-xl" />}
            >
              <InfoItem
                icon={<FaPhone />}
                label="Telefon raqam"
                value={student.phone}
              />
              <InfoItem
                icon={<FaMapMarkerAlt />}
                label="Manzil"
                value={student.address}
              />
              <InfoItem
                icon={<FaLock />}
                label="Login"
                value={student.login}
              />
              <InfoItem
                icon={<FaLock />}
                label="Parol"
                value={student.password}
              />
            </InfoCard>
          </div>
        </div>
      </div>

      {/* Fanlar bo'limi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <InfoCard
          title="Asosiy Fanlar"
          icon={<FaBook className="text-green-600 text-xl" />}
        >
          {student.main_subjects?.length > 0 ? (
            <div className="space-y-3">
              {student.main_subjects.map((subj, idx) => (
                <div key={idx} className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="font-semibold">{subj.subjectId?.subjectName || "—"}</p>
                    <p className="text-sm text-gray-500">{subj.teacherId?.fullName || "O'qituvchi"}</p>
                  </div>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    {subj.price?.toLocaleString() || "—"} so'm
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-3">Asosiy fanlar mavjud emas</p>
          )}
        </InfoCard>

        <InfoCard
          title="Qo'shimcha Fanlar"
          icon={<FaPlus className="text-purple-600 text-xl" />}
        >
          {student.additionalSubjects?.length > 0 ? (
            <div className="space-y-3">
              {student.additionalSubjects.map((subj, idx) => (
                <div key={idx} className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="font-semibold">{subj.subjectId?.subjectName || "—"}</p>
                    <p className="text-sm text-gray-500">{subj.teacherId?.fullName || "O'qituvchi"}</p>
                  </div>
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                    {subj.price?.toLocaleString() || "—"} so'm
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-3">Qo'shimcha fanlar mavjud emas</p>
          )}
        </InfoCard>
      </div>

      {/* Xizmatlar bo'limi */}
      <InfoCard
        title="Qo'shimcha Xizmatlar"
        icon={<FaMoneyBillWave className="text-red-600 text-xl" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <FaBed className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Yotoqxona</p>
              <p className="font-semibold">{student.hostel?.hostelName || "—"}</p>
              <p className="text-blue-700 font-medium">
                {student.hostel?.hostelPrice ? student.hostel.hostelPrice.toLocaleString() + " so'm" : "—"}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <FaUtensils className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Ovqatlanish</p>
              <p className="font-semibold">{student.product?.productName || "—"}</p>
              <p className="text-green-700 font-medium">
                {student.product?.productPrice ? student.product.productPrice.toLocaleString() + " so'm" : "—"}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg flex items-center">
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <FaBus className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Transport</p>
              <p className="font-semibold">{student.transport?.transportName || "—"}</p>
              <p className="text-purple-700 font-medium">
                {student.transport?.transportPrice ? student.transport.transportPrice.toLocaleString() + " so'm" : "—"}
              </p>
            </div>
          </div>
        </div>
      </InfoCard>

      {/* Yakunlash tugmasi */}
      <div className="flex justify-center mt-10">
        <button
          onClick={handleFinal}
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold px-8 py-4 rounded-xl hover:opacity-90 transition shadow-lg flex items-center"
        >
          <FaCheck className="mr-2" />
          Ro'yxatdan O'tishni Yakunlash
        </button>
      </div>
    </div>
  )
}

export default Shunchaki
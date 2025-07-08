import axios from "axios"
import { useEffect, useState } from "react"
import {
  FaBed, FaBus, FaShoppingCart, FaCheck, FaArrowRight, FaArrowLeft,
  FaMoneyBillWave, FaExclamationTriangle
} from "react-icons/fa"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const OtherCosts = ({ studentId, onclick, onHotelChange }) => {
  const [xizmatlar, setXizmatlar] = useState({ yotoqxona: [], mahsulot: [], transport: [] })
  const [yuklanmoqda, setYuklanmoqda] = useState(true)
  const [tanlanganXizmatTuri, setTanlanganXizmatTuri] = useState("barchasi")
  const [tanlanganXizmatlar, setTanlanganXizmatlar] = useState([])

  useEffect(() => {
    if (!studentId) return

    const xizmatlarniYuklash = async () => {
      try {
        setYuklanmoqda(true)
        const [yotoqxonaRes, mahsulotRes, transportRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/hostel/getAll`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/product/getAll`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/transport/getAll`),
        ])

        setXizmatlar({
          yotoqxona: yotoqxonaRes.data.hostels.map(item => ({
            ...item, tanlangan: false, turi: "yotoqxona",
            narx: item.hostelPrice, name: item.hostelName,
            description: item.description, icon: <FaBed className="text-blue-500 text-xl" />
          })),
          mahsulot: mahsulotRes.data.products.map(item => ({
            ...item, tanlangan: false, turi: "mahsulot",
            narx: item.productPrice, name: item.productName,
            description: item.description, icon: <FaShoppingCart className="text-green-500 text-xl" />
          })),
          transport: transportRes.data.transports.map(item => ({
            ...item, tanlangan: false, turi: "transport",
            narx: item.transportPrice, name: item.transportName,
            description: item.description, icon: <FaBus className="text-purple-500 text-xl" />
          })),
        })

      } catch (err) {
        toast.error("Xizmatlar ma'lumotlari yuklanmadi")
      } finally {
        setYuklanmoqda(false)
      }
    }

    xizmatlarniYuklash()
  }, [studentId])

  useEffect(() => {
    const barcha = [
      ...xizmatlar.yotoqxona,
      ...xizmatlar.mahsulot,
      ...xizmatlar.transport
    ].filter(item => item.tanlangan)
    setTanlanganXizmatlar(barcha)
  }, [xizmatlar])

  const tanlashniOzgarti = (turi, id) => {
    setXizmatlar(prev => {
      const yangilangan = prev[turi].map(item =>
        item._id === id ? { ...item, tanlangan: !item.tanlangan } : item
      )
      return { ...prev, [turi]: yangilangan }
    })
  }

  const royxatdanOtish = async () => {
    const tanlangan = {
      hostel: xizmatlar.yotoqxona.filter(x => x.tanlangan),
      mahsulot: xizmatlar.mahsulot.filter(x => x.tanlangan),
      transport: xizmatlar.transport.filter(x => x.tanlangan),
    }

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/student/monthly-payment/${studentId}`,
        { userId: studentId, xizmatlar: tanlangan }
      )

      if (res.data.success) {
        toast.success("Xizmatlarga muvaffaqiyatli yozildingiz")
        setTimeout(() => {
          if (res.data.isHotel && onclick) onclick()
        }, 1500)
      } else {
        toast.error(res.data.message || "Xatolik yuz berdi")
      }
    } catch {
      toast.error("Ro'yxatdan o'tishda xatolik yuz berdi")
    }
  }

  const SkipHandle = () => {
    setTimeout(() => {
      if (onHotelChange) onHotelChange()
      if (onclick) onclick()
    }, 500)
  }

  const barchaXizmatlar = [
    ...xizmatlar.yotoqxona,
    ...xizmatlar.mahsulot,
    ...xizmatlar.transport,
  ]

  const filtrlanganXizmatlar = tanlanganXizmatTuri === "barchasi"
    ? barchaXizmatlar
    : xizmatlar[tanlanganXizmatTuri]

  const jamiNarx = tanlanganXizmatlar.reduce((sum, item) => sum + (item.narx || 0), 0)

  return (
    <div className="max-w-5xl mx-auto p-4">
      <ToastContainer />

      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-6 mb-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-2 flex items-center">
          <FaMoneyBillWave className="mr-3" />
          Qo'shimcha Xizmatlar
        </h1>
        <p className="opacity-90">Talaba uchun xizmatlarni tanlang</p>
      </div>

      {/* Filtr tugmalari */}
      <div className="flex gap-2 mb-5">
        {["barchasi", "yotoqxona", "mahsulot", "transport"].map(turi => (
          <button
            key={turi}
            onClick={() => setTanlanganXizmatTuri(turi)}
            className={`px-4 py-2 rounded-full border font-medium transition ${
              tanlanganXizmatTuri === turi
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-700 border-gray-300"
            }`}
          >
            {turi.charAt(0).toUpperCase() + turi.slice(1)}
          </button>
        ))}
      </div>

      {/* Xizmatlar */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {yuklanmoqda ? (
          <div className="p-10 text-center">
            <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-indigo-600 rounded-full mx-auto mb-4"></div>
            <p>Xizmatlar ro'yxati yuklanmoqda...</p>
          </div>
        ) : filtrlanganXizmatlar.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {filtrlanganXizmatlar.map(xizmat => (
              <div
                key={xizmat._id}
                onClick={() => tanlashniOzgarti(xizmat.turi, xizmat._id)}
                className={`p-5 border rounded-xl cursor-pointer transition transform hover:scale-[1.02] ${
                  xizmat.tanlangan
                    ? "bg-indigo-50 border-indigo-400"
                    : "bg-white border-gray-200 hover:border-indigo-300"
                }`}
              >
                <div className="flex items-start">
                  <div className="mr-4">{xizmat.icon}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-gray-800">{xizmat.name}</h4>
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm">
                        {xizmat.narx.toLocaleString("uz-UZ")} so'm
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{xizmat.description}</p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">
                        {xizmat.turi.charAt(0).toUpperCase() + xizmat.turi.slice(1)}
                      </span>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        xizmat.tanlangan ? "bg-indigo-600 border-indigo-600" : "border-gray-400"
                      }`}>
                        {xizmat.tanlangan && <FaCheck className="text-white w-3 h-3" />}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-400">
            <FaExclamationTriangle className="text-3xl mx-auto mb-2" />
            Hech qanday xizmat topilmadi
          </div>
        )}
      </div>

      {/* Jami narx */}
      <div className="text-right font-semibold text-lg mt-4">
        Jami: {jamiNarx.toLocaleString("uz-UZ")} so'm
      </div>

      {/* Tugmalar */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
       

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={royxatdanOtish}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 flex items-center justify-center shadow-md"
          >
            <FaCheck className="mr-2" /> Xizmatlarga yozilish
          </button>

          <button
            onClick={SkipHandle}
            className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 flex items-center justify-center shadow-md"
          >
            Keyingisi <FaArrowRight className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default OtherCosts

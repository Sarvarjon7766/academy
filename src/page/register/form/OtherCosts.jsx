import axios from "axios"
import { useEffect, useState } from "react"

const OtherCosts = ({ studentId, onclick, onHotelChange }) => {
  const [xizmatlar, setXizmatlar] = useState({
    yotoqxona: [],
    mahsulot: [],
    transport: [],
  })
  const [yuklanmoqda, setYuklanmoqda] = useState(true)
  const [xato, setXato] = useState("")
  const [muvaffaqiyat, setMuvaffaqiyat] = useState("")
  const [tanlanganXizmatTuri, setTanlanganXizmatTuri] = useState("barchasi")

  useEffect(() => {
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
            ...item,
            tanlangan: false,
            turi: "yotoqxona",
            narx: item.hostelPrice // hostelPrice narxini olish
          })),
          mahsulot: mahsulotRes.data.products.map(item => ({
            ...item,
            tanlangan: false,
            turi: "mahsulot",
            narx: item.productPrice // productPrice narxini olish
          })),
          transport: transportRes.data.transports.map(item => ({
            ...item,
            tanlangan: false,
            turi: "transport",
            narx: item.transportPrice // transportPrice narxini olish
          })),
        })
        setYuklanmoqda(false)
      } catch (err) {
        setXato("Xizmat ma'lumotlari yuklanmadi")
        setYuklanmoqda(false)
      }
    }

    xizmatlarniYuklash()
  }, [studentId])

  const tanlashniOzgarti = (turi, id) => {
    setXizmatlar(prev => {
      const yangilangan = prev[turi].map(item =>
        item._id === id ? { ...item, tanlangan: !item.tanlangan } : item
      )
      return { ...prev, [turi]: yangilangan }
    })
  }

  const royxatdanOtish = async () => {
    setXato("")
    setMuvaffaqiyat("")

    const tanlanganXizmatlar = {
      hostel: xizmatlar.yotoqxona.filter(item => item.tanlangan),
      mahsulot: xizmatlar.mahsulot.filter(item => item.tanlangan),
      transport: xizmatlar.transport.filter(item => item.tanlangan),
    }
    console.log('Salom')
    console.log(tanlanganXizmatlar)
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/student/monthly-payment/${studentId}`, {
        userId: studentId,
        xizmatlar: tanlanganXizmatlar,
      })
      if (res.data.success) {
        setMuvaffaqiyat("Xizmatlarga muvaffaqiyatli yozildingiz")
        if (res.data.isHotel) {
            if (onclick) onclick()
        }
      } else {
        setXato(res.data.message || "Noma'lum xatolik yuz berdi")
      }
    } catch (err) {
      setXato("Ro'yxatdan o'tishda xatolik yuz berdi")
    }
  }
  const SkipHandle = () => {
    setTimeout(() => {
      onHotelChange()
      if (onclick) onclick()
    }, 1500)
  }

  const barchaXizmatlar = [
    ...xizmatlar.yotoqxona,
    ...xizmatlar.mahsulot,
    ...xizmatlar.transport
  ]

  const filtrlanganXizmatlar = tanlanganXizmatTuri === "barchasi"
    ? barchaXizmatlar
    : xizmatlar[tanlanganXizmatTuri]

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-xl text-center font-bold p-4 text-indigo-400">
        Qo'shimcha Xizmatlar Ro'yxati
      </h2>

      {xato && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4 text-sm">
          {xato}
        </div>
      )}

      {muvaffaqiyat && (
        <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded mb-4 text-sm">
          {muvaffaqiyat}
        </div>
      )}

      {yuklanmoqda ? (
        <div className="text-center py-6">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-3 text-gray-600">Ma'lumotlar yuklanmoqda...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtrlanganXizmatlar.length > 0 ? (
            filtrlanganXizmatlar.map(xizmat => (
              <div
                key={xizmat._id}
                className={`p-4 border rounded-lg flex items-start cursor-pointer transition-all ${xizmat.tanlangan
                  ? "bg-blue-50 border-blue-400 shadow-sm"
                  : "hover:bg-gray-50 border-gray-200"
                  }`}
                onClick={() => tanlashniOzgarti(xizmat.turi, xizmat._id)}
              >
                <div className="flex-shrink-0 mr-3 mt-1">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center ${xizmat.tanlangan
                    ? "bg-blue-600 border-blue-600"
                    : "border-gray-400"
                    }`}>
                    {xizmat.tanlangan && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-gray-800">
                      {xizmat.hostelName || xizmat.productName || xizmat.transportName}
                    </h4>
                    {xizmat.narx && (
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm font-medium">
                        {xizmat.narx.toLocaleString('uz-UZ', { style: 'currency', currency: 'UZS' })}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mt-1.5">
                    {xizmat.description}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 border border-dashed rounded-lg bg-gray-50">
              <div className="text-gray-400 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-500">Hech qanday xizmat topilmadi</p>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
        <button
          onClick={royxatdanOtish}
          className="px-5 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm"
        >
          Ro'yxatdan o'tish
        </button>
        <button
          onClick={SkipHandle}
          className="px-5 py-2 text-sm text-white border bg-green-500 border-gray-300 rounded-lg hover:bg-green-600 font-medium"
        >
          Keyingisi
        </button>

      </div>
    </div>
  )
}

export default OtherCosts
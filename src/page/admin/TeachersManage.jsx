import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// PDF uchun
import jsPDF from 'jspdf'

// Excel uchun
import * as XLSX from 'xlsx'

// Word uchun
import { Document, Packer, Paragraph } from 'docx'
import { saveAs } from 'file-saver'

const TeachersManage = () => {
  const navigate = useNavigate()
  const [selectedOption, setSelectedOption] = useState('')
  const [teachers, setTeachers] = useState([])
  const [filteredTeachers, setFilteredTeachers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTeacher, setSelectedTeacher] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/teacher/getAll`)
        if (res.data.success) {
          const filtered = res.data.teachers.filter(teacher => teacher.isAdmin === false)
          setTeachers(filtered)
          setFilteredTeachers(filtered)
        }
      } catch (error) {
        console.error("O'qituvchilarni olishda xatolik:", error)
      }
    }

    fetchTeacher()
  }, [])


  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase()
    setSearchTerm(value)

    const filtered = teachers.filter((teacher) =>
      teacher.fullName.toLowerCase().includes(value) ||
      teacher.phone.toLowerCase().includes(value) ||
      (teacher.address && teacher.address.toLowerCase().includes(value))
    )
    setFilteredTeachers(filtered)
  }

  const openModal = (teacher) => {
    setSelectedTeacher(teacher)
    setModalOpen(true)
  }

  const closeModal = () => {
    setSelectedTeacher(null)
    setModalOpen(false)
  }
  const updateHandler = () => {
    if (!selectedOption) return

    navigate('/admin/teacher-register', {
      state: {
        teacher: selectedTeacher,
        section: selectedOption, // 0, 1, 2 qiymatlar
      },
    })
  }


  // PDF eksport funksiyasi
  const exportToPDF = () => {
    if (!selectedTeacher) return

    const pdf = new jsPDF()

    pdf.setFontSize(18)
    pdf.setTextColor(55, 0, 120)
    pdf.text(selectedTeacher.fullName, 10, 20)

    pdf.setFontSize(12)
    pdf.setTextColor(0, 0, 0)

    const lines = [
      `Telefon: ${selectedTeacher.phone}`,
      `Manzil: ${selectedTeacher.address || '-'}`,
      `Tug'ilgan sana: ${new Date(selectedTeacher.date_of_birth).toLocaleDateString()}`,
      `Jins: ${selectedTeacher.gender}`,
      `Malaka: ${selectedTeacher.qualification}`,
      `Fanlar: ${selectedTeacher.subjects ? selectedTeacher.subjects.map(s => s.subjectName).join(', ') : selectedTeacher.subjectNames}`,
      `Oylik maosh: ${selectedTeacher.salary.toLocaleString()} UZS`,
      `Ulushi: ${selectedTeacher.share_of_salary}%`,
    ]

    let y = 30
    lines.forEach(line => {
      pdf.text(line, 10, y)
      y += 10 // qatorlar orasini 10 mm qilib qo‘ydik
    })

    pdf.save(`${selectedTeacher.fullName}.pdf`)
  }


  // Excel eksport funksiyasi
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet([
      { Key: 'Telefon', Value: selectedTeacher.phone },
      { Key: 'Manzil', Value: selectedTeacher.address || '-' },
      { Key: 'Tug\'ilgan sana', Value: new Date(selectedTeacher.date_of_birth).toLocaleDateString() },
      { Key: 'Jins', Value: selectedTeacher.gender },
      { Key: 'Malaka', Value: selectedTeacher.qualification },
      { Key: 'Fanlar', Value: selectedTeacher.subjects ? selectedTeacher.subjects.map(s => s.subjectName).join(', ') : selectedTeacher.subjectNames },
      { Key: 'Oylik maosh', Value: selectedTeacher.salary.toLocaleString() + ' UZS' },
      { Key: 'Ulushi', Value: selectedTeacher.share_of_salary + '%' },
    ])
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Teacher Info')
    XLSX.writeFile(workbook, `${selectedTeacher.fullName}.xlsx`)
  }

  // Word eksport funksiyasi
  const exportToDocx = () => {
    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({ text: selectedTeacher.fullName, heading: "Heading1" }),
          new Paragraph({ text: `Telefon: ${selectedTeacher.phone}` }),
          new Paragraph({ text: `Manzil: ${selectedTeacher.address || '-'}` }),
          new Paragraph({ text: `Tug'ilgan sana: ${new Date(selectedTeacher.date_of_birth).toLocaleDateString()}` }),
          new Paragraph({ text: `Jins: ${selectedTeacher.gender}` }),
          new Paragraph({ text: `Malaka: ${selectedTeacher.qualification}` }),
          new Paragraph({ text: `Fanlar: ${selectedTeacher.subjects ? selectedTeacher.subjects.map(s => s.subjectName).join(', ') : selectedTeacher.subjectNames}` }),
          new Paragraph({ text: `Oylik maosh: ${selectedTeacher.salary.toLocaleString()} UZS` }),
          new Paragraph({ text: `Ulushi: ${selectedTeacher.share_of_salary}%` }),
        ]
      }]
    })

    Packer.toBlob(doc).then(blob => {
      saveAs(blob, `${selectedTeacher.fullName}.docx`)
    })
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gradient-to-br from-purple-50 via-white to-purple-50 min-h-screen">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-purple-900 mb-6 text-center drop-shadow-md">
        O'qituvchilar Ro'yxati
      </h2>

      <div className="max-w-2xl mx-auto mb-6">
        <input
          type="text"
          placeholder="O'qituvchi ismi, telefon yoki manzil bo'yicha qidirish..."
          className="w-full border-2 border-purple-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-4 focus:ring-purple-400 focus:border-purple-600 transition"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="mx-auto border border-purple-300 rounded-lg shadow-sm bg-white overflow-x-auto">
        <ul className="min-w-full">
          <li className="hidden sm:grid grid-cols-3 gap-4 bg-blue-200 text-blue-900 font-semibold rounded-t-lg p-3 select-none">
            <span>Ism Familiya</span>
            <span>Telefon</span>
            <span>Manzil</span>
          </li>

          {filteredTeachers.length === 0 ? (
            <li className="p-4 text-center text-gray-500">O'qituvchi topilmadi</li>
          ) : (
            filteredTeachers.map((teacher) => (
              <li
                key={teacher._id}
                onClick={() => openModal(teacher)}
                className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 border-t border-purple-100 cursor-pointer hover:bg-purple-50 transition px-3 py-4 items-center"
              >
                <span className="font-medium text-purple-800">{teacher.fullName}</span>
                <span className="text-sm sm:text-base">{teacher.phone}</span>
                <span className="text-sm sm:text-base">{teacher.address || '-'}</span>
              </li>
            ))
          )}
        </ul>
      </div>
      {modalOpen && selectedTeacher && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
            onClick={closeModal}
          ></div>

          {/* Modal Content */}
          <div
            className="fixed inset-0 flex items-center justify-center z-50 px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-white rounded-3xl w-full max-w-3xl p-6 shadow-2xl ring-4 ring-purple-400 max-h-[90vh] overflow-y-auto">
              {/* Close Button */}
              <button
                className="absolute bg-white top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full text-purple-700 hover:text-purple-900 hover:bg-purple-100 transition text-2xl font-bold"
                onClick={closeModal}
                aria-label="Modalni yopish"
              >
                &times;
              </button>

              {/* Title */}
              <h3 className="text-2xl sm:text-3xl font-extrabold text-purple-900 mb-6 border-b border-purple-300 pb-3 text-center">
                {selectedTeacher.fullName}
              </h3>

              {/* Info Section */}
              <div className="space-y-3 text-gray-800 text-sm sm:text-base leading-relaxed">
                <p><span className="font-semibold text-purple-700">Telefon:</span> {selectedTeacher.phone}</p>
                <p><span className="font-semibold text-purple-700">Manzil:</span> {selectedTeacher.address || '-'}</p>
                <p><span className="font-semibold text-purple-700">Tug'ilgan sana:</span> {new Date(selectedTeacher.date_of_birth).toLocaleDateString()}</p>
                <p><span className="font-semibold text-purple-700">Jins:</span> {selectedTeacher.gender}</p>
                <p><span className="font-semibold text-purple-700">Malaka:</span> {selectedTeacher.qualification}</p>
                <p><span className="font-semibold text-purple-700">Fanlar:</span> {selectedTeacher.subjects ? selectedTeacher.subjects.map(s => s.subjectName).join(', ') : selectedTeacher.subjectNames}</p>
                <p><span className="font-semibold text-purple-700">Oylik maosh:</span> {selectedTeacher.salary.toLocaleString()} UZS</p>
                <p><span className="font-semibold text-purple-700">Ulushi:</span> {selectedTeacher.share_of_salary}%</p>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Select dropdown */}
                <select
                  className="border border-purple-400 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                  value={selectedOption}
                  onChange={(e) => setSelectedOption(e.target.value)}
                >
                  <option value="">Tanlang</option>
                  <option value="0">Shaxsiy</option>
                  <option value="1">Fan</option>
                  <option value="2">Oylik</option>
                </select>

                {/* Buttons */}
                <button
                  onClick={updateHandler}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md w-full shadow-sm transition duration-200 text-sm sm:text-base"
                >
                  Yangilash
                </button>

                <button
                  onClick={exportToPDF}
                  className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md w-full shadow-sm transition duration-200 text-sm sm:text-base"
                >
                  PDF yuklash
                </button>

                <button
                  onClick={exportToExcel}
                  className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md w-full shadow-sm transition duration-200 text-sm sm:text-base"
                >
                  Excel yuklash
                </button>

                <button
                  onClick={exportToDocx}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md w-full shadow-sm transition duration-200 text-sm sm:text-base"
                >
                  Word yuklash
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default TeachersManage

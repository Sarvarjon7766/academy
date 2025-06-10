import axios from 'axios'
import { useEffect, useState } from 'react'

const AddSubjectAdd = ({ teacherId, onSuccess }) => {
  const [error, setError] = useState(null)
  const [showSalaryInput, setShowSalaryInput] = useState(false)
  const [showShareInput, setShowShareInput] = useState(false)
  const [salary, setSalary] = useState(0)
  const [shareOfSalary, setShareOfSalary] = useState(0)

  useEffect(() => {
    const fetchSalary = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/teacher/check-salary/${teacherId}`)
        if (res.data.success && res.data.salary) {
					console.log(res.data)
          setSalary(Number(res.data.salary.salary) || 0)
          setShareOfSalary(Number(res.data.salary.share_of_salary) || 0)
        }
      } catch (error) {
        console.error(error)
      }
    }
    fetchSalary()
  }, [teacherId])

  const handleSave = async () => {
    setError(null)

    // Validatsiya
    if (showShareInput && (shareOfSalary < 0 || shareOfSalary > 100)) {
      setError("Ulashish foizi 0 dan 100 gacha bo'lishi kerak!")
      return
    }

    try {
      const res = await axios.post("http://localhost:4000/api/teacher/add-salary", {
        teacherId,
        salary: showSalaryInput ? salary : 0,
        share_of_salary: showShareInput ? shareOfSalary : 0,
      })

      if (res.data.success && onSuccess) {
        onSuccess()
      }
    } catch (err) {
      console.error(err)
      setError("Oylikni saqlashda xatolik")
    }
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-6 border border-gray-200">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6 flex items-center gap-2">
        💼 Oylik Ma'lumotlari
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Oylik qismi */}
        <div className="bg-gray-50 rounded-xl p-4 shadow-sm border border-gray-200">
          <label className="flex items-center gap-2 mb-2 text-gray-700 font-medium">
            <input
              type="checkbox"
              checked={showSalaryInput}
              onChange={() => setShowSalaryInput(prev => !prev)}
              className="accent-indigo-600 w-5 h-5"
            />
            Oylik kiritish
          </label>

          {showSalaryInput && (
            <input
              type="number"
              value={salary}
              onChange={(e) => setSalary(Number(e.target.value))}
              placeholder="Masalan: 3000000"
              className="mt-2 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              min={0}
            />
          )}
        </div>

        {/* Ulush foizi qismi */}
        <div className="bg-gray-50 rounded-xl p-4 shadow-sm border border-gray-200">
          <label className="flex items-center gap-2 mb-2 text-gray-700 font-medium">
            <input
              type="checkbox"
              checked={showShareInput}
              onChange={() => setShowShareInput(prev => !prev)}
              className="accent-indigo-600 w-5 h-5"
            />
            Ulush foizi (0% - 100%)
          </label>

          {showShareInput && (
            <input
              type="number"
              min={0}
              max={100}
              step={1}
              value={shareOfSalary}
              onChange={(e) => {
                let val = Number(e.target.value)
                if (val < 0) val = 0
                else if (val > 100) val = 100
                setShareOfSalary(val)
              }}
              placeholder="Masalan: 25"
              className="mt-2 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          )}
        </div>
      </div>

      {error && (
        <p className="mt-4 text-red-500 bg-red-50 border border-red-200 px-4 py-2 rounded-lg">
          ⚠ {error}
        </p>
      )}

      <button
        onClick={handleSave}
        className="mt-6 w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-xl transition-all duration-300"
      >
        💾 Saqlash
      </button>
    </div>
  )
}

export default AddSubjectAdd

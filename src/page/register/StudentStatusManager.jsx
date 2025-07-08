import axios from 'axios'
import React, { useEffect, useState } from 'react'

const StudentStatusManager = () => {
  const [students, setStudents] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRemoving, setIsRemoving] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    axios.get(`${import.meta.env.VITE_API_URL}/api/student/getAll`)
      .then(res => {
        setStudents(res.data.students)
        setIsLoading(false)
      })
      .catch(err => {
        alert("Talabalarni olishda xatolik: " + err.message)
        setIsLoading(false)
      })
  }, [])

  useEffect(() => {
    const student = students.find(s => s._id === selectedId)
    setSelectedStudent(student || null)
  }, [selectedId, students])

  const handleRemove = async () => {
    if (!selectedId) return alert("Iltimos, talabani tanlang!")
    
    setIsRemoving(true)
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/student/student-archived/${selectedId}`
      )
      alert(res.data.message)
      setSelectedId('')
      
      // Yangilangan talabalar ro'yxatini olish
      const updatedRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/student/getAll`)
      setStudents(updatedRes.data.students)
    } catch (err) {
      alert("Xatolik yuz berdi: " + err?.response?.data?.message || err.message)
    } finally {
      setIsRemoving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-indigo-800 mb-2">Talabalar safidan chiqarish</h1>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Talaba tanlash paneli */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-indigo-100 transform transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center mb-6">
              <div className="bg-indigo-100 p-3 rounded-xl mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Talaba Tanlash</h2>
            </div>
            
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
                <p className="text-gray-600">Talabalar ro'yxati yuklanmoqda...</p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">Talabani tanlang</label>
                  <div className="relative">
                    <select
                      value={selectedId}
                      onChange={(e) => setSelectedId(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition appearance-none bg-white"
                    >
                      <option value="">Tanlang</option>
                      {students.map(student => (
                        <option key={student._id} value={student._id}>
                          {student.fullName} - {student.login}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleRemove}
                  disabled={isRemoving || !selectedId}
                  className={`w-full py-3 rounded-xl text-white font-bold transition-all flex items-center justify-center ${
                    isRemoving || !selectedId 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                  }`}
                >
                  {isRemoving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Amalga oshirilmoqda...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Talabani safdan chiqarish
                    </>
                  )}
                </button>
              </>
            )}
          </div>
          
          {/* Talaba ma'lumotlari paneli */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-indigo-100 transform transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center mb-6">
              <div className="bg-indigo-100 p-3 rounded-xl mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Talaba Ma'lumotlari</h2>
            </div>
            
            {selectedStudent ? (
              <div className="space-y-6">
                {/* Asosiy ma'lumotlar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-4 border border-indigo-100">
                    <p className="text-sm text-indigo-600 font-medium">F.I.Sh</p>
                    <p className="text-lg font-semibold mt-1">{selectedStudent.fullName}</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-4 border border-indigo-100">
                    <p className="text-sm text-indigo-600 font-medium">Login</p>
                    <p className="text-lg font-semibold mt-1">{selectedStudent.login}</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-4 border border-indigo-100">
                    <p className="text-sm text-indigo-600 font-medium">Status</p>
                    <div className="mt-1">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium 
                        ${selectedStudent.status === 'removed'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-green-100 text-green-700'
                        }`}>
                        {selectedStudent.status === 'removed' ? 'Safdan chiqarilgan' : 'Faol'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Qo'shimcha ma'lumotlar */}
                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Batafsil ma'lumot</h3>
                  <div className="space-y-3">
                    <div className="flex">
                      <span className="text-gray-600 w-32 flex-shrink-0">Manzil:</span>
                      <span className="font-medium">{selectedStudent.address || 'Mavjud emas'}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-600 w-32 flex-shrink-0">Telefon:</span>
                      <span className="font-medium">{selectedStudent.phone || 'Mavjud emas'}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-600 w-32 flex-shrink-0">Maktabi:</span>
                      <span className="font-medium">{selectedStudent.old_school || 'Mavjud emas'}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-600 w-32 flex-shrink-0">Sinfi:</span>
                      <span className="font-medium">{selectedStudent.old_class || 'Mavjud emas'}</span>
                    </div>
                  </div>
                </div>
                
                {/* Guruhlar */}
                {selectedStudent.groups?.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-5">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Guruhlar</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedStudent.groups.map((group, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-xl border-2 ${
                            group.type === 'main' 
                              ? 'border-indigo-200 bg-indigo-50' 
                              : 'border-green-200 bg-green-50'
                          } transition hover:shadow-md`}
                        >
                          <div className="flex items-start">
                            <div className={`mr-3 mt-1 ${
                              group.type === 'main' 
                                ? 'text-indigo-500' 
                                : 'text-green-500'
                            }`}>
                              {group.type === 'main' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            <div>
                              <p className="text-xs mb-1">
                                {group.type === 'main' ? 'Asosiy guruh' : 'Qoʻshimcha guruh'}
                              </p>
                              <p className="font-medium">
                                {group.group?.groupName || 'Nomaʼlum guruh'}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h3 className="text-xl font-medium text-gray-500 mb-2">Talaba tanlanmagan</h3>
                <p className="text-gray-400 max-w-md">Talabalar ro'yxatidan birontasini tanlang va uning ma'lumotlari shu yerda ko'rinadi</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentStatusManager
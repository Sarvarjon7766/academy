import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiBook, FiUser, FiUsers, FiDollarSign, FiCalendar, FiSave, FiCheck } from 'react-icons/fi';

const MAX_SUBJECTS = 3;

const AdditionalSubjectUpdate = ({ student, onSuccess }) => {
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(
    Array(MAX_SUBJECTS).fill().map(() => ({
      subject: null,
      teacher: null,
      group: null,
      teachers: [],
      groups: [],
      price: ''
    }))
  );
  const [sundayRegistration, setSundayRegistration] = useState(false);
  const studentId = student._id;

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        // Fetch subjects
        const subjectRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/subject/getAll`);
        const allowed = ["Matematika", "Tarix", "Ona tili"];
        const filtered = subjectRes.data.subject.filter(s => allowed.includes(s.subjectName));
        setSubjects(filtered);

        // Fetch student's current subjects
        const studentRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/student/additional-subject/${studentId}`);
        if (studentRes.data.success && Array.isArray(studentRes.data.additionalSub)) {
          const additionalSub = studentRes.data.additionalSub;
          const updatedForm = await Promise.all(
            additionalSub.slice(0, MAX_SUBJECTS).map(async (sub) => {
              let teachers = [];
              let groups = [];
              try {
                const tRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/teacher/subject/${sub._id}`);
                teachers = tRes.data.teachers || [];
                const gRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/group/groups/${sub.teacher._id}/${sub._id}`);
                groups = gRes.data.groups || [];
              } catch (err) {
                console.error("Teacher or group fetch error", err);
              }
              return {
                subject: {
                  _id: sub._id,
                  subjectName: sub.subjectName,
                  additionalPrice: sub.additionalPrice
                },
                teacher: sub.teacher,
                group: sub.group,
                teachers,
                groups,
                price: sub.price || sub.additionalPrice || ''
              }
            })
          );

          while (updatedForm.length < MAX_SUBJECTS) {
            updatedForm.push({
              subject: null,
              teacher: null,
              group: null,
              teachers: [],
              groups: [],
              price: ''
            });
          }
          setFormData(updatedForm);
        }
      } catch (err) {
        console.error(err);
        setError("Ma'lumotlarni yuklashda xatolik yuz berdi.");
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, [studentId]);

  const handleChange = async (index, type, value) => {
    const newForm = [...formData];
    newForm[index][type] = value;

    try {
      if (type === "subject") {
        newForm[index].teacher = null;
        newForm[index].group = null;
        newForm[index].price = value?.additionalPrice || '';
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/teacher/subject/${value._id}`);
        newForm[index].teachers = res.data.teachers || [];
        newForm[index].groups = [];
      }
      if (type === "teacher") {
        newForm[index].group = null;
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/group/groups/${value._id}/${newForm[index].subject._id}`);
        newForm[index].groups = res.data.groups || [];
      }
    } catch (err) {
      setError("Ma'lumotlarni yuklashda xatolik.");
      console.error(err);
    }

    setFormData(newForm);
  };

  const handlePriceChange = (index, value) => {
    const newForm = [...formData];
    newForm[index].price = value;
    setFormData(newForm);
  };

  const handleSubmit = async () => {
    const valid = formData
      .filter(f => f.subject && f.teacher && f.group)
      .map(f => ({
        subjectId: f.subject._id,
        teacherId: f.teacher._id,
        groupId: f.group._id,
        price: Number(f.price) || 0
      }));

    if (valid.length === 0 && !sundayRegistration) {
      setError("Kamida bitta fan, o'qituvchi va guruh tanlang yoki Yakshanba uchun belgilang.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      const payload = sundayRegistration
        ? { sunday: true }
        : { subjects: valid, sunday: false }

      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/student/update-addition/${studentId}`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      
      if (res.data.success) {
        setSuccess(true);
        if (onSuccess) onSuccess();
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      setError("Yuborishda xatolik yuz berdi.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSubjectBlock = (index) => {
    const entry = formData[index];
    return (
      <div key={index} className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-2xl border border-purple-200 shadow-sm">
        <div className="flex items-center mb-4">
          <div className="bg-purple-100 p-2 rounded-lg mr-3">
            <FiBook className="text-purple-600 text-xl" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Fan {index + 1}</h3>
        </div>

        <div className="space-y-4">
          {/* Fan tanlash */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FiBook className="mr-2 text-purple-500" />
              Fan tanlang
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white"
              value={entry.subject?._id || ""}
              onChange={e => {
                const sub = subjects.find(s => s._id === e.target.value);
                handleChange(index, "subject", sub || null);
              }}
            >
              <option value="">Fan tanlang</option>
              {subjects
                .filter(sub => !formData.some((f, i) => i !== index && f.subject?._id === sub._id))
                .map(sub => (
                  <option key={sub._id} value={sub._id}>{sub.subjectName}</option>
                ))}
            </select>
          </div>

          {/* O'qituvchi tanlash */}
          {entry.teachers.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FiUser className="mr-2 text-blue-500" />
                O'qituvchi tanlang
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white"
                value={entry.teacher?._id || ""}
                onChange={e => {
                  const teacher = entry.teachers.find(t => t._id === e.target.value);
                  handleChange(index, "teacher", teacher || null);
                }}
              >
                <option value="">O'qituvchi tanlang</option>
                {entry.teachers.map(t => (
                  <option key={t._id} value={t._id}>{t.fullName}</option>
                ))}
              </select>
            </div>
          )}

          {/* Guruh tanlash */}
          {entry.groups.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FiUsers className="mr-2 text-green-500" />
                Guruhni tanlang
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white"
                value={entry.group?._id || ""}
                onChange={e => {
                  const group = entry.groups.find(g => g._id === e.target.value);
                  handleChange(index, "group", group || null);
                }}
              >
                <option value="">Guruh tanlang</option>
                {entry.groups.map(g => (
                  <option key={g._id} value={g._id}>{g.groupName}</option>
                ))}
              </select>
            </div>
          )}

          {/* Narxni kiritish */}
          {entry.group && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FiDollarSign className="mr-2 text-yellow-500" />
                Qo'shimcha narx
              </label>
              <input
                type="number"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                value={entry.price}
                onChange={e => handlePriceChange(index, e.target.value)}
                placeholder="Narxni kiriting"
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center">
          <FiCheck className="mr-2 text-xl" />
          <span>Ma'lumotlar muvaffaqiyatli yangilandi!</span>
        </div>
      )}

      {/* Fan bloklari */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {formData.map((_, i) => renderSubjectBlock(i))}
      </div>

      {/* Yakshanba uchun qism */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-2xl border border-yellow-200 mb-8">
        <div className="flex items-center">
          <div className="bg-yellow-100 p-2 rounded-lg mr-3">
            <FiCalendar className="text-yellow-600 text-xl" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Yakshanba uchun ro'yxat</h3>
        </div>
        
        <p className="text-gray-600 mt-2 mb-4">
          Agar talaba faqat yakshanba kunlari o'qiydigan bo'lsa, bu qismni belgilang
        </p>
        
        <div className="flex items-center">
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={sundayRegistration} 
              onChange={(e) => setSundayRegistration(e.target.checked)} 
            />
            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-600"></div>
            <span className="ms-3 text-sm font-medium text-gray-700">
              {sundayRegistration ? "Faollashtirilgan" : "Faollashtirilmagan"}
            </span>
          </label>
        </div>
      </div>

      {/* Tugmalar */}
      <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`px-8 py-3 rounded-xl text-white font-medium flex items-center transition ${
            isSubmitting 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
          }`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Yangilanmoqda...
            </>
          ) : (
            <>
              <FiSave className="mr-2" />
              Yangilashni saqlash
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AdditionalSubjectUpdate;
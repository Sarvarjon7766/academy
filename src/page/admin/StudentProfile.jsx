import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";

const StudentProfile = ({ students }) => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [additionalSubjects, setAdditionalSubjects] = useState([]);
  const [formData, setFormData] = useState({
    login: "",
    password: "",
    mainSubject1: "",
    mainSubject2: "",
    additionalSubjects: [],
    photo: null,
    monthly_payment: "",
    paid_sum: "",
  });
  const [monthly, setMonthly] = useState(0);
  const [inputValue, setInputValue] = useState("");

  const fetchAdditionalSubjects = async () => {
    try {
      const [subjectsRes, hostelRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/addsubject/getAll`),
        axios.get(`${import.meta.env.VITE_API_URL}/api/hostel/getAll`),
      ]);

      let combinedData = [
        ...(subjectsRes.data.subjects || []), 
        ...(hostelRes.data.hostels || []),
      ];

      combinedData = combinedData.map(item => {
        if (item.subjectName) {
          return { name: item.subjectName, price: item.subjectPrice };
        } else if (item.hostelName) {
          return { name: item.hostelName, price: item.hostelPrice };
        }
        return {};
      });

      setAdditionalSubjects(combinedData);
    } catch (error) {
      console.error("Error fetching additional subjects:", error);
    }
  };

  useEffect(() => {
    fetchAdditionalSubjects();
  }, []);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/subject/getAll`);
        setSubjects(res.data.subject || []);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };
    fetchSubjects();
  }, []);

  const handleStudentChange = (selectedOption) => {
    setInputValue(selectedOption?.label || ""); // Update input value
    if (!selectedOption) {
      setSelectedStudent(null);
      return;
    }

    const student = students.find((s) => s._id === selectedOption.value);
    if (student) {
      setSelectedStudent(student);
      setFormData({
        login: student.login || "",
        password: "",
        monthly_payment: student.monthly_payment || "",
        paid_sum: student.paid_sum || "",
        mainSubject1: "",
        mainSubject2: "",
        additionalSubjects: [],
        photo: null,
      });
      setMonthly(0);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => {
      const updatedData = {
        ...prev,
        [name]: type === "file" ? files[0] : value,
      };

      if (name === "mainSubject1" || name === "mainSubject2") {
        // Reset the monthly calculation and add only the selected subject's price
        const subjectField = name === "mainSubject1" ? "mainSubject1" : "mainSubject2";
        const newMonthly = monthly - (subjects.find(subject => subject.subjectName === prev[subjectField])?.subjectPrice || 0);

        // Add the new selected subject's price
        const selectedSubject = subjects.find((subject) => subject.subjectName === value);
        const finalMonthly = newMonthly + (selectedSubject ? selectedSubject.subjectPrice : 0);
        
        setMonthly(finalMonthly);
      }

      return updatedData;
    });
  };

  const handleCheckboxChange = (e, subject) => {
    const isChecked = e.target.checked;
    setFormData((prev) => {
      const updatedSubjects = isChecked
        ? [...prev.additionalSubjects, subject.name]
        : prev.additionalSubjects.filter((subj) => subj !== subject.name);
      return { ...prev, additionalSubjects: updatedSubjects };
    });

    // Update the monthly payment based on selected additional subjects
    setMonthly((prev) => {
      const priceAdjustment = isChecked ? subject.price : -subject.price;
      return prev + priceAdjustment;
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-indigo-700">Studentni tanlang</h3>
        <Select
          options={students.map((s) => ({ value: s._id, label: s.fullName }))}
          onChange={handleStudentChange}
          placeholder="Talabani tanlang"
          className="mt-2"
        />

        {selectedStudent && (
          <div className="mt-4 p-4 border rounded-lg shadow">
            {selectedStudent.photo && (
              <div className="mt-2">
                <img
                  src={`${import.meta.env.VITE_API_URL}/${selectedStudent.photo}`}
                  alt="Student Photo"
                  className="w-32 h-32 object-cover rounded-full"
                />
              </div>
            )}
            <h3 className="text-lg font-bold text-blue-600">{selectedStudent.fullName}</h3>
            <p className="text-gray-600">Telefon: {selectedStudent.phone}</p>
            <p className="text-gray-600">Tug'ilgan sana: {new Date(selectedStudent.date_of_birth).toLocaleDateString()}</p>
            <p className="text-gray-600">Jins: {selectedStudent.gender}</p>
            <p className="text-gray-600">Pasport raqami: {selectedStudent.passport_number}</p>
            <p className="text-gray-600">JSHR: {selectedStudent.jshr}</p>
            <p className="text-gray-600">Manzil: {selectedStudent.address}</p>
            <p className="text-gray-600">Login: {selectedStudent.login}</p>
            
          </div>
        )}
      </div>

      {inputValue && selectedStudent && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-indigo-700 mb-4">Student ma'lumotlarini kiriting</h3>
          <input
            type="text"
            name="login"
            value={formData.login}
            placeholder="Login"
            onChange={handleChange}
            className="w-full outline-indigo-700 p-2 border rounded mb-2"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            placeholder="Parol"
            onChange={handleChange}
            className="w-full outline-indigo-700 p-2 border rounded mb-4"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {["mainSubject1", "mainSubject2"].map((field, idx) => (
              <div key={idx}>
                <label className="block text-lg text-indigo-700 font-semibold">Asosiy fan {idx + 1}</label>
                <select
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full p-2 outline-indigo-700 border rounded mt-2"
                >
                  <option value="">Fanni tanlang</option>
                  {subjects.map((subject, index) => (
                    <option key={index} value={subject.subjectName}>
                      {subject.subjectName}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <label className="block text-lg text-indigo-700 font-semibold">Qo'shimcha fanlar</label>
            <div className="flex gap-4 flex-wrap">
              {additionalSubjects.map((subject, index) => (
                <label key={index} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.additionalSubjects.includes(subject.name)}
                    onChange={(e) => handleCheckboxChange(e, subject)}
                  />
                  {subject.name}
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {["monthly_payment", "paid_sum"].map((field, idx) => (
              <div key={idx}>
                <label className="block text-lg text-indigo-700 font-semibold">
                  {field === "monthly_payment" ? "Oylik to'lov" : "Hozirgi to'lovi"}
                </label>
                <input
                  type="number"
                  name={field}
                  value={formData[field]}
                  placeholder="Qiymat kiriting"
                  onChange={handleChange}
                  className="w-full outline-indigo-700 p-2 border rounded"
                />
              </div>
            ))}
          </div>

          <div className="text-center mt-4">
            <p className="text-lg text-indigo-700 font-semibold">Hisob: {monthly.toLocaleString("ru-RU")} so'm</p>
            <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded mt-4">
              Yuborish
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;

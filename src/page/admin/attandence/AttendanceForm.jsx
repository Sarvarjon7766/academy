import React, { useState } from "react";

const AttendanceForm = ({ markAttendance }) => {
  const [form, setForm] = useState({ student: "", subject: "", day: "", status: "Kelgan" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(form).some((val) => val === "")) {
      alert("Iltimos, barcha maydonlarni to‘ldiring!");
      return;
    }
    markAttendance(form);
    setForm({ student: "", subject: "", day: "", status: "Kelgan" });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <h2 className="text-lg font-bold mb-2">📌 Davomatni belgilash</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <input type="text" name="student" placeholder="Talaba ismi" value={form.student} onChange={handleChange} className="border p-2 rounded" />
        <input type="text" name="subject" placeholder="Fan nomi" value={form.subject} onChange={handleChange} className="border p-2 rounded" />
        <input type="text" name="day" placeholder="Kun (Dushanba, Seshanba...)" value={form.day} onChange={handleChange} className="border p-2 rounded" />
        <select name="status" value={form.status} onChange={handleChange} className="border p-2 rounded">
          <option value="Kelgan">✅ Kelgan</option>
          <option value="Kelmagan">❌ Kelmagan</option>
        </select>
        <button type="submit" className="col-span-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-700">Saqlash</button>
      </form>
    </div>
  );
};

export default AttendanceForm;

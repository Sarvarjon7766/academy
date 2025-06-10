import React, { useState } from "react";

const TimetableForm = ({ addLesson }) => {
  const [form, setForm] = useState({ subject: "", teacher: "", group: "", day: "", time: "", room: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(form).some((val) => val === "")) {
      alert("Iltimos, barcha maydonlarni to‘ldiring!");
      return;
    }
    addLesson(form);
    setForm({ subject: "", teacher: "", group: "", day: "", time: "", room: "" });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <h2 className="text-lg font-bold mb-2">➕ Yangi Dars Qo‘shish</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <input type="text" name="subject" placeholder="Fan nomi" value={form.subject} onChange={handleChange} className="border p-2 rounded" />
        <input type="text" name="teacher" placeholder="O‘qituvchi" value={form.teacher} onChange={handleChange} className="border p-2 rounded" />
        <input type="text" name="group" placeholder="Guruh" value={form.group} onChange={handleChange} className="border p-2 rounded" />
        <input type="text" name="day" placeholder="Kun (Dushanba, Seshanba...)" value={form.day} onChange={handleChange} className="border p-2 rounded" />
        <input type="text" name="time" placeholder="Vaqt (10:00 - 11:30)" value={form.time} onChange={handleChange} className="border p-2 rounded" />
        <input type="text" name="room" placeholder="Xona raqami" value={form.room} onChange={handleChange} className="border p-2 rounded" />
        <button type="submit" className="col-span-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-700">Saqlash</button>
      </form>
    </div>
  );
};

export default TimetableForm;

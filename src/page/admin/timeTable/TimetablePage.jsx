import React, { useState } from "react";
import TimetableForm from "./TimetableForm";
import TimetableControl from "./TimetableControl";

const TimetablePage = () => {
  const [lessons, setLessons] = useState([
    { id: 1, subject: "Matematika", teacher: "Hasan Aliyev", group: "CS-101", day: "Dushanba", time: "10:00 - 11:30", room: "202" },
    { id: 2, subject: "Fizika", teacher: "Asadbek Raxmonov", group: "CS-102", day: "Seshanba", time: "12:00 - 13:30", room: "305" }
  ]);

  const addLesson = (newLesson) => {
    setLessons([...lessons, { id: lessons.length + 1, ...newLesson }]);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📅 Dars Jadvali</h1>
      <TimetableForm addLesson={addLesson} />
      <TimetableControl lessons={lessons} />
      <div className="mt-6">
        {lessons.map((lesson) => (
          <div key={lesson.id} className="bg-gray-100 p-4 rounded-lg shadow-md mb-2">
            <h2 className="font-bold">{lesson.subject} - {lesson.teacher}</h2>
            <p>{lesson.day}, {lesson.time} | Xona: {lesson.room} | Guruh: {lesson.group}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimetablePage;

import React from "react";

const TimetableControl = ({ lessons }) => {
  const checkRoomAvailability = (room, time) => {
    return lessons.some((lesson) => lesson.room === room && lesson.time === time);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <h2 className="text-lg font-bold mb-2">🛠 Xonalar Bandligi</h2>
      {lessons.map((lesson) => (
        <div key={lesson.id} className={`p-2 rounded ${checkRoomAvailability(lesson.room, lesson.time) ? "bg-red-100" : "bg-green-100"} mb-1`}>
          {lesson.room} - {lesson.time} ({lesson.subject}) {checkRoomAvailability(lesson.room, lesson.time) ? "❌ Band" : "✅ Bo‘sh"}
        </div>
      ))}
    </div>
  );
};

export default TimetableControl;

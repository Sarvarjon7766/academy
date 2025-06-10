import React from "react";

const AttendanceTable = ({ attendance }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-6">
      <h2 className="text-lg font-bold mb-4">📋 Davomat Ro‘yxati</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2 text-sm sm:text-base">№</th>
              <th className="border p-2 text-sm sm:text-base">Talaba</th>
              <th className="border p-2 text-sm sm:text-base">Fan</th>
              <th className="border p-2 text-sm sm:text-base">Kun</th>
              <th className="border p-2 text-sm sm:text-base">Holat</th>
            </tr>
          </thead>
          <tbody>
            {attendance.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-2 text-sm sm:text-base">
                  📭 Hozircha davomot yo‘q
                </td>
                <hr />
                <hr />
                <hr />
              </tr>
            ) : (
              attendance.map((entry, index) => (
                <tr
                  key={entry.id}
                  className={entry.status === "Kelmagan" ? "bg-red-100" : "bg-green-100"}
                >
                  <td className="border p-2 text-sm sm:text-base">{index + 1}</td>
                  <td className="border p-2 text-sm sm:text-base">{entry.student}</td>
                  <td className="border p-2 text-sm sm:text-base">{entry.subject}</td>
                  <td className="border p-2 text-sm sm:text-base">{entry.day}</td>
                  <td className="border p-2 text-sm sm:text-base">
                    {entry.status === "Kelgan" ? "✅" : "❌"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceTable;

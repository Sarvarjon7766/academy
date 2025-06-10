



import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import AttendanceTable from "./AttendanceTable";

const AttendancePage = () => {
  const [attendance, setAttendance] = useState([
    { id: 1, student: "Hasan Aliyev", subject: "Matematika", group: "CS-101", day: "2025-02-06", status: "Kelgan" },
    { id: 2, student: "Nodira Raxmonova", subject: "Fizika", group: "CS-101", day: "2025-02-07", status: "Kelmagan" },
    { id: 3, student: "Asadbek Raxmonov", subject: "Fizika", group: "ax-20-07", day: "2025-02-08", status: "Kelmagan" },
    { id: 44, student: "Hoshim Bekmurodov", subject: "Ingliz Tili", group: "Matematika-Fizika", day: "2025-02-09", status: "Kelgan" },
    { id: 43, student: "Bekzod Bekmurodov", subject: "Tarix", group: "Matematika-Fizika", day: "2025-02-09", status: "Kelgan" },
    { id: 42, student: "javihir Bekmurodov", subject: "Biologiya", group: "Matematika-Fizika", day: "2025-02-09", status: "Kelgan" },
    { id: 45, student: "olmos Bekmurodov", subject: "Rus tili", group: "Matematika-Fizika", day: "2025-02-09", status: "Kelgan" },
    { id: 46, student: "Damir Bekmurodov", subject: "Kimyo", group: "Matematika-Fizika", day: "2025-02-09", status: "Kelgan" },
    { id: 47, student: "Asad Bekmurodov", subject: "Huquq", group: "Matematika-Fizika", day: "2025-02-09", status: "Kelgan" },
    { id: 48, student: "Javlon ", subject: "Huquq", group: "Matematika-Fizika", day: "2025-02-09", status: "Kelgan" },
    { id: 4, student: "Bekmurodov", subject: "tarix", group: "Matematika-Fizika", day: "2025-02-09", status: "Kelgan" },
    { id: 5, student: "Yulduz Tursunova", subject: "Kimyo", group: "Fizika-Matematika", day: "2025-02-10", status: "Kelmagan" },
    { id: 6, student: "Akbarbek Abdullayev", subject: "Fizika", group: "Ona tili-Tarix", day: "2025-02-11", status: "Kelmagan" },
    { id: 7, student: "Zamira Mirzayeva", subject: "Biologiya", group: "Kimyo-Biologiya", day: "2025-02-12", status: "Kelgan" },
    { id: 8, student: "Ravshanbek Iskandarov", subject: "Matematika", group: "Kimyo-Matematika", day: "2025-02-13", status: "Kelmagan" },
    { id: 9, student: "Aziza Kamilova", subject: "Ingliz Tili", group: "Ona tili-Rustili", day: "2025-02-14", status: "Kelgan" },
    { id: 10, student: "Zokirbek Akramov", subject: "Geografiya", group: "Matematika-Ingliz tili", day: "2025-02-15", status: "Kelmagan" },
    { id: 11, student: "Farida Shukurova", subject: "Ona Tili", group: "CS-102", day: "2025-02-16", status: "Kelgan" },
    { id: 12, student: "Mansur Zayniddinov", subject: "Kimyo", group: "CS-102", day: "2025-02-17", status: "Kelmagan" },
    { id: 13, student: "Shahzoda Kamilova", subject: "Fizika", group: "CS-102", day: "2025-02-18", status: "Kelgan" },
    { id: 14, student: "Nodirbek Abduvokhidov", subject: "Ingliz Tili", group: "CS-102", day: "2025-02-19", status: "Kelmagan" },
    { id: 15, student: "Jamila Tashmuhammedova", subject: "Matematika", group: "CS-102", day: "2025-02-20", status: "Kelgan" },
    { id: 16, student: "Samandar Yunusov", subject: "Biologiya", group: "CS-103", day: "2025-02-21", status: "Kelmagan" },
    { id: 17, student: "Gulbahor Mahmudova", subject: "Kimyo", group: "CS-103", day: "2025-02-22", status: "Kelgan" },
    { id: 18, student: "Otabek Xamdamov", subject: "Fizika", group: "CS-104", day: "2025-02-23", status: "Kelmagan" },
    { id: 19, student: "Dilnoza G'ulomova", subject: "Matematika", group: "CS-104", day: "2025-02-24", status: "Kelgan" },
    { id: 20, student: "Anvarbek Toshpo'latov", subject: "Ingliz Tili", group: "CS-105", day: "2025-02-25", status: "Kelmagan" },
    { id: 21, student: "Sardorbek Karimov", subject: "Geografiya", group: "CS-105", day: "2025-02-26", status: "Kelgan" },
    { id: 22, student: "Murodilla Mirzoev", subject: "Matematika", group: "CS-106", day: "2025-02-27", status: "Kelmagan" },
    { id: 23, student: "Amina Gulomova", subject: "Fizika", group: "CS-106", day: "2025-02-28", status: "Kelgan" },
    { id: 24, student: "Yodgorbek Qodirov", subject: "Ingliz Tili", group: "CS-107", day: "2025-03-01", status: "Kelmagan" },
    { id: 25, student: "Ravshanbek Tashkentov", subject: "Biologiya", group: "CS-107", day: "2025-03-02", status: "Kelgan" },
    { id: 26, student: "Zarina Xudoyberganova", subject: "Kimyo", group: "CS-108", day: "2025-03-03", status: "Kelmagan" },
    { id: 27, student: "Lola Mirzaeva", subject: "Matematika", group: "CS-108", day: "2025-03-04", status: "Kelgan" },
    { id: 28, student: "Suxrobbek Ergashev", subject: "Fizika", group: "CS-109", day: "2025-03-05", status: "Kelmagan" },
    { id: 29, student: "Bekzodbek Tursunov", subject: "Geografiya", group: "CS-109", day: "2025-03-06", status: "Kelgan" },
    { id: 30, student: "Shohruhbek Yuldashev", subject: "Ingliz Tili", group: "CS-110", day: "2025-03-07", status: "Kelmagan" }
  ]);

  const today = new Date().toISOString().split("T")[0]; // Bugungi sana

  // Filtrlar
  const [filterText, setFilterText] = useState(""); // Ism, guruh, sana bo'yicha filtr
  const [filterSubject, setFilterSubject] = useState(""); // Fan bo'yicha filtr
  const [showTodayOnly, setShowTodayOnly] = useState(false); // Bugungi davomatlar uchun filtr
  const [showAbsentsOnly, setShowAbsentsOnly] = useState(false); // Kelmaganlar uchun filtr

  useEffect(() => {
    const sortedAttendance = [...attendance].sort((a, b) => new Date(a.day) - new Date(b.day));
    setAttendance(sortedAttendance);
  }, []);

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
  };

  const handleSubjectFilterChange = (e) => {
    setFilterSubject(e.target.value);
  };

  // Filtrlash funksiyasi
  const filteredAttendance = attendance.filter((entry) => {
    const lowerCaseFilterText = filterText.toLowerCase();
    const lowerCaseFilterSubject = filterSubject ? filterSubject.toLowerCase() : ""; // filterSubject bo'sh emasligini tekshirish
    const nameMatch = entry.student.toLowerCase().includes(lowerCaseFilterText); // Ismga mos keladimi?
    const groupMatch = entry.group.toLowerCase().includes(lowerCaseFilterText); // Guruhga mos keladimi?
    const dateMatch = entry.day.includes(lowerCaseFilterText); // Sana bo'yicha mos keladimi?
    const subjectMatch = entry.subject.toLowerCase().includes(lowerCaseFilterSubject); // Fan bo'yicha mos keladimi?
  
    // Bugungi davomatlarni filtrlash
    const todayMatch = showTodayOnly ? entry.day === today : true;
  
    // Kelmaganlarni filtrlash
    const absentMatch = showAbsentsOnly ? entry.status === "Kelmagan" : true;
  
    return (nameMatch || groupMatch || dateMatch) && subjectMatch && todayMatch && absentMatch;
  });
  

  // Excelga eksport qilish funksiyasi
  const handleExportToExcel = () => {
    const excelData = filteredAttendance.map((entry, index) => ({
      "Tartib": index + 1,
      "Talaba": entry.student,
      "Fan": entry.subject,
      "Guruh": entry.group,
      "Kun": entry.day,
      "Holat": entry.status === "Kelgan" ? "✅ Kelgan" : "❌ Kelmagan"
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Davomat");

    // Excel faylini eksport qilish
    XLSX.writeFile(wb, `attendance_${today}.xlsx`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl text-center font-bold mb-4">📊 Talaba Davomati</h1>

      {/* Filtrlar */}
      <div className="mb-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <input
          type="text"
          value={filterText}
          onChange={handleFilterChange}
          placeholder="Ism, Guruh, Sana"
          className="px-4 py-2 border rounded-md w-full sm:w-1/3"
        />

        <input
          type="text"
          value={filterSubject}
          onChange={handleSubjectFilterChange}
          placeholder="Fan bo'yicha filtr"
          className="px-4 py-2 border rounded-md w-full sm:w-1/3"
        />
      </div>

      {/* Filtr tugmalari */}
      <div className="mb-6 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
        {/* Bugungi davomatlar */}
        <button
          onClick={() => setShowTodayOnly(prev => !prev)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md w-full sm:w-auto"
        >
          {showTodayOnly ? "Barcha Davomatlar" : "Bugungi Davomatlar"}
        </button>

        {/* Kelmaganlar */}
        <button
          onClick={() => setShowAbsentsOnly(prev => !prev)}
          className="px-4 py-2 bg-red-500 text-white rounded-md w-full sm:w-auto"
        >
          {showAbsentsOnly ? "Barcha Talabalar" : "Kelmaganlar"}
        </button>

        {/* Excelga eksport qilish */}
        <button
          onClick={handleExportToExcel}
          className="px-4 py-2 bg-green-500 text-white rounded-md w-full sm:w-auto"
        >
          📥 Excelga Yuklash
        </button>
      </div>

      {/* Filterlangan davomatlarni ko'rsatish */}
      <AttendanceTable attendance={filteredAttendance} />
    </div>
  );
};

export default AttendancePage;

import React, { useState, useEffect } from "react";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCounts, setFilterCounts] = useState({ today: 0, yesterday: 0, week: 0, month: 0 });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/application/getAll`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const sorted = data.applications.sort((a, b) => new Date(b.sent_date) - new Date(a.sent_date));
          setApplications(sorted);
          updateFilterCounts(sorted);
          filterApplications(sorted, "all");
        }
      });
  }, []);

  const toggleContacted = async (id, status) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/application/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !status }),
      });
      const data = await res.json();
      if (data.success) {
        const updated = applications.map((app) => app._id === id ? { ...app, isActive: !status } : app);
        setApplications(updated);
        filterApplications(updated, filter);
        updateFilterCounts(updated);
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const filterApplications = (apps, type) => {
    const now = new Date();
    const oneDay = 86400000;
    const weekAgo = new Date(now - 7 * oneDay);
    const monthAgo = new Date();
    monthAgo.setMonth(now.getMonth() - 1);

    let result = [...apps];
    if (searchTerm) {
      result = result.filter((app) => app.fullName.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (type !== "all") {
      result = result.filter((app) => {
        const d = new Date(app.sent_date);
        if (type === "today") return d.toDateString() === now.toDateString();
        if (type === "yesterday") return d.toDateString() === new Date(now - oneDay).toDateString();
        if (type === "week") return d >= weekAgo;
        if (type === "month") return d >= monthAgo;
        return true;
      });
    }
    result.sort((a, b) => new Date(b.sent_date) - new Date(a.sent_date));
    setFilteredApps(result);
  };

  const updateFilterCounts = (apps) => {
    const now = new Date();
    const oneDay = 86400000;
    const counts = { today: 0, yesterday: 0, week: 0, month: 0 };

    apps.forEach((app) => {
      const d = new Date(app.sent_date);
      if (d.toDateString() === now.toDateString()) counts.today++;
      if (d.toDateString() === new Date(now - oneDay).toDateString()) counts.yesterday++;
      if (d >= new Date(now - 7 * oneDay)) counts.week++;
      if (d >= new Date(now.setMonth(now.getMonth() - 1))) counts.month++;
    });
    setFilterCounts(counts);
  };

  useEffect(() => {
    filterApplications(applications, filter);
  }, [filter, applications, searchTerm]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-center text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-10">
        Murojaatlar Ro‘yxati
      </h1>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Ism bo‘yicha qidirish..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3 px-4 py-3 border border-gray-300 rounded-xl shadow-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {[
          { label: "Barcha", val: "all", count: applications.length },
          { label: "Bugun", val: "today", count: filterCounts.today },
          { label: "Kecha", val: "yesterday", count: filterCounts.yesterday },
          { label: "Hafta", val: "week", count: filterCounts.week },
          { label: "Oy", val: "month", count: filterCounts.month },
        ].map((btn) => (
          <button
            key={btn.val}
            onClick={() => setFilter(btn.val)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition shadow-sm ${
              filter === btn.val
                ? "bg-indigo-600 text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            {btn.label} ({btn.count})
          </button>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 space-y-4">
        {filteredApps.length === 0 ? (
          <p className="text-center text-gray-500">Hozircha hech qanday murojaat yo‘q.</p>
        ) : (
          filteredApps.map((app) => (
            <div
              key={app._id}
              className="p-5 bg-gradient-to-br from-indigo-50 to-white rounded-xl border border-indigo-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center"
            >
              <div className="flex-1 space-y-1">
                <h2 className="text-xl font-semibold text-indigo-800">{app.fullName}</h2>
                <p className="text-sm text-gray-600"><strong>Telefon:</strong> {app.phone}</p>
                <p className="text-sm text-gray-700"><strong>Xabar:</strong> {app.message}</p>
                <p className="text-xs text-gray-400"><strong>Sana:</strong> {new Date(app.sent_date).toLocaleDateString("uz-UZ")}</p>
              </div>
              <button
                onClick={() => toggleContacted(app._id, app.isActive)}
                className={`mt-4 sm:mt-0 sm:ml-6 px-5 py-2 flex items-center gap-2 rounded-full font-semibold transition duration-200 ${
                  app.isActive
                    ? "bg-emerald-500 text-white hover:bg-emerald-600"
                    : "bg-rose-500 text-white hover:bg-rose-600"
                }`}
              >
                {app.isActive ? (
                  <>
                    <AiOutlineCheckCircle className="text-lg" /> Qabul qilindi
                  </>
                ) : (
                  <>
                    <IoMdClose className="text-lg" /> Javob berilmagan
                  </>
                )}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Applications;
import React, { useState, useEffect } from "react";
import { AiOutlineCheckCircle, AiOutlineSearch } from "react-icons/ai";
import { IoMdClose, IoMdCalendar } from "react-icons/io";
import { FaPhoneAlt, FaUserAlt, FaRegCommentDots } from "react-icons/fa";
import { BsFilter } from "react-icons/bs";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCounts, setFilterCounts] = useState({ today: 0, yesterday: 0, week: 0, month: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/api/application/getAll`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const sorted = data.applications.sort((a, b) => new Date(b.sent_date) - new Date(a.sent_date));
          setApplications(sorted);
          updateFilterCounts(sorted);
          filterApplications(sorted, "all");
        }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
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
      result = result.filter((app) => 
        app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.phone.includes(searchTerm)
      );
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("uz-UZ", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-3 rounded-full mb-4">
          <FaRegCommentDots className="text-xl" />
        </div>
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-700 mb-2">
          Murojaatlar Boshqaruvi
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Foydalanuvchilardan kelgan murojaatlarni kuzatish va boshqarish
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <AiOutlineSearch className="text-gray-400 text-xl" />
          </div>
          <input
            type="text"
            placeholder="Ism yoki telefon raqam bo‘yicha qidirish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <button 
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden absolute right-3 top-1/2 transform -translate-y-1/2 bg-indigo-100 text-indigo-700 p-2 rounded-lg"
          >
            <BsFilter className="text-lg" />
          </button>
        </div>

        <div className={`${mobileFilterOpen ? "block" : "hidden"} md:block mb-6`}>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: "Barcha", val: "all", count: applications.length },
              { label: "Bugun", val: "today", count: filterCounts.today },
              { label: "Kecha", val: "yesterday", count: filterCounts.yesterday },
              { label: "Hafta", val: "week", count: filterCounts.week },
              { label: "Oy", val: "month", count: filterCounts.month },
            ].map((btn) => (
              <button
                key={btn.val}
                onClick={() => {
                  setFilter(btn.val);
                  setMobileFilterOpen(false);
                }}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition shadow-sm flex items-center gap-2 ${
                  filter === btn.val
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>{btn.label}</span>
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                  {btn.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl shadow-xl border border-indigo-100 overflow-hidden">
        <div className="p-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
        
        <div className="p-6">
          {isLoading ? (
            <div className="py-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
              <p className="text-gray-600">Murojaatlar yuklanmoqda...</p>
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="py-12 text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaRegCommentDots className="text-indigo-600 text-2xl" />
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">Murojaatlar topilmadi</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Tanlangan filtrlarda hech qanday murojaat topilmadi
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApps.map((app) => (
                <div
                  key={app._id}
                  className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="bg-indigo-100 p-3 rounded-xl">
                          <FaUserAlt className="text-indigo-600 text-xl" />
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-indigo-800">{app.fullName}</h2>
                          <div className="flex flex-wrap gap-4 mt-3">
                            <div className="flex items-center text-gray-600">
                              <FaPhoneAlt className="mr-2 text-blue-500" />
                              <span>{app.phone}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <IoMdCalendar className="mr-2 text-purple-500" />
                              <span>{formatDate(app.sent_date)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 pl-2 border-l-2 border-indigo-200">
                        <p className="text-gray-700">
                          <FaRegCommentDots className="inline mr-2 text-indigo-500" />
                          {app.message}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex md:flex-col justify-between gap-2">
                      <button
                        onClick={() => toggleContacted(app._id, app.isActive)}
                        className={`px-4 py-2 flex items-center justify-center gap-2 rounded-xl font-medium transition duration-200 ${
                          app.isActive
                            ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
                            : "bg-gradient-to-r from-rose-500 to-pink-600 text-white"
                        }`}
                      >
                        {app.isActive ? (
                          <>
                            <AiOutlineCheckCircle className="text-lg" /> 
                            <span className="hidden sm:inline">Qabul qilindi</span>
                          </>
                        ) : (
                          <>
                            <IoMdClose className="text-lg" /> 
                            <span className="hidden sm:inline">Javob berilmagan</span>
                          </>
                        )}
                      </button>
                      
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition">
                        Batafsil
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Applications;
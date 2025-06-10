import React, { useState, useEffect } from "react";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCounts, setFilterCounts] = useState({
    today: 0,
    yesterday: 0,
    week: 0,
    month: 0,
  });

  useEffect(() => {
    fetch("http://localhost:4000/api/application/getAll")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const sortedApps = data.applications.sort(
            (a, b) => new Date(b.sent_date) - new Date(a.sent_date)
          );
          setApplications(sortedApps);
          updateFilterCounts(sortedApps);
          filterApplications(sortedApps, "all");
        }
      })
      .catch((error) =>
        console.error("Error fetching applications:", error)
      );
  }, []);

  const toggleContacted = async (id, currentStatus) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/application/update/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isActive: !currentStatus }),
        }
      );
      const data = await response.json();
      if (data.success) {
        const updatedApps = applications.map((app) =>
          app._id === id ? { ...app, isActive: !currentStatus } : app
        );
        setApplications(updatedApps);
        filterApplications(updatedApps, filter);
        updateFilterCounts(updatedApps);
      }
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };

  const filterApplications = (apps, filterType) => {
    const today = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeekAgo = new Date(today.getTime() - 7 * oneDay);
    const oneMonthAgo = new Date(today.setMonth(today.getMonth() - 1));
    let filtered = apps;

    if (searchTerm) {
      filtered = filtered.filter((app) =>
        app.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== "all") {
      filtered = filtered.filter((app) => {
        const appDate = new Date(app.sent_date);
        switch (filterType) {
          case "today":
            return appDate.toDateString() === new Date().toDateString();
          case "yesterday":
            return (
              appDate.toDateString() ===
              new Date(Date.now() - oneDay).toDateString()
            );
          case "week":
            return appDate >= oneWeekAgo;
          case "month":
            return appDate >= oneMonthAgo;
          default:
            return true;
        }
      });
    }

    filtered.sort(
      (a, b) => new Date(b.sent_date) - new Date(a.sent_date)
    );
    setFilteredApps(filtered);
  };

  const updateFilterCounts = (apps) => {
    const counts = { today: 0, yesterday: 0, week: 0, month: 0 };
    apps.forEach((app) => {
      const appDate = new Date(app.sent_date);
      if (appDate.toDateString() === new Date().toDateString())
        counts.today++;
      if (
        appDate.toDateString() ===
        new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()
      )
        counts.yesterday++;
      if (appDate >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
        counts.week++;
      if (
        appDate >=
        new Date(new Date().setMonth(new Date().getMonth() - 1))
      )
        counts.month++;
    });
    setFilterCounts(counts);
  };

  useEffect(() => {
    filterApplications(applications, filter);
  }, [filter, applications, searchTerm]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-center text-4xl font-bold text-indigo-700 mb-8">
        Murojaatlar
      </h1>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Ism bo'yicha qidirish..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            filterApplications(applications, filter);
          }}
          className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3 px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
        />
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-8">
        <FilterButton label="Barcha" value="all" count={applications.length} current={filter} setFilter={setFilter} />
        <FilterButton label="Bugun" value="today" count={filterCounts.today} current={filter} setFilter={setFilter} />
        <FilterButton label="Kecha" value="yesterday" count={filterCounts.yesterday} current={filter} setFilter={setFilter} />
        <FilterButton label="O‘tgan hafta" value="week" count={filterCounts.week} current={filter} setFilter={setFilter} />
        <FilterButton label="O‘tgan oy" value="month" count={filterCounts.month} current={filter} setFilter={setFilter} />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 space-y-4">
        {filteredApps.length === 0 ? (
          <p className="text-center text-gray-500">Murojaatlar topilmadi.</p>
        ) : (
          filteredApps.map((app) => (
            <div
              key={app._id}
              className="p-4 bg-gray-50 rounded-xl border border-gray-300 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center"
            >
              <div className="flex-1 space-y-1">
                <h2 className="text-xl font-semibold text-gray-800">{app.fullName}</h2>
                <p className="text-sm text-gray-600"><strong>Telefon:</strong> {app.phone}</p>
                <p className="text-sm text-gray-700"><strong>Xabar:</strong> {app.message}</p>
                <p className="text-sm text-gray-500"><strong>Sana:</strong> {new Date(app.sent_date).toLocaleDateString("uz-UZ")}</p>
              </div>
              <button
                onClick={() => toggleContacted(app._id, app.isActive)}
                className={`mt-4 sm:mt-0 sm:ml-6 px-4 py-2 flex items-center gap-2 rounded-full font-semibold transition ${
                  app.isActive
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-red-500 text-white hover:bg-red-600"
                }`}
              >
                {app.isActive ? (
                  <>
                    <AiOutlineCheckCircle className="text-lg" />
                    Qabul qilindi
                  </>
                ) : (
                  <>
                    <IoMdClose className="text-lg" />
                    Javob berilmagan
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

const FilterButton = ({ label, value, count, current, setFilter }) => (
  <button
    onClick={() => setFilter(value)}
    className={`px-4 py-2 rounded-full text-sm sm:text-base font-medium shadow-sm transition ${
      current === value
        ? "bg-indigo-600 text-white"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
    }`}
  >
    {label} ({count})
  </button>
);

export default Applications;

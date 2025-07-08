import React, { useState, useEffect } from "react";
import axios from "axios";

const Announcement = () => {
  const [ads, setAds] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/ads/getAll`);
        console.log(response.data)
        if (response.data.success) {
          setAds(response.data.alldata);
        }
      } catch (error) {
        console.error("Error fetching ads:", error);
      }
    };

    fetchAds();
  }, []);

  useEffect(() => {
    if (ads.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % ads.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [ads]);

  const getSlidePosition = (index) => {
    const total = ads.length;
    if (total < 3) return "hidden";

    const leftIndex = (currentSlide - 1 + total) % total;
    const centerIndex = currentSlide;
    const rightIndex = (currentSlide + 1) % total;

    if (index === leftIndex) return "left";
    if (index === centerIndex) return "center";
    if (index === rightIndex) return "right";
    return "hidden";
  };

  return (
    <div className="w-full bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4">
      <h2 className="text-4xl font-extrabold text-center text-indigo-700 mb-10">📢 E'lonlar</h2>
      <div className="relative w-full flex justify-center items-center overflow-hidden">
        <div className="flex w-full max-w-6xl justify-between relative">
          {ads.map((ad, index) => {
            const position = getSlidePosition(index);
            let styles = "hidden";

            if (position === "left") {
              styles = "w-1/4 transform scale-75 opacity-40 transition-all duration-700 -translate-x-8 blur-sm";
            } else if (position === "center") {
              styles = "w-1/2 transform scale-105 opacity-100 transition-all duration-700 z-10";
            } else if (position === "right") {
              styles = "w-1/4 transform scale-75 opacity-40 transition-all duration-700 translate-x-8 blur-sm";
            }

            return (
              <div key={ad.id} className={`${styles} flex justify-center items-center`}>
                <div className="bg-white rounded-2xl shadow-2xl p-5 flex flex-col items-center text-center w-full max-w-sm transition-transform hover:scale-105 duration-500">
                  {ad.photo && (
                    <img
                      src={`${import.meta.env.VITE_API_URL}${ad.photo}`}
                      alt={ad.title}
                      className="w-full h-52 object-contain rounded-lg mb-4"
                    />
                  )}
                  <h3 className="text-xl font-semibold text-indigo-800 mb-2">{ad.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">{ad.description}</p>
                  <span className="text-xs text-gray-500">📅 {new Date(ad.sent_date).toLocaleDateString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dot navigatsiya */}
      <div className="flex justify-center mt-8 gap-2">
        {ads.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-indigo-600 scale-110" : "bg-indigo-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Announcement;

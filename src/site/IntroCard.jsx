import React, { useState } from 'react';
import school from '../assets/school.jpeg';

const IntroCard = () => {
  const [openCardIndex, setOpenCardIndex] = useState(null);

  const toggleHandler = (index) => {
    setOpenCardIndex(openCardIndex === index ? null : index);
  };

  const card = [
    {
      cardname: 'Matematika',
      image: school,
      briefly: "Tajribali o'qituvchilardan mukammal matematika darslari.",
      description: 'Bu kurs sizga asosiy va chuqurlashtirilgan matematik bilimlarni o‘rgatadi.'
    },
    {
      cardname: 'Ingliz tili',
      image: school,
      briefly: "Xorijiy tilni oson va qiziqarli o'rganing.",
      description: 'Tinglash, gaplashish, o‘qish va yozish bo‘yicha to‘liq kurs.'
    },
    {
      cardname: 'IT-dasturlash',
      image: school,
      briefly: "Dasturlash tillari va algoritmlarni o‘rganish.",
      description: 'Frontend va backend dasturlashda amaliy tajriba.'
    },
    {
      cardname: 'Arab tili',
      image: school,
      briefly: "Til o‘rganishni istaganlar uchun maxsus kurs.",
      description: 'Arab yozuvi, so‘zlashuv va grammatikasini bosqichma-bosqich o‘rganasiz.'
    },
    {
      cardname: 'Rus tili',
      image: school,
      briefly: "Tajribali o'qituvchilar bilan rus tilini o'rganing.",
      description: 'Rus tili bo‘yicha kundalik va akademik so‘zlashuv malakalari shakllantiriladi.'
    },
    {
      cardname: 'Mental arifmetika',
      image: school,
      briefly: "Bolalar uchun aqlni rivojlantiruvchi darslar.",
      description: 'Zehnni charxlovchi, mantiqiy fikrlashni kuchaytiruvchi mashg‘ulotlar.'
    },
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10 text-blue-800">Chuqurlashtirilgan Fanlar</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {card.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-[1.02] border border-blue-200"
            >
              <img src={item.image} alt={item.cardname} className="w-full h-48 object-cover" />
              <div className="p-5">
                <h2 className="text-xl font-semibold text-blue-900 mb-2">{item.cardname}</h2>
                <p className="text-gray-700 mb-3">{item.briefly}</p>

                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${openCardIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <hr className="my-2" />
                  <p className="text-gray-800">{item.description}</p>
                </div>

                <button
                  onClick={() => toggleHandler(index)}
                  className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition"
                >
                  {openCardIndex === index ? "Yopish" : "Batafsil"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IntroCard;

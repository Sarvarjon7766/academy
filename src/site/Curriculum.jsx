import React, { useState } from 'react';
import { AiOutlineDown, AiOutlineUp,AiOutlineDoubleRight } from "react-icons/ai";

const Curriculum = () => {
  const dastur = [
    {
      name: '1-4 sinflar uchun',
      subjects: ['Ona tili', 'Matematika', 'Mental arifmetika', 'Ingliz tili', 'Arab tili', 'Rus tili', 'IT-dasturlash']
    },
    {
      name: '5-8 sinflar uchun',
      subjects: ['Ona tili', 'Matematika', 'Mental arifmetika', 'Ingliz tili', 'Arab tili', 'Rus tili', 'IT-dasturlash']
    },
    {
      name: '9-11 sinflar uchun',
      subjects: ['Ona tili', 'Matematika', 'Mental arifmetika', 'Ingliz tili', 'Arab tili', 'Rus tili', 'IT-dasturlash']
    }
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleSubjects = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-blue-800 mb-10">O'quv Dasturi</h1>
        
        {dastur.map((item, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-xl mb-6 transition-transform duration-300 hover:scale-[1.01]"
          >
            <button
              onClick={() => toggleSubjects(index)}
              className="w-full px-6 py-5 flex bg-white justify-between items-center text-left text-2xl font-semibold text-blue-900 rounded-t-xl hover:bg-blue-100 transition"
            >
              <span>{item.name}</span>
              {openIndex === index
                ? <AiOutlineUp className="text-2xl bg-white" />
                : <AiOutlineDown className="text-2xl" />}
            </button>

            <div className={`overflow-hidden transition-all duration-500 px-6 ${openIndex === index ? 'max-h-96 py-4' : 'max-h-0 py-0'}`}>
              <ul className="space-y-3">
                {item.subjects.map((sub, subIndex) => (
                  <li
                    key={subIndex}
                    className="text-blue-800 text-lg flex items-center gap-3 hover:text-blue-600 transition"
                  >
                    <span className="text-blue-600"><AiOutlineDoubleRight /></span> {sub}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Curriculum;

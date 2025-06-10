import React from 'react'
import school from '../assets/school.jpeg'

const About = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-white px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8">
        {/* Image Block */}
        <div className="w-full md:w-1/2">
          <img
            src={school}
            alt="logo"
            className="rounded-[25px] shadow-lg hover:shadow-2xl transition-shadow duration-500 w-full h-auto object-cover"
          />
        </div>

        {/* Text Block */}
        <div className="w-full md:w-1/2 text-center md:text-left space-y-6">
          <h1 className="text-3xl font-bold text-blue-700">BULUNG'UR AKADEMIYASI</h1>
          <h3 className="text-2xl font-semibold text-gray-800">
            O‘quv binosi va Asosiy qulayliklar
          </h3>
          <p className="text-gray-700 leading-relaxed text-base md:text-lg">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem excepturi odit eos ea pariatur nulla a ab alias libero natus.
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Et beatae inventore id quasi laudantium, cupiditate porro repellat,
            numquam odit deserunt libero assumenda modi quaerat nostrum consequuntur excepturi voluptatibus.
          </p>
          <div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-full shadow-md transition-transform duration-300 hover:scale-105">
              Batafsil
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About;

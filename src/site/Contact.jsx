// import React from 'react';
// import { FaFacebook, FaTelegram, FaInstagram, FaPhone, FaYoutube, FaEnvelope } from 'react-icons/fa';
// import { MdLocationOn, MdAccessTime } from 'react-icons/md';

// const Contact = () => {
//   return (
//     <div className=" mx-auto p-8 bg-gradient-to-br from-white via-blue-50 to-white shadow-2xl rounded-3xl">
//       <h2 className="text-4xl font-bold text-center text-blue-700 mb-10">Ijtimoiy tarmoqlarimizga obuna bo'ling</h2>
      
//       <div className="flex flex-wrap justify-center gap-6 mb-12">
//         <a href="#" className="bg-blue-100 p-4 rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition duration-300">
//           <FaFacebook size={30} />
//         </a>
//         <a href="#" className="bg-blue-100 p-4 rounded-full shadow-lg hover:bg-blue-400 hover:text-white transition duration-300">
//           <FaTelegram size={30} />
//         </a>
//         <a href="#" className="bg-pink-100 p-4 rounded-full shadow-lg hover:bg-pink-500 hover:text-white transition duration-300">
//           <FaInstagram size={30} />
//         </a>
//         <a href="#" className="bg-red-100 p-4 rounded-full shadow-lg hover:bg-red-500 hover:text-white transition duration-300">
//           <FaEnvelope size={30} />
//         </a>
//         <a href="#" className="bg-green-100 p-4 rounded-full shadow-lg hover:bg-green-500 hover:text-white transition duration-300">
//           <FaPhone size={30} />
//         </a>
//         <a href="#" className="bg-red-100 p-4 rounded-full shadow-lg hover:bg-red-600 hover:text-white transition duration-300">
//           <FaYoutube size={30} />
//         </a>
//       </div>

//       <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">Kontaktlar</h2>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
//         <div className="flex items-center gap-6 p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition">
//           <FaPhone className="text-blue-600 text-4xl" />
//           <div>
//             <h3 className="text-xl font-semibold text-gray-800">Telefon raqam</h3>
//             <p className="text-gray-600 text-lg">+99 897 438 08 96</p>
//           </div>
//         </div>
//         <div className="flex items-center gap-6 p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition">
//           <FaEnvelope className="text-red-500 text-4xl" />
//           <div>
//             <h3 className="text-xl font-semibold text-gray-800">Elektron pochta</h3>
//             <p className="text-gray-600 text-lg">bulungur@gmail.com</p>
//           </div>
//         </div>
//         <div className="flex items-center gap-6 p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition">
//           <MdLocationOn className="text-green-600 text-4xl" />
//           <div>
//             <h3 className="text-xl font-semibold text-gray-800">Manzil</h3>
//             <p className="text-gray-600 text-lg">Bulung'ur tumani,<br /> Mingchinor MFY, 64-uy</p>
//           </div>
//         </div>
//         <div className="flex items-center gap-6 p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition">
//           <MdAccessTime className="text-purple-600 text-4xl" />
//           <div>
//             <h3 className="text-xl font-semibold text-gray-800">Dars vaqti</h3>
//             <p className="text-gray-600 text-lg">08:30 - 17:00</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Contact;

import React from 'react';
import {
  FaFacebook, FaTelegram, FaInstagram, FaPhone,
  FaYoutube, FaEnvelope
} from 'react-icons/fa';
import { MdLocationOn, MdAccessTime } from 'react-icons/md';

const Contact = () => {
  return (
    <div className="w-full bg-gradient-to-b from-white to-blue-50 py-10 px-4">
      {/* Social Media Section - Full Width */}
      <div className="max-w-6xl mx-auto p-6 md:p-10 rounded-3xl  mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-700 mb-10">
          Ijtimoiy tarmoqlarimizga obuna bo'ling
        </h2>
        <div className="flex flex-wrap gap-6 justify-center">
          <a href="#" className="text-blue-700 hover:scale-110 transition-all">
            <FaFacebook size={40} />
          </a>
          <a href="#" className="text-blue-400 hover:scale-110 transition-all">
            <FaTelegram size={40} />
          </a>
          <a href="#" className="text-pink-600 hover:scale-110 transition-all">
            <FaInstagram size={40} />
          </a>
          <a href="#" className="text-red-500 hover:scale-110 transition-all">
            <FaEnvelope size={40} />
          </a>
          <a href="#" className="text-green-500 hover:scale-110 transition-all">
            <FaPhone size={40} />
          </a>
          <a href="#" className="text-red-600 hover:scale-110 transition-all">
            <FaYoutube size={40} />
          </a>
        </div>
      </div>

      {/* Split Content: Contact Info (Left) + Address & Map (Right) */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10">
        {/* Left Side: Contact Info */}
        <div className="w-full md:w-1/2 p-6 rounded-3xl">
          <h2 className="text-2xl md:text-3xl font-semibold text-center text-blue-700 mb-8">Kontaktlar</h2>
          <div className="flex flex-col gap-6">
            <div className="flex items-start gap-5">
              <FaPhone className="text-blue-600 text-3xl mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Telefon raqam</h3>
                <p className="text-gray-600">+99 897 438 08 96</p>
              </div>
            </div>
            <div className="flex items-start gap-5">
              <FaEnvelope className="text-red-500 text-3xl mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Elektron pochta</h3>
                <p className="text-gray-600">bulungur@gmail.com</p>
              </div>
            </div>
            <div className="flex items-start gap-5">
              <MdAccessTime className="text-purple-600 text-3xl mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Dars vaqti</h3>
                <p className="text-gray-600">08:30 - 17:00</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Address + Map */}
        <div className="w-full md:w-1/2  p-6 rounded-3xl">
          <h2 className="text-2xl md:text-3xl font-semibold text-center text-blue-700 mb-6">Manzil</h2>
          <div className="flex items-start gap-4 mb-6">
            <MdLocationOn className="text-green-600 text-3xl mt-1" />
            <p className="text-gray-600 text-lg">
              Bulung'ur tumani,<br />
              Mingchinor MFY, 64-uy
            </p>
          </div>
          <div className="relative overflow-hidden rounded-2xl shadow-md" style={{ paddingTop: '56.25%' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3069.7210844668443!2d67.30644267480281!3d39.70097469889339!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f4d2b764cc5b60d%3A0x7757ba11e4cdf01a!2sBulungur%20Akademiyasi!5e0!3m2!1suz!2s!4v1737616782865!5m2!1suz!2s"
              className="absolute top-0 left-0 w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;


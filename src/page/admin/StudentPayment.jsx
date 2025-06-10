import React, { useState } from "react";
import Select from "react-select";

// Oyliklar massivini yoki oylik to'lovni olish uchun bazadan kutilgan ma'lumotlar
const months = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktyabr", "Noyabr", "Dekabr"];

function PaymentForm({ students }) {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [paymentDetails, setPaymentDetails] = useState({
    monthlyPayment: 0,
    paidAmount: 0,
    remainingAmount: 0,
    amountToPay: "",
  });

  // Talabani tanlash
  const handleStudents = (selectedOption) => {
    setSelectedStudent(selectedOption);
  };

  // Oyni tanlash
  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  // Formani yuborish
  const handleSubmit = async (e) => {
    e.preventDefault();

    // So'rov yuborish: Bu yerda API chaqiruvini amalga oshirishingiz mumkin
    if (selectedStudent && selectedMonth) {
      try {
        // API so'rovi (axios yordamida)
        // const response = await axios.post("/api/get-payment-details", {
        //   student: selectedStudent.value,
        //   month: selectedMonth,
        // });

        // Simulyatsiya: Oylik to'lov, to'langan summa, qolgan summa
        const data = {monthlyPayment: 1500000, paidAmount: 850000, remainingAmount: 300000};

        if (data) {
          // Bazadan javob kelsa, oylik to'lov va boshqa ma'lumotlarni yangilaymiz
          setPaymentDetails({
            monthlyPayment: data.monthlyPayment,
            paidAmount: data.paidAmount,
            remainingAmount: data.remainingAmount,
            amountToPay: "", // Foydalanuvchi kirita oladigan inputni bo'shatamiz
          });
        } else {
          alert("Ma'lumot topilmadi.");
        }
      } catch (error) {
        console.error("API xato:", error);
        alert("Xato yuz berdi.");
      }
    } else {
      alert("Iltimos, ism familiyani va oyni tanlang.");
    }
  };


  // To'lov qilish
  const handleAmountChange = (e) => {
    setPaymentDetails({
      ...paymentDetails,
      amountToPay: e.target.value,
    });
  };

  // Student optionsni yaratish
  const studentOptions = students.map((student) => ({
    value: student._id,
    label: student.fullName,
  }));

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 shadow-md rounded-lg">
      <h3 className="text-2xl text-indigo-700 text-center font-bold mb-6">To'lov qilish</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Asosiy Inputlar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Ism Familiyani Tanlash */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <Select
              id="fullName"
              options={studentOptions}
              onChange={handleStudents}
              value={selectedStudent}
              placeholder="Ism familiya"
              className="w-full p-0 rounded-lg focus:outline-indigo-700"
            />
          </div>

          {/* Oy Tanlash */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <select
              value={selectedMonth}
              onChange={handleMonthChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-indigo-700"
            >
              <option value="">Oyni tanlang</option>
              {months.map((month, index) => (
                <option key={index} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="px-3 bg-green-500 hover:bg-[green] transition text-white rounded-lg shadow-md"
          >
            Tekshirish
          </button>
        </div>

        {/* Hisob va To'lov */}
        {paymentDetails.monthlyPayment > 0 && (
          <div className="mt-6">
            {/* Oylik to'lov, To'langan summa va Qolgan summa */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex flex-col justify-center items-center bg-indigo-50 p-4 rounded-lg shadow-md">
                <span className="text-sm font-semibold text-gray-500">Oylik to'lov</span>
                <span className="text-xl text-indigo-700 font-bold">{paymentDetails.monthlyPayment} so'm</span>
              </div>
              <div className="flex flex-col justify-center items-center bg-indigo-50 p-4 rounded-lg shadow-md">
                <span className="text-sm font-semibold text-gray-500">To'langan summa</span>
                <span className="text-xl text-indigo-700 font-bold">{paymentDetails.paidAmount} so'm</span>
              </div>
              <div className="flex flex-col justify-center items-center bg-indigo-50 p-4 rounded-lg shadow-md">
                <span className="text-sm font-semibold text-gray-500">Qolgan summa</span>
                <span className="text-xl text-indigo-700 font-bold">{paymentDetails.remainingAmount} so'm</span>
              </div>
            </div>

            {/* To'lovni kiritish */}
            <div className="mt-8">
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="amountToPay">
                Summani kiriting
              </label>
              <input
                type="number"
                id="amountToPay"
                value={paymentDetails.amountToPay}
                onChange={handleAmountChange}
                placeholder="Summani kiriting"
                className="w-full p-3 border border-indigo-300 rounded-lg focus:outline-indigo-700 "
              />
            </div>
          </div>
        )}

        {/* Yuborish tugmasi */}
        <div className="text-center mt-4">
          <button
            type="submit"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-lg mt-4 shadow-md"
          >
            Yuborish
          </button>
        </div>
      </form>
    </div>
  );
}

export default PaymentForm;

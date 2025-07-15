import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const GeneralReport = () => {
  const years = [2023, 2024, 2025];
  const months = [
    { value: 1, label: 'Yanvar' }, { value: 2, label: 'Fevral' }, { value: 3, label: 'Mart' },
    { value: 4, label: 'Aprel' }, { value: 5, label: 'May' }, { value: 6, label: 'Iyun' },
    { value: 7, label: 'Iyul' }, { value: 8, label: 'Avgust' }, { value: 9, label: 'Sentabr' },
    { value: 10, label: 'Oktabr' }, { value: 11, label: 'Noyabr' }, { value: 12, label: 'Dekabr' }
  ];

  const [year, setYear] = useState(2024);
  const [month, setMonth] = useState(6);

  // Statik ma'lumotlar (namuna)
  const monthlyStats = [
    { month: 1, due: 1200000, paid: 1000000, balance: 200000 },
    { month: 2, due: 1500000, paid: 1300000, balance: 200000 },
    { month: 3, due: 1000000, paid: 1000000, balance: 0 },
    { month: 4, due: 1700000, paid: 1500000, balance: 200000 },
    { month: 5, due: 1600000, paid: 1600000, balance: 0 },
    { month: 6, due: 1800000, paid: 1700000, balance: 100000 }
  ];

  const totalDue = 8800000;
  const totalPaid = 8100000;
  const totalBalance = 700000;
  const avgMonthlyPaid = totalPaid / monthlyStats.length;

  const topCategories = [
    { category: 'Oylik', amount: 4000000 },
    { category: 'Bonus', amount: 2500000 },
    { category: 'Stipendiya', amount: 1600000 }
  ];

  const pieData = [
    { name: 'To‘langan', value: totalPaid },
    { name: 'Qoldiq', value: totalBalance }
  ];

  const COLORS = ['#00C49F', '#FF8042'];
  const BAR_COLORS = ['#4e73df', '#1cc88a', '#e74a3b'];

  const barData = monthlyStats.map(m => ({
    name: months.find(x => x.value === m.month).label,
    due: m.due,
    paid: m.paid,
    balance: m.balance
  }));

  // KPI kartalari uchun progress foizlari
  const paidPercentage = Math.round((totalPaid / totalDue) * 100);
  const balancePercentage = Math.round((totalBalance / totalDue) * 100);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800">To'lovlar Monitoringi</h1>
          <p className="text-gray-600 mt-2">{year} yil {months.find(m => m.value === month).label} oyi hisoboti</p>
        </div>

        {/* Filterlar */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <div className="relative">
            <select
              className="appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:border-blue-500 shadow-sm"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
            >
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
          
          <div className="relative">
            <select
              className="appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:border-blue-500 shadow-sm"
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value))}
            >
              {months.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
          
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 shadow-md">
            Hisobotni yuklash
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-5 rounded-xl shadow-lg border-l-4 border-blue-500 transition-all hover:shadow-xl">
            <div className="flex items-center mb-3">
              <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="text-gray-500 font-medium">To'lov reja</h4>
            </div>
            <p className="text-2xl font-bold text-gray-800 mb-1">{totalDue.toLocaleString()} UZS</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-xl shadow-lg border-l-4 border-green-500 transition-all hover:shadow-xl">
            <div className="flex items-center mb-3">
              <div className="p-2 rounded-full bg-green-100 text-green-600 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-gray-500 font-medium">To'langan summa</h4>
            </div>
            <p className="text-2xl font-bold text-gray-800 mb-1">{totalPaid.toLocaleString()} UZS</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: `${paidPercentage}%` }}></div>
            </div>
            <p className="text-sm text-gray-500 mt-1">{paidPercentage}% rejadan</p>
          </div>
          
          <div className="bg-white p-5 rounded-xl shadow-lg border-l-4 border-red-500 transition-all hover:shadow-xl">
            <div className="flex items-center mb-3">
              <div className="p-2 rounded-full bg-red-100 text-red-600 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-gray-500 font-medium">Qoldiq</h4>
            </div>
            <p className="text-2xl font-bold text-gray-800 mb-1">{totalBalance.toLocaleString()} UZS</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-red-500 h-2 rounded-full" style={{ width: `${balancePercentage}%` }}></div>
            </div>
            <p className="text-sm text-gray-500 mt-1">{balancePercentage}% rejadan</p>
          </div>
          
          <div className="bg-white p-5 rounded-xl shadow-lg border-l-4 border-purple-500 transition-all hover:shadow-xl">
            <div className="flex items-center mb-3">
              <div className="p-2 rounded-full bg-purple-100 text-purple-600 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="text-gray-500 font-medium">O'rtacha oylik to'lov</h4>
            </div>
            <p className="text-2xl font-bold text-gray-800 mb-1">{avgMonthlyPaid.toLocaleString('uz-UZ', {maximumFractionDigits:0})} UZS</p>
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${avgMonthlyPaid > 1500000 ? 'text-green-600' : 'text-yellow-600'}`}>
                {avgMonthlyPaid > 1500000 ? 'Yuqori' : 'Oʻrtacha'} samaradorlik
              </span>
            </div>
          </div>
        </div>

        {/* Grafiklar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Oylik ko'rsatkichlar</h3>
              <div className="flex space-x-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#4e73df] mr-2"></div>
                  <span className="text-sm">Reja</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#1cc88a] mr-2"></div>
                  <span className="text-sm">To'langan</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#e74a3b] mr-2"></div>
                  <span className="text-sm">Qoldiq</span>
                </div>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={v => `${v / 1000000}M`} />
                  <Tooltip 
                    formatter={(value) => [`${value.toLocaleString()} UZS`, '']}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="due" fill={BAR_COLORS[0]} name="Reja" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="paid" fill={BAR_COLORS[1]} name="To'langan" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="balance" fill={BAR_COLORS[2]} name="Qoldiq" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Umumiy to'lov holati</h3>
            <div className="flex flex-col items-center h-80">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value.toLocaleString()} UZS`, '']}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex mt-4 space-x-6">
                {pieData.map((entry, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: COLORS[index] }}></div>
                    <span className="text-sm">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Eng ko'p to'lovlar jadvali */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-800">Eng ko'p to'langan kategoriyalar</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategoriya
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Foiz
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Summasi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topCategories.map((cat, index) => {
                  const percentage = Math.round((cat.amount / totalPaid) * 100);
                  return (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600 font-medium">
                              {cat.category.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{cat.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2.5 mr-3">
                            <div 
                              className={`h-2.5 rounded-full ${index === 0 ? 'bg-blue-600' : index === 1 ? 'bg-green-500' : 'bg-yellow-500'}`} 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-500">{percentage}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {cat.amount.toLocaleString()} UZS
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralReport;
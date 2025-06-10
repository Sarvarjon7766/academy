import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const studentGrades = [
  { month: 'Yanvar', avgGrade: 4.5 },
  { month: 'Fevral', avgGrade: 4.2 },
  { month: 'Mart', avgGrade: 3.9 },
  { month: 'Aprel', avgGrade: 4.3 },
];

const StudentGradeChart = () => {
  return (
    <div className="w-full h-64 bg-white p-4 shadow-md rounded-lg">
      <h3 className="text-lg font-semibold text-center">📈 Oylik baholar tendensiyasi</h3>
      <ResponsiveContainer width="100%" height="80%">
        <LineChart data={studentGrades}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="avgGrade" stroke="#10B981" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StudentGradeChart;

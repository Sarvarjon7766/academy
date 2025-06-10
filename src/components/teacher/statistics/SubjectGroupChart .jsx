import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const subjectGroups = [
  { name: 'Matematika', value: 35 },
  { name: 'Fizika', value: 25 },
  { name: 'Kimyo', value: 20 },
  { name: 'Biologiya', value: 20 },
];

const COLORS = ['#34D399', '#3B82F6', '#FACC15', '#EF4444'];

const SubjectGroupChart = () => {
  return (
    <div className="w-full h-64 bg-white p-4 shadow-md rounded-lg">
      <h3 className="text-lg font-semibold text-center">📚 Fanlar bo‘yicha guruh taqsimoti</h3>
      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          <Pie data={subjectGroups} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value">
            {subjectGroups.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SubjectGroupChart;

const Bed = ({ bed, onClick }) => (
  <div
    onClick={onClick}
    className={`w-6 h-24 flex items-center justify-center text-xs font-medium rounded-md shadow-md cursor-pointer transition
      ${bed ? "bg-red-500 text-white" : "bg-green-500 text-white"} hover:scale-105`}
    style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
  >
    {bed || "Bo‘sh"}
  </div>
);
export default Bed;

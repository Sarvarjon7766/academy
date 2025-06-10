const RoomCard5 = ({ room, roomIndex, onBedClick, onRemoveGuest, onDelete }) => (
  <div className="bg-white rounded-xl shadow-lg p-4 w-full max-w-md mx-auto relative">
    <h3 className="text-center text-xl font-bold mb-4 text-gray-700">
      🛏 Xona #{room.number} (5 kishilik)
    </h3>

    {/* Room layout */}
    <div className="relative w-full h-80 border-4 border-gray-200 rounded-md bg-gray-50">

      {/* Beds layout */}
      <div className="absolute top-6 left-6">
        <Bed bed={room.beds[0]} onClick={() => handleBedClick(roomIndex, 0, room.beds[0], onBedClick, onRemoveGuest)} />
      </div>
      <div className="absolute top-6 right-6">
        <Bed bed={room.beds[1]} onClick={() => handleBedClick(roomIndex, 1, room.beds[1], onBedClick, onRemoveGuest)} />
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 top-32">
        <Bed bed={room.beds[2]} onClick={() => handleBedClick(roomIndex, 2, room.beds[2], onBedClick, onRemoveGuest)} />
      </div>
      <div className="absolute bottom-16 left-6">
        <Bed bed={room.beds[3]} onClick={() => handleBedClick(roomIndex, 3, room.beds[3], onBedClick, onRemoveGuest)} />
      </div>
      <div className="absolute bottom-16 right-6">
        <Bed bed={room.beds[4]} onClick={() => handleBedClick(roomIndex, 4, room.beds[4], onBedClick, onRemoveGuest)} />
      </div>

      {/* Door */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-8 bg-yellow-600 rounded-t text-center text-white text-sm flex items-center justify-center">
        🚪 Eshik
      </div>
    </div>

    {/* Delete Button */}
    {onDelete && (
      <button
        onClick={onDelete}
        className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600"
      >
        🗑 O‘chirish
      </button>
    )}
  </div>
);

// Yotoq joyi componenti
const Bed = ({ bed, onClick }) => (
  <div
    onClick={onClick}
    className={`w-24 h-16 flex items-center justify-center text-sm font-medium rounded-lg shadow-md cursor-pointer transition 
      ${bed ? "bg-red-500 text-white" : "bg-green-500 text-white"} hover:scale-105`}
  >
    {bed || "Bo‘sh"}
  </div>
);

// Funksiya: Qaysi action bajariladi
const handleBedClick = (roomIndex, bedIndex, bed, onBedClick, onRemoveGuest) => {
  bed ? onRemoveGuest(roomIndex, bedIndex) : onBedClick(roomIndex, bedIndex);
};

export default RoomCard5;

import Bed from './Bed'
const RoomCard4 = ({ room, roomIndex, onBedClick, onRemoveGuest, onDelete }) => (
  <div className="bg-white rounded-xl shadow-lg p-4 w-full max-w-md mx-auto relative">
    <h3 className="text-center text-xl font-bold mb-4 text-gray-700">
      🛏 Xona #{room.number} (4 kishilik)
    </h3>

    {/* Xona maketi */}
    <div className="relative w-full h-96 border-4 border-gray-200 rounded-md bg-gray-50">

      {/* Deraza - yuqori markazda */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-8 bg-blue-400 rounded-b text-center text-white text-sm flex items-center justify-center">
        🪟 Deraza
      </div>

      {/* Yuqori qavatdagi yotoqlar */}
      <div className="absolute top-16 left-6">
        <Bed
          bed={room.beds[0]}
          onClick={() => handleBedClick(roomIndex, 0, room.beds[0], onBedClick, onRemoveGuest)}
        />
      </div>
      <div className="absolute top-16 right-6">
        <Bed
          bed={room.beds[1]}
          onClick={() => handleBedClick(roomIndex, 1, room.beds[1], onBedClick, onRemoveGuest)}
        />
      </div>

      {/* Pastki qavatdagi yotoqlar */}
      <div className="absolute top-40 left-6">
        <Bed
          bed={room.beds[2]}
          onClick={() => handleBedClick(roomIndex, 2, room.beds[2], onBedClick, onRemoveGuest)}
        />
      </div>
      <div className="absolute top-40 right-6">
        <Bed
          bed={room.beds[3]}
          onClick={() => handleBedClick(roomIndex, 3, room.beds[3], onBedClick, onRemoveGuest)}
        />
      </div>

      {/* Eshik - pastki markazda */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-8 bg-yellow-600 rounded-t text-center text-white text-sm flex items-center justify-center">
        🚪 Eshik
      </div>
    </div>

    {/* O‘chirish tugmasi */}
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

export default RoomCard4;

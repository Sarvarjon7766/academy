const RoomCard6 = ({ room, roomIndex, onBedClick, onRemoveGuest }) => (
  <div className="bg-white rounded shadow p-4">
    <h3 className="text-center font-bold text-lg mb-4">🛏 Xona #{room.number} (6 kishilik)</h3>
    <div className="grid grid-cols-3 gap-3">
      {room.beds.map((bed, bedIndex) => (
        <div
          key={bedIndex}
          onClick={() =>
            bed ? onRemoveGuest(roomIndex, bedIndex) : onBedClick(roomIndex, bedIndex)
          }
          className={`cursor-pointer p-3 rounded shadow text-center text-sm transition ${
            bed ? "bg-red-500 text-white" : "bg-green-500 text-white"
          }`}
        >
          {bed || "Bo‘sh joy"}
        </div>
      ))}
    </div>
  </div>
);

export default RoomCard6;

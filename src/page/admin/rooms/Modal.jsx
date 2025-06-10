const Modal = ({ guestName, setGuestName, onClose, onSave }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded shadow-lg w-80">
      <h2 className="text-lg font-bold mb-4">Ism Familiya kiriting</h2>
      <input
        type="text"
        className="border p-2 w-full rounded mb-4"
        value={guestName}
        onChange={(e) => setGuestName(e.target.value)}
        placeholder="FISH"
      />
      <div className="flex justify-end gap-2">
        <button onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded">Bekor</button>
        <button onClick={onSave} className="bg-blue-600 text-white px-4 py-2 rounded">Saqlash</button>
      </div>
    </div>
  </div>
);

export default Modal;

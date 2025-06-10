import React from "react";

export function Dialog({ open, onOpenChange, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-md">
        {children}
        <button onClick={() => onOpenChange(false)} className="mt-2 text-red-500">
          Yopish
        </button>
      </div>
    </div>
  );
}

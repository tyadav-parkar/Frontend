
import React from 'react';

const DeleteAlert = ({ content, onDelete }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
      <p className="text-gray-700 text-sm mb-4">{content}</p>
      <div className="flex justify-end gap-3">
        <button
          type="button"
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DeleteAlert;

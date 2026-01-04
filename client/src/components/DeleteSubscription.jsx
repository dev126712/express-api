import API from '../api/axios';
import React, { useState } from 'react'; 

const DeleteSubscription = ({ isOpen, onClose, subscriptionId, onRefresh }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await API.delete(`/subscription/${subscriptionId}`);
      onRefresh(); // Refresh the dashboard list
      onClose();   // Close modal
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete subscription");
      console.log(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold mb-2">Delete Subscription</h2>
        <p className="mb-6 text-gray-600">
          Are you sure you want to delete this subscription? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-400"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteSubscription;
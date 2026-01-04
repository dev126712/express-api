import React, { useState, useEffect } from 'react';
import API from '../api/axios';

const UpdateSubscription = ({ isOpen, onClose, subscriptionId, onRefresh }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    frequency: 'monthly',
  });

  // Fetch current data when modal opens
  useEffect(() => {
    if (isOpen && subscriptionId) {
      const fetchCurrentSub = async () => {
        try {
          const res = await API.get(`/subscription/${subscriptionId}`);
          const { name, price, frequency } = res.data.data;
          setFormData({ name, price, frequency });
        } catch (err) {
          console.error("Failed to fetch sub details", err);
        }
      };
      fetchCurrentSub();
    }
  }, [isOpen, subscriptionId]);

  if (!isOpen) return null;

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await API.put(`/subscription/${subscriptionId}`, {
        ...formData,
        price: Number(formData.price)
      });
      onRefresh();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update subscription");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold mb-4">Edit Subscription</h2>
        
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input 
              type="text"
              className="w-full p-2 border rounded-lg"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input 
              type="number"
              className="w-full p-2 border rounded-lg"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              required
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isUpdating}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateSubscription;
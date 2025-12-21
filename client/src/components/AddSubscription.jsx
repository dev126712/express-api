import React, { useState } from 'react';
import API from '../api/axios';

const AddSubscription = ({ isOpen, onClose, onRefresh }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    currency: 'USD',
    frequency: 'monthly',
    category: 'entertainment',
    startDate: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/subscription', formData);
      onRefresh(); // Refresh the dashboard list
      onClose();   // Close modal
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add subscription");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold mb-4">Add Subscription</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Service Name</label>
            <input 
              type="text" required placeholder="Netflix, Spotify..."
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input 
                type="number" required step="0.01"
                className="w-full p-2 border rounded-lg"
                onChange={(e) => setFormData({...formData, price: e.target.value})}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Frequency</label>
              <select 
                className="w-full p-2 border rounded-lg"
                onChange={(e) => setFormData({...formData, frequency: e.target.value})}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input 
              type="date" required
              className="w-full p-2 border rounded-lg"
              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Subscription</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubscription;

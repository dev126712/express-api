import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { Calendar, DollarSign, Plus, Bell } from 'lucide-react';
import AddSubscription from '../components/AddSubscription';
import DeleteSubscription from '../components/DeleteSubscription';
import UpdateSubscription from '../components/UpdateSubscription';

const Dashboard = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSubId, setSelectedSubId] = useState(null);

  const fetchSubscriptions = async () => {
    try {
      const response = await API.get('/subscription');
      setSubscriptions(response.data.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setSelectedSubId(id);
    setIsDeleteOpen(true);
  };

  const handleUpdateClick = (id) => {
    setSelectedSubId(id);
    setIsEditOpen(true);
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  // Simple calculation for total monthly spend
  const totalMonthly = subscriptions.reduce((acc, sub) => {
    return acc + (sub.frequency === 'monthly' ? sub.price : sub.price / 12);
  }, 0);

  if (loading) return <div className="p-10 text-center font-sans">Loading tracker...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500">Welcome back to your sub tracker</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-200"
          >
            <Plus size={20} /> Add New
          </button>
        </div>
      {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                <DollarSign size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Monthly Spending</p>
                <h2 className="text-2xl font-bold text-gray-900">${totalMonthly.toFixed(2)}</h2>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                <Bell size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Active Subs</p>
                <h2 className="text-2xl font-bold text-gray-900">{subscriptions.length}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Subscriptions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subscriptions.map((sub) => (
            <div key={sub._id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-200 transition-colors group">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{sub.name}</h3>
                <span className="text-xs font-bold px-2 py-1 bg-gray-100 text-gray-600 rounded uppercase tracking-wider">
                  {sub.category}
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-gray-900">${sub.price}</span>
                <span className="text-gray-400 text-sm">/{sub.frequency}</span>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-2 text-sm text-gray-500">
                <Calendar size={14} />
                <span>Renews: {new Date(sub.renewalDate).toLocaleDateString()}</span>
                <button 
                   onClick={() => handleDeleteClick(sub._id)}
                   className="text-red-500 hover:text-red-700 font-medium transition-colors"
                 >
                    Delete
                </button>
                <button 
                  onClick={() => handleUpdateClick(sub._id)}
                  className="text-blue-500 hover:text-blue-700 font-medium transition-colors"
                >
                    Update
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {subscriptions.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400">No subscriptions tracked yet. Click "Add New" to begin.</p>
          </div>
        )}

        {/* Modal Component */}
        <AddSubscription 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onRefresh={fetchSubscriptions} 
        />

        <DeleteSubscription 
          isOpen={isDeleteOpen}
          subscriptionId={selectedSubId}
          onClose={() => {
            setIsDeleteOpen(false);
            setSelectedSubId(null);
          }}
          onRefresh={fetchSubscriptions}
        />

        <UpdateSubscription 
          isOpen={isEditOpen}
          subscriptionId={selectedSubId}
          onClose={() => setIsEditOpen(false)}
          onRefresh={fetchSubscriptions}
        />

        

      </div>
    </div>
  );
};

export default Dashboard;

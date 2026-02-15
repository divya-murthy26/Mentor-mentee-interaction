import React from 'react';
import DashboardLayout from './DashboardLayout';

const AdminDashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-800">Admin Dashboard</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-600">Welcome to the admin panel. Manage users and settings here.</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
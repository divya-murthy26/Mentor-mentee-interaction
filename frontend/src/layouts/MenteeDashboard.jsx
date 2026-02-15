import React from 'react';
import DashboardLayout from './DashboardLayout';

const MenteeDashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-800">Mentee Dashboard</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-600">Welcome! Here you can view your upcoming sessions and progress.</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MenteeDashboard;
import React from 'react';
import Sidebar from '../components/Sidebar';
import '../styles/dashboard.css';

const DashboardLayout = ({ children, role }) => {
  return (
    <div className="dashboard-layout">
      <Sidebar role={role} />
      <main className="dashboard-content">
        <header className="dashboard-header">
          <h2>Dashboard</h2>
          <div className="user-profile">
            <div className="avatar-small"></div>
            <span>{role.charAt(0).toUpperCase() + role.slice(1)}</span>
          </div>
        </header>
        <div className="content-scroll">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;

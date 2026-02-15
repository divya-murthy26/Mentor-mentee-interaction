import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Bell, Menu } from 'lucide-react';
import '../styles/dashboard.css';

const DashboardLayout = ({ children, role }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="dashboard-layout">
      <Sidebar role={role} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="dashboard-main">
        {/* Top Navbar */}
        <header className="top-navbar">
          <div className="navbar-left">
            <button className="icon-btn menu-toggle" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <h2 className="page-title">
              {role === 'admin' ? 'Admin Portal' : role === 'mentor' ? 'Mentor Dashboard' : 'Learning Dashboard'}
            </h2>
          </div>
          
          <div className="navbar-actions">
            <button className="icon-btn">
              <Bell size={20} />
            </button>
            <div className="user-profile">
              <div className="user-info">
                <span className="user-name">{role.charAt(0).toUpperCase() + role.slice(1)}</span>
                <span className="user-role">Fund a Child</span>
              </div>
              <div className="avatar">
                {role.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <main className="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  );
};
export default DashboardLayout;
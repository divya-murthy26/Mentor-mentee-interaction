import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './DashboardLayout.css';

export default function DashboardLayout({ title, navItems, children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={`dash-layout ${collapsed ? 'collapsed' : ''}`}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          {!collapsed && <span className="logo-text">FundaChild</span>}
        </div>
        <div className="sidebar-user">
          <div className="su-avatar">{user?.name?.[0]?.toUpperCase() || 'U'}</div>
          {!collapsed && (
            <div className="su-info">
              <div className="su-name">{user?.name || 'User'}</div>
              <div className="su-role">{user?.role}</div>
            </div>
          )}
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} style={{marginBottom:'4px'}}
            >
              {!collapsed && <span className="nav-label">{item.label}</span>}
            </NavLink>
          ))}
        </nav>
        <button className="sidebar-logout" onClick={handleLogout}>
          {!collapsed && <span>Logout</span>}
        </button>
      </aside>

      {/* Main */}
      <div className="dash-main">
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-left">
            <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
              {collapsed ? '>' : '<'}
            </button>
            <h1 className="topbar-title">{title}</h1>
          </div>
          <div className="topbar-right">
            <div className="topbar-search">
              <input type="text" placeholder="Search..." />
            </div>
            <div className="topbar-notif"><span className="notif-dot" /></div>
            <div className="topbar-avatar">{user?.name?.[0]?.toUpperCase() || 'U'}</div>
          </div>
        </header>

        {/* Content */}
        <main className="dash-content">
          {children}
        </main>
      </div>
    </div>
  );
}

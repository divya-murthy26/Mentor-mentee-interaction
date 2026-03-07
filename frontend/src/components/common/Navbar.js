import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false); };
  const dashLink = user ? `/${user.role}/dashboard` : '/';
  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() : 'U';

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
          <div className="brand-monogram">FI</div>
          <div className="brand-text">
            <span className="brand-name">Fund a Child India</span>
            <span className="brand-sub">Mentoring Platform</span>
          </div>
        </Link>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          {user ? (
            <>
              <Link to={dashLink} className="nav-link" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <div className="nav-user">
                <div className="nav-avatar">{initials}</div>
                <div className="nav-user-info">
                  <span className="nav-user-name">{user.name}</span>
                  <span className={`nav-role-chip chip-${user.role}`}>{user.role}</span>
                </div>
              </div>
              <button className="navbar-signout" onClick={handleLogout}>Sign Out</button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>Sign In</Link>
          )}
        </div>

        <button className="navbar-toggle" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

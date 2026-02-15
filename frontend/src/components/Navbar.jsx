import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="logo">
          <span className="logo-icon">💙</span> Fund a Child
        </Link>
        
        <div className="nav-links">
          <Link to="/">Home</Link>
          <a href="#about">About</a>
          <a href="#programs">Programs</a>
          <a href="#contact">Contact</a>
        </div>

        <div className="auth-buttons">
          <Link to="/login" className="btn-text">Log In</Link>
          <Link to="/signup" className="btn btn-primary">Get Started</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

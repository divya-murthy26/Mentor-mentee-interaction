import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/auth.css';

const Signup = () => {
  const [role, setRole] = useState('mentee');
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p style={{color: '#64748b'}}>Join us in making a difference</p>
        </div>

        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label>I am a:</label>
            <div className="role-select">
              {['admin', 'mentor', 'mentee'].map((r) => (
                <button 
                  key={r}
                  type="button"
                  className={`role-btn ${role === r ? 'active' : ''}`}
                  onClick={() => setRole(r)}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Full Name</label>
            <input type="text" className="form-input" placeholder="John Doe" required />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input type="email" className="form-input" placeholder="name@example.com" required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-input" placeholder="Create a password" required />
          </div>

          <button type="submit" className="btn btn-primary" style={{width: '100%', justifyContent: 'center'}}>
            Sign Up
          </button>
        </form>

        <p style={{textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', color: '#64748b'}}>
          Already have an account? <Link to="/login" style={{color: 'var(--primary)', fontWeight: 600}}>Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
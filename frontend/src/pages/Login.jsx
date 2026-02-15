import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/auth.css';

const Login = () => {
  const [role, setRole] = useState('mentee');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate login
    if(role === 'admin') navigate('/admin');
    else if(role === 'mentor') navigate('/mentor');
    else navigate('/mentee');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p style={{color: '#64748b'}}>Login to continue your journey</p>
        </div>

        <form onSubmit={handleLogin}>
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
            <label>Email Address</label>
            <input type="email" className="form-input" placeholder="name@example.com" required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-input" placeholder="••••••••" required />
          </div>

          <button type="submit" className="btn btn-primary" style={{width: '100%', justifyContent: 'center'}}>
            Log In
          </button>
        </form>
        
        <p style={{textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', color: '#64748b'}}>
          Don't have an account? <Link to="/signup" style={{color: 'var(--primary)', fontWeight: 600}}>Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

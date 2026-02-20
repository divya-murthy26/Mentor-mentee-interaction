import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

export default function LoginPage() {
  const [role, setRole] = useState('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    // Mock login — replace with API call
    login(role, email.split('@')[0], email);
    if (role === 'admin') navigate('/admin');
    else if (role === 'mentor') navigate('/mentor');
    else navigate('/mentee');
  };

  return (
    <div className="auth-page-center">
      <div className="auth-card fade-in">
        <Link to="/" className="auth-logo-center">FundaChild</Link>
        <h1>Welcome Back</h1>
        <p className="auth-sub">Sign in to your account to continue.</p>
        
          <form onSubmit={handleSubmit}>
            {error && <div className="form-error">{error}</div>}
            <div className="form-group">
              <label>Select Your Role</label>
              <select className="form-select" value={role} onChange={e => setRole(e.target.value)}>
                <option value="admin">Admin</option>
                <option value="mentor">Mentor</option>
                <option value="mentee">Mentee</option>
              </select>
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <div className="auth-forgot"><a href="#">Forgot password?</a></div>
            <button type="submit" className="btn-primary auth-submit">Sign In</button>
          </form>

          <p className="auth-switch">Don't have an account? <Link to="/signup">Sign up</Link></p>
          <Link to="/" className="auth-back">Back to home</Link>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

export default function SignupPage() {
  const [role, setRole] = useState('mentor');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password) { setError('Please fill in all fields.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    // Mock signup — replace with API call
    login(role, name, email);
    if (role === 'admin') navigate('/admin');
    else if (role === 'mentor') navigate('/mentor');
    else navigate('/mentee');
  };

  return (
    <div className="auth-page-center">
      <div className="auth-card fade-in">
        <Link to="/" className="auth-logo-center">FundaChild</Link>
        <h1>Create Your Account</h1>
        <p className="auth-sub">Join our mission to make a difference.</p>
        
          <form onSubmit={handleSubmit}>
            {error && <div className="form-error">{error}</div>}
            <div className="form-group">
              <label>I want to sign up as a</label>
              <select className="form-select" value={role} onChange={e => setRole(e.target.value)}>
                <option value="mentor">Mentor</option>
                <option value="mentee">Mentee</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="Priya Sharma" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="form-row-2">
              <div className="form-group">
                <label>Password</label>
                <input type="password" placeholder="Min 8 chars" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input type="password" placeholder="Repeat password" value={confirm} onChange={e => setConfirm(e.target.value)} />
              </div>
            </div>
            <button type="submit" className="btn-primary auth-submit">Create Account</button>
          </form>

          <p className="auth-terms">By signing up, you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.</p>
          <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
          <Link to="/" className="auth-back">Back to home</Link>
      </div>
    </div>
  );
}

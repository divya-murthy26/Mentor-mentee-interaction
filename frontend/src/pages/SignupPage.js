import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './AuthPages.css';

const SignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => { setForm({ ...form, [e.target.name]: e.target.value }); setError(''); };

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      const user = await signup({ ...form, role: 'admin' });
      navigate(`/${user.role}/dashboard`);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-panel-left">
        <div className="auth-panel-deco deco-1" />
        <div className="auth-panel-deco deco-2" />
        <div className="auth-panel-deco deco-3" />
        <div className="auth-panel-logo">
          <div className="auth-panel-monogram">FI</div>
          <div>
            <div className="auth-panel-brand">Fund a Child India</div>
            <div className="auth-panel-sub">Mentoring Management System</div>
          </div>
        </div>
        <div className="auth-panel-content">
          <h2 className="auth-panel-title">Set Up Your<br /><span>Admin Account</span></h2>
          <p className="auth-panel-desc">As an administrator, you'll manage the entire mentoring program — from creating accounts to tracking outcomes.</p>
        </div>
        <div className="auth-panel-dots"><span /><span /><span /></div>
      </div>

      <div className="auth-panel-right">
        <div className="auth-form-wrap">
          <div className="auth-form-header">
            <span className="auth-form-eyebrow">Admin Registration</span>
            <h1 className="auth-form-title">Create Account</h1>
            <p className="auth-form-subtitle">Register as a program administrator to get started.</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Administrator name" required />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="admin@example.com" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Minimum 6 characters" required />
            </div>
            <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
              {loading ? 'Creating account…' : 'Create Admin Account →'}
            </button>
          </form>

          <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

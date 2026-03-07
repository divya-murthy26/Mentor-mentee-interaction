import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './AuthPages.css';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => { setForm({ ...form, [e.target.name]: e.target.value }); setError(''); };

  const handleSubmit = async e => {
    e.preventDefault(); setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(`/${user.role}/dashboard`);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      {/* Left decorative panel */}
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
          <h2 className="auth-panel-title">
            Empowering the<br />
            <span>Next Generation</span>
          </h2>
          <p className="auth-panel-desc">
            A structured mentoring platform connecting passionate educators
            with children who need guidance, support, and opportunity.
          </p>
        </div>

        <div className="auth-panel-dots">
          <span /><span /><span />
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-panel-right">
        <div className="auth-form-wrap">
          <div className="auth-form-header">
            <span className="auth-form-eyebrow">Secure Access</span>
            <h1 className="auth-form-title">Welcome Back</h1>
            <p className="auth-form-subtitle">Sign in to your account to continue managing the mentoring program.</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required autoComplete="email" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Enter your password" required autoComplete="current-password" />
            </div>
            <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>

          <div className="auth-info-card">
            <p>
              <strong>Note:</strong> Mentor and Mentee accounts are created by the program administrator.
              Contact your admin if you need access to the platform.
            </p>
          </div>

          <p className="auth-switch">
            Are you an admin? <Link to="/signup">Create admin account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

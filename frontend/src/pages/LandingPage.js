import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './LandingPage.css';

const LandingPage = () => {
  const { user } = useAuth();

  return (
    <div className="landing">

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-ring hero-ring-1" />
        <div className="hero-ring hero-ring-2" />
        <div className="hero-ring hero-ring-3" />
        <div className="container hero-content">
          <div className="hero-eyebrow">
            <div className="hero-eyebrow-dot" />
            <span>Mentoring Management System</span>
          </div>

          <h1 className="hero-title">
            Structured Growth for
            <span className="hero-title-accent">Every Child in India</span>
          </h1>

          <p className="hero-description">
            Fund a Child India connects dedicated mentors with promising mentees through
            a structured platform. Schedule sessions, track progress, and measure impact —
            all in one place.
          </p>

          <div className="hero-cta">
            {user ? (
              <Link to={`/${user.role}/dashboard`} className="hero-btn-primary">
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link to="/login" className="hero-btn-primary">Sign In to Continue →</Link>
                <Link to="/signup" className="hero-btn-secondary">Admin Registration</Link>
              </>
            )}
          </div>

          <div className="hero-stats">
            <div className="hero-stat"><strong>500+</strong><span>Mentors</span></div>
            <div className="hero-stat"><strong>2,000+</strong><span>Students</span></div>
            <div className="hero-stat"><strong>15K+</strong><span>Sessions</span></div>
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────── */}
      <section className="features-section">
        <div className="container">
          <span className="section-eyebrow">Platform Capabilities</span>
          <h2 className="section-title">Everything You Need to Run<br />a Successful Mentoring Program</h2>
          <div className="features-grid">
            {[
              { n: '01', title: 'Role-Based Access Control', desc: 'Admin, Mentor, and Mentee dashboards — each tailored with the right tools and permissions for the role.' },
              { n: '02', title: 'Smart Session Scheduling', desc: 'Book online or offline sessions. Mentors accept or reject requests with full context before confirming.' },
              { n: '03', title: 'Calendar Integration', desc: 'Accepted sessions are automatically added to both mentor and mentee Google Calendars.' },
              { n: '04', title: 'PDF Feedback Reports', desc: 'Structured post-session feedback auto-generates a professional PDF report stored for admin review.' },
              { n: '05', title: 'Statistical Dashboards', desc: 'Visual bar, line and pie charts give admins and users instant insight into program performance.' },
              { n: '06', title: 'Admin-Controlled Accounts', desc: 'Only admins can create mentor and mentee accounts — ensuring data integrity and program quality.' },
            ].map(f => (
              <div className="feature-card" key={f.n}>
                <span className="feature-number">{f.n}</span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Roles ─────────────────────────────────────────── */}
      <section className="roles-section">
        <div className="container">
          <span className="section-eyebrow">Three Roles</span>
          <h2 className="section-title">One Unified System</h2>
          <div className="roles-grid">
            <div className="role-card">
              <span className="role-badge admin">Administrator</span>
              <h3>Program Admin</h3>
              <ul className="role-list">
                <li>Create mentor &amp; mentee accounts</li>
                <li>Assign mentors to mentees</li>
                <li>View all sessions &amp; statistics</li>
                <li>Access and download feedback PDFs</li>
              </ul>
            </div>
            <div className="role-card featured">
              <span className="role-badge mentor">Mentor</span>
              <h3>Mentor</h3>
              <ul className="role-list">
                <li>Receive and manage session requests</li>
                <li>Accept or decline interactions</li>
                <li>View upcoming confirmed sessions</li>
                <li>Access mentee feedback reports</li>
              </ul>
            </div>
            <div className="role-card">
              <span className="role-badge mentee-badge">Mentee</span>
              <h3>Mentee</h3>
              <ul className="role-list">
                <li>Schedule sessions with assigned mentor</li>
                <li>Choose online or offline format</li>
                <li>Submit structured post-session feedback</li>
                <li>Download PDF feedback reports</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-inner">
            <div className="footer-brand">
              <div className="footer-monogram">FI</div>
              <div>
                <div className="footer-brand-name">Fund a Child India</div>
                <div className="footer-brand-sub">Empowering children through mentorship</div>
              </div>
            </div>
            <p className="footer-copy">© 2024 Fund a Child India. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

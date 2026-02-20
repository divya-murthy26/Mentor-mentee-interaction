import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  return (
    <nav className="navbar">
      <div className="nav-inner">
        <div className="nav-logo">
          <span className="logo-text">Fund<span>aChild</span></span>
        </div>
        <div className={`nav-links ${open ? 'open' : ''}`}>
          <a href="#features">Features</a>
          <a href="#how">How It Works</a>
          <a href="#impact">Impact</a>
          <Link to="/login" className="nav-login">Login</Link>
          <Link to="/signup" className="nav-cta">Get Started</Link>
        </div>
        <button className="nav-toggle" onClick={() => setOpen(!open)}>☰</button>
      </div>
    </nav>
  );
};

const Hero = () => (
  <section className="hero">
    <div className="hero-content">
      <div className="hero-badge">Empowering India's Future</div>
      <h1>Connecting <span className="highlight">Mentors</span> with Children Who Need Guidance</h1>
      <p>A comprehensive mentor-mentee management platform built for NGOs and foundations working to give every child in India an equal opportunity to succeed.</p>
      <div className="hero-actions">
        <Link to="/signup" className="btn-primary">Start Mentoring</Link>
        <Link to="/login" className="btn-secondary">View Dashboard</Link>
      </div>
      <div className="hero-stats">
        <div className="hstat"><strong>2,400+</strong><span>Children Enrolled</span></div>
        <div className="hstat-divider" />
        <div className="hstat"><strong>850+</strong><span>Active Mentors</span></div>
        <div className="hstat-divider" />
        <div className="hstat"><strong>12,000+</strong><span>Sessions Completed</span></div>
      </div>
    </div>
  </section>
);

const Features = () => (
  <section className="features-section" id="features">
    <div className="section-label">Platform Features</div>
    <h2 className="section-title">Everything you need to manage mentorship at scale</h2>
    <p className="section-sub">Purpose-built tools for NGOs, administrators, mentors, and children.</p>
    <div className="features-grid">
      {[
        { title: 'Smart Pairing', desc: 'Intelligent matching algorithm pairs mentors with mentees based on skills, availability, and learning goals.' },
        { title: 'Session Scheduling', desc: 'Mentees request sessions, mentors accept or reschedule. Automated reminders keep everyone on track.' },
        { title: 'Progress Analytics', desc: "Track each child's development journey with detailed analytics, session history, and milestone markers." },
        { title: 'Feedback System', desc: 'Structured feedback forms after every session help mentors improve and administrators monitor quality.' },
        { title: 'Role-Based Access', desc: 'Separate secure portals for Admins, Mentors, and Mentees with tailored features for each.' },
        { title: 'Responsive Design', desc: 'Works seamlessly on desktops, tablets, and mobile phones for mentors in any location.' },
      ].map((f, i) => (
        <div key={i} className="feature-card fade-in" style={{ animationDelay: i * 0.07 + 's' }}>
          <h3>{f.title}</h3>
          <p>{f.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

const HowItWorks = () => (
  <section className="how-section" id="how">
    <div className="how-inner">
      <div className="section-label">Process</div>
      <h2 className="section-title">How It Works</h2>
      <p className="section-sub">A simple 4-step journey from registration to transformation.</p>
      <div className="steps">
        {[
          { step: '01', title: 'Register & Verify', desc: 'Admins register mentors and enroll children. Profiles are verified and approved.' },
          { step: '02', title: 'Smart Assignment', desc: 'Admin assigns mentors to mentees based on subject expertise and compatibility.' },
          { step: '03', title: 'Schedule Sessions', desc: 'Mentees request sessions; mentors accept and conduct 1-on-1 guidance sessions.' },
          { step: '04', title: 'Track & Improve', desc: 'Feedback is collected, progress is tracked, and reports are generated for stakeholders.' },
        ].map((s, i) => (
          <div key={i} className="step-item">
            <div className="step-num">{s.step}</div>
            <div className="step-connector" style={{display: i < 3 ? 'block' : 'none'}} />
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Impact = () => (
  <section className="impact-section" id="impact">
    <div className="impact-inner">
      <h2>Making a Real Difference Across India</h2>
      <p>Our platform powers NGOs and foundations working in 18 states to provide quality mentorship to underprivileged children.</p>
      <div className="impact-grid">
        {[
          { num: '2,400+', label: 'Children Enrolled' },
          { num: '850+', label: 'Verified Mentors' },
          { num: '18', label: 'States Covered' },
          { num: '94%', label: 'Satisfaction Rate' },
        ].map((item, i) => (
          <div key={i} className="impact-card">
            <div className="impact-num">{item.num}</div>
            <div className="impact-label">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const CTA = () => (
  <section className="cta-section">
    <div className="cta-inner">
      <h2>Ready to Transform a Child's Future?</h2>
      <p>Join hundreds of mentors already making a difference. Register your NGO or sign up as a mentor today.</p>
      <div className="cta-actions">
        <Link to="/signup" className="btn-primary">Get Started Free</Link>
        <Link to="/login" className="btn-secondary" style={{background:'rgba(255,255,255,0.1)', borderColor:'rgba(255,255,255,0.4)', color:'#fff'}}>Login to Dashboard</Link>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="footer">
    <div className="footer-inner">
      <div className="footer-brand">
        <span className="logo-text">Fund<span>aChild</span></span>
        <p>Empowering India's children through structured mentorship and technology.</p>
      </div>
      <div className="footer-links">
        <div>
          <h4>Platform</h4>
          <Link to="/login">Admin Login</Link>
          <Link to="/login">Mentor Login</Link>
          <Link to="/login">Mentee Login</Link>
        </div>
        <div>
          <h4>Company</h4>
          <a href="#features">About Us</a>
          <a href="#impact">Our Impact</a>
          <a href="#how">How It Works</a>
        </div>
        <div>
          <h4>Contact</h4>
          <a href="mailto:hello@fundachild.in">hello@fundachild.in</a>
          <a href="#">+91 98765 43210</a>
          <a href="#">New Delhi, India</a>
        </div>
      </div>
    </div>
    <div className="footer-bottom">
      <span>© 2024 FundaChild India. All rights reserved.</span>
      <span>A Project for India's Children</span>
    </div>
  </footer>
);

export default function LandingPage() {
  return (
    <div className="landing">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Impact />
      <CTA />
      <Footer />
    </div>
  );
}

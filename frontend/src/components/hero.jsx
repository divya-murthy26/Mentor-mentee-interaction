import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import '../styles/hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="container hero-content">
        <div className="hero-text">
          <span className="hero-badge">🚀 Empowering the Future</span>
          <h1>Empowering Education Through <span className="highlight">Structured Mentorship</span></h1>
          <p>Connect ambitious students in India with global mentors. Bridge the gap between potential and opportunity through our funded education platform.</p>
          <div className="hero-cta">
            <Link to="/signup" className="btn btn-primary">
              Start Mentoring <ArrowRight size={20} />
            </Link>
            <Link to="/about" className="btn btn-outline">Learn More</Link>
          </div>
          <div className="stats">
            <div className="stat-item">
              <h3>500+</h3>
              <p>Students Funded</p>
            </div>
            <div className="stat-item">
              <h3>120+</h3>
              <p>Active Mentors</p>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="visual-card main-card">
            <div className="card-header">
              <div className="avatar"></div>
              <div>
                <h4>Riya Sharma</h4>
                <small>Aspiring Engineer</small>
              </div>
            </div>
            <div className="progress-bar"><div className="fill"></div></div>
            <p className="status">🎓 Scholarship Approved</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

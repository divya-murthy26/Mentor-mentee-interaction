import React from 'react'
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import FeatureCards from '../components/FeatureCards';
import Footer from '../components/Footer';

const Landing = () => {
  return (
    <div className="landing-page">
      <Navbar />
      <Hero />
      <FeatureCards />
      
      {/* Call to Action Section */}
      <section style={{ background: 'var(--primary-dark)', padding: '80px 20px', textAlign: 'center', color: 'white' }}>
        <div className="container">
          <h2 style={{ color: 'white', marginBottom: '16px' }}>Ready to Change a Life?</h2>
          <p style={{ marginBottom: '32px', opacity: 0.9 }}>Join our community of mentors and students today.</p>
          <button className="btn" style={{ background: 'white', color: 'var(--primary-dark)' }}>Get Started Now</button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;

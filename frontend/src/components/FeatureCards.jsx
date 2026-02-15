import React from 'react';
import { Users, BookOpen, Target } from 'lucide-react';

const features = [
  {
    icon: <Users size={32} color="#1e88c8" />,
    title: "1-on-1 Mentorship",
    desc: "Personalized guidance from industry experts to help students navigate their career paths."
  },
  {
    icon: <BookOpen size={32} color="#2e7d32" />,
    title: "Scholarship Funding",
    desc: "Direct financial support for tuition and educational resources for verified students."
  },
  {
    icon: <Target size={32} color="#1565a9" />,
    title: "Goal Tracking",
    desc: "Structured milestones and progress tracking to ensure consistent growth and accountability."
  }
];

const FeatureCards = () => {
  return (
    <section className="container" style={{ padding: '80px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>How We Make a Difference</h2>
        <p style={{ color: 'var(--text-light)' }}>A holistic approach to educational empowerment.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
        {features.map((f, index) => (
          <div key={index} className="card" style={{ textAlign: 'left' }}>
            <div style={{ background: '#f5f9fc', width: '60px', height: '60px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              {f.icon}
            </div>
            <h3 style={{ marginBottom: '12px' }}>{f.title}</h3>
            <p style={{ color: 'var(--text-light)' }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureCards;

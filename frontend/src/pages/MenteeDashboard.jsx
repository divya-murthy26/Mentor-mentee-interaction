import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { Calendar } from 'lucide-react';

const MenteeDashboard = () => {
  return (
    <DashboardLayout role="mentee">
      <div style={{background: 'linear-gradient(to right, #1e88c8, #1565a9)', borderRadius: '16px', padding: '32px', color: 'white', marginBottom: '32px'}}>
        <h2 style={{color: 'white', marginBottom: '8px'}}>Hello, Priya! 👋</h2>
        <p style={{opacity: 0.9, marginBottom: '24px'}}>You have 2 upcoming sessions this week.</p>
        <button className="btn" style={{background: 'white', color: 'var(--primary)'}}>
          <Calendar size={18} /> Schedule New Meeting
        </button>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px'}}>
        <div className="card">
          <h3 style={{marginBottom: '20px'}}>My Learning Path</h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
            <div>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                <strong>Frontend Basics</strong>
                <span style={{color: 'var(--accent-green)'}}>80%</span>
              </div>
              <div style={{height: '8px', background: '#f1f5f9', borderRadius: '4px'}}>
                <div style={{width: '80%', height: '100%', background: 'var(--accent-green)', borderRadius: '4px'}}></div>
              </div>
            </div>
            <div>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                <strong>React Development</strong>
                <span style={{color: 'var(--primary)'}}>45%</span>
              </div>
              <div style={{height: '8px', background: '#f1f5f9', borderRadius: '4px'}}>
                <div style={{width: '45%', height: '100%', background: 'var(--primary)', borderRadius: '4px'}}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{marginBottom: '20px'}}>Feedback</h3>
          <p style={{fontSize: '0.9rem', color: '#64748b', fontStyle: 'italic'}}>
            "Priya showed great enthusiasm in today's session regarding Data Structures."
          </p>
          <div style={{marginTop: '12px', fontWeight: 600, fontSize: '0.9rem'}}>- Mentor Ankit</div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MenteeDashboard;

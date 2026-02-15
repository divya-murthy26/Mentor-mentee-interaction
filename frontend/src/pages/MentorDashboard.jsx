import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

const MentorDashboard = () => {
  return (
    <DashboardLayout role="mentor">
      <h3 style={{marginBottom: '24px'}}>Pending Requests</h3>
      
      <div style={{display: 'grid', gap: '20px'}}>
        {[1, 2].map((i) => (
          <div key={i} className="card" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{display: 'flex', gap: '16px', alignItems: 'center'}}>
              <div style={{width: '50px', height: '50px', borderRadius: '50%', background: '#e2e8f0'}}></div>
              <div>
                <h4 style={{marginBottom: '4px'}}>Sneha Gupta</h4>
                <p style={{fontSize: '0.9rem', color: '#64748b'}}>Seeking guidance in Computer Science</p>
              </div>
            </div>
            <div style={{display: 'flex', gap: '12px'}}>
              <button className="btn" style={{background: '#fef2f2', color: '#ef4444'}}>
                <XCircle size={18} /> Reject
              </button>
              <button className="btn" style={{background: '#f0fdf4', color: '#16a34a'}}>
                <CheckCircle size={18} /> Accept
              </button>
            </div>
          </div>
        ))}
      </div>

      <h3 style={{margin: '40px 0 24px'}}>Upcoming Meetings</h3>
      <div className="card">
        <div style={{display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 0'}}>
          <div style={{background: '#e0f2fe', padding: '12px', borderRadius: '8px', color: 'var(--primary)'}}>
            <Clock size={24} />
          </div>
          <div>
            <h4 style={{marginBottom: '4px'}}>Mentorship Session with Rahul</h4>
            <p style={{fontSize: '0.9rem', color: '#64748b'}}>Today, 4:00 PM - 5:00 PM • Google Meet</p>
          </div>
          <button className="btn btn-primary" style={{marginLeft: 'auto', padding: '8px 16px', fontSize: '0.9rem'}}>Join</button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MentorDashboard;

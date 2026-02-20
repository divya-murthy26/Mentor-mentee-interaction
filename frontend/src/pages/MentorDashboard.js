import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import './MentorDashboard.css';

const navItems = [
  { path: '/mentor/overview', label: 'Overview' },
  { path: '/mentor/requests', label: 'Meeting Requests' },
  { path: '/mentor/sessions', label: 'Session History' },
  { path: '/mentor/mentees', label: 'My Mentees' },
  { path: '/mentor/profile', label: 'My Profile' },
];

const mockRequests = [
  { id: 1, mentee: 'Aarav Sharma', subject: 'React - State Management', date: '2024-06-12', time: '10:00 AM', message: 'Need help understanding Redux flow.' },
  { id: 2, mentee: 'Sneha Nair', subject: 'DSA - Linked Lists', date: '2024-06-13', time: '2:00 PM', message: 'Stuck on reversing a linked list problem.' },
];

const mockHistory = [
  { id: 1, mentee: 'Aarav Sharma', subject: 'Project Setup', date: '2024-06-10', duration: '1.5 hrs', status: 'Completed' },
  { id: 2, mentee: 'Sneha Nair', subject: 'Python Basics', date: '2024-06-08', duration: '1.0 hrs', status: 'Completed' },
  { id: 3, mentee: 'Aarav Sharma', subject: 'Git & GitHub', date: '2024-06-05', duration: '1.0 hrs', status: 'Completed' },
];

function MentorOverview() {
  return (
    <div className="fade-in">
      <div className="stat-cards">
        {[
          { label: 'My Mentees', value: '2', change: 'Max Limit Reached' },
          { label: 'Sessions This Month', value: '18', change: 'vs 12 last month' },
          { label: 'Pending Requests', value: '3', change: 'Awaiting response' },
        ].map((s, i) => (
          <div key={i} className="stat-card fade-in" style={{animationDelay:i*0.08+'s'}}>
            <div className="value">{s.value}</div>
            <div className="label">{s.label}</div>
            <div className="change">{s.change}</div>
          </div>
        ))}
      </div>

      <div className="mentor-grid">
        <div className="card">
          <div className="section-header"><h2>Pending Requests</h2><p>Meeting requests awaiting your response</p></div>
          {mockRequests.slice(0,2).map(r => (
            <div key={r.id} className="request-mini">
              <div className="cell-av">{r.mentee[0]}</div>
              <div className="req-info">
                <strong>{r.mentee}</strong>
                <span>{r.subject} — {r.date} at {r.time}</span>
              </div>
              <div className="req-actions">
                <button className="btn-green" style={{padding:'6px 14px',fontSize:12}}>Accept</button>
                <button className="btn-danger" style={{padding:'6px 14px',fontSize:12}}>Decline</button>
              </div>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="section-header"><h2>Upcoming Schedule</h2><p>Your next sessions</p></div>
          {[
            {mentee:'Aarav Sharma', date:'Jun 12', time:'10:00 AM', topic:'React - State Management'},
            {mentee:'Sneha Nair', date:'Jun 13', time:'2:00 PM', topic:'DSA - Linked Lists'},
          ].map((s,i) => (
            <div key={i} className="schedule-item">
              <div className="schedule-date">
                <div className="sched-day">{s.date.split(' ')[1]}</div>
                <div className="sched-mon">{s.date.split(' ')[0]}</div>
              </div>
              <div className="schedule-info">
                <strong>{s.mentee}</strong>
                <span>{s.time} · {s.topic}</span>
              </div>
              <span className="badge badge-blue">Confirmed</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MeetingRequests() {
  const [requests, setRequests] = useState(mockRequests.map(r => ({...r, status: 'Pending'})));

  const respond = (id, action) => {
    setRequests(reqs => reqs.map(r => r.id === id ? {...r, status: action} : r));
  };

  return (
    <div className="fade-in">
      <div className="section-header"><h2>Meeting Requests</h2><p>Accept or decline session requests from your mentees</p></div>
      <div className="requests-list">
        {requests.map(r => (
          <div key={r.id} className="card request-card">
            <div className="request-top">
              <div className="cell-name">
                <div className="cell-av" style={{width:44,height:44,borderRadius:12,background:'var(--green)',color:'#fff',fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center'}}>{r.mentee[0]}</div>
                <div>
                  <strong style={{fontSize:16}}>{r.mentee}</strong>
                  <div style={{fontSize:13,color:'var(--text-muted)',marginTop:2}}>{r.subject}</div>
                </div>
              </div>
              <span className={`badge ${r.status==='Accepted'?'badge-green':r.status==='Declined'?'badge-red':'badge-orange'}`}>{r.status}</span>
            </div>
            <div className="request-details">
              <div className="req-detail">{r.date}</div>
              <div className="req-detail">{r.time}</div>
            </div>
            <div className="request-message">
              <p>"{r.message}"</p>
            </div>
            {r.status === 'Pending' && (
              <div className="request-footer">
                <button className="btn-green" onClick={() => respond(r.id, 'Accepted')}>✓ Accept Request</button>
                <button className="btn-danger" onClick={() => respond(r.id, 'Declined')}>✕ Decline</button>
              </div>
            )}
            {r.status !== 'Pending' && (
              <div className="request-footer">
                <span style={{fontSize:13, color: r.status==='Accepted' ? 'var(--green)' : '#c62828', fontWeight:600}}>
                  {r.status === 'Accepted' ? '✓ You accepted this request' : '✕ You declined this request'}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function SessionHistory() {
  return (
    <div className="fade-in">
      <div className="section-header"><h2>Session History</h2><p>All your completed sessions</p></div>
      <div className="card">
        <table className="data-table">
          <thead><tr><th>Mentee</th><th>Topic</th><th>Date</th><th>Duration</th><th>Status</th></tr></thead>
          <tbody>
            {mockHistory.map(s => (
              <tr key={s.id}>
                <td><div className="cell-name"><div className="cell-av" style={{background:'var(--green)'}}>{s.mentee[0]}</div><strong>{s.mentee}</strong></div></td>
                <td><span className="badge badge-blue">{s.subject}</span></td>
                <td>{s.date}</td>
                <td>{s.duration}</td>
                <td><span className="badge badge-green">{s.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MyMentees() {
  return (
    <div className="fade-in">
      <div className="section-header">
        <h2>My Mentees</h2>
        <p>Managed Mentees (Max 2 allowed per FCI rule)</p>
      </div>
      <div className="mentees-grid">
        {[
          { name: 'Aarav Sharma', branch: 'CSE', batch: '2025', sessions: 8, progress: 78, lastSession: 'Jun 10' },
          { name: 'Sneha Nair', branch: 'ISE', batch: '2026', sessions: 6, progress: 65, lastSession: 'Jun 8' },
        ].map((m, i) => (
          <div key={i} className="card mentee-card">
            <div className="mentee-av">{m.name[0]}</div>
            <h3>{m.name}</h3>
            <p style={{fontSize:13,color:'var(--text-muted)'}}>{m.branch} · Batch {m.batch}</p>
            <div className="mentee-stats">
              <div><strong>{m.sessions}</strong><span>Sessions</span></div>
              <div><strong>{m.progress}%</strong><span>Progress</span></div>
              <div><strong>{m.lastSession}</strong><span>Last Session</span></div>
            </div>
            <div className="prog-track" style={{marginTop:14}}>
              <div className="prog-fill" style={{width:m.progress+'%'}} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MentorProfile() {
  return (
    <div className="fade-in">
      <div className="profile-layout">
        <div className="card profile-card">
          <div className="profile-avatar">P</div>
          <h2>Dr. Priya Sharma</h2>
          <p style={{color:'var(--text-muted)',fontSize:14}}>priya@example.com</p>
          <div className="profile-badges">
            <span className="badge badge-blue">Data Science</span>
            <span className="badge badge-green">Active Mentor</span>
          </div>
          <div className="profile-meta">
            <div><strong>48</strong><span>Total Sessions</span></div>
            <div><strong>2</strong><span>Mentees</span></div>
          </div>
        </div>
        <div className="card" style={{flex:1}}>
          <h3 style={{marginBottom:24}}>Edit Profile</h3>
          <div className="form-row-2">
            <div className="form-group"><label>Full Name</label><input defaultValue="Dr. Priya Sharma" /></div>
            <div className="form-group"><label>Email</label><input defaultValue="priya@example.com" /></div>
            <div className="form-group"><label>Phone</label><input defaultValue="+91 98765 43210" /></div>
            <div className="form-group"><label>Company Name</label><input defaultValue="Google" /></div>
            <div className="form-group"><label>Domain / Specialization</label><input defaultValue="Data Science" /></div>
            <div className="form-group"><label>Years of Experience</label><input defaultValue="8" type="number" /></div>
          </div>
          <div className="form-group"><label>Bio</label><textarea rows={3} defaultValue="Passionate mathematics educator with 8 years of experience helping students excel." /></div>
          <button className="btn-primary">Save Changes</button>
        </div>
      </div>
    </div>
  );
}

export default function MentorDashboard() {
  return (
    <DashboardLayout title="Mentor Dashboard" navItems={navItems}>
      <Routes>
        <Route index element={<Navigate to="overview" />} />
        <Route path="overview" element={<MentorOverview />} />
        <Route path="requests" element={<MeetingRequests />} />
        <Route path="sessions" element={<SessionHistory />} />
        <Route path="mentees" element={<MyMentees />} />
        <Route path="profile" element={<MentorProfile />} />
      </Routes>
    </DashboardLayout>
  );
}

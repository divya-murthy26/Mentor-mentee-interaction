import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import './MenteeDashboard.css';

const navItems = [
  { path: '/mentee/overview', label: 'Overview' },
  { path: '/mentee/schedule', label: 'Schedule Interaction' },
  { path: '/mentee/interactions', label: 'My Interactions' },
  { path: '/mentee/feedback', label: 'Submit Feedback' },
  { path: '/mentee/profile', label: 'My Profile' },
];

const myInteractionHistory = [
  { id: 1, mentor: 'Dr. Priya Sharma', topic: 'React - Hooks', date: '2024-06-10', time: '10:00 AM', status: 'Completed', feedbackStatus: 'Approved' },
  { id: 2, mentor: 'Dr. Priya Sharma', topic: 'DSA - Trees', date: '2024-06-08', time: '10:00 AM', status: 'Completed', feedbackStatus: 'Pending Approval' },
  { id: 3, mentor: 'Dr. Priya Sharma', topic: 'System Design', date: '2024-06-12', time: '10:00 AM', status: 'Upcoming', feedbackStatus: 'N/A' },
  { id: 4, mentor: 'Dr. Priya Sharma', topic: 'Resume Review', date: '2024-06-05', time: '10:00 AM', status: 'Completed', feedbackStatus: 'Pending Submission' },
];

function MenteeOverview() {
  return (
    <div className="fade-in">
      <div className="mentee-welcome">
        <div>
          <h2>Hello, Aarav!</h2>
          <p>Welcome to your mentorship dashboard. Stay consistent with your interactions.</p>
        </div>
        <div className="progress-ring">
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#e3f2fd" strokeWidth="8" />
            <circle cx="50" cy="50" r="40" fill="none" stroke="#1e88c8" strokeWidth="8"
              strokeDasharray={`${100 * 2.51} ${100 * 2.51}`} strokeLinecap="round" transform="rotate(-90 50 50)" />
          </svg>
          <div className="ring-label"><strong>2/2</strong><span>Goal Met</span></div>
        </div>
      </div>

      <div className="stat-cards">
        {[
          { label: 'Interactions', value: '2', change: 'This month' },
          { label: 'Pending Feedback', value: '1', change: 'Action Required' },
          { label: 'Pending Requests', value: '1', change: 'Awaiting response' },
        ].map((s, i) => (
          <div key={i} className="stat-card fade-in" style={{animationDelay:i*0.08+'s'}}>
            <div className="value">{s.value}</div>
            <div className="label">{s.label}</div>
            <div className="change">{s.change}</div>
          </div>
        ))}
      </div>

      <div className="mentee-overview-grid">
        <div className="card">
          <div className="section-header"><h2>Monthly Goal</h2></div>
          <div style={{background:'var(--primary-light)', padding:'20px', borderRadius:'12px', textAlign:'center'}}>
            <h3 style={{color:'var(--primary-dark)', marginBottom:'8px'}}>2 Interactions Required</h3>
            <p style={{fontSize:'14px', color:'var(--text-muted)'}}>FCI Rule: You must complete at least 2 interactions per month with your mentor.</p>
            <div style={{marginTop:'16px', fontWeight:'bold', color:'var(--green)'}}>Current Status: On Track</div>
          </div>
        </div>

        <div className="card">
          <div className="section-header"><h2>Next Interaction</h2></div>
          <div className="next-session">
            <div className="next-session-icon">📅</div>
            <div>
              <h3>System Design Discussion</h3>
              <p>With <strong>Dr. Priya Sharma</strong></p>
              <p style={{marginTop:6}}>June 12, 2024 at 10:00 AM</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="section-header"><h2>My Mentor</h2></div>
          <div className="mentor-info-card">
            <div className="mentor-big-av">P</div>
            <h3>Dr. Priya Sharma</h3>
            <p>Senior Data Scientist @ Google</p>
            <div className="mentor-rating">48 Interactions</div>
            <button className="btn-primary" style={{marginTop:16, width:'100%', justifyContent:'center'}}>Schedule Interaction</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScheduleInteraction() {
  const [subject, setSubject] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject || !date || !time) return;
    setSubmitted(true);
  };

  return (
    <div className="fade-in">
      <div className="section-header"><h2>Schedule Interaction</h2><p>Request a meeting with your assigned mentor</p></div>
      <div className="schedule-layout">
        <div className="card" style={{flex:1}}>
          {submitted ? (
            <div className="success-state">
              <h3>Request Sent!</h3>
              <p>Your interaction request has been sent to Dr. Priya Sharma. You'll be notified once she responds.</p>
              <button className="btn-primary" style={{marginTop:20}} onClick={() => setSubmitted(false)}>Schedule Another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Topic (Tech Related)</label>
                <select value={subject} onChange={e=>setSubject(e.target.value)}>
                  <option value="">Select topic...</option>
                  <option>Data Structures & Algorithms</option><option>Web Development (React/Node)</option><option>System Design</option>
                  <option>Resume Review</option><option>Mock Interview</option><option>Career Guidance</option>
                </select>
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label>Preferred Date</label>
                  <input type="date" value={date} onChange={e=>setDate(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Preferred Time</label>
                  <input type="time" value={time} onChange={e=>setTime(e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label>Message to Mentor (Optional)</label>
                <textarea rows={4} placeholder="Tell your mentor what you'd like help with..." value={note} onChange={e=>setNote(e.target.value)} />
              </div>
              <button type="submit" className="btn-primary" style={{width:'100%',justifyContent:'center'}}>
                Send Request
              </button>
            </form>
          )}
        </div>
        <div className="card schedule-info-panel">
          <h3>My Mentor</h3>
          <div className="mentor-mini">
            <div className="cell-av" style={{width:52,height:52,borderRadius:14,fontSize:20}}>P</div>
            <div>
              <strong>Dr. Priya Sharma</strong>
              <span>Data Science</span>
            </div>
          </div>
          <div style={{borderTop:'1px solid var(--border)', paddingTop:20,marginTop:20}}>
            <h4 style={{marginBottom:12,fontSize:13,color:'var(--text-muted)',fontWeight:700,textTransform:'uppercase'}}>Available Slots</h4>
            {[['Mon, Jun 12', '10:00 AM'], ['Wed, Jun 14', '2:00 PM'], ['Fri, Jun 16', '11:00 AM']].map(([d,t],i) => (
              <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid var(--border)',fontSize:14}}>
                <span>{d}</span><span className="badge badge-green">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MyInteractions() {
  return (
    <div className="fade-in">
      <div className="section-header"><h2>My Interactions</h2><p>History of your mentorship meetings</p></div>
      <div className="session-status-tabs">
        {['All', 'Upcoming', 'Completed'].map(tab => (
          <button key={tab} className={`tab-btn ${tab === 'All' ? 'active' : ''}`}>{tab}</button>
        ))}
      </div>
      <div className="card">
        <table className="data-table">
          <thead><tr><th>Mentor</th><th>Topic</th><th>Date</th><th>Time</th><th>Status</th><th>Feedback Status</th></tr></thead>
          <tbody>
            {myInteractionHistory.map(s => (
              <tr key={s.id}>
                <td><div className="cell-name"><div className="cell-av">{s.mentor[0]}</div><strong>{s.mentor}</strong></div></td>
                <td><span className="badge badge-blue">{s.topic}</span></td>
                <td>{s.date}</td>
                <td>{s.time}</td>
                <td><span className={`badge ${s.status==='Completed'?'badge-green':'badge-orange'}`}>{s.status}</span></td>
                <td>
                  {s.status === 'Completed' ? (
                    s.feedbackStatus === 'Pending Submission' ? <button className="btn-edit" style={{padding:'5px 12px',fontSize:12}}>Submit Now</button> :
                    s.feedbackStatus === 'Approved' ? <span className="badge badge-green">Approved</span> :
                    <span className="badge badge-orange">Pending Approval</span>
                  ) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SubmitFeedback() {
  const [session, setSession] = useState('');
  const [mode, setMode] = useState('Online');
  const [duration, setDuration] = useState('');
  const [topics, setTopics] = useState('');
  const [learnings, setLearnings] = useState('');
  const [challenges, setChallenges] = useState('');
  const [goals, setGoals] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="fade-in">
      <div className="section-header"><h2>Submit Feedback</h2><p>Monthly interaction report (Required for FCI)</p></div>
      <div className="feedback-layout">
        <div className="card" style={{flex:1}}>
          {submitted ? (
            <div className="success-state">
              <h3>Feedback Submitted!</h3>
              <p>Your report has been sent to your mentor for approval. Once approved, it will be filed with the admin.</p>
              <button className="btn-primary" style={{marginTop:20}} onClick={() => { setSubmitted(false); setTopics(''); }}>Submit Another Report</button>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); if(session) setSubmitted(true); }}>
              <div className="form-row-2">
                <div className="form-group">
                  <label>Select Interaction</label>
                  <select value={session} onChange={e=>setSession(e.target.value)}>
                    <option value="">Choose an interaction...</option>
                    <option>Dr. Priya Sharma — Jun 10</option>
                    <option>Dr. Priya Sharma — Jun 8</option>
                  </select>
                </div>
                <div className="form-group"><label>Mentor Name</label><input value="Dr. Priya Sharma" disabled style={{background:'#f5f7fa'}} /></div>
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label>Mode of Communication</label>
                  <select value={mode} onChange={e=>setMode(e.target.value)}>
                    <option>Online (Video Call)</option>
                    <option>Offline (In-Person)</option>
                    <option>Phone Call</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Duration (Hours)</label>
                  <input type="number" step="0.5" placeholder="1.0" value={duration} onChange={e=>setDuration(e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label>Topics Discussed (Tech Related)</label>
                <textarea rows={2} placeholder="e.g. React Hooks, API Integration, System Design..." value={topics} onChange={e=>setTopics(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Key Learnings</label>
                <textarea rows={2} placeholder="What did you learn from this interaction?" value={learnings} onChange={e=>setLearnings(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Challenges Faced</label>
                <textarea rows={2} placeholder="Any difficulties you are facing?" value={challenges} onChange={e=>setChallenges(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Goals for Next Month</label>
                <textarea rows={2} placeholder="What do you plan to achieve next?" value={goals} onChange={e=>setGoals(e.target.value)} />
              </div>
              <button type="submit" className="btn-primary" style={{width:'100%',justifyContent:'center'}}>Submit Feedback</button>
            </form>
          )}
        </div>
        <div className="card feedback-tips">
          <h3>Feedback Flow</h3>
          <div className="tips-list">
            {[
              { title: '1. Submit', desc: 'Fill out the structured form after your interaction.' },
              { title: '2. Mentor Approval', desc: 'Your mentor reviews and approves the details.' },
              { title: '3. Admin Record', desc: 'Approved feedback is filed and downloadable as PDF.' },
            ].map((t, i) => (
              <div key={i} className="tip-item">
                <div><strong>{t.title}</strong><p>{t.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MenteeProfile() {
  return (
    <div className="fade-in">
      <div className="profile-layout">
        <div className="card profile-card" style={{textAlign:'center',width:280}}>
          <div className="profile-avatar" style={{background:'var(--green)'}}>A</div>
          <h2>Aarav Sharma</h2>
          <p style={{color:'var(--text-muted)',fontSize:14}}>aarav@example.com</p>
          <div style={{display:'flex',gap:8,justifyContent:'center',margin:'16px 0',flexWrap:'wrap'}}>
            <span className="badge badge-blue">CSE</span>
            <span className="badge badge-green">Active</span>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginTop:20,borderTop:'1px solid var(--border)',paddingTop:20}}>
            {[{v:'8',l:'Interactions'},{v:'2/2',l:'Goal'},{v:'2025',l:'Batch'}].map((m,i) => (
              <div key={i} style={{display:'flex',flexDirection:'column',gap:4}}>
                <strong style={{fontSize:16,fontWeight:800,color:'var(--primary)'}}>{m.v}</strong>
                <span style={{fontSize:11,color:'var(--text-muted)'}}>{m.l}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card" style={{flex:1}}>
          <h3 style={{marginBottom:24}}>My Information</h3>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
            <div className="form-group"><label>Full Name</label><input defaultValue="Aarav Sharma" /></div>
            <div className="form-group"><label>Email</label><input defaultValue="aarav@example.com" /></div>
            <div className="form-group"><label>Branch</label><input defaultValue="CSE" /></div>
            <div className="form-group"><label>FCI Batch</label><input defaultValue="2025" /></div>
            <div className="form-group"><label>Location</label><input defaultValue="Bangalore" /></div>
          </div>
          <div className="form-group"><label>Learning Goals</label><textarea rows={3} defaultValue="I want to master Full Stack Development and get an internship at a top product company." /></div>
          <button className="btn-primary">Save Changes</button>
        </div>
      </div>
    </div>
  );
}

export default function MenteeDashboard() {
  return (
    <DashboardLayout title="Mentee Dashboard" navItems={navItems}>
      <Routes>
        <Route index element={<Navigate to="overview" />} />
        <Route path="overview" element={<MenteeOverview />} />
        <Route path="schedule" element={<ScheduleInteraction />} />
        <Route path="interactions" element={<MyInteractions />} />
        <Route path="feedback" element={<SubmitFeedback />} />
        <Route path="profile" element={<MenteeProfile />} />
      </Routes>
    </DashboardLayout>
  );
}

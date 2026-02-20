import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts';
import './AdminDashboard.css';

const navItems = [
  { path: '/admin/overview', label: 'Overview' },
  { path: '/admin/mentors', label: 'Manage Mentors' },
  { path: '/admin/mentees', label: 'Manage Mentees' },
  { path: '/admin/assign', label: 'Assign Pairs' },
  { path: '/admin/sessions', label: 'Sessions' },
  { path: '/admin/feedback', label: 'Feedback' },
];

const sessionData = [
  { month: 'Jan', sessions: 120 }, { month: 'Feb', sessions: 180 },
  { month: 'Mar', sessions: 220 }, { month: 'Apr', sessions: 195 },
  { month: 'May', sessions: 280 }, { month: 'Jun', sessions: 310 },
];
const enrollData = [
  { month: 'Jan', mentors: 40, mentees: 80 }, { month: 'Feb', mentors: 55, mentees: 110 },
  { month: 'Mar', mentors: 70, mentees: 145 }, { month: 'Apr', mentors: 85, mentees: 180 },
  { month: 'May', mentors: 100, mentees: 220 }, { month: 'Jun', mentors: 120, mentees: 260 },
];

const mockMentors = [
  { id: 1, name: 'Dr. Priya Sharma', email: 'priya@ex.com', company: 'Google', domain: 'Data Science', mentees: 4, status: 'Active' },
  { id: 2, name: 'Mr. Rajan Patel', email: 'rajan@ex.com', company: 'Microsoft', domain: 'Cloud Computing', mentees: 3, status: 'Active' },
  { id: 3, name: 'Ms. Anita Singh', email: 'anita@ex.com', company: 'Amazon', domain: 'Web Dev', mentees: 5, status: 'Active' },
  { id: 4, name: 'Mr. Vikram Nair', email: 'vikram@ex.com', company: 'StartupInc', domain: 'Cybersecurity', mentees: 2, status: 'Inactive' },
];

const mockMentees = [
  { id: 1, name: 'Aarav Sharma', email: 'aarav@ex.com', branch: 'CSE', batch: '2025', mentor: 'Dr. Priya', status: 'Active' },
  { id: 2, name: 'Riya Patel', email: 'riya@ex.com', branch: 'ISE', batch: '2026', mentor: 'Mr. Rajan', status: 'Active' },
  { id: 3, name: 'Sneha Nair', email: 'sneha@ex.com', branch: 'ECE', batch: '2025', mentor: 'Ms. Anita', status: 'Active' },
  { id: 4, name: 'Dev Kumar', email: 'dev@ex.com', branch: 'CSE', batch: '2027', mentor: 'Unassigned', status: 'Pending' },
];

const mockSessions = [
  { id: 1, mentee: 'Aarav Sharma', mentor: 'Dr. Priya', date: '2024-06-10', time: '10:00 AM', subject: 'Math', status: 'Completed' },
  { id: 2, mentee: 'Riya Patel', mentor: 'Mr. Rajan', date: '2024-06-11', time: '11:30 AM', subject: 'English', status: 'Upcoming' },
  { id: 3, mentee: 'Sneha Nair', mentor: 'Ms. Anita', date: '2024-06-11', time: '2:00 PM', subject: 'Science', status: 'Upcoming' },
  { id: 4, mentee: 'Aarav Sharma', mentor: 'Dr. Priya', date: '2024-06-12', time: '10:00 AM', subject: 'Math', status: 'Scheduled' },
];

const mockFeedback = [
  { id: 1, mentee: 'Aarav Sharma', mentor: 'Dr. Priya', date: '2024-06-10', mode: 'Online', duration: '1.5', discussion: 'Discussed final year project ideas and tech stack selection.', outcome: 'Selected React and Node.js for the project.' },
  { id: 2, mentee: 'Riya Patel', mentor: 'Mr. Rajan', date: '2024-06-08', mode: 'In-Person', duration: '1', discussion: 'Resume review and mock interview preparation.', outcome: 'Resume updated, scheduled mock interview.' },
];

// Overview
function Overview() {
  return (
    <div className="fade-in">
      <div className="stat-cards">
        {[
          { label: 'Total Mentees', value: '142', change: '+12% this month' },
          { label: 'Total Mentors', value: '58', change: '+5% this month' },
          { label: 'Sessions This Month', value: '310', change: '+18% vs last' },
        ].map((s, i) => (
          <div key={i} className="stat-card fade-in" style={{animationDelay: i*0.08+'s'}}>
            <div className="value">{s.value}</div>
            <div className="label">{s.label}</div>
            <div className="change">{s.change}</div>
          </div>
        ))}
      </div>

      <div className="charts-grid" style={{gridTemplateColumns: '1fr'}}>
        <div className="card chart-card">
          <h3>Monthly Interactions</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={sessionData}>
              <defs>
                <linearGradient id="sessGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1e88c8" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#1e88c8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{fontSize:12}} />
              <YAxis tick={{fontSize:12}} />
              <Tooltip />
              <Area type="monotone" dataKey="sessions" stroke="#1e88c8" fill="url(#sessGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card" style={{marginTop: 24}}>
        <div className="section-header"><h2>Recent Sessions</h2><p>Latest activity on the platform</p></div>
        <table className="data-table">
          <thead><tr><th>Mentee</th><th>Mentor</th><th>Date</th><th>Subject</th><th>Status</th></tr></thead>
          <tbody>
            {mockSessions.slice(0,4).map(s => (
              <tr key={s.id}>
                <td><strong>{s.mentee}</strong></td>
                <td>{s.mentor}</td>
                <td>{s.date}</td>
                <td>{s.subject}</td>
                <td><span className={`badge ${s.status==='Completed'?'badge-green':s.status==='Upcoming'?'badge-blue':'badge-orange'}`}>{s.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Manage Mentors
function ManageMentors() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', company: '', domain: '', experience: '' });

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="section-header"><h2>Manage Mentors</h2><p>Create, view and manage all mentors</p></div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Close' : 'Add Mentor'}
        </button>
      </div>

      {showForm && (
        <div className="card form-card fade-in">
          <h3>Create New Mentor</h3>
          <div className="form-row-2">
            <div className="form-group"><label>Full Name</label><input placeholder="Dr. Priya Sharma" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
            <div className="form-group"><label>Email</label><input type="email" placeholder="mentor@example.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></div>
            <div className="form-group"><label>Company Name</label><input placeholder="Google, Microsoft, etc." value={form.company} onChange={e=>setForm({...form,company:e.target.value})} /></div>
            <div className="form-group"><label>Domain / Specialization</label><input placeholder="AI, Web Dev, CyberSec..." value={form.domain} onChange={e=>setForm({...form,domain:e.target.value})} /></div>
            <div className="form-group"><label>Years of Experience</label><input type="number" placeholder="5" value={form.experience} onChange={e=>setForm({...form,experience:e.target.value})} /></div>
          </div>
          <div className="form-actions">
            <button className="btn-primary">Create Mentor</button>
            <button className="btn-secondary" onClick={()=>setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="card">
        <table className="data-table">
          <thead><tr><th>Name</th><th>Email</th><th>Company</th><th>Domain</th><th>Mentees</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {mockMentors.map(m => (
              <tr key={m.id}>
                <td><div className="cell-name"><div className="cell-av">{m.name[0]}</div><strong>{m.name}</strong></div></td>
                <td style={{color:'var(--text-muted)'}}>{m.email}</td>
                <td>{m.company}</td>
                <td><span className="badge badge-blue">{m.domain}</span></td>
                <td><strong>{m.mentees}</strong></td>
                <td><span className={`badge ${m.status==='Active'?'badge-green':'badge-orange'}`}>{m.status}</span></td>
                <td><div className="cell-actions"><button className="btn-edit">Edit</button><button className="btn-danger">Remove</button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Manage Mentees
function ManageMentees() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', branch: '', batch: '' });

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="section-header"><h2>Manage Mentees</h2><p>Enroll and manage children in the program</p></div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Close' : 'Enroll Mentee'}
        </button>
      </div>

      {showForm && (
        <div className="card form-card fade-in">
          <h3>Enroll New Mentee</h3>
          <div className="form-row-2">
            <div className="form-group"><label>Full Name</label><input placeholder="Aarav Sharma" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
            <div className="form-group"><label>Email / Guardian Email</label><input type="email" placeholder="guardian@example.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></div>
            <div className="form-group"><label>Branch</label><input placeholder="CSE, ISE, ECE..." value={form.branch} onChange={e=>setForm({...form,branch:e.target.value})} /></div>
            <div className="form-group"><label>FCI Batch</label><input placeholder="2024, 2025..." value={form.batch} onChange={e=>setForm({...form,batch:e.target.value})} /></div>
          </div>
          <div className="form-actions">
            <button className="btn-primary">Enroll Mentee</button>
            <button className="btn-secondary" onClick={()=>setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="card">
        <table className="data-table">
          <thead><tr><th>Name</th><th>Email</th><th>Branch</th><th>Batch</th><th>Assigned Mentor</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {mockMentees.map(m => (
              <tr key={m.id}>
                <td><div className="cell-name"><div className="cell-av" style={{background:'var(--green)'}}>{m.name[0]}</div><strong>{m.name}</strong></div></td>
                <td style={{color:'var(--text-muted)'}}>{m.email}</td>
                <td>{m.branch}</td>
                <td>{m.batch}</td>
                <td>{m.mentor === 'Unassigned' ? <span className="badge badge-orange">Unassigned</span> : m.mentor}</td>
                <td><span className={`badge ${m.status==='Active'?'badge-green':'badge-orange'}`}>{m.status}</span></td>
                <td><div className="cell-actions"><button className="btn-edit">Edit</button><button className="btn-danger">Remove</button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Assign
function AssignPairs() {
  const [mentee, setMentee] = useState('');
  const [mentor, setMentor] = useState('');
  const [assigned, setAssigned] = useState([
    { mentee: 'Aarav Sharma', mentor: 'Dr. Priya Sharma', subject: 'Mathematics', date: '2024-06-01' },
    { mentee: 'Riya Patel', mentor: 'Mr. Rajan Patel', subject: 'English', date: '2024-06-02' },
    { mentee: 'Sneha Nair', mentor: 'Ms. Anita Singh', subject: 'Science', date: '2024-06-03' },
  ]);

  const handleAssign = () => {
    if (!mentee || !mentor) return;
    setAssigned([...assigned, { mentee, mentor, subject: 'General', date: new Date().toISOString().split('T')[0] }]);
    setMentee(''); setMentor('');
  };

  return (
    <div className="fade-in">
      <div className="section-header"><h2>Assign Mentor-Mentee Pairs</h2><p>Create and manage mentor-mentee relationships</p></div>
      <div className="assign-grid">
        <div className="card">
          <h3>New Assignment</h3>
          <p style={{color:'var(--text-muted)',fontSize:14,marginBottom:24}}>Select a mentee and mentor to create a new pairing.</p>
          <div className="form-group">
            <label>Select Mentee</label>
            <select value={mentee} onChange={e=>setMentee(e.target.value)}>
              <option value="">Choose a mentee...</option>
              {mockMentees.map(m => <option key={m.id}>{m.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Select Mentor</label>
            <select value={mentor} onChange={e=>setMentor(e.target.value)}>
              <option value="">Choose a mentor...</option>
              {mockMentors.map(m => <option key={m.id}>{m.name}</option>)}
            </select>
          </div>
          <button className="btn-primary" onClick={handleAssign} style={{width:'100%',justifyContent:'center',marginTop:8}}>
            Assign Pair
          </button>
        </div>
        <div className="card">
          <h3 style={{marginBottom:20}}>Current Assignments</h3>
          <div className="assign-list">
            {assigned.map((a, i) => (
              <div key={i} className="assign-item">
                <div className="assign-avatars">
                  <div className="cell-av" style={{width:36,height:36,borderRadius:10,background:'var(--green)',color:'#fff',fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14}}>{a.mentee[0]}</div>
                  <span className="assign-arrow">→</span>
                  <div className="cell-av" style={{width:36,height:36,borderRadius:10,background:'var(--primary)',color:'#fff',fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14}}>{a.mentor[0]}</div>
                </div>
                <div className="assign-info">
                  <div><strong>{a.mentee}</strong> with <strong>{a.mentor}</strong></div>
                  <div style={{fontSize:12,color:'var(--text-muted)'}}>Since {a.date}</div>
                </div>
                <button className="btn-danger" style={{fontSize:12,padding:'6px 12px'}}>Unassign</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Sessions
function Sessions() {
  return (
    <div className="fade-in">
      <div className="section-header"><h2>All Sessions</h2><p>View and manage all scheduled and completed sessions</p></div>
      <div className="stat-cards" style={{gridTemplateColumns:'repeat(4,1fr)'}}>
        {[
          {label:'Total Sessions',value:'1,240',badge:'All Time'},
          {label:'This Month',value:'310',badge:'Jun 2024'},
          {label:'Upcoming',value:'48',badge:'Next 7 Days'},
          {label:'Completed',value:'1,192',badge:'Historical'},
        ].map((s,i) => (
          <div key={i} className="card" style={{textAlign:'center',padding:'20px'}}>
            <div style={{fontSize:28,fontWeight:800,color:'var(--primary)'}}>{s.value}</div>
            <div style={{fontSize:13,color:'var(--text-muted)',marginTop:4}}>{s.label}</div>
            <span className="badge badge-blue" style={{marginTop:8}}>{s.badge}</span>
          </div>
        ))}
      </div>
      <div className="card">
        <table className="data-table">
          <thead><tr><th>Mentee</th><th>Mentor</th><th>Date</th><th>Time</th><th>Subject</th><th>Status</th></tr></thead>
          <tbody>
            {[...mockSessions, ...mockSessions.map((s,i) => ({...s, id:s.id+10, date:'2024-06-1'+i, status:'Completed'}))].map(s => (
              <tr key={s.id}>
                <td><strong>{s.mentee}</strong></td>
                <td>{s.mentor}</td>
                <td>{s.date}</td>
                <td>{s.time}</td>
                <td><span className="badge badge-blue">{s.subject}</span></td>
                <td><span className={`badge ${s.status==='Completed'?'badge-green':s.status==='Upcoming'?'badge-blue':'badge-orange'}`}>{s.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Feedback
function Feedback() {
  return (
    <div className="fade-in">
      <div className="section-header"><h2>Session Reports</h2><p>Review structured feedback and outcomes from sessions</p></div>
      <div className="feedback-cards" style={{display:'flex', flexDirection:'column', gap:'16px'}}>
        {mockFeedback.map(f => (
          <div key={f.id} className="card feedback-card" style={{display:'block'}}>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'12px', borderBottom:'1px solid var(--border)', paddingBottom:'12px'}}>
              <div>
                <strong>{f.mentee}</strong> <span style={{color:'var(--text-muted)'}}>with</span> <strong>{f.mentor}</strong>
              </div>
              <div style={{fontSize:'13px', color:'var(--text-muted)'}}>
                {f.date} · {f.mode} · {f.duration} hrs
              </div>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px'}}>
              <div>
                <div style={{fontSize:'12px', fontWeight:'700', color:'var(--text-muted)', textTransform:'uppercase', marginBottom:'4px'}}>Discussion Points</div>
                <p style={{fontSize:'14px', lineHeight:'1.5'}}>{f.discussion}</p>
              </div>
              <div>
                <div style={{fontSize:'12px', fontWeight:'700', color:'var(--text-muted)', textTransform:'uppercase', marginBottom:'4px'}}>Outcome / Progress</div>
                <p style={{fontSize:'14px', lineHeight:'1.5'}}>{f.outcome}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <DashboardLayout title="Admin Dashboard" navItems={navItems}>
      <Routes>
        <Route index element={<Navigate to="overview" />} />
        <Route path="overview" element={<Overview />} />
        <Route path="mentors" element={<ManageMentors />} />
        <Route path="mentees" element={<ManageMentees />} />
        <Route path="assign" element={<AssignPairs />} />
        <Route path="sessions" element={<Sessions />} />
        <Route path="feedback" element={<Feedback />} />
      </Routes>
    </DashboardLayout>
  );
}

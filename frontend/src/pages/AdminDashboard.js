import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mentorService, menteeService, feedbackService, interactionService, statsService } from '../services/apiService';
import api from '../services/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import './Dashboard.css';

const PIE_COLORS = ['#f59e0b','#0F4C5C','#10b981','#ef4444'];

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [mentors, setMentors] = useState([]);
  const [mentees, setMentees] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [interactions, setInteractions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(null);
  const [mentorForm, setMentorForm] = useState({ name: '', email: '', password: '', expertise: '' });
  const [menteeForm, setMenteeForm] = useState({ name: '', email: '', password: '', goal: '' });
  const [assignForm, setAssignForm] = useState({ menteeId: '', mentorId: '' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [m, me, fb, inter, st] = await Promise.all([
        mentorService.getAll(), menteeService.getAll(),
        feedbackService.getAll(), interactionService.getAll(), statsService.admin()
      ]);
      setMentors(m.data.data); setMentees(me.data.data);
      setFeedback(fb.data.data); setInteractions(inter.data.data);
      setStats(st.data.data);
    } catch { setError('Failed to load data.'); }
    finally { setLoading(false); }
  };

  const msg = (m, err=false) => {
    err ? setError(m) : setSuccess(m);
    setTimeout(() => { setError(''); setSuccess(''); }, 4000);
  };

  const handleCreateMentor = async e => {
    e.preventDefault();
    try { await mentorService.create(mentorForm); msg('Mentor created.'); setMentorForm({ name:'',email:'',password:'',expertise:'' }); setShowModal(null); fetchData(); }
    catch(err) { msg(err.response?.data?.message||'Failed.',true); }
  };
  const handleCreateMentee = async e => {
    e.preventDefault();
    try { await menteeService.create(menteeForm); msg('Mentee created.'); setMenteeForm({ name:'',email:'',password:'',goal:'' }); setShowModal(null); fetchData(); }
    catch(err) { msg(err.response?.data?.message||'Failed.',true); }
  };
  const handleAssign = async e => {
    e.preventDefault();
    try { await menteeService.assignMentor(assignForm.menteeId, assignForm.mentorId); msg('Mentor assigned.'); setAssignForm({ menteeId:'',mentorId:'' }); setShowModal(null); fetchData(); }
    catch(err) { msg(err.response?.data?.message||'Failed.',true); }
  };
  const downloadPDF = async id => {
    try {
      const r = await api.get(`/feedback/${id}/pdf`,{responseType:'blob'});
      const url=URL.createObjectURL(new Blob([r.data]));
      const a=document.createElement('a'); a.href=url; a.download=`feedback_${id}.pdf`;
      document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    } catch { msg('Failed to download PDF.',true); }
  };

  const initials = n => n ? n.split(' ').map(x=>x[0]).join('').slice(0,2).toUpperCase() : '?';

  const tabs = [
    { id:'overview',      label:'Overview',    icon:'◈' },
    { id:'mentors',       label:'Mentors',      icon:'◉' },
    { id:'mentees',       label:'Mentees',      icon:'◎' },
    { id:'interactions',  label:'Sessions',     icon:'◷' },
    { id:'feedback',      label:'Feedback',     icon:'◐' },
  ];

  if (loading) return <div className="loading-spinner">Loading dashboard…</div>;

  const pieData = stats ? [
    { name:'Pending',   value: stats.pending },
    { name:'Accepted',  value: stats.accepted },
    { name:'Completed', value: stats.completed },
    { name:'Rejected',  value: stats.rejected }
  ].filter(d=>d.value>0) : [];

  const barSummary = stats ? [
    { label:'Mentors',   value: stats.totalMentors },
    { label:'Mentees',   value: stats.totalMentees },
    { label:'Sessions',  value: stats.totalSessions },
    { label:'Completed', value: stats.completed },
    { label:'Feedback',  value: stats.feedbackSubmitted },
  ] : [];

  return (
    <div className="dashboard">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="sidebar-user-card">
            <div className="sidebar-avatar">{initials(user?.name)}</div>
            <div>
              <div className="sidebar-user-name">{user?.name}</div>
              <div className="sidebar-user-role">Administrator</div>
            </div>
          </div>
        </div>

        <div className="sidebar-section-label">Navigation</div>
        <nav className="sidebar-nav">
          {tabs.map(t => (
            <button key={t.id} className={`sidebar-nav-item ${activeTab===t.id?'active':''}`} onClick={()=>setActiveTab(t.id)}>
              <span className="nav-icon">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-section-label">Actions</div>
        <div className="sidebar-footer">
          <button className="btn btn-primary" onClick={()=>setShowModal('mentor')}>+ Add Mentor</button>
          <button className="btn btn-secondary" onClick={()=>setShowModal('mentee')}>+ Add Mentee</button>
          <button className="btn btn-accent" onClick={()=>setShowModal('assign')}>Assign Mentor</button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="dashboard-main">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {/* OVERVIEW */}
        {activeTab==='overview' && stats && (
          <>
            <div className="page-header">
              <h1>Program Overview</h1>
              <p>Real-time statistics and program performance metrics</p>
            </div>

            <div className="grid-4" style={{marginBottom:22}}>
              {[
                {label:'Total Mentors',  value:stats.totalMentors,    cls:'teal'},
                {label:'Total Mentees',  value:stats.totalMentees,    cls:'info'},
                {label:'Total Sessions', value:stats.totalSessions,   cls:'accent'},
                {label:'Completed',      value:stats.completed,        cls:'success'},
                {label:'Pending',        value:stats.pending,          cls:'warning'},
                {label:'Feedback Reports',value:stats.feedbackSubmitted,cls:'accent'},
              ].map(s => (
                <div className={`stat-card ${s.cls}`} key={s.label}>
                  <div className={`stat-icon ${s.cls}`} style={{fontSize:22, fontFamily:'var(--font-display)', fontWeight:700}}>
                    {s.value}
                  </div>
                  <div className="stat-info">
                    <h3>{s.value}</h3>
                    <p>{s.label}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="charts-row">
              <div className="chart-card">
                <div className="chart-card-header"><h3>Sessions by Month</h3></div>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={stats.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" />
                    <XAxis dataKey="month" tick={{fontSize:11,fill:'#8896a4'}} />
                    <YAxis allowDecimals={false} tick={{fontSize:11,fill:'#8896a4'}} />
                    <Tooltip contentStyle={{borderRadius:10,border:'1px solid #e4eaef',fontSize:12,boxShadow:'0 4px 16px rgba(0,0,0,.08)'}} />
                    <Line type="monotone" dataKey="sessions" stroke="#0F4C5C" strokeWidth={2.5} dot={{r:4,fill:'#0F4C5C',strokeWidth:0}} activeDot={{r:6}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-card">
                <div className="chart-card-header"><h3>Session Status</h3></div>
                {pieData.length>0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                        {pieData.map((_,i)=><Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{borderRadius:10,fontSize:12}} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : <div className="empty-state" style={{padding:40}}><p>No session data yet</p></div>}
              </div>
            </div>

            <div className="chart-card">
              <div className="chart-card-header"><h3>Program Summary</h3></div>
              <ResponsiveContainer width="100%" height={190}>
                <BarChart data={barSummary} barSize={36}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" vertical={false} />
                  <XAxis dataKey="label" tick={{fontSize:12,fill:'#8896a4'}} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{fontSize:11,fill:'#8896a4'}} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{borderRadius:10,border:'1px solid #e4eaef',fontSize:12}} cursor={{fill:'rgba(15,76,92,.04)'}} />
                  <Bar dataKey="value" radius={[6,6,0,0]}>
                    {barSummary.map((_,i)=><Cell key={i} fill={['#0F4C5C','#2A9D8F','#3bbdad','#10b981','#f59e0b'][i]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* MENTORS */}
        {activeTab==='mentors' && (
          <>
            <div className="page-header"><h1>Mentors</h1><p>{mentors.length} mentor{mentors.length!==1?'s':''} registered</p></div>
            <div className="card card-with-table">
              <div className="card-header"><h3>All Mentors</h3></div>
              <div className="table-wrapper">
                <table>
                  <thead><tr><th>Name</th><th>Email</th><th>Expertise</th><th>Description</th><th>Joined</th></tr></thead>
                  <tbody>
                    {mentors.map(m=>(
                      <tr key={m._id}>
                        <td><strong style={{color:'var(--text-primary)'}}>{m.userId?.name}</strong></td>
                        <td style={{color:'var(--text-muted)'}}>{m.userId?.email}</td>
                        <td>{m.expertise ? <span className="badge badge-online">{m.expertise}</span> : '—'}</td>
                        <td style={{maxWidth:200,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',color:'var(--text-muted)'}}>{m.profileDescription||'—'}</td>
                        <td style={{color:'var(--text-muted)'}}>{new Date(m.createdAt).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {mentors.length===0 && <div className="empty-state"><p>No mentors yet</p><span>Use "Add Mentor" to create the first mentor account.</span></div>}
              </div>
            </div>
          </>
        )}

        {/* MENTEES */}
        {activeTab==='mentees' && (
          <>
            <div className="page-header"><h1>Mentees</h1><p>{mentees.length} mentee{mentees.length!==1?'s':''} enrolled</p></div>
            <div className="card card-with-table">
              <div className="card-header"><h3>All Mentees</h3></div>
              <div className="table-wrapper">
                <table>
                  <thead><tr><th>Name</th><th>Email</th><th>Goal</th><th>Assigned Mentor</th><th>Joined</th></tr></thead>
                  <tbody>
                    {mentees.map(m=>(
                      <tr key={m._id}>
                        <td><strong style={{color:'var(--text-primary)'}}>{m.userId?.name}</strong></td>
                        <td style={{color:'var(--text-muted)'}}>{m.userId?.email}</td>
                        <td style={{color:'var(--text-muted)'}}>{m.goal||'—'}</td>
                        <td>
                          {m.assignedMentorId
                            ? <span className="badge badge-accepted">{m.assignedMentorId?.userId?.name}</span>
                            : <span className="badge badge-pending">Unassigned</span>}
                        </td>
                        <td style={{color:'var(--text-muted)'}}>{new Date(m.createdAt).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {mentees.length===0 && <div className="empty-state"><p>No mentees yet</p></div>}
              </div>
            </div>
          </>
        )}

        {/* INTERACTIONS */}
        {activeTab==='interactions' && (
          <>
            <div className="page-header"><h1>All Sessions</h1><p>Complete session history across all mentors and mentees</p></div>
            <div className="card card-with-table">
              <div className="card-header"><h3>Session Log</h3></div>
              <div className="table-wrapper">
                <table>
                  <thead><tr><th>Mentee</th><th>Mentor</th><th>Topic</th><th>Date</th><th>Type</th><th>Status</th></tr></thead>
                  <tbody>
                    {interactions.map(i=>(
                      <tr key={i._id}>
                        <td><strong style={{color:'var(--text-primary)'}}>{i.menteeId?.userId?.name}</strong></td>
                        <td>{i.mentorId?.userId?.name}</td>
                        <td style={{maxWidth:180,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{i.topic}</td>
                        <td style={{color:'var(--text-muted)',whiteSpace:'nowrap'}}>{new Date(i.dateTime).toLocaleDateString('en-IN')}</td>
                        <td><span className={`badge badge-${i.sessionType}`}>{i.sessionType}</span></td>
                        <td><span className={`badge badge-${i.status}`}>{i.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {interactions.length===0 && <div className="empty-state"><p>No sessions yet</p></div>}
              </div>
            </div>
          </>
        )}

        {/* FEEDBACK */}
        {activeTab==='feedback' && (
          <>
            <div className="page-header"><h1>Feedback Reports</h1><p>All submitted feedback — accessible only by admin</p></div>
            <div className="card card-with-table">
              <div className="card-header"><h3>Feedback Log</h3></div>
              <div className="table-wrapper">
                <table>
                  <thead><tr><th>Mentee</th><th>Mentor</th><th>Topic</th><th>Hours</th><th>Date</th><th>Action</th></tr></thead>
                  <tbody>
                    {feedback.map(f=>(
                      <tr key={f._id}>
                        <td><strong style={{color:'var(--text-primary)'}}>{f.menteeName||f.menteeId?.userId?.name}</strong></td>
                        <td>{f.mentorName||f.mentorId?.userId?.name}</td>
                        <td style={{maxWidth:160,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{f.topic||f.interactionId?.topic}</td>
                        <td><span className="feedback-hours-chip">{f.hoursOfInteraction}h</span></td>
                        <td style={{color:'var(--text-muted)',whiteSpace:'nowrap'}}>{f.sessionDate?new Date(f.sessionDate).toLocaleDateString('en-IN'):'—'}</td>
                        <td>
                          {f.pdfFilePath
                            ? <button className="btn btn-primary btn-sm" onClick={()=>downloadPDF(f._id)}>Download PDF</button>
                            : <span style={{color:'var(--text-muted)',fontSize:12}}>Generating…</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {feedback.length===0 && <div className="empty-state"><p>No feedback submitted yet</p></div>}
              </div>
            </div>
          </>
        )}
      </main>

      {/* ── Modals ── */}
      {showModal==='mentor' && (
        <div className="modal-overlay" onClick={()=>setShowModal(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create Mentor Account</h2>
              <button className="modal-close" onClick={()=>setShowModal(null)}>×</button>
            </div>
            <form onSubmit={handleCreateMentor}>
              <div className="form-group"><label>Full Name</label><input type="text" value={mentorForm.name} onChange={e=>setMentorForm({...mentorForm,name:e.target.value})} placeholder="Mentor's full name" required /></div>
              <div className="form-group"><label>Email Address</label><input type="email" value={mentorForm.email} onChange={e=>setMentorForm({...mentorForm,email:e.target.value})} placeholder="mentor@example.com" required /></div>
              <div className="form-group"><label>Password</label><input type="password" value={mentorForm.password} onChange={e=>setMentorForm({...mentorForm,password:e.target.value})} placeholder="Minimum 6 characters" required /></div>
              <div className="form-group"><label>Area of Expertise</label><input type="text" value={mentorForm.expertise} onChange={e=>setMentorForm({...mentorForm,expertise:e.target.value})} placeholder="e.g. Mathematics, Science, Arts" /></div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary btn-sm" onClick={()=>setShowModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Create Mentor</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showModal==='mentee' && (
        <div className="modal-overlay" onClick={()=>setShowModal(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create Mentee Account</h2>
              <button className="modal-close" onClick={()=>setShowModal(null)}>×</button>
            </div>
            <form onSubmit={handleCreateMentee}>
              <div className="form-group"><label>Full Name</label><input type="text" value={menteeForm.name} onChange={e=>setMenteeForm({...menteeForm,name:e.target.value})} placeholder="Student's full name" required /></div>
              <div className="form-group"><label>Email Address</label><input type="email" value={menteeForm.email} onChange={e=>setMenteeForm({...menteeForm,email:e.target.value})} placeholder="student@example.com" required /></div>
              <div className="form-group"><label>Password</label><input type="password" value={menteeForm.password} onChange={e=>setMenteeForm({...menteeForm,password:e.target.value})} placeholder="Minimum 6 characters" required /></div>
              <div className="form-group"><label>Learning Goal</label><input type="text" value={menteeForm.goal} onChange={e=>setMenteeForm({...menteeForm,goal:e.target.value})} placeholder="e.g. Improve math skills" /></div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary btn-sm" onClick={()=>setShowModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Create Mentee</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showModal==='assign' && (
        <div className="modal-overlay" onClick={()=>setShowModal(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <h2>Assign Mentor to Mentee</h2>
              <button className="modal-close" onClick={()=>setShowModal(null)}>×</button>
            </div>
            <form onSubmit={handleAssign}>
              <div className="form-group">
                <label>Select Mentee</label>
                <select value={assignForm.menteeId} onChange={e=>setAssignForm({...assignForm,menteeId:e.target.value})} required>
                  <option value="">Choose a mentee…</option>
                  {mentees.map(m=><option key={m._id} value={m._id}>{m.userId?.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Select Mentor</label>
                <select value={assignForm.mentorId} onChange={e=>setAssignForm({...assignForm,mentorId:e.target.value})} required>
                  <option value="">Choose a mentor…</option>
                  {mentors.map(m=><option key={m._id} value={m._id}>{m.userId?.name}{m.expertise?` — ${m.expertise}`:''}</option>)}
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary btn-sm" onClick={()=>setShowModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-accent btn-sm">Confirm Assignment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { interactionService, feedbackService, statsService, mentorService } from '../services/apiService';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import './Dashboard.css';

const PIE_COLORS = ['#f59e0b', '#0F4C5C', '#10b981', '#ef4444'];

const MentorDashboard = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('overview');
  const [interactions, setInteractions] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [stats, setStats] = useState(null);

  const [profile, setProfile] = useState(null);

  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    expertise: '',
    profileDescription: ''
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [inter, fb, st, prof] = await Promise.all([
        interactionService.getAll(),
        feedbackService.getAll(),
        statsService.mentor(),
        mentorService.getMe()
      ]);

      setInteractions(inter.data.data);
      setFeedback(fb.data.data);
      setStats(st.data.data);

      const profileData = prof.data.data;
      setProfile(profileData);

      setProfileForm({
        name: profileData.userId?.name || '',
        email: profileData.userId?.email || '',
        expertise: profileData.expertise || '',
        profileDescription: profileData.profileDescription || ''
      });

    } catch {
      setError('Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  const showMsg = (m, isErr = false) => {
    isErr ? setError(m) : setSuccess(m);
    setTimeout(() => {
      setError('');
      setSuccess('');
    }, 4000);
  };

  const handleAction = async (id, action) => {
    try {
      await interactionService.accept(id, action);
      showMsg(`Session ${action}ed.`);
      fetchData();
    } catch {
      showMsg(`Failed to ${action} session.`, true);
    }
  };

  const handleProfileUpdate = async e => {
    e.preventDefault();
    try {
      await mentorService.updateMe(profileForm);
      showMsg('Profile updated.');
      fetchData();
    } catch (err) {
      showMsg(err.response?.data?.message || 'Failed to update.', true);
    }
  };

  const pending = interactions.filter(i => i.status === 'pending');
  const upcoming = interactions.filter(i => i.status === 'accepted');

  const initials = n =>
    n ? n.split(' ').map(x => x[0]).join('').slice(0, 2).toUpperCase() : 'M';

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '◈' },
    { id: 'requests', label: 'Requests', icon: '◉', count: pending.length },
    { id: 'upcoming', label: 'Upcoming', icon: '◷', count: upcoming.length },
    { id: 'feedback', label: 'Feedback', icon: '◐', count: feedback.length },
    { id: 'profile', label: 'My Profile', icon: '◎' }
  ];

  if (loading) return <div className="loading-spinner">Loading dashboard…</div>;

  const pieData = stats
    ? [
        { name: 'Pending', value: stats.pending },
        { name: 'Accepted', value: stats.accepted },
        { name: 'Completed', value: stats.completed },
        { name: 'Rejected', value: stats.rejected }
      ].filter(d => d.value > 0)
    : [];

  const barData = stats
    ? [
        { label: 'Total', value: stats.total },
        { label: 'Pending', value: stats.pending },
        { label: 'Upcoming', value: stats.accepted },
        { label: 'Completed', value: stats.completed },
        { label: 'Feedback', value: stats.feedbackReceived }
      ]
    : [];

  return (
    <div className="dashboard">

      {/* Sidebar */}
      <aside className="sidebar">

        <div className="sidebar-top">
          <div className="sidebar-user-card">
            <div className="sidebar-avatar">{initials(user?.name)}</div>
            <div>
              <div className="sidebar-user-name">{user?.name}</div>
              <div className="sidebar-user-role">Mentor</div>
            </div>
          </div>
        </div>

        <div className="sidebar-section-label">Navigation</div>

        <nav className="sidebar-nav">
          {tabs.map(t => (
            <button
              key={t.id}
              className={`sidebar-nav-item ${activeTab === t.id ? 'active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              <span className="nav-icon">{t.icon}</span>
              {t.label}
              {t.count > 0 && <span className="nav-count">{t.count}</span>}
            </button>
          ))}
        </nav>

      </aside>

      {/* Main Content */}
      <main className="dashboard-main">

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {activeTab === 'overview' && stats && (
          <>
            <div className="page-header">
              <h1>Mentor Dashboard</h1>
              <p>Welcome back, {user?.name}</p>
            </div>

            <div className="charts-row">

              <div className="chart-card">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#0F4C5C" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-card">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      dataKey="value"
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

            </div>
          </>
        )}

        {/* REQUESTS */}
        {activeTab === 'requests' && (
          <>
            <div className="page-header">
              <h1>Session Requests</h1>
              <p>Manage incoming mentorship requests</p>
            </div>
            {pending.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">◉</div>
                <p>No pending requests</p>
              </div>
            ) : (
              <div className="grid-2">
                {pending.map(i => (
                  <div key={i._id} className="session-card pending">
                    <div className="session-card-header">
                      <span className="session-card-title">{i.topic}</span>
                      <span className="badge badge-pending">Pending</span>
                    </div>
                    <div className="session-meta">
                      <span className="session-meta-item">
                        <span style={{width:6,height:6,borderRadius:'50%',background:'var(--warning)',display:'inline-block',marginRight:6}} />
                        {i.menteeId?.userId?.name}
                      </span>
                      <span className="session-meta-item">
                        {new Date(i.dateTime).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                      </span>
                      <span className={`badge badge-${i.sessionType}`}>{i.sessionType}</span>
                    </div>
                    {i.location && <p style={{fontSize:12,color:'var(--text-muted)',marginTop:8}}>📍 {i.location}</p>}
                    <div className="session-actions">
                      <button className="btn btn-secondary btn-sm" onClick={() => handleAction(i._id, 'reject')}>Reject</button>
                      <button className="btn btn-primary btn-sm" onClick={() => handleAction(i._id, 'accept')}>Accept</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* UPCOMING */}
        {activeTab === 'upcoming' && (
          <>
            <div className="page-header">
              <h1>Upcoming Sessions</h1>
              <p>Your confirmed schedule</p>
            </div>
            {upcoming.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">◷</div>
                <p>No upcoming sessions</p>
              </div>
            ) : (
              <div className="grid-2">
                {upcoming.map(i => (
                  <div key={i._id} className="session-card">
                    <div className="session-card-header">
                      <span className="session-card-title">{i.topic}</span>
                      <span className="badge badge-accepted">Confirmed</span>
                    </div>
                    <div className="session-meta">
                      <span className="session-meta-item">
                        <span style={{width:6,height:6,borderRadius:'50%',background:'var(--success)',display:'inline-block',marginRight:6}} />
                        {i.menteeId?.userId?.name}
                      </span>
                      <span className="session-meta-item">
                        {new Date(i.dateTime).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                      </span>
                      <span className={`badge badge-${i.sessionType}`}>{i.sessionType}</span>
                    </div>
                    {i.meetingLink && (
                      <a href={i.meetingLink} target="_blank" rel="noopener noreferrer" className="meeting-link">
                        Join Session →
                      </a>
                    )}
                    {i.location && <p style={{fontSize:12,color:'var(--text-muted)',marginTop:8}}>📍 {i.location}</p>}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* FEEDBACK */}
        {activeTab === 'feedback' && (
          <>
            <div className="page-header">
              <h1>Mentee Feedback</h1>
              <p>Reviews from your completed sessions</p>
            </div>
            {feedback.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">◐</div>
                <p>No feedback received yet</p>
              </div>
            ) : (
              <div className="grid-2">
                {feedback.map(f => (
                  <div key={f._id} className="feedback-item">
                    <div className="feedback-item-header">
                      <div>
                        <div className="feedback-item-name">{f.menteeName || f.menteeId?.userId?.name}</div>
                        <div className="feedback-item-topic">{f.topic || f.interactionId?.topic}</div>
                      </div>
                      <span className="feedback-hours-chip">{f.hoursOfInteraction}h</span>
                    </div>
                    <hr className="section-divider" />
                    {f.pointsDiscussed && (
                      <p style={{fontSize:13,color:'var(--text-secondary)',lineHeight:1.6}}>
                        <strong style={{color:'var(--ink)'}}>Points: </strong>
                        {f.pointsDiscussed}
                      </p>
                    )}
                    <div style={{fontSize:11,color:'var(--text-muted)',marginTop:10}}>
                      {new Date(f.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* PROFILE */}
        {activeTab === 'profile' && (
          <>
            <div className="page-header">
              <h1>My Profile</h1>
              <p>Manage your public mentor profile</p>
            </div>
            <div className="form-card" style={{ maxWidth: 600 }}>
              <form onSubmit={handleProfileUpdate}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" value={profileForm.name} disabled style={{background:'#f0f4f8',color:'#8896a4'}} />
                  <small style={{fontSize:11,color:'var(--text-muted)'}}>Contact admin to change name</small>
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={profileForm.email} disabled style={{background:'#f0f4f8',color:'#8896a4'}} />
                </div>
                <div className="form-group">
                  <label>Area of Expertise</label>
                  <input
                    type="text"
                    value={profileForm.expertise}
                    onChange={e => setProfileForm({ ...profileForm, expertise: e.target.value })}
                    placeholder="e.g. Mathematics, Career Guidance"
                  />
                </div>
                <div className="form-group">
                  <label>Profile Description</label>
                  <textarea
                    value={profileForm.profileDescription}
                    onChange={e => setProfileForm({ ...profileForm, profileDescription: e.target.value })}
                    placeholder="Tell mentees about your background and how you can help..."
                    style={{ minHeight: 120 }}
                  />
                </div>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </form>
            </div>
          </>
        )}

      </main>
    </div>
  );
};

export default MentorDashboard;
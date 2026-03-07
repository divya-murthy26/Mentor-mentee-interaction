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
  const [profileForm, setProfileForm] = useState({ name: '', email: '', expertise: '', profileDescription: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [inter, fb, st, prof] = await Promise.all([
        interactionService.getAll(), feedbackService.getAll(),
        statsService.mentor(), mentorService.getMe()
      ]);
      setInteractions(inter.data.data); setFeedback(fb.data.data);
      setStats(st.data.data); setProfile(prof.data.data);
      const p = prof.data.data;
      setProfileForm({
        name: p.userId?.name || '', email: p.userId?.email || '',
        expertise: p.expertise || '', profileDescription: p.profileDescription || ''
      });
    } catch { setError('Failed to load data.'); }
    finally { setLoading(false); }
  };

  const showMsg = (m, isErr = false) => {
    isErr ? setError(m) : setSuccess(m);
    setTimeout(() => { setError(''); setSuccess(''); }, 4000);
  };

  const handleAction = async (id, action) => {
    try { await interactionService.accept(id, action); showMsg(`Session ${action}ed.`); fetchData(); }
    catch { showMsg(`Failed to ${action} session.`, true); }
  };

  const handleProfileUpdate = async e => {
    e.preventDefault();
    try { await mentorService.updateMe(profileForm); showMsg('Profile updated.'); fetchData(); }
    catch (err) { showMsg(err.response?.data?.message || 'Failed to update.', true); }
  };

  const pending   = interactions.filter(i => i.status === 'pending');
  const upcoming  = interactions.filter(i => i.status === 'accepted');
// const [profile, setProfile] = useState(null);
// const completed = something;
  const initials  = n => n ? n.split(' ').map(x=>x[0]).join('').slice(0,2).toUpperCase() : 'M';

  const tabs = [
    { id: 'overview',  label: 'Overview',   icon: '◈' },
    { id: 'requests',  label: 'Requests',   icon: '◉', count: pending.length },
    { id: 'upcoming',  label: 'Upcoming',   icon: '◷', count: upcoming.length },
    { id: 'feedback',  label: 'Feedback',   icon: '◐', count: feedback.length },
    { id: 'profile',   label: 'My Profile', icon: '◎' },
  ];

  if (loading) return <div className="loading-spinner">Loading dashboard…</div>;

  const pieData = stats ? [
    { name: 'Pending',   value: stats.pending },
    { name: 'Accepted',  value: stats.accepted },
    { name: 'Completed', value: stats.completed },
    { name: 'Rejected',  value: stats.rejected }
  ].filter(d => d.value > 0) : [];

  const barData = stats ? [
    { label: 'Total',     value: stats.total },
    { label: 'Pending',   value: stats.pending },
    { label: 'Upcoming',  value: stats.accepted },
    { label: 'Completed', value: stats.completed },
    { label: 'Feedback',  value: stats.feedbackReceived },
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
              <div className="sidebar-user-role">Mentor</div>
            </div>
          </div>
        </div>

        <div className="sidebar-section-label">Navigation</div>
        <nav className="sidebar-nav">
          {tabs.map(t => (
            <button key={t.id} className={`sidebar-nav-item ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
              <span className="nav-icon">{t.icon}</span>
              {t.label}
              {t.count > 0 && <span className="nav-count">{t.count}</span>}
            </button>
          ))}
        </nav>

        {stats && (
          <>
            <div className="sidebar-section-label">Quick Stats</div>
            <div className="sidebar-widget">
              <div className="sidebar-widget-label">Sessions</div>
              {[['Pending', stats.pending], ['Upcoming', stats.accepted], ['Completed', stats.completed]].map(([k, v]) => (
                <div className="sidebar-stat-row" key={k}>
                  <span>{k}</span><strong>{v}</strong>
                </div>
              ))}
            </div>
          </>
        )}
      </aside>

      {/* ── Main ── */}
      <main className="dashboard-main">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {/* OVERVIEW */}
        {activeTab === 'overview' && stats && (
          <>
            <div className="page-header">
              <h1>Mentor Dashboard</h1>
              <p>Welcome back, {user?.name} — here's your session overview</p>
            </div>

            <div className="grid-3" style={{ marginBottom: 22 }}>
              <div className="stat-card teal">
                <div className="stat-icon teal" style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-display)' }}>{stats.total}</div>
                <div className="stat-info"><h3>{stats.total}</h3><p>Total Sessions</p></div>
              </div>
              <div className="stat-card warning">
                <div className="stat-icon warning" style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-display)' }}>{stats.pending}</div>
                <div className="stat-info"><h3>{stats.pending}</h3><p>Pending Requests</p></div>
              </div>
              <div className="stat-card success">
                <div className="stat-icon success" style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-display)' }}>{stats.completed}</div>
                <div className="stat-info"><h3>{stats.completed}</h3><p>Completed</p></div>
              </div>
            </div>

            <div className="charts-row">
              <div className="chart-card">
                <div className="chart-card-header"><h3>Session Breakdown</h3></div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={barData} barSize={32}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#8896a4' }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#8896a4' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e4eaef', fontSize: 12, boxShadow: '0 4px 16px rgba(0,0,0,.08)' }} cursor={{ fill: 'rgba(15,76,92,.04)' }} />
                    <Bar dataKey="value" fill="#0F4C5C" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-card">
                <div className="chart-card-header"><h3>Status Distribution</h3></div>
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                        {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="empty-state" style={{ padding: 50 }}>
                    <div className="empty-state-icon">◷</div>
                    <p>No sessions yet</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* REQUESTS */}
        {activeTab === 'requests' && (
          <>
            <div className="page-header">
              <h1>Session Requests</h1>
              <p>{pending.length} pending request{pending.length !== 1 ? 's' : ''} from mentees</p>
            </div>
            {pending.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">◉</div>
                <p>No pending requests</p>
                <span>You're all caught up!</span>
              </div>
            ) : (
              <div className="grid-2">
                {pending.map(i => (
                  <div key={i._id} className="request-card">
                    <div className="session-card-header">
                      <span className="session-card-title">{i.topic}</span>
                      <span className={`badge badge-${i.sessionType}`}>{i.sessionType}</span>
                    </div>
                    <div className="session-meta">
                      <span className="session-meta-item">
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
                        {i.menteeId?.userId?.name}
                      </span>
                      <span className="session-meta-item">
                        {new Date(i.dateTime).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                      </span>
                      {i.sessionType === 'online' && i.platform && (
                        <span className="session-meta-item">{i.platform}</span>
                      )}
                      {i.sessionType === 'offline' && i.location && (
                        <span className="session-meta-item">{i.location}</span>
                      )}
                    </div>
                    {i.meetingLink && (
                      <a href={i.meetingLink} target="_blank" rel="noopener noreferrer" className="meeting-link">
                        View Meeting Link
                      </a>
                    )}
                    <div className="session-actions">
                      <button className="btn btn-primary btn-sm" onClick={() => handleAction(i._id, 'accept')}>Accept Session</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleAction(i._id, 'reject')}>Decline</button>
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
              <p>{upcoming.length} confirmed session{upcoming.length !== 1 ? 's' : ''}</p>
            </div>
            {upcoming.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">◷</div>
                <p>No upcoming sessions</p>
                <span>Accepted sessions will appear here</span>
              </div>
            ) : (
              <div className="grid-2">
                {upcoming.map(i => (
                  <div key={i._id} className="session-card">
                    <div className="session-card-header">
                      <span className="session-card-title">{i.topic}</span>
                      <span className={`badge badge-${i.sessionType}`}>{i.sessionType}</span>
                    </div>
                    <div className="session-meta">
                      <span className="session-meta-item">
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
                        {i.menteeId?.userId?.name}
                      </span>
                      <span className="session-meta-item">
                        {new Date(i.dateTime).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                      </span>
                      {i.location && <span className="session-meta-item">{i.location}</span>}
                    </div>
                    {i.meetingLink && (
                      <a href={i.meetingLink} target="_blank" rel="noopener noreferrer" className="meeting-link">
                        Join Session →
                      </a>
                    )}
                    {i.calendarEventId && (
                      <div className="calendar-tag">
                        <span>✓</span> Added to Google Calendar
                      </div>
                    )}
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
              <p>Feedback submitted for your mentoring sessions</p>
            </div>
            {feedback.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">◐</div>
                <p>No feedback yet</p>
                <span>Feedback from mentees will appear here</span>
              </div>
            ) : (
              <div className="grid-2">
                {feedback.map(f => (
                  <div key={f._id} className="feedback-item">
                    <div className="feedback-item-header">
                      <div>
                        <div className="feedback-item-name">{f.menteeName || f.menteeId?.userId?.name}</div>
                        <div className="feedback-item-topic">{f.topic}</div>
                      </div>
                      <span className="feedback-hours-chip">{f.hoursOfInteraction}h</span>
                    </div>
                    <hr className="section-divider" />
                    {f.pointsDiscussed && (
                      <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6, lineHeight: 1.6 }}>
                        <strong style={{ color: 'var(--ink)' }}>Points: </strong>
                        {f.pointsDiscussed.slice(0, 130)}{f.pointsDiscussed.length > 130 ? '…' : ''}
                      </p>
                    )}
                    {f.description && (
                      <p style={{ fontSize: 13, color: 'var(--text-muted)', fontStyle: 'italic', lineHeight: 1.5 }}>
                        {f.description.slice(0, 100)}{f.description.length > 100 ? '…' : ''}
                      </p>
                    )}
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 10 }}>
                      {new Date(f.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                    </p>
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
              <p>Manage your mentor information and bio</p>
            </div>
            <div className="profile-section">
              <div className="form-card">
                <div className="form-card-title">Edit Profile</div>
                <form onSubmit={handleProfileUpdate}>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" value={profileForm.name} onChange={e => setProfileForm({ ...profileForm, name: e.target.value })} placeholder="Your full name" />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" value={profileForm.email} onChange={e => setProfileForm({ ...profileForm, email: e.target.value })} placeholder="your@email.com" />
                  </div>
                  <div className="form-group">
                    <label>Area of Expertise</label>
                    <input type="text" value={profileForm.expertise} onChange={e => setProfileForm({ ...profileForm, expertise: e.target.value })} placeholder="e.g. Mathematics, Science, Arts" />
                  </div>
                  <div className="form-group">
                    <label>Profile Description</label>
                    <textarea
                      value={profileForm.profileDescription}
                      onChange={e => setProfileForm({ ...profileForm, profileDescription: e.target.value })}
                      placeholder="Share your background, teaching approach, and what you hope to offer mentees…"
                      style={{ minHeight: 130 }}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                </form>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default MentorDashboard;

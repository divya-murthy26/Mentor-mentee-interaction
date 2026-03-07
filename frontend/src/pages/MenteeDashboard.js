import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { interactionService, feedbackService, statsService, menteeService } from '../services/apiService';
import api from '../services/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import './Dashboard.css';

const PIE_COLORS = ['#f59e0b', '#0F4C5C', '#10b981'];

const MenteeDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [interactions, setInteractions] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [stats, setStats] = useState(null);
  const [menteeProfile, setMenteeProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [feedbackModal, setFeedbackModal] = useState(null);
  const [scheduleForm, setScheduleForm] = useState({
    topic: '', dateTime: '', sessionType: 'online',
    platform: 'Google Meet', meetingLink: '', location: ''
  });
  const [feedbackForm, setFeedbackForm] = useState({
    hoursOfInteraction: 1, pointsDiscussed: '', description: ''
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [inter, fb, st, me] = await Promise.all([
        interactionService.getAll(), feedbackService.getAll(),
        statsService.mentee(), menteeService.getMe()
      ]);
      setInteractions(inter.data.data); setFeedback(fb.data.data);
      setStats(st.data.data); setMenteeProfile(me.data.data);
    } catch { setError('Failed to load data.'); }
    finally { setLoading(false); }
  };

  const showMsg = (m, isErr = false) => {
    isErr ? setError(m) : setSuccess(m);
    setTimeout(() => { setError(''); setSuccess(''); }, 4000);
  };

  const handleSchedule = async e => {
    e.preventDefault();
    try {
      await interactionService.create(scheduleForm);
      showMsg('Session request sent! Awaiting mentor confirmation.');
      setScheduleForm({ topic: '', dateTime: '', sessionType: 'online', platform: 'Google Meet', meetingLink: '', location: '' });
      setActiveTab('sessions'); fetchData();
    } catch (err) { showMsg(err.response?.data?.message || 'Failed to schedule session.', true); }
  };

  const handleFeedbackSubmit = async e => {
    e.preventDefault();
    if (!feedbackForm.pointsDiscussed) { showMsg('Please describe the points discussed.', true); return; }
    try {
      await feedbackService.submit({ interactionId: feedbackModal._id, ...feedbackForm });
      showMsg('Feedback submitted and PDF report generated.');
      setFeedbackModal(null);
      setFeedbackForm({ hoursOfInteraction: 1, pointsDiscussed: '', description: '' });
      setActiveTab('feedback'); fetchData();
    } catch (err) { showMsg(err.response?.data?.message || 'Failed to submit feedback.', true); }
  };

  const handleDownloadPDF = async id => {
    try {
      const r = await api.get(`/feedback/${id}/pdf`, { responseType: 'blob' });
      const url = URL.createObjectURL(new Blob([r.data]));
      const a = document.createElement('a'); a.href = url;
      a.download = `feedback_${id}.pdf`;
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
    } catch { showMsg('Failed to download PDF.', true); }
  };

  const pending   = interactions.filter(i => i.status === 'pending');
  const accepted  = interactions.filter(i => i.status === 'accepted');
  const completed = interactions.filter(i => i.status === 'completed');
  const feedbackDone = new Set(feedback.map(f => f.interactionId?._id || f.interactionId));
  const assignedMentor = menteeProfile?.assignedMentorId;
  const initials = n => n ? n.split(' ').map(x => x[0]).join('').slice(0, 2).toUpperCase() : 'S';

  const tabs = [
    { id: 'overview',  label: 'Overview',          icon: '◈' },
    { id: 'schedule',  label: 'Schedule Session',   icon: '◉' },
    { id: 'sessions',  label: 'My Sessions',        icon: '◷', count: accepted.length },
    { id: 'feedback',  label: 'My Feedback',        icon: '◐', count: feedback.length },
  ];

  if (loading) return <div className="loading-spinner">Loading dashboard…</div>;

  const barData = stats ? [
    { label: 'Total',     value: stats.total },
    { label: 'Pending',   value: stats.pending },
    { label: 'Confirmed', value: stats.accepted },
    { label: 'Completed', value: stats.completed },
    { label: 'Feedback',  value: stats.feedbackSubmitted },
  ] : [];

  const pieData = stats ? [
    { name: 'Pending',   value: stats.pending },
    { name: 'Confirmed', value: stats.accepted },
    { name: 'Completed', value: stats.completed },
  ].filter(d => d.value > 0) : [];

  return (
    <div className="dashboard">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="sidebar-user-card">
            <div className="sidebar-avatar">{initials(user?.name)}</div>
            <div>
              <div className="sidebar-user-name">{user?.name}</div>
              <div className="sidebar-user-role">Mentee</div>
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

        {assignedMentor && (
          <>
            <div className="sidebar-section-label">My Mentor</div>
            <div className="sidebar-widget">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: 'linear-gradient(135deg, #0F4C5C, #2A9D8F)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, color: 'white', flexShrink: 0,
                  fontFamily: 'var(--font-display)'
                }}>
                  {initials(assignedMentor.userId?.name)}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>{assignedMentor.userId?.name}</div>
                  {assignedMentor.expertise && (
                    <div style={{ fontSize: 11, color: 'rgba(42,157,143,.9)', marginTop: 1 }}>{assignedMentor.expertise}</div>
                  )}
                </div>
              </div>
              {assignedMentor.profileDescription && (
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,.45)', lineHeight: 1.5 }}>
                  {assignedMentor.profileDescription.slice(0, 80)}
                  {assignedMentor.profileDescription.length > 80 ? '…' : ''}
                </p>
              )}
            </div>
          </>
        )}

        {stats && (
          <>
            <div className="sidebar-section-label">Progress</div>
            <div className="sidebar-widget">
              <div className="sidebar-widget-label">Sessions</div>
              {[['Total', stats.total], ['Completed', stats.completed], ['Feedback', stats.feedbackSubmitted]].map(([k, v]) => (
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
              <h1>My Dashboard</h1>
              <p>Your mentoring journey overview, {user?.name}</p>
            </div>

            {!assignedMentor && (
              <div className="warning-box" style={{ marginBottom: 22 }}>
                <p>You have not been assigned a mentor yet. Please contact your program administrator to get started.</p>
              </div>
            )}

            <div className="grid-4" style={{ marginBottom: 22 }}>
              {[
                { label: 'Total Sessions',     value: stats.total,             cls: 'teal' },
                { label: 'Pending',            value: stats.pending,           cls: 'warning' },
                { label: 'Completed',          value: stats.completed,         cls: 'success' },
                { label: 'Feedback Submitted', value: stats.feedbackSubmitted, cls: 'accent' },
              ].map(s => (
                <div className={`stat-card ${s.cls}`} key={s.label}>
                  <div className={`stat-icon ${s.cls}`} style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-display)' }}>{s.value}</div>
                  <div className="stat-info"><h3>{s.value}</h3><p>{s.label}</p></div>
                </div>
              ))}
            </div>

            <div className="charts-row">
              <div className="chart-card">
                <div className="chart-card-header"><h3>Session Breakdown</h3></div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={barData} barSize={30}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#8896a4' }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#8896a4' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e4eaef', fontSize: 12, boxShadow: '0 4px 16px rgba(0,0,0,.08)' }} cursor={{ fill: 'rgba(15,76,92,.04)' }} />
                    <Bar dataKey="value" fill="#2A9D8F" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-card">
                <div className="chart-card-header"><h3>Status Overview</h3></div>
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
                    <div className="empty-state-icon">◈</div>
                    <p>No session data yet</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* SCHEDULE */}
        {activeTab === 'schedule' && (
          <>
            <div className="page-header">
              <h1>Schedule a Session</h1>
              <p>Request a new mentoring session with your assigned mentor</p>
            </div>
            {!assignedMentor ? (
              <div className="warning-box">
                <p>You have no assigned mentor yet. Please contact your program administrator to have a mentor assigned to you.</p>
              </div>
            ) : (
              <div className="form-card" style={{ maxWidth: 600 }}>
                <div className="form-card-title">New Session Request</div>

                {/* Assigned mentor tag */}
                <div className="assigned-mentor-tag">
                  <div className="assigned-mentor-tag-avatar">{initials(assignedMentor.userId?.name)}</div>
                  <div>
                    <div className="assigned-mentor-tag-label">Assigned Mentor</div>
                    <div className="assigned-mentor-tag-name">{assignedMentor.userId?.name}</div>
                    {assignedMentor.expertise && <div className="assigned-mentor-tag-exp">{assignedMentor.expertise}</div>}
                  </div>
                </div>

                <form onSubmit={handleSchedule}>
                  <div className="form-group">
                    <label>Session Topic</label>
                    <input type="text" value={scheduleForm.topic} onChange={e => setScheduleForm({ ...scheduleForm, topic: e.target.value })} placeholder="What would you like to discuss?" required />
                  </div>
                  <div className="form-group">
                    <label>Date and Time</label>
                    <input type="datetime-local" value={scheduleForm.dateTime} onChange={e => setScheduleForm({ ...scheduleForm, dateTime: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Session Format</label>
                    <select value={scheduleForm.sessionType} onChange={e => setScheduleForm({ ...scheduleForm, sessionType: e.target.value })}>
                      <option value="online">Online</option>
                      <option value="offline">Offline / In-person</option>
                    </select>
                  </div>
                  {scheduleForm.sessionType === 'online' && (
                    <>
                      <div className="form-group">
                        <label>Platform</label>
                        <select value={scheduleForm.platform} onChange={e => setScheduleForm({ ...scheduleForm, platform: e.target.value })}>
                          <option value="Google Meet">Google Meet</option>
                          <option value="Zoom">Zoom</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Meeting Link</label>
                        <input type="url" value={scheduleForm.meetingLink} onChange={e => setScheduleForm({ ...scheduleForm, meetingLink: e.target.value })} placeholder="https://meet.google.com/…" required />
                      </div>
                    </>
                  )}
                  {scheduleForm.sessionType === 'offline' && (
                    <div className="form-group">
                      <label>Location</label>
                      <input type="text" value={scheduleForm.location} onChange={e => setScheduleForm({ ...scheduleForm, location: e.target.value })} placeholder="e.g. Community Hall, Room 5" required />
                    </div>
                  )}
                  <button type="submit" className="btn btn-primary btn-lg" style={{ borderRadius: 'var(--r-full)', width: '100%', justifyContent: 'center', marginTop: 4 }}>
                    Send Session Request →
                  </button>
                </form>
              </div>
            )}
          </>
        )}

        {/* SESSIONS */}
        {activeTab === 'sessions' && (
          <>
            <div className="page-header">
              <h1>My Sessions</h1>
              <p>All your scheduled and completed mentoring sessions</p>
            </div>
            {interactions.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">◷</div>
                <p>No sessions yet</p>
                <span>Schedule your first session to get started!</span>
              </div>
            ) : (
              <>
                {pending.length > 0 && (
                  <div style={{ marginBottom: 28 }}>
                    <div className="section-group-label">Awaiting Confirmation</div>
                    <div className="grid-2">
                      {pending.map(i => (
                        <div key={i._id} className="session-card pending">
                          <div className="session-card-header">
                            <span className="session-card-title">{i.topic}</span>
                            <span className="badge badge-pending">Pending</span>
                          </div>
                          <div className="session-meta">
                            <span className="session-meta-item">
                              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--warning)', display: 'inline-block' }} />
                              {i.mentorId?.userId?.name}
                            </span>
                            <span className="session-meta-item">
                              {new Date(i.dateTime).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                            </span>
                            <span className={`badge badge-${i.sessionType}`}>{i.sessionType}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {accepted.length > 0 && (
                  <div style={{ marginBottom: 28 }}>
                    <div className="section-group-label">Confirmed Sessions</div>
                    <div className="grid-2">
                      {accepted.map(i => (
                        <div key={i._id} className="session-card">
                          <div className="session-card-header">
                            <span className="session-card-title">{i.topic}</span>
                            <span className="badge badge-accepted">Confirmed</span>
                          </div>
                          <div className="session-meta">
                            <span className="session-meta-item">
                              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', display: 'inline-block' }} />
                              {i.mentorId?.userId?.name}
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
                          {i.location && (
                            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>{i.location}</p>
                          )}
                          <div className="session-actions">
                            {!feedbackDone.has(i._id) ? (
                              <button className="btn btn-accent btn-sm" onClick={() => setFeedbackModal(i)}>Submit Feedback</button>
                            ) : (
                              <span style={{ fontSize: 12, color: 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                                <span>✓</span> Feedback submitted
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {completed.length > 0 && (
                  <div>
                    <div className="section-group-label">Completed Sessions</div>
                    <div className="grid-2">
                      {completed.map(i => (
                        <div key={i._id} className="session-card completed">
                          <div className="session-card-header">
                            <span className="session-card-title">{i.topic}</span>
                            <span className="badge badge-completed">Completed</span>
                          </div>
                          <div className="session-meta">
                            <span className="session-meta-item">
                              {i.mentorId?.userId?.name}
                            </span>
                            <span className="session-meta-item">
                              {new Date(i.dateTime).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                            </span>
                          </div>
                          {!feedbackDone.has(i._id) && (
                            <div className="session-actions">
                              <button className="btn btn-accent btn-sm" onClick={() => setFeedbackModal(i)}>Submit Feedback</button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* FEEDBACK */}
        {activeTab === 'feedback' && (
          <>
            <div className="page-header">
              <h1>My Feedback Reports</h1>
              <p>Session reports you've submitted</p>
            </div>
            {feedback.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">◐</div>
                <p>No feedback submitted yet</p>
                <span>Submit feedback after your sessions to see reports here</span>
              </div>
            ) : (
              <div className="grid-2">
                {feedback.map(f => (
                  <div key={f._id} className="feedback-item">
                    <div className="feedback-item-header">
                      <div>
                        <div className="feedback-item-name">{f.topic || f.interactionId?.topic || 'Session'}</div>
                        <div className="feedback-item-topic">with {f.mentorName || f.mentorId?.userId?.name}</div>
                      </div>
                      <span className="feedback-hours-chip">{f.hoursOfInteraction}h</span>
                    </div>
                    <hr className="section-divider" />
                    {f.pointsDiscussed && (
                      <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 10 }}>
                        <strong style={{ color: 'var(--ink)' }}>Points: </strong>
                        {f.pointsDiscussed.slice(0, 130)}{f.pointsDiscussed.length > 130 ? '…' : ''}
                      </p>
                    )}
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginTop: 4 }}>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        {new Date(f.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                      </span>
                      {f.pdfFilePath && (
                        <button className="btn btn-primary btn-sm" onClick={() => handleDownloadPDF(f._id)}>
                          Download PDF
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* ── Feedback Modal ── */}
      {feedbackModal && (
        <div className="modal-overlay" onClick={() => setFeedbackModal(null)}>
          <div className="modal" style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Submit Session Feedback</h2>
              <button className="modal-close" onClick={() => setFeedbackModal(null)}>×</button>
            </div>

            <div className="info-box" style={{ marginBottom: 22 }}>
              <p><strong>Mentor:</strong> {feedbackModal.mentorId?.userId?.name}</p>
              <p style={{ marginTop: 4 }}><strong>Topic:</strong> {feedbackModal.topic}</p>
              <p style={{ marginTop: 4 }}><strong>Date:</strong> {new Date(feedbackModal.dateTime).toLocaleDateString('en-IN', { dateStyle: 'long' })}</p>
            </div>

            <form onSubmit={handleFeedbackSubmit}>
              <div className="form-group">
                <label>Hours of Interaction</label>
                <input
                  type="number" min="0.5" max="8" step="0.5"
                  value={feedbackForm.hoursOfInteraction}
                  onChange={e => setFeedbackForm({ ...feedbackForm, hoursOfInteraction: parseFloat(e.target.value) })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Points Discussed</label>
                <textarea
                  value={feedbackForm.pointsDiscussed}
                  onChange={e => setFeedbackForm({ ...feedbackForm, pointsDiscussed: e.target.value })}
                  placeholder="List the key topics and points covered in the session…"
                  style={{ minHeight: 100 }}
                  required
                />
              </div>
              <div className="form-group">
                <label>Session Description</label>
                <textarea
                  value={feedbackForm.description}
                  onChange={e => setFeedbackForm({ ...feedbackForm, description: e.target.value })}
                  placeholder="Describe the session experience, outcomes, and any next steps…"
                  style={{ minHeight: 100 }}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setFeedbackModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Submit &amp; Generate PDF</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenteeDashboard;

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

      </main>
    </div>
  );
};

export default MentorDashboard;
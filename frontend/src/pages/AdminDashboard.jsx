import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { Users, UserCheck, Calendar, Clock, ArrowUpRight } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <DashboardLayout role="admin">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon-wrapper stat-icon-blue">
              <Users size={24} />
            </div>
            <span className="badge badge-blue">+12%</span>
          </div>
          <div className="stat-label">Total Mentors</div>
          <div className="stat-value">124</div>
          <div className="stat-trend trend-up">
            <ArrowUpRight size={16} /> <span>vs last month</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon-wrapper stat-icon-green">
              <UserCheck size={24} />
            </div>
            <span className="badge badge-green">+5%</span>
          </div>
          <div className="stat-label">Total Mentees</div>
          <div className="stat-value">850</div>
          <div className="stat-trend trend-up">
            <ArrowUpRight size={16} /> <span>vs last month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon-wrapper stat-icon-yellow">
              <Calendar size={24} />
            </div>
          </div>
          <div className="stat-label">Active Sessions</div>
          <div className="stat-value">45</div>
          <div className="stat-trend" style={{color: 'var(--text-muted)'}}>
            <span>Currently ongoing</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon-wrapper stat-icon-gray">
              <Clock size={24} />
            </div>
          </div>
          <div className="stat-label">Pending Approvals</div>
          <div className="stat-value">12</div>
          <div className="stat-trend trend-down">
            <span>Requires attention</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Recent Sessions</h3>
          <button className="btn btn-outline btn-sm">View All</button>
        </div>
        
        <div className="table-container" style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Mentor</th>
                <th>Mentee</th>
                <th>Topic</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="user-cell">
                    <span className="user-cell-name">Dr. Amit Patel</span>
                    <span className="user-cell-sub">Senior Engineer</span>
                  </div>
                </td>
                <td>Rohan Kumar</td>
                <td>Career Guidance</td>
                <td>Oct 24, 2023</td>
                <td><span className="badge badge-green">Completed</span></td>
                <td><button className="btn btn-outline btn-sm">Details</button></td>
              </tr>
              <tr>
                <td>
                  <div className="user-cell">
                    <span className="user-cell-name">Sarah Wilson</span>
                    <span className="user-cell-sub">Product Manager</span>
                  </div>
                </td>
                <td>Priya Singh</td>
                <td>Resume Review</td>
                <td>Oct 25, 2023</td>
                <td><span className="badge badge-blue">Scheduled</span></td>
                <td><button className="btn btn-outline btn-sm">Details</button></td>
              </tr>
              <tr>
                <td>
                  <div className="user-cell">
                    <span className="user-cell-name">Rajesh Koothrappali</span>
                    <span className="user-cell-sub">Astrophysicist</span>
                  </div>
                </td>
                <td>Sheldon Cooper</td>
                <td>Physics 101</td>
                <td>Oct 26, 2023</td>
                <td><span className="badge badge-yellow">Pending</span></td>
                <td><button className="btn btn-outline btn-sm">Details</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;

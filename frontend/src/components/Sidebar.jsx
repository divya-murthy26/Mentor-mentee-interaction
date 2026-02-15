import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, UserPlus, UserCheck, MessageSquare, LogOut, X } from 'lucide-react';

const Sidebar = ({ role, isOpen, onClose }) => {
  const location = useLocation();
  
  const getLinks = () => {
    switch(role) {
      case 'admin':
        return [
          { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin' },
          { icon: <UserPlus size={20} />, label: 'Create Mentor', path: '/admin/create-mentor' },
          { icon: <UserPlus size={20} />, label: 'Create Mentee', path: '/admin/create-mentee' },
          { icon: <UserCheck size={20} />, label: 'Assign Mentor', path: '/admin/assign' },
          { icon: <Calendar size={20} />, label: 'Sessions', path: '/admin/sessions' },
          { icon: <MessageSquare size={20} />, label: 'Feedback', path: '/admin/feedback' },
        ];
      case 'mentor':
        return [
          { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/mentor' },
          { icon: <Calendar size={20} />, label: 'Requests', path: '/mentor/requests' },
          { icon: <Users size={20} />, label: 'My Mentees', path: '/mentor/mentees' },
        ];
      case 'mentee':
        return [
          { icon: <LayoutDashboard size={20} />, label: 'My Progress', path: '/mentee' },
          { icon: <Calendar size={20} />, label: 'Schedule', path: '/mentee/schedule' },
          { icon: <Users size={20} />, label: 'Mentors', path: '/mentee/mentors' },
        ];
      default: return [];
    }
  };

  return (
    <>
    <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="brand">
          <span>💙 Fund a Child</span>
        </div>
        <button className="icon-btn menu-toggle" onClick={onClose} style={{ marginLeft: 'auto' }}>
          <X size={20} />
        </button>
      </div>
      <div className="sidebar-menu">
        {getLinks().map((link, index) => (
          <Link 
            key={index} 
            to={link.path} 
            className={`menu-item ${location.pathname === link.path ? 'active' : ''}`}
            onClick={onClose}
          >
            {link.icon}
            <span>{link.label}</span>
          </Link>
        ))}
      </div>
      <div className="sidebar-footer">
        <Link to="/" className="menu-item logout">
          <LogOut size={20} />
          <span>Logout</span>
        </Link>
      </div>
    </aside>
    </>
  );
};

export default Sidebar;

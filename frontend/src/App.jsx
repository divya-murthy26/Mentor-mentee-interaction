import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import MentorDashboard from './pages/MentorDashboard';
import MenteeDashboard from './pages/MenteeDashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Protected Routes (Logic omitted for UI demo) */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/mentor" element={<MentorDashboard />} />
      <Route path="/mentee" element={<MenteeDashboard />} />
    </Routes>
  );
}

export default App;

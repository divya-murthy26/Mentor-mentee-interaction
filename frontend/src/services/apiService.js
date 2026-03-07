import api from './api';

export const authService = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me')
};

export const mentorService = {
  getAll: () => api.get('/mentors'),
  create: (data) => api.post('/mentors', data),
  getMe: () => api.get('/mentors/me'),
  updateMe: (data) => api.put('/mentors/me', data)
};

export const menteeService = {
  getAll: () => api.get('/mentees'),
  create: (data) => api.post('/mentees', data),
  assignMentor: (id, mentorId) => api.patch(`/mentees/${id}/assign`, { mentorId }),
  getMe: () => api.get('/mentees/me')
};

export const interactionService = {
  create: (data) => api.post('/interactions', data),
  getAll: () => api.get('/interactions'),
  accept: (id, action) => api.patch(`/interactions/${id}/accept`, { action }),
  markComplete: (id) => api.patch(`/interactions/${id}/complete`)
};

export const feedbackService = {
  submit: (data) => api.post('/feedback', data),
  getAll: () => api.get('/feedback'),
  downloadPDF: (id) => api.get(`/feedback/${id}/pdf`, { responseType: 'blob' })
};

export const statsService = {
  admin: () => api.get('/stats/admin'),
  mentor: () => api.get('/stats/mentor'),
  mentee: () => api.get('/stats/mentee')
};

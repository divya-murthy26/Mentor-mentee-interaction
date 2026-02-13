const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'mentor', 'mentee'],
    required: true
  },
  // For Mentees: The ID of their assigned mentor
  assignedMentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
});

module.exports = mongoose.model('User', UserSchema);
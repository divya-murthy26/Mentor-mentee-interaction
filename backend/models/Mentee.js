const mongoose = require('mongoose');

const menteeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  goal: {
    type: String,
    trim: true,
    default: ''
  },
  assignedMentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mentor',
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Mentee', menteeSchema);

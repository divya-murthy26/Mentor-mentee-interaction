const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema({
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mentor',
    required: true
  },
  menteeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mentee',
    required: true
  },
  topic: {
    type: String,
    required: [true, 'Topic is required'],
    trim: true
  },
  dateTime: {
    type: Date,
    required: [true, 'Date and time is required']
  },
  sessionType: {
    type: String,
    enum: ['online', 'offline'],
    required: [true, 'Session type is required']
  },
  platform: {
    type: String,
    enum: ['Google Meet', 'Zoom', null],
    default: null
  },
  meetingLink: {
    type: String,
    default: null
  },
  location: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed'],
    default: 'pending'
  },
  calendarEventId: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Interaction', interactionSchema);

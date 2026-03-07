const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  interactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interaction',
    required: true
  },
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
  mentorName: { type: String, default: '' },
  menteeName: { type: String, default: '' },
  sessionDate: { type: Date },
  topic: { type: String, default: '' },
  hoursOfInteraction: { type: Number, default: 1 },
  pointsDiscussed: { type: String, default: '' },
  description: { type: String, default: '' },
  pdfFilePath: { type: String, default: null }
}, {
  timestamps: true
});

module.exports = mongoose.model('Feedback', feedbackSchema);

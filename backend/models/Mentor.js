const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  expertise: { type: String, trim: true, default: '' },
  profileDescription: { type: String, trim: true, default: '' },
  googleCalendarToken: { type: Object, default: null }
}, {
  timestamps: true
});

module.exports = mongoose.model('Mentor', mentorSchema);

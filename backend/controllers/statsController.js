const User = require('../models/User');
const Mentor = require('../models/Mentor');
const Mentee = require('../models/Mentee');
const Interaction = require('../models/Interaction');
const Feedback = require('../models/Feedback');

const getAdminStats = async (req, res) => {
  try {
    const [totalMentors, totalMentees, interactions, feedback] = await Promise.all([
      Mentor.countDocuments(),
      Mentee.countDocuments(),
      Interaction.find(),
      Feedback.countDocuments()
    ]);

    const totalSessions = interactions.length;
    const pending = interactions.filter(i => i.status === 'pending').length;
    const accepted = interactions.filter(i => i.status === 'accepted').length;
    const completed = interactions.filter(i => i.status === 'completed').length;
    const rejected = interactions.filter(i => i.status === 'rejected').length;

    // Sessions by month (last 6 months)
    const now = new Date();
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleString('default', { month: 'short', year: '2-digit' });
      const count = interactions.filter(s => {
        const sd = new Date(s.dateTime);
        return sd.getMonth() === d.getMonth() && sd.getFullYear() === d.getFullYear();
      }).length;
      monthlyData.push({ month: label, sessions: count });
    }

    res.status(200).json({
      success: true,
      data: {
        totalMentors, totalMentees, totalSessions,
        pending, accepted, completed, rejected,
        feedbackSubmitted: feedback,
        monthlyData
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching stats.' });
  }
};

const getMentorStats = async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ userId: req.user.id });
    if (!mentor) return res.status(404).json({ success: false, message: 'Mentor not found.' });

    const interactions = await Interaction.find({ mentorId: mentor._id });
    const feedback = await Feedback.countDocuments({ mentorId: mentor._id });

    res.status(200).json({
      success: true,
      data: {
        total: interactions.length,
        pending: interactions.filter(i => i.status === 'pending').length,
        accepted: interactions.filter(i => i.status === 'accepted').length,
        completed: interactions.filter(i => i.status === 'completed').length,
        rejected: interactions.filter(i => i.status === 'rejected').length,
        feedbackReceived: feedback
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching mentor stats.' });
  }
};

const getMenteeStats = async (req, res) => {
  try {
    const mentee = await Mentee.findOne({ userId: req.user.id });
    if (!mentee) return res.status(404).json({ success: false, message: 'Mentee not found.' });

    const interactions = await Interaction.find({ menteeId: mentee._id });
    const feedback = await Feedback.countDocuments({ menteeId: mentee._id });

    res.status(200).json({
      success: true,
      data: {
        total: interactions.length,
        pending: interactions.filter(i => i.status === 'pending').length,
        accepted: interactions.filter(i => i.status === 'accepted').length,
        completed: interactions.filter(i => i.status === 'completed').length,
        feedbackSubmitted: feedback
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching mentee stats.' });
  }
};

module.exports = { getAdminStats, getMentorStats, getMenteeStats };

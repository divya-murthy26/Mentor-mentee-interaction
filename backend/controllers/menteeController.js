const User = require('../models/User');
const Mentee = require('../models/Mentee');
const Mentor = require('../models/Mentor');

const getMentees = async (req, res) => {
  try {
    const mentees = await Mentee.find()
      .populate('userId', 'name email role')
      .populate({ path: 'assignedMentorId', populate: { path: 'userId', select: 'name email' } });
    res.status(200).json({ success: true, data: mentees });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching mentees.' });
  }
};

const createMentee = async (req, res) => {
  try {
    const { name, email, password, goal } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required.' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already in use.' });
    }
    const user = await User.create({ name, email, password, role: 'mentee' });
    const mentee = await Mentee.create({ userId: user._id, goal: goal || '' });
    const populated = await Mentee.findById(mentee._id).populate('userId', 'name email role');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    console.error('Create mentee error:', error);
    res.status(500).json({ success: false, message: 'Server error creating mentee.' });
  }
};

const assignMentor = async (req, res) => {
  try {
    const { id } = req.params;
    const { mentorId } = req.body;
    if (!mentorId) return res.status(400).json({ success: false, message: 'mentorId is required.' });

    const mentor = await Mentor.findById(mentorId);
    if (!mentor) return res.status(404).json({ success: false, message: 'Mentor not found.' });

    const mentee = await Mentee.findByIdAndUpdate(id, { assignedMentorId: mentorId }, { new: true })
      .populate('userId', 'name email role')
      .populate({ path: 'assignedMentorId', populate: { path: 'userId', select: 'name email' } });

    if (!mentee) return res.status(404).json({ success: false, message: 'Mentee not found.' });
    res.status(200).json({ success: true, data: mentee });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error assigning mentor.' });
  }
};

const getMenteeByUserId = async (req, res) => {
  try {
    const mentee = await Mentee.findOne({ userId: req.user.id })
      .populate('userId', 'name email')
      .populate({ path: 'assignedMentorId', populate: { path: 'userId', select: 'name email' } });
    if (!mentee) return res.status(404).json({ success: false, message: 'Mentee profile not found.' });
    res.status(200).json({ success: true, data: mentee });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { getMentees, createMentee, assignMentor, getMenteeByUserId };

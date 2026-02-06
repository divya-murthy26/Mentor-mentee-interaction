const User = require('../models/User');
const Meeting = require('../models/Meeting');
const Feedback = require('../models/Feedback');
const bcrypt = require('bcryptjs');

// Helper to create user
const createUser = async (req, res, role) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      name,
      email,
      password,
      role
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    res.json({ msg: `${role} created successfully`, user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.createMentor = async (req, res) => {
  await createUser(req, res, 'mentor');
};

exports.createMentee = async (req, res) => {
  await createUser(req, res, 'mentee');
};

exports.assignMentor = async (req, res) => {
  const { mentorId, menteeId } = req.body;

  try {
    const mentor = await User.findById(mentorId);
    const mentee = await User.findById(menteeId);

    if (!mentor || mentor.role !== 'mentor') return res.status(404).json({ msg: 'Mentor not found' });
    if (!mentee || mentee.role !== 'mentee') return res.status(404).json({ msg: 'Mentee not found' });

    mentee.assignedMentor = mentorId;
    await mentee.save();

    res.json({ msg: 'Mentor assigned successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getAllSessions = async (req, res) => {
  try {
    const sessions = await Meeting.find().populate('mentor', 'name').populate('mentee', 'name');
    res.json(sessions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate('mentee', 'name').populate('meetingId');
    res.json(feedbacks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.createAdmin = async (req, res) => {
  await createUser(req, res, 'admin');
};
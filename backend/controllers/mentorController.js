const User = require('../models/User');
const Mentor = require('../models/Mentor');

const getMentors = async (req, res) => {
  try {
    const mentors = await Mentor.find().populate('userId', 'name email role');
    res.status(200).json({ success: true, data: mentors });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching mentors.' });
  }
};

const createMentor = async (req, res) => {
  try {
    const { name, email, password, expertise, profileDescription } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required.' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already in use.' });
    }
    const user = await User.create({ name, email, password, role: 'mentor' });
    const mentor = await Mentor.create({
      userId: user._id,
      expertise: expertise || '',
      profileDescription: profileDescription || ''
    });
    const populated = await Mentor.findById(mentor._id).populate('userId', 'name email role');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    console.error('Create mentor error:', error);
    res.status(500).json({ success: false, message: 'Server error creating mentor.' });
  }
};

const getMentorByUserId = async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ userId: req.user.id }).populate('userId', 'name email');
    if (!mentor) return res.status(404).json({ success: false, message: 'Mentor profile not found.' });
    res.status(200).json({ success: true, data: mentor });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

const updateMentorProfile = async (req, res) => {
  try {
    const { name, email, expertise, profileDescription } = req.body;
    const mentor = await Mentor.findOne({ userId: req.user.id });
    if (!mentor) return res.status(404).json({ success: false, message: 'Mentor not found.' });

    // Update user fields
    if (name || email) {
      await User.findByIdAndUpdate(req.user.id, {
        ...(name && { name }),
        ...(email && { email })
      });
    }
    // Update mentor fields
    mentor.expertise = expertise !== undefined ? expertise : mentor.expertise;
    mentor.profileDescription = profileDescription !== undefined ? profileDescription : mentor.profileDescription;
    await mentor.save();

    const updated = await Mentor.findById(mentor._id).populate('userId', 'name email role');
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error('Update mentor error:', error);
    res.status(500).json({ success: false, message: 'Server error updating profile.' });
  }
};

module.exports = { getMentors, createMentor, getMentorByUserId, updateMentorProfile };

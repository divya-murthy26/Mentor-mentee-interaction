const Interaction = require('../models/Interaction');
const Mentor = require('../models/Mentor');
const Mentee = require('../models/Mentee');
const { createCalendarEvent } = require('../services/calendarService');

const createInteraction = async (req, res) => {
  try {
    const { topic, dateTime, sessionType, platform, meetingLink, location } = req.body;

    if (!topic || !dateTime || !sessionType) {
      return res.status(400).json({ success: false, message: 'topic, dateTime, and sessionType are required.' });
    }
    if (sessionType === 'online' && !meetingLink) {
      return res.status(400).json({ success: false, message: 'Meeting link is required for online sessions.' });
    }
    if (sessionType === 'offline' && !location) {
      return res.status(400).json({ success: false, message: 'Location is required for offline sessions.' });
    }

    // Get mentee and their assigned mentor
    const mentee = await Mentee.findOne({ userId: req.user.id })
      .populate({ path: 'assignedMentorId', populate: { path: 'userId', select: 'name email' } });
    if (!mentee) return res.status(404).json({ success: false, message: 'Mentee profile not found.' });
    if (!mentee.assignedMentorId) {
      return res.status(400).json({ success: false, message: 'You have no assigned mentor. Please contact admin.' });
    }

    const interaction = await Interaction.create({
      mentorId: mentee.assignedMentorId._id,
      menteeId: mentee._id,
      topic,
      dateTime,
      sessionType,
      platform: sessionType === 'online' ? (platform || 'Google Meet') : null,
      meetingLink: sessionType === 'online' ? meetingLink : null,
      location: sessionType === 'offline' ? location : null,
      status: 'pending'
    });

    const populated = await Interaction.findById(interaction._id)
      .populate({ path: 'mentorId', populate: { path: 'userId', select: 'name email' } })
      .populate({ path: 'menteeId', populate: { path: 'userId', select: 'name email' } });

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    console.error('Create interaction error:', error);
    res.status(500).json({ success: false, message: 'Server error creating interaction.' });
  }
};

const getInteractions = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'mentor') {
      const mentor = await Mentor.findOne({ userId: req.user.id });
      if (!mentor) return res.status(404).json({ success: false, message: 'Mentor not found.' });
      query.mentorId = mentor._id;
    } else if (req.user.role === 'mentee') {
      const mentee = await Mentee.findOne({ userId: req.user.id });
      if (!mentee) return res.status(404).json({ success: false, message: 'Mentee not found.' });
      query.menteeId = mentee._id;
    }

    const interactions = await Interaction.find(query)
      .populate({ path: 'mentorId', populate: { path: 'userId', select: 'name email' } })
      .populate({ path: 'menteeId', populate: { path: 'userId', select: 'name email' } })
      .sort({ dateTime: -1 });

    res.status(200).json({ success: true, data: interactions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching interactions.' });
  }
};

const acceptInteraction = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;

    const interaction = await Interaction.findById(id)
      .populate({ path: 'mentorId', populate: { path: 'userId', select: 'name email' } })
      .populate({ path: 'menteeId', populate: { path: 'userId', select: 'name email' } });

    if (!interaction) return res.status(404).json({ success: false, message: 'Interaction not found.' });

    const mentor = await Mentor.findOne({ userId: req.user.id });
    if (!mentor || interaction.mentorId._id.toString() !== mentor._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this interaction.' });
    }

    if (action === 'accept') {
      interaction.status = 'accepted';
      try {
        const mentorUser = interaction.mentorId.userId;
        const menteeUser = interaction.menteeId.userId;
        const eventId = await createCalendarEvent(interaction, mentorUser, menteeUser);
        if (eventId) interaction.calendarEventId = eventId;
      } catch (calErr) {
        console.error('Calendar error (non-fatal):', calErr.message);
      }
    } else if (action === 'reject') {
      interaction.status = 'rejected';
    } else {
      return res.status(400).json({ success: false, message: 'Invalid action. Use accept or reject.' });
    }

    await interaction.save();
    res.status(200).json({ success: true, data: interaction });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error updating interaction.' });
  }
};

const markCompleted = async (req, res) => {
  try {
    const interaction = await Interaction.findByIdAndUpdate(req.params.id, { status: 'completed' }, { new: true });
    if (!interaction) return res.status(404).json({ success: false, message: 'Interaction not found.' });
    res.status(200).json({ success: true, data: interaction });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { createInteraction, getInteractions, acceptInteraction, markCompleted };

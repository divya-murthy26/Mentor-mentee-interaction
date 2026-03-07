const Feedback = require('../models/Feedback');
const Interaction = require('../models/Interaction');
const Mentee = require('../models/Mentee');
const Mentor = require('../models/Mentor');
const { generateFeedbackPDF } = require('../services/pdfService');
const path = require('path');
const fs = require('fs');

const submitFeedback = async (req, res) => {
  try {
    const { interactionId, hoursOfInteraction, pointsDiscussed, description } = req.body;
    if (!interactionId) {
      return res.status(400).json({ success: false, message: 'interactionId is required.' });
    }

    const interaction = await Interaction.findById(interactionId)
      .populate({ path: 'mentorId', populate: { path: 'userId', select: 'name email' } })
      .populate({ path: 'menteeId', populate: { path: 'userId', select: 'name email' } });

    if (!interaction) return res.status(404).json({ success: false, message: 'Interaction not found.' });

    const mentorName = interaction.mentorId.userId.name;
    const menteeName = interaction.menteeId.userId.name;

    const feedback = await Feedback.create({
      interactionId,
      mentorId: interaction.mentorId._id,
      menteeId: interaction.menteeId._id,
      mentorName,
      menteeName,
      sessionDate: interaction.dateTime,
      topic: interaction.topic,
      hoursOfInteraction: hoursOfInteraction || 1,
      pointsDiscussed: pointsDiscussed || '',
      description: description || ''
    });

    // Generate PDF
    try {
      const { filePath } = await generateFeedbackPDF(feedback, interaction);
      feedback.pdfFilePath = filePath;
      await feedback.save();
      await Interaction.findByIdAndUpdate(interactionId, { status: 'completed' });
    } catch (pdfErr) {
      console.error('PDF error (non-fatal):', pdfErr.message);
    }

    const populated = await Feedback.findById(feedback._id)
      .populate({ path: 'mentorId', populate: { path: 'userId', select: 'name email' } })
      .populate({ path: 'menteeId', populate: { path: 'userId', select: 'name email' } })
      .populate('interactionId');

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({ success: false, message: 'Server error submitting feedback.' });
  }
};

const getFeedback = async (req, res) => {
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
    // admin gets all

    const feedback = await Feedback.find(query)
      .populate({ path: 'mentorId', populate: { path: 'userId', select: 'name email' } })
      .populate({ path: 'menteeId', populate: { path: 'userId', select: 'name email' } })
      .populate('interactionId')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching feedback.' });
  }
};

const downloadFeedbackPDF = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) return res.status(404).json({ success: false, message: 'Feedback not found.' });
    if (!feedback.pdfFilePath) return res.status(404).json({ success: false, message: 'PDF not found.' });

    const absolutePath = path.join(__dirname, '..', feedback.pdfFilePath);
    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({ success: false, message: 'PDF file not found on server.' });
    }
    res.download(absolutePath, `feedback_${req.params.id}.pdf`);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error downloading PDF.' });
  }
};

module.exports = { submitFeedback, getFeedback, downloadFeedbackPDF };

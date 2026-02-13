const Meeting = require('../models/Meeting');
const Feedback = require('../models/Feedback');
const User = require('../models/User');

exports.scheduleMeeting = async (req, res) => {
  const { dateTime, description } = req.body;
  
  try {
    const mentee = await User.findById(req.user.id);
    
    if (!mentee.assignedMentor) {
      return res.status(400).json({ msg: 'No mentor assigned yet' });
    }

    const newMeeting = new Meeting({
      mentee: req.user.id,
      mentor: mentee.assignedMentor,
      dateTime,
      description
    });

    await newMeeting.save();
    res.json(newMeeting);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getMyMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({ mentee: req.user.id }).populate('mentor', 'name');
    res.json(meetings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.submitFeedback = async (req, res) => {
  const { meetingId, rating, comments } = req.body;

  try {
    const feedback = new Feedback({
      meetingId,
      mentee: req.user.id,
      rating,
      comments
    });

    await feedback.save();
    res.json({ msg: 'Feedback submitted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
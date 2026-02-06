const Meeting = require('../models/Meeting');

exports.getRequests = async (req, res) => {
  try {
    // Find meetings where mentor is current user
    const meetings = await Meeting.find({ mentor: req.user.id }).populate('mentee', 'name');
    res.json(meetings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const updateStatus = async (req, res, status) => {
  const { meetingId } = req.body;
  try {
    let meeting = await Meeting.findById(meetingId);

    if (!meeting) return res.status(404).json({ msg: 'Meeting not found' });

    // Ensure this meeting belongs to this mentor
    if (meeting.mentor.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    meeting.status = status;
    await meeting.save();
    res.json(meeting);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.acceptMeeting = async (req, res) => {
  await updateStatus(req, res, 'accepted');
};

exports.rejectMeeting = async (req, res) => {
  await updateStatus(req, res, 'rejected');
};

exports.completeMeeting = async (req, res) => {
  await updateStatus(req, res, 'completed');
};
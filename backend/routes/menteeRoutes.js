const express = require('express');
const router = express.Router();
const menteeController = require('../controllers/menteeController');
const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');

// All routes here require Auth and Mentee role
router.use(auth, checkRole(['mentee']));

router.post('/schedule', menteeController.scheduleMeeting);
router.get('/my-meetings', menteeController.getMyMeetings);
router.post('/feedback', menteeController.submitFeedback);

module.exports = router;
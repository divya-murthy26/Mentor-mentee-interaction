const express = require('express');
const router = express.Router();
const mentorController = require('../controllers/mentorController');
const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');

// All routes here require Auth and Mentor role
router.use(auth, checkRole(['mentor']));

router.get('/requests', mentorController.getRequests);
router.post('/accept', mentorController.acceptMeeting);
router.post('/reject', mentorController.rejectMeeting);
router.post('/complete', mentorController.completeMeeting);

module.exports = router;
const express = require('express');
const router = express.Router();
const { getMentors, createMentor, getMentorByUserId, updateMentorProfile } = require('../controllers/mentorController');
const { protect, authorize } = require('../middlewares/auth');

router.get('/', protect, getMentors);
router.post('/', protect, authorize('admin'), createMentor);
router.get('/me', protect, authorize('mentor'), getMentorByUserId);
router.put('/me', protect, authorize('mentor'), updateMentorProfile);

module.exports = router;

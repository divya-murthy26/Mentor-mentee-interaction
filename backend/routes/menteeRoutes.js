const express = require('express');
const router = express.Router();
const { getMentees, createMentee, assignMentor, getMenteeByUserId } = require('../controllers/menteeController');
const { protect, authorize } = require('../middlewares/auth');

router.get('/', protect, authorize('admin', 'mentor'), getMentees);
router.post('/', protect, authorize('admin'), createMentee);
router.patch('/:id/assign', protect, authorize('admin'), assignMentor);
router.get('/me', protect, authorize('mentee'), getMenteeByUserId);

module.exports = router;

const express = require('express');
const router = express.Router();
const { createInteraction, getInteractions, acceptInteraction, markCompleted } = require('../controllers/interactionController');
const { protect, authorize } = require('../middlewares/auth');

router.post('/', protect, authorize('mentee'), createInteraction);
router.get('/', protect, getInteractions);
router.patch('/:id/accept', protect, authorize('mentor'), acceptInteraction);
router.patch('/:id/complete', protect, markCompleted);

module.exports = router;

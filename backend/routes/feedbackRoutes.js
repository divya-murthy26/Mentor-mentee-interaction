const express = require('express');
const router = express.Router();
const { submitFeedback, getFeedback, downloadFeedbackPDF } = require('../controllers/feedbackController');
const { protect, authorize } = require('../middlewares/auth');

router.post('/', protect, authorize('mentee'), submitFeedback);
router.get('/', protect, getFeedback);
router.get('/:id/pdf', protect, downloadFeedbackPDF);

module.exports = router;

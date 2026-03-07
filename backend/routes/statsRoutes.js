const express = require('express');
const router = express.Router();
const { getAdminStats, getMentorStats, getMenteeStats } = require('../controllers/statsController');
const { protect, authorize } = require('../middlewares/auth');

router.get('/admin', protect, authorize('admin'), getAdminStats);
router.get('/mentor', protect, authorize('mentor'), getMentorStats);
router.get('/mentee', protect, authorize('mentee'), getMenteeStats);

module.exports = router;

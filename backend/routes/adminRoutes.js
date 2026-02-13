const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');

// All routes here require Auth and Admin role
router.use(auth, checkRole(['admin']));

router.post('/create-mentor', adminController.createMentor);
router.post('/create-mentee', adminController.createMentee);
router.post('/assign-mentor', adminController.assignMentor);
router.get('/all-sessions', adminController.getAllSessions);
router.get('/all-feedback', adminController.getAllFeedback);

module.exports = router;
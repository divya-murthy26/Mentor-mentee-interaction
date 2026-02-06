const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');

// @route POST /api/auth/login
router.post('/create-admin', adminController.createAdmin);
router.post('/login', authController.login);

module.exports = router;
const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile } = require('../controllers/authController');
const { sendOTP, verifyOTP, checkOTPStatus, sendOTPForRegister, verifyOTPForRegister } = require('../controllers/otpController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/send-otp', protect, sendOTP);
router.post('/verify-otp', protect, verifyOTP);
router.get('/phone-status', protect, checkOTPStatus);
router.post('/send-otp-register', sendOTPForRegister);
router.post('/verify-otp-register', verifyOTPForRegister);

module.exports = router;

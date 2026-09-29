const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { protect } = require('../middleware/auth');
const logger = require('../utils/logger');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
  '/register',
  [
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('phone').matches(/^[6-9]\d{9}$/).withMessage('Please provide a valid 10-digit phone number'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('dateOfBirth').isISO8601().withMessage('Please provide a valid date of birth'),
    body('gender').isIn(['male', 'female', 'other']).withMessage('Invalid gender'),
    body('state').trim().notEmpty().withMessage('State is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const {
        firstName,
        lastName,
        email,
        phone,
        password,
        dateOfBirth,
        gender,
        address,
        isST,
        isPVTG,
        tribeName,
      } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this email or phone already exists',
        });
      }

      // Create user
      const user = await User.create({
        firstName,
        lastName,
        email,
        phone,
        password,
        dateOfBirth,
        gender,
        address: {
          ...address,
          state: req.body.state,
        },
        isST: isST || false,
        isPVTG: isPVTG || false,
        tribeName,
      });

      // Generate token
      const token = generateToken(user._id);

      logger.info(`New user registered: ${email}`);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          isVerified: user.isVerified,
        },
      });
    } catch (error) {
      logger.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during registration',
      });
    }
  }
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { email, password } = req.body;

      // Check if user exists (include password for comparison)
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
      }

      // Check password
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
      }

      // Update last login
      user.lastLogin = Date.now();
      user.loginCount += 1;
      await user.save();

      // Generate token
      const token = generateToken(user._id);

      logger.info(`User logged in: ${email}`);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          isVerified: user.isVerified,
          role: user.role,
        },
      });
    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during login',
      });
    }
  }
);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    logger.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const allowedFields = [
      'firstName',
      'lastName',
      'phone',
      'address',
      'educationLevel',
      'currentInstitution',
      'currentCourse',
      'bankDetails',
      'fatherName',
      'motherName',
      'annualFamilyIncome',
      'familyMembers',
      'stCertificateNumber',
      'stCertificateIssuingAuthority',
      'stCertificateIssueDate',
      'apaarId',
    ];

    const updateData = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    logger.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during profile update',
    });
  }
});

// @route   POST /api/auth/send-otp
// @desc    Send OTP for phone verification
// @access  Private
router.post('/send-otp', protect, async (req, res) => {
  try {
    const { phone } = req.body;

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user with OTP
    await User.findByIdAndUpdate(req.user._id, {
      otp: {
        code: otp,
        expiry: otpExpiry,
      },
    });

    // TODO: Integrate with SMS service to send OTP
    logger.info(`OTP sent to ${phone}: ${otp}`);

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
    });
  } catch (error) {
    logger.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while sending OTP',
    });
  }
});

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP
// @access  Private
router.post('/verify-otp', protect, async (req, res) => {
  try {
    const { otp } = req.body;

    const user = await User.findById(req.user._id);

    if (!user.otp || user.otp.code !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP',
      });
    }

    if (new Date() > user.otp.expiry) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired',
      });
    }

    // Verify phone
    user.isPhoneVerified = true;
    user.otp = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Phone verified successfully',
    });
  } catch (error) {
    logger.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while verifying OTP',
    });
  }
});

module.exports = router;

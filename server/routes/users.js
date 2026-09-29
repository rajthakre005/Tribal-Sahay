const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');
const Application = require('../models/Application');
const logger = require('../utils/logger');

// @route   GET /api/users/dashboard
// @desc    Get user dashboard data
// @access  Private
router.get('/dashboard', protect, async (req, res) => {
  try {
    // Get user's applications
    const applications = await Application.find({ applicant: req.user._id })
      .select('scheme status academicYear applicationNumber submittedAt sanctionedAmount')
      .sort('-createdAt');

    // Calculate statistics
    const stats = {
      totalApplications: applications.length,
      pendingApplications: applications.filter((a) => a.status === 'submitted' || a.status === 'under_review').length,
      approvedApplications: applications.filter((a) => a.status === 'approved' || a.status === 'sanctioned').length,
      disbursedApplications: applications.filter((a) => a.status === 'disbursed').length,
      rejectedApplications: applications.filter((a) => a.status === 'rejected').length,
    };

    // Get recent activity
    const recentActivity = applications.slice(0, 5).map((app) => ({
      type: 'application',
      scheme: app.scheme,
      status: app.status,
      date: app.updatedAt,
      applicationNumber: app.applicationNumber,
    }));

    res.status(200).json({
      success: true,
      dashboard: {
        user: {
          firstName: req.user.firstName,
          lastName: req.user.lastName,
          isVerified: req.user.isVerified,
          digilockerLinked: req.user.digilockerLinked,
        },
        stats,
        recentApplications: applications.slice(0, 5),
        recentActivity,
      },
    });
  } catch (error) {
    logger.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard',
    });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID (Admin only)
// @access  Private (Admin)
router.get('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    logger.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user',
    });
  }
});

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private (Admin)
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10, isST, state, role } = req.query;

    const query = {};

    if (isST !== undefined) query.isST = isST === 'true';
    if (state) query['address.state'] = state;
    if (role) query.role = role;

    const users = await User.find(query)
      .select('-password -otp')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort('-createdAt');

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      users,
    });
  } catch (error) {
    logger.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users',
    });
  }
});

// @route   PUT /api/users/:id/verify
// @desc    Verify user (Admin only)
// @access  Private (Admin)
router.put('/:id/verify', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.isVerified = true;
    await user.save();

    logger.info(`User verified: ${user._id} by admin ${req.user._id}`);

    res.status(200).json({
      success: true,
      message: 'User verified successfully',
      user,
    });
  } catch (error) {
    logger.error('Verify user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while verifying user',
    });
  }
});

module.exports = router;

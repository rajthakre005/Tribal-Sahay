const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Verification = require('../models/Verification');
const Application = require('../models/Application');
const { VERIFICATION_STATUS, VERIFICATION_SOURCES } = require('../config/constants');
const logger = require('../utils/logger');

// @route   POST /api/verification/initiate
// @desc    Initiate verification for an application
// @access  Private (Admin/Verifier)
router.post('/initiate', protect, authorize('admin', 'verifier'), async (req, res) => {
  try {
    const { applicationId, verificationType } = req.body;

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Check if verification already exists
    const existingVerification = await Verification.findOne({
      application: applicationId,
      verificationType,
      status: { $nin: [VERIFICATION_STATUS.VERIFIED, VERIFICATION_STATUS.FAILED] },
    });

    if (existingVerification) {
      return res.status(400).json({
        success: false,
        message: 'Verification already in progress for this type',
      });
    }

    // Determine source based on verification type
    const sourceMap = {
      identity: VERIFICATION_SOURCES.UIDAI,
      st_status: VERIFICATION_SOURCES.EDISTRICT,
      income: VERIFICATION_SOURCES.EDISTRICT,
      academic: VERIFICATION_SOURCES.APAAR,
      institution: VERIFICATION_SOURCES.AISHE,
    };

    const source = sourceMap[verificationType] || VERIFICATION_SOURCES.MANUAL;

    // Create verification record
    const verification = await Verification.create({
      application: applicationId,
      user: application.applicant,
      verificationType,
      status: VERIFICATION_STATUS.PENDING,
      source,
      initiatedAt: Date.now(),
    });

    logger.info(`Verification initiated: ${verification._id} for application ${applicationId}`);

    // TODO: Trigger actual verification process based on source
    // This would call the appropriate government API

    res.status(201).json({
      success: true,
      message: 'Verification initiated successfully',
      verification,
    });
  } catch (error) {
    logger.error('Initiate verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while initiating verification',
    });
  }
});

// @route   GET /api/verification/application/:applicationId
// @desc    Get all verifications for an application
// @access  Private
router.get('/application/:applicationId', protect, async (req, res) => {
  try {
    const application = await Application.findById(req.params.applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Check if user owns this application
    if (
      application.applicant.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin' &&
      req.user.role !== 'verifier'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this application',
      });
    }

    const verifications = await Verification.find({
      application: req.params.applicationId,
    }).sort('-initiatedAt');

    res.status(200).json({
      success: true,
      count: verifications.length,
      verifications,
    });
  } catch (error) {
    logger.error('Get verifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching verifications',
    });
  }
});

// @route   GET /api/verification/:id
// @desc    Get specific verification details
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const verification = await Verification.findById(req.params.id)
      .populate('application')
      .populate('user', 'firstName lastName email');

    if (!verification) {
      return res.status(404).json({
        success: false,
        message: 'Verification not found',
      });
    }

    // Check authorization
    if (
      verification.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin' &&
      req.user.role !== 'verifier'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this verification',
      });
    }

    res.status(200).json({
      success: true,
      verification,
    });
  } catch (error) {
    logger.error('Get verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching verification',
    });
  }
});

// @route   PUT /api/verification/:id/manual-review
// @desc    Submit manual review for verification
// @access  Private (Admin/Verifier)
router.put('/:id/manual-review', protect, authorize('admin', 'verifier'), async (req, res) => {
  try {
    const { status, remarks } = req.body;

    const verification = await Verification.findById(req.params.id);

    if (!verification) {
      return res.status(404).json({
        success: false,
        message: 'Verification not found',
      });
    }

    verification.status = status;
    verification.requiresManualReview = false;
    verification.manualReviewBy = req.user._id;
    verification.manualReviewDate = Date.now();
    verification.manualReviewRemarks = remarks;
    verification.completedAt = Date.now();

    await verification.save();

    // Update application verification status
    const application = await Application.findById(verification.application);
    if (application) {
      const verificationTypeMap = {
        identity: 'identity',
        st_status: 'stStatus',
        income: 'income',
        academic: 'academic',
        institution: 'institution',
      };

      const field = verificationTypeMap[verification.verificationType];
      if (field) {
        application.verificationStatus[field].status = status;
        application.verificationStatus[field].source = VERIFICATION_SOURCES.MANUAL;
        application.verificationStatus[field].verifiedAt = Date.now();
        application.verificationStatus[field].remarks = remarks;
        await application.save();
      }
    }

    logger.info(`Manual review submitted for verification ${verification._id}`);

    res.status(200).json({
      success: true,
      message: 'Manual review submitted successfully',
      verification,
    });
  } catch (error) {
    logger.error('Manual review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while submitting manual review',
    });
  }
});

// @route   GET /api/verification/pending
// @desc    Get all pending verifications requiring manual review
// @access  Private (Admin/Verifier)
router.get('/pending/all', protect, authorize('admin', 'verifier'), async (req, res) => {
  try {
    const verifications = await Verification.find({
      requiresManualReview: true,
      status: VERIFICATION_STATUS.MANUAL_REVIEW,
    })
      .populate('application', 'applicationNumber scheme')
      .populate('user', 'firstName lastName email phone')
      .sort('-initiatedAt');

    res.status(200).json({
      success: true,
      count: verifications.length,
      verifications,
    });
  } catch (error) {
    logger.error('Get pending verifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching pending verifications',
    });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Application = require('../models/Application');
const { APPLICATION_STATUS, SCHOLARSHIP_SCHEMES } = require('../config/constants');
const logger = require('../utils/logger');

// @route   POST /api/applications
// @desc    Create new scholarship application
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { scheme, academicYear, academicDetails, previousAcademicRecord, incomeDetails } = req.body;

    // Validate scheme
    if (!SCHOLARSHIP_SCHEMES[scheme.toUpperCase()]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid scholarship scheme',
      });
    }

    // Check if user already has an active application for this scheme in the same academic year
    const existingApplication = await Application.findOne({
      applicant: req.user._id,
      scheme,
      academicYear,
      status: { $nin: [APPLICATION_STATUS.REJECTED, APPLICATION_STATUS.DISBURSED] },
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active application for this scheme in this academic year',
      });
    }

    // Create application
    const application = await Application.create({
      applicant: req.user._id,
      scheme,
      academicYear,
      academicDetails,
      previousAcademicRecord,
      incomeDetails,
      status: APPLICATION_STATUS.DRAFT,
    });

    // Add audit trail
    application.auditTrail.push({
      action: 'application_created',
      performedBy: req.user._id,
      details: { scheme, academicYear },
    });

    await application.save();

    logger.info(`Application created: ${application.applicationNumber} by user ${req.user._id}`);

    res.status(201).json({
      success: true,
      message: 'Application created successfully',
      application,
    });
  } catch (error) {
    logger.error('Create application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating application',
    });
  }
});

// @route   GET /api/applications
// @desc    Get all applications for current user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { status, scheme, academicYear } = req.query;

    const query = { applicant: req.user._id };

    if (status) query.status = status;
    if (scheme) query.scheme = scheme;
    if (academicYear) query.academicYear = academicYear;

    const applications = await Application.find(query)
      .populate('applicant', 'firstName lastName email phone')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    logger.error('Get applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching applications',
    });
  }
});

// @route   GET /api/applications/:id
// @desc    Get specific application details
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('applicant', 'firstName lastName email phone isST isPVTG')
      .populate('documents.documentId');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Check if user owns this application
    if (application.applicant._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this application',
      });
    }

    res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    logger.error('Get application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching application',
    });
  }
});

// @route   PUT /api/applications/:id
// @desc    Update application
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Check if user owns this application
    if (application.applicant.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this application',
      });
    }

    // Only allow updates if application is in draft or verification_pending status
    if (
      application.status !== APPLICATION_STATUS.DRAFT &&
      application.status !== APPLICATION_STATUS.VERIFICATION_PENDING
    ) {
      return res.status(400).json({
        success: false,
        message: 'Cannot update application in current status',
      });
    }

    const allowedFields = [
      'academicDetails',
      'previousAcademicRecord',
      'incomeDetails',
    ];

    const updateData = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    // Add audit trail
    updatedApplication.auditTrail.push({
      action: 'application_updated',
      performedBy: req.user._id,
      details: updateData,
    });

    await updatedApplication.save();

    logger.info(`Application updated: ${updatedApplication.applicationNumber} by user ${req.user._id}`);

    res.status(200).json({
      success: true,
      message: 'Application updated successfully',
      application: updatedApplication,
    });
  } catch (error) {
    logger.error('Update application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating application',
    });
  }
});

// @route   POST /api/applications/:id/submit
// @desc    Submit application for review
// @access  Private
router.post('/:id/submit', protect, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Check if user owns this application
    if (application.applicant.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to submit this application',
      });
    }

    // Only allow submission if application is in draft status
    if (application.status !== APPLICATION_STATUS.DRAFT) {
      return res.status(400).json({
        success: false,
        message: 'Application can only be submitted from draft status',
      });
    }

    application.status = APPLICATION_STATUS.SUBMITTED;
    application.submittedAt = Date.now();

    // Add audit trail
    application.auditTrail.push({
      action: 'application_submitted',
      performedBy: req.user._id,
      details: { submittedAt: application.submittedAt },
    });

    await application.save();

    logger.info(`Application submitted: ${application.applicationNumber} by user ${req.user._id}`);

    // TODO: Trigger verification process
    // TODO: Send notification to user

    res.status(200).json({
      success: true,
      message: 'Application submitted successfully',
      application,
    });
  } catch (error) {
    logger.error('Submit application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while submitting application',
    });
  }
});

// @route   GET /api/applications/:id/status
// @desc    Get application status timeline
// @access  Private
router.get('/:id/status', protect, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Check if user owns this application
    if (application.applicant.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this application',
      });
    }

    const statusTimeline = {
      currentStatus: application.status,
      submittedAt: application.submittedAt,
      reviewedAt: application.reviewedAt,
      approvedAt: application.approvedAt,
      sanctionedAt: application.sanctionedAt,
      disbursedAt: application.disbursedAt,
      verificationStatus: application.verificationStatus,
      deficiencies: application.deficiencies.filter((d) => !d.resolved),
    };

    res.status(200).json({
      success: true,
      statusTimeline,
    });
  } catch (error) {
    logger.error('Get application status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching application status',
    });
  }
});

module.exports = router;

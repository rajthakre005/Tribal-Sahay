const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Application = require('../models/Application');
const logger = require('../utils/logger');

// @route   GET /api/payments
// @desc    Get all payments for current user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const applications = await Application.find({
      applicant: req.user._id,
      status: { $in: ['sanctioned', 'disbursed', 'disbursement_pending'] },
    }).select('scheme applicationNumber paymentDetails sanctionedAt disbursedAt');

    const payments = applications.flatMap((app) => {
      return app.paymentDetails.disbursements.map((disbursement) => ({
        applicationNumber: app.applicationNumber,
        scheme: app.scheme,
        amount: disbursement.amount,
        date: disbursement.date,
        referenceNumber: disbursement.referenceNumber,
        status: disbursement.status,
        remarks: disbursement.remarks,
      }));
    });

    res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    logger.error('Get payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching payments',
    });
  }
});

// @route   GET /api/payments/:id
// @desc    Get specific payment details
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    // Find application containing this payment
    const application = await Application.findOne({
      applicant: req.user._id,
      'paymentDetails.disbursements._id': req.params.id,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    const disbursement = application.paymentDetails.disbursements.id(req.params.id);

    res.status(200).json({
      success: true,
      payment: {
        applicationNumber: application.applicationNumber,
        scheme: application.scheme,
        ...disbursement.toObject(),
      },
    });
  } catch (error) {
    logger.error('Get payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching payment',
    });
  }
});

// @route   GET /api/payments/dbt-status/:applicationId
// @desc    Check DBT status for an application
// @access  Private
router.get('/dbt-status/:applicationId', protect, async (req, res) => {
  try {
    const application = await Application.findById(req.params.applicationId);

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

    // TODO: Implement actual DBT status check with PFMS API
    // This is a placeholder for the actual integration

    const dbtStatus = {
      referenceNumber: application.paymentDetails.dbtReference,
      status: application.paymentDetails.dbtStatus || 'pending',
      totalAmount: application.paymentDetails.totalAmount,
      disbursedAmount: application.paymentDetails.disbursedAmount,
      pendingAmount: application.paymentDetails.pendingAmount,
      lastUpdated: application.updatedAt,
    };

    res.status(200).json({
      success: true,
      dbtStatus,
    });
  } catch (error) {
    logger.error('Get DBT status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching DBT status',
    });
  }
});

// @route   GET /api/payments/summary
// @desc    Get payment summary for current user
// @access  Private
router.get('/summary/user', protect, async (req, res) => {
  try {
    const applications = await Application.find({
      applicant: req.user._id,
      paymentDetails: { $exists: true },
    });

    let totalSanctioned = 0;
    let totalDisbursed = 0;
    let totalPending = 0;

    applications.forEach((app) => {
      totalSanctioned += app.paymentDetails.totalAmount || 0;
      totalDisbursed += app.paymentDetails.disbursedAmount || 0;
      totalPending += app.paymentDetails.pendingAmount || 0;
    });

    res.status(200).json({
      success: true,
      summary: {
        totalSanctioned,
        totalDisbursed,
        totalPending,
        applicationCount: applications.length,
      },
    });
  } catch (error) {
    logger.error('Get payment summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching payment summary',
    });
  }
});

module.exports = router;

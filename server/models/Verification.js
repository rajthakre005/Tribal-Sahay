const mongoose = require('mongoose');
const { VERIFICATION_STATUS, VERIFICATION_SOURCES } = require('../config/constants');

const verificationSchema = new mongoose.Schema(
  {
    // Reference to Application
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
    },

    // Reference to User
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Verification Type
    verificationType: {
      type: String,
      enum: ['identity', 'st_status', 'income', 'academic', 'institution', 'disability', 'net_jrf'],
      required: [true, 'Verification type is required'],
    },

    // Verification Status
    status: {
      type: String,
      enum: Object.values(VERIFICATION_STATUS),
      default: VERIFICATION_STATUS.PENDING,
    },

    // Source System
    source: {
      type: String,
      enum: Object.values(VERIFICATION_SOURCES),
    },

    // API Request/Response
    apiRequest: {
      endpoint: String,
      payload: mongoose.Schema.Types.Mixed,
      timestamp: Date,
    },
    apiResponse: {
      data: mongoose.Schema.Types.Mixed,
      timestamp: Date,
      success: Boolean,
      errorMessage: String,
    },

    // Verification Result
    verificationResult: {
      matched: Boolean,
      confidence: Number,
      discrepancies: [
        {
          field: String,
          expected: String,
          actual: String,
        },
      ],
    },

    // Manual Review (if automated verification fails)
    requiresManualReview: {
      type: Boolean,
      default: false,
    },
    manualReviewBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    manualReviewDate: Date,
    manualReviewRemarks: String,

    // Timestamps
    initiatedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: Date,

    // Retry Information
    retryCount: {
      type: Number,
      default: 0,
    },
    maxRetries: {
      type: Number,
      default: 3,
    },
    nextRetryAt: Date,

    // Error Information
    error: {
      message: String,
      code: String,
      stack: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
verificationSchema.index({ application: 1, verificationType: 1 });
verificationSchema.index({ user: 1, status: 1 });
verificationSchema.index({ status: 1, requiresManualReview: 1 });

const Verification = mongoose.model('Verification', verificationSchema);

module.exports = Verification;

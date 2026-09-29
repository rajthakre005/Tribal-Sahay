const mongoose = require('mongoose');
const { DOCUMENT_TYPES, VERIFICATION_SOURCES } = require('../config/constants');

const documentSchema = new mongoose.Schema(
  {
    // Reference to User
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Document Information
    documentType: {
      type: String,
      enum: Object.values(DOCUMENT_TYPES),
      required: [true, 'Document type is required'],
    },
    documentName: {
      type: String,
      required: [true, 'Document name is required'],
    },
    documentNumber: String,
    issuingAuthority: String,
    issueDate: Date,
    expiryDate: Date,

    // File Information
    fileName: {
      type: String,
      required: [true, 'File name is required'],
    },
    filePath: {
      type: String,
      required: [true, 'File path is required'],
    },
    fileSize: Number,
    mimeType: String,
    fileHash: String,

    // Source (Uploaded or DigiLocker)
    source: {
      type: String,
      enum: ['uploaded', 'digilocker'],
      default: 'uploaded',
    },
    digilockerUri: String,

    // Verification Status
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationSource: {
      type: String,
      enum: Object.values(VERIFICATION_SOURCES),
    },
    verificationDate: Date,
    verificationRemarks: String,

    // Usage Tracking
    usedInApplications: [
      {
        applicationId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Application',
        },
        usedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Metadata
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    lastAccessedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
documentSchema.index({ owner: 1, documentType: 1 });
documentSchema.index({ owner: 1, isVerified: 1 });
documentSchema.index({ fileHash: 1 });

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;

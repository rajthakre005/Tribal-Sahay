const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const Document = require('../models/Document');
const { DOCUMENT_TYPES } = require('../config/constants');
const logger = require('../utils/logger');

// @route   GET /api/documents
// @desc    Get all documents for current user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { type, verified } = req.query;

    const query = { owner: req.user._id };

    if (type) query.documentType = type;
    if (verified !== undefined) query.isVerified = verified === 'true';

    const documents = await Document.find(query).sort('-uploadedAt');

    res.status(200).json({
      success: true,
      count: documents.length,
      documents,
    });
  } catch (error) {
    logger.error('Get documents error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching documents',
    });
  }
});

// @route   POST /api/documents/upload
// @desc    Upload a new document
// @access  Private
router.post('/upload', protect, upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const { documentType, documentNumber, issuingAuthority, issueDate, expiryDate } = req.body;

    // Validate document type
    if (!DOCUMENT_TYPES[documentType?.toUpperCase()]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid document type',
      });
    }

    // Create document record
    const document = await Document.create({
      owner: req.user._id,
      documentType,
      documentName: req.file.originalname,
      documentNumber,
      issuingAuthority,
      issueDate: issueDate ? new Date(issueDate) : undefined,
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
      fileName: req.file.filename,
      filePath: req.file.path,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      source: 'uploaded',
    });

    logger.info(`Document uploaded: ${document._id} by user ${req.user._id}`);

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      document,
    });
  } catch (error) {
    logger.error('Upload document error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while uploading document',
    });
  }
});

// @route   GET /api/documents/:id
// @desc    Get specific document details
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }

    // Check if user owns this document
    if (document.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this document',
      });
    }

    res.status(200).json({
      success: true,
      document,
    });
  } catch (error) {
    logger.error('Get document error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching document',
    });
  }
});

// @route   DELETE /api/documents/:id
// @desc    Delete a document
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }

    // Check if user owns this document
    if (document.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this document',
      });
    }

    // Check if document is used in any active application
    if (document.usedInApplications.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete document used in active applications',
      });
    }

    await document.deleteOne();

    logger.info(`Document deleted: ${document._id} by user ${req.user._id}`);

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully',
    });
  } catch (error) {
    logger.error('Delete document error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting document',
    });
  }
});

// @route   POST /api/digilocker/connect
// @desc    Connect DigiLocker account
// @access  Private
router.post('/digilocker/connect', protect, async (req, res) => {
  try {
    const { digilockerId } = req.body;

    // TODO: Implement DigiLocker OAuth flow
    // This is a placeholder for the actual DigiLocker integration

    const User = require('../models/User');
    await User.findByIdAndUpdate(req.user._id, {
      digilockerLinked: true,
      digilockerId,
    });

    logger.info(`DigiLocker connected for user ${req.user._id}`);

    res.status(200).json({
      success: true,
      message: 'DigiLocker connected successfully',
    });
  } catch (error) {
    logger.error('DigiLocker connect error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while connecting DigiLocker',
    });
  }
});

// @route   GET /api/documents/digilocker/fetch
// @desc    Fetch documents from DigiLocker
// @access  Private
router.get('/digilocker/fetch', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.digilockerLinked) {
      return res.status(400).json({
        success: false,
        message: 'DigiLocker not connected',
      });
    }

    // TODO: Implement actual DigiLocker API call to fetch documents
    // This is a placeholder for the actual integration

    const documents = []; // Would be fetched from DigiLocker API

    res.status(200).json({
      success: true,
      count: documents.length,
      documents,
    });
  } catch (error) {
    logger.error('Fetch DigiLocker documents error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching DigiLocker documents',
    });
  }
});

module.exports = router;

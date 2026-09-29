const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { SCHOLARSHIP_SCHEMES } = require('../config/constants');

// @route   GET /api/scholarships
// @desc    Get all scholarship schemes
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const schemes = Object.values(SCHOLARSHIP_SCHEMES).map((scheme) => ({
      id: scheme.id,
      name: scheme.name,
      description: scheme.description,
      eligibility: scheme.eligibility,
    }));

    res.status(200).json({
      success: true,
      count: schemes.length,
      schemes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @route   GET /api/scholarships/:id
// @desc    Get specific scholarship details
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const scheme = SCHOLARSHIP_SCHEMES[req.params.id.toUpperCase()];

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: 'Scholarship scheme not found',
      });
    }

    res.status(200).json({
      success: true,
      scheme: {
        id: scheme.id,
        name: scheme.name,
        description: scheme.description,
        eligibility: scheme.eligibility,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

module.exports = router;

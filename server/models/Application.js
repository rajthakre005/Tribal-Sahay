const mongoose = require('mongoose');
const { APPLICATION_STATUS, SCHOLARSHIP_SCHEMES } = require('../config/constants');

const applicationSchema = new mongoose.Schema(
  {
    // Reference to User
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Scholarship Scheme
    scheme: {
      type: String,
      enum: Object.keys(SCHOLARSHIP_SCHEMES),
      required: [true, 'Scholarship scheme is required'],
    },
    academicYear: {
      type: String,
      required: [true, 'Academic year is required'],
    },

    // Application Status
    status: {
      type: String,
      enum: Object.values(APPLICATION_STATUS),
      default: APPLICATION_STATUS.DRAFT,
    },
    submittedAt: Date,
    reviewedAt: Date,
    approvedAt: Date,
    sanctionedAt: Date,
    disbursedAt: Date,

    // Application Number
    applicationNumber: {
      type: String,
      unique: true,
      sparse: true,
    },

    // Academic Details
    academicDetails: {
      institutionName: String,
      institutionType: String,
      institutionAddress: String,
      institutionState: String,
      udiseCode: String,
      aisheCode: String,
      courseName: String,
      courseLevel: String,
      courseDuration: Number,
      currentYear: Number,
      totalFees: Number,
      admissionDate: Date,
    },

    // Previous Academic Record
    previousAcademicRecord: {
      examination: String,
      board: String,
      year: Number,
      percentage: Number,
      rollNumber: String,
    },

    // Family Income Details
    incomeDetails: {
      annualIncome: Number,
      incomeSource: String,
      incomeCertificateNumber: String,
      incomeCertificateIssuingAuthority: String,
      incomeCertificateIssueDate: Date,
    },

    // Documents Submitted
    documents: [
      {
        type: String,
        documentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Document',
        },
        name: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
        verified: {
          type: Boolean,
          default: false,
        },
      },
    ],

    // Verification Status
    verificationStatus: {
      identity: {
        status: { type: String, default: 'pending' },
        source: String,
        verifiedAt: Date,
        remarks: String,
      },
      stStatus: {
        status: { type: String, default: 'pending' },
        source: String,
        verifiedAt: Date,
        remarks: String,
      },
      income: {
        status: { type: String, default: 'pending' },
        source: String,
        verifiedAt: Date,
        remarks: String,
      },
      academic: {
        status: { type: String, default: 'pending' },
        source: String,
        verifiedAt: Date,
        remarks: String,
      },
      institution: {
        status: { type: String, default: 'pending' },
        source: String,
        verifiedAt: Date,
        remarks: String,
      },
    },

    // Sanction Details
    sanctionDetails: {
      sanctionedAmount: Number,
      sanctionLetterNumber: String,
      sanctionDate: Date,
      sanctioningAuthority: String,
      installments: [
        {
          installmentNumber: Number,
          amount: Number,
          dueDate: Date,
          status: String,
        },
      ],
    },

    // Payment/Disbursement Details
    paymentDetails: {
      totalAmount: Number,
      disbursedAmount: { type: Number, default: 0 },
      pendingAmount: Number,
      dbtReference: String,
      dbtStatus: String,
      disbursements: [
        {
          amount: Number,
          date: Date,
          referenceNumber: String,
          status: String,
          remarks: String,
        },
      ],
    },

    // Deficiencies/Rejections
    deficiencies: [
      {
        field: String,
        description: String,
        requiredAction: String,
        dueDate: Date,
        resolved: {
          type: Boolean,
          default: false,
        },
      },
    ],

    // Rejection Reason (if rejected)
    rejectionReason: {
      reason: String,
      category: String,
      remarks: String,
    },

    // Remarks/Comments
    remarks: [
      {
        addedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        comment: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Source System (NSP, SFMP, NOS)
    sourceSystem: {
      type: String,
      enum: ['nsp', 'sfmp', 'nos', 'unified'],
      default: 'unified',
    },
    sourceApplicationId: String,

    // Audit Trail
    auditTrail: [
      {
        action: String,
        performedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        details: mongoose.Schema.Types.Mixed,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Generate application number before saving
applicationSchema.pre('save', async function (next) {
  if (this.isNew && !this.applicationNumber) {
    const year = new Date().getFullYear();
    const count = await this.constructor.countDocuments({
      scheme: this.scheme,
      academicYear: this.academicYear,
    });
    this.applicationNumber = `${this.scheme.toUpperCase()}-${year}-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Index for faster queries
applicationSchema.index({ applicant: 1 });
applicationSchema.index({ scheme: 1, academicYear: 1 });
applicationSchema.index({ status: 1 });
applicationSchema.index({ applicationNumber: 1 });
applicationSchema.index({ 'verificationStatus.identity.status': 1 });

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;

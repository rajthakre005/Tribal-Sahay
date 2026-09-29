const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { USER_ROLES } = require('../config/constants');

const userSchema = new mongoose.Schema(
  {
    // Personal Information
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required'],
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: [true, 'Gender is required'],
    },
    
    // Contact Information
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^[6-9]\d{9}$/, 'Please provide a valid 10-digit phone number'],
    },
    address: {
      street: String,
      city: String,
      district: String,
      state: {
        type: String,
        required: [true, 'State is required'],
      },
      pincode: {
        type: String,
        required: [true, 'Pincode is required'],
        match: [/^\d{6}$/, 'Please provide a valid 6-digit pincode'],
      },
    },

    // ST/PVTG Information
    isST: {
      type: Boolean,
      default: false,
    },
    isPVTG: {
      type: Boolean,
      default: false,
    },
    tribeName: {
      type: String,
    },
    stCertificateNumber: {
      type: String,
    },
    stCertificateIssuingAuthority: {
      type: String,
    },
    stCertificateIssueDate: {
      type: Date,
    },

    // Academic Information
    educationLevel: {
      type: String,
      enum: ['secondary', 'higher_secondary', 'undergraduate', 'postgraduate', 'phd'],
    },
    currentInstitution: {
      name: String,
      type: String,
      address: String,
      state: String,
      udiseCode: String,
      aisheCode: String,
    },
    currentCourse: {
      name: String,
      level: String,
      year: Number,
      duration: Number,
    },
    
    // APAAR ID
    apaarId: {
      type: String,
      unique: true,
      sparse: true,
    },

    // Bank Details
    bankDetails: {
      accountNumber: String,
      ifscCode: String,
      bankName: String,
      branchName: String,
      accountHolderName: String,
    },

    // Family Information
    fatherName: String,
    motherName: String,
    annualFamilyIncome: {
      type: Number,
      default: 0,
    },
    familyMembers: Number,

    // Authentication
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.STUDENT,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      code: String,
      expiry: Date,
    },

    // DigiLocker Integration
    digilockerLinked: {
      type: Boolean,
      default: false,
    },
    digilockerId: String,

    // Profile
    profilePhoto: String,

    // Active Applications
    activeScholarships: [
      {
        scheme: String,
        applicationId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Application',
        },
        academicYear: String,
      },
    ],

    // Metadata
    lastLogin: Date,
    loginCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to get full name
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ isST: 1, state: 1 });
userSchema.index({ 'currentInstitution.udiseCode': 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;

// Scholarship Schemes
const SCHOLARSHIP_SCHEMES = {
  PRE_MATRIC: {
    id: 'pre_matric',
    name: 'Pre-Matric Scholarship',
    description: 'For ST students studying in classes IX and X',
    eligibility: 'ST students with family income up to ₹2.5 lakhs per annum',
  },
  POST_MATRIC: {
    id: 'post_matric',
    name: 'Post-Matric Scholarship',
    description: 'For ST students at post-matriculation level',
    eligibility: 'ST students with family income up to ₹2.5 lakhs per annum',
  },
  TOP_CLASS: {
    id: 'top_class',
    name: 'Top Class Education',
    description: 'For ST students pursuing professional/technical courses',
    eligibility: 'ST students with family income up to ₹6.0 lakhs per annum',
  },
  NFST: {
    id: 'nfst',
    name: 'National Fellowship for ST',
    description: 'For ST candidates pursuing M.Phil/Ph.D',
    eligibility: 'ST students with NET/JRF qualification',
  },
  NOS: {
    id: 'nos',
    name: 'National Overseas Scholarship',
    description: 'For ST students pursuing higher studies abroad',
    eligibility: 'ST students with family income up to ₹15.0 lakhs per annum',
  },
};

// Application Status
const APPLICATION_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under_review',
  VERIFICATION_PENDING: 'verification_pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
  APPROVED: 'approved',
  SANCTIONED: 'sanctioned',
  DISBURSED: 'disbursed',
  DISBURSMENT_PENDING: 'disbursement_pending',
};

// Verification Status
const VERIFICATION_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  VERIFIED: 'verified',
  FAILED: 'failed',
  MANUAL_REVIEW: 'manual_review',
};

// Document Types
const DOCUMENT_TYPES = {
  AADHAAR_CARD: 'aadhaar_card',
  ST_CERTIFICATE: 'st_certificate',
  PVTG_CERTIFICATE: 'pvtg_certificate',
  INCOME_CERTIFICATE: 'income_certificate',
  DOMICILE_CERTIFICATE: 'domicile_certificate',
  MARKSHEET_10TH: 'marksheet_10th',
  MARKSHEET_12TH: 'marksheet_12th',
  GRADUATION_CERTIFICATE: 'graduation_certificate',
  POST_GRADUATION_CERTIFICATE: 'post_graduation_certificate',
  NET_JRF_CERTIFICATE: 'net_jrf_certificate',
  ADMISSION_LETTER: 'admission_letter',
  FEE_RECEIPT: 'fee_receipt',
  BANK_PASSBOOK: 'bank_passbook',
  DISABILITY_CERTIFICATE: 'disability_certificate',
  PASSPORT: 'passport',
  VISA: 'visa',
  OFFER_LETTER: 'offer_letter',
};

// Verification Sources
const VERIFICATION_SOURCES = {
  DIGILOCKER: 'digilocker',
  UIDAI: 'uidai',
  UDISE: 'udise',
  APAAR: 'apaar',
  AISHE: 'aishe',
  EDISTRICT: 'edistrict',
  UGC_NTA: 'ugc_nta',
  NSP: 'nsp',
  SFMP: 'sfmp',
  MANUAL: 'manual',
};

// User Roles
const USER_ROLES = {
  STUDENT: 'student',
  VERIFIER: 'verifier',
  ADMIN: 'admin',
  MINISTRY_OFFICER: 'ministry_officer',
};

// Notification Types
const NOTIFICATION_TYPES = {
  APPLICATION_SUBMITTED: 'application_submitted',
  APPLICATION_STATUS_UPDATE: 'application_status_update',
  VERIFICATION_REQUIRED: 'verification_required',
  DOCUMENT_REQUIRED: 'document_required',
  PAYMENT_DISBURSED: 'payment_disbursed',
  DEADLINE_REMINDER: 'deadline_reminder',
  SCHEME_UPDATE: 'scheme_update',
};

module.exports = {
  SCHOLARSHIP_SCHEMES,
  APPLICATION_STATUS,
  VERIFICATION_STATUS,
  DOCUMENT_TYPES,
  VERIFICATION_SOURCES,
  USER_ROLES,
  NOTIFICATION_TYPES,
};

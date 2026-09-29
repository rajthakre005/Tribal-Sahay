const Verification = require('../models/Verification');
const Application = require('../models/Application');
const User = require('../models/User');
const { VERIFICATION_STATUS } = require('../config/constants');
const logger = require('../utils/logger');

// Import integrations
const digilocker = require('../integrations/digilocker');
const uidai = require('../integrations/uidai');
const udise = require('../integrations/udise');
const apaar = require('../integrations/apaar');
const aishe = require('../integrations/aishe');
const edistrict = require('../integrations/edistrict');
const ugcnta = require('../integrations/ugcnta');

class VerificationService {
  /**
   * Initiate verification process
   */
  async initiateVerification(applicationId, verificationType) {
    try {
      const application = await Application.findById(applicationId).populate('applicant');
      if (!application) {
        throw new Error('Application not found');
      }

      // Create verification record
      const verification = await Verification.create({
        application: applicationId,
        user: application.applicant._id,
        verificationType,
        status: VERIFICATION_STATUS.IN_PROGRESS,
        initiatedAt: Date.now(),
      });

      // Execute verification based on type
      await this.executeVerification(verification, application);

      return verification;
    } catch (error) {
      logger.error('Initiate verification error:', error);
      throw error;
    }
  }

  /**
   * Execute verification based on type
   */
  async executeVerification(verification, application) {
    try {
      const user = application.applicant;
      let result;

      switch (verification.verificationType) {
        case 'identity':
          result = await this.verifyIdentity(user);
          verification.source = 'uidai';
          break;

        case 'st_status':
          result = await this.verifySTStatus(user);
          verification.source = 'edistrict';
          break;

        case 'income':
          result = await this.verifyIncome(application);
          verification.source = 'edistrict';
          break;

        case 'academic':
          result = await this.verifyAcademic(user, application);
          verification.source = 'apaar';
          break;

        case 'institution':
          result = await this.verifyInstitution(application);
          verification.source = 'aishe';
          break;

        case 'net_jrf':
          result = await this.verifyNETJRF(application);
          verification.source = 'ugc_nta';
          break;

        default:
          throw new Error('Unknown verification type');
      }

      // Update verification record
      verification.apiResponse = {
        data: result,
        timestamp: Date.now(),
        success: result.success,
      };

      if (result.success && result.verified) {
        verification.status = VERIFICATION_STATUS.VERIFIED;
        verification.verificationResult = {
          matched: true,
          confidence: result.confidence || 1,
          discrepancies: [],
        };
        verification.completedAt = Date.now();
      } else if (result.success && !result.verified) {
        verification.status = VERIFICATION_STATUS.MANUAL_REVIEW;
        verification.requiresManualReview = true;
        verification.verificationResult = {
          matched: false,
          confidence: result.confidence || 0,
          discrepancies: result.discrepancies || [],
        };
      } else {
        verification.status = VERIFICATION_STATUS.FAILED;
        verification.error = {
          message: result.message || 'Verification failed',
        };
      }

      await verification.save();

      // Update application verification status
      await this.updateApplicationVerificationStatus(application, verification);

      return verification;
    } catch (error) {
      logger.error('Execute verification error:', error);
      verification.status = VERIFICATION_STATUS.FAILED;
      verification.error = {
        message: error.message,
      };
      await verification.save();
      throw error;
    }
  }

  /**
   * Verify identity using UIDAI
   */
  async verifyIdentity(user) {
    try {
      // TODO: Get Aadhaar number from user profile
      const aadhaarNumber = user.aadhaarNumber;

      if (!aadhaarNumber) {
        return {
          success: false,
          verified: false,
          message: 'Aadhaar number not found',
        };
      }

      const result = await uidai.verifyAadhaar(aadhaarNumber);

      // Compare with user data
      const discrepancies = [];
      if (result.data.name !== user.fullName) {
        discrepancies.push({
          field: 'name',
          expected: user.fullName,
          actual: result.data.name,
        });
      }

      return {
        success: true,
        verified: discrepancies.length === 0,
        confidence: discrepancies.length === 0 ? 1 : 0.5,
        discrepancies,
        data: result.data,
      };
    } catch (error) {
      logger.error('Verify identity error:', error);
      return {
        success: false,
        verified: false,
        message: error.message,
      };
    }
  }

  /**
   * Verify ST status using e-District
   */
  async verifySTStatus(user) {
    try {
      if (!user.stCertificateNumber) {
        return {
          success: false,
          verified: false,
          message: 'ST certificate number not found',
        };
      }

      const result = await edistrict.verifySTCertificate(
        user.stCertificateNumber,
        user.address.state
      );

      return {
        success: true,
        verified: result.verified,
        confidence: result.verified ? 1 : 0,
        data: result.data,
      };
    } catch (error) {
      logger.error('Verify ST status error:', error);
      return {
        success: false,
        verified: false,
        message: error.message,
      };
    }
  }

  /**
   * Verify income using e-District
   */
  async verifyIncome(application) {
    try {
      const incomeDetails = application.incomeDetails;

      if (!incomeDetails || !incomeDetails.incomeCertificateNumber) {
        return {
          success: false,
          verified: false,
          message: 'Income certificate number not found',
        };
      }

      const result = await edistrict.verifyIncomeCertificate(
        incomeDetails.incomeCertificateNumber,
        application.applicant.address.state
      );

      // Compare income
      const discrepancies = [];
      if (result.data.annualIncome !== incomeDetails.annualIncome) {
        discrepancies.push({
          field: 'annualIncome',
          expected: incomeDetails.annualIncome,
          actual: result.data.annualIncome,
        });
      }

      return {
        success: true,
        verified: discrepancies.length === 0,
        confidence: discrepancies.length === 0 ? 1 : 0.5,
        discrepancies,
        data: result.data,
      };
    } catch (error) {
      logger.error('Verify income error:', error);
      return {
        success: false,
        verified: false,
        message: error.message,
      };
    }
  }

  /**
   * Verify academic records using APAAR
   */
  async verifyAcademic(user, application) {
    try {
      const previousRecord = application.previousAcademicRecord;

      if (!previousRecord) {
        return {
          success: false,
          verified: false,
          message: 'Previous academic record not found',
        };
      }

      const result = await apaar.verifyAcademicRecord(
        previousRecord.board,
        previousRecord.year,
        previousRecord.rollNumber
      );

      // Compare with application data
      const discrepancies = [];
      if (result.data.percentage !== previousRecord.percentage) {
        discrepancies.push({
          field: 'percentage',
          expected: previousRecord.percentage,
          actual: result.data.percentage,
        });
      }

      return {
        success: true,
        verified: discrepancies.length === 0,
        confidence: discrepancies.length === 0 ? 1 : 0.5,
        discrepancies,
        data: result.data,
      };
    } catch (error) {
      logger.error('Verify academic error:', error);
      return {
        success: false,
        verified: false,
        message: error.message,
      };
    }
  }

  /**
   * Verify institution using AISHE/UDISE
   */
  async verifyInstitution(application) {
    try {
      const academicDetails = application.academicDetails;

      if (!academicDetails) {
        return {
          success: false,
          verified: false,
          message: 'Academic details not found',
        };
      }

      let result;
      if (academicDetails.aisheCode) {
        result = await aishe.verifyInstitution(academicDetails.aisheCode);
      } else if (academicDetails.udiseCode) {
        result = await udise.verifyInstitution(academicDetails.udiseCode);
      } else {
        return {
          success: false,
          verified: false,
          message: 'Institution code not found',
        };
      }

      // Compare institution name
      const discrepancies = [];
      if (result.data.name !== academicDetails.institutionName) {
        discrepancies.push({
          field: 'institutionName',
          expected: academicDetails.institutionName,
          actual: result.data.name,
        });
      }

      return {
        success: true,
        verified: discrepancies.length === 0,
        confidence: discrepancies.length === 0 ? 1 : 0.5,
        discrepancies,
        data: result.data,
      };
    } catch (error) {
      logger.error('Verify institution error:', error);
      return {
        success: false,
        verified: false,
        message: error.message,
      };
    }
  }

  /**
   * Verify NET/JRF qualification using UGC-NTA
   */
  async verifyNETJRF(application) {
    try {
      // TODO: Get NET/JRF details from application documents
      const rollNumber = application.netJrfRollNumber;
      const year = application.netJrfYear;
      const subject = application.netJrfSubject;

      if (!rollNumber || !year) {
        return {
          success: false,
          verified: false,
          message: 'NET/JRF details not found',
        };
      }

      const result = await ugcnta.verifyNETJRF(rollNumber, year, subject);

      return {
        success: true,
        verified: result.verified,
        confidence: result.verified ? 1 : 0,
        data: result.data,
      };
    } catch (error) {
      logger.error('Verify NET/JRF error:', error);
      return {
        success: false,
        verified: false,
        message: error.message,
      };
    }
  }

  /**
   * Update application verification status
   */
  async updateApplicationVerificationStatus(application, verification) {
    const verificationTypeMap = {
      identity: 'identity',
      st_status: 'stStatus',
      income: 'income',
      academic: 'academic',
      institution: 'institution',
    };

    const field = verificationTypeMap[verification.verificationType];
    if (field) {
      application.verificationStatus[field].status = verification.status;
      application.verificationStatus[field].source = verification.source;
      application.verificationStatus[field].verifiedAt = verification.completedAt;
      if (verification.verificationResult?.discrepancies?.length > 0) {
        application.verificationStatus[field].remarks =
          'Discrepancies found: ' + verification.verificationResult.discrepancies.map(d => d.field).join(', ');
      }
      await application.save();
    }
  }

  /**
   * Retry failed verification
   */
  async retryVerification(verificationId) {
    try {
      const verification = await Verification.findById(verificationId);
      if (!verification) {
        throw new Error('Verification not found');
      }

      if (verification.retryCount >= verification.maxRetries) {
        throw new Error('Maximum retry attempts exceeded');
      }

      verification.retryCount += 1;
      verification.nextRetryAt = Date.now();
      verification.status = VERIFICATION_STATUS.IN_PROGRESS;

      await verification.save();

      const application = await Application.findById(verification.application).populate('applicant');
      await this.executeVerification(verification, application);

      return verification;
    } catch (error) {
      logger.error('Retry verification error:', error);
      throw error;
    }
  }
}

module.exports = new VerificationService();

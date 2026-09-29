const axios = require('axios');
const logger = require('../utils/logger');

class DigiLockerIntegration {
  constructor() {
    this.clientId = process.env.DIGILOCKER_CLIENT_ID;
    this.clientSecret = process.env.DIGILOCKER_CLIENT_SECRET;
    this.redirectUri = process.env.DIGILOCKER_REDIRECT_URI;
    this.baseUrl = 'https://digilocker.gov.in';
  }

  /**
   * Get authorization URL for DigiLocker OAuth
   */
  getAuthUrl(state) {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      state: state,
      scope: 'read',
    });

    return `${this.baseUrl}/oauth/authorize?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async getAccessToken(code) {
    try {
      const response = await axios.post(`${this.baseUrl}/oauth/token`, {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: this.redirectUri,
      });

      return response.data;
    } catch (error) {
      logger.error('DigiLocker getAccessToken error:', error);
      throw new Error('Failed to get access token from DigiLocker');
    }
  }

  /**
   * Get user profile from DigiLocker
   */
  async getUserProfile(accessToken) {
    try {
      const response = await axios.get(`${this.baseUrl}/user/profile`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data;
    } catch (error) {
      logger.error('DigiLocker getUserProfile error:', error);
      throw new Error('Failed to get user profile from DigiLocker');
    }
  }

  /**
   * Get list of documents from DigiLocker
   */
  async getDocuments(accessToken) {
    try {
      const response = await axios.get(`${this.baseUrl}/user/documents`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data;
    } catch (error) {
      logger.error('DigiLocker getDocuments error:', error);
      throw new Error('Failed to get documents from DigiLocker');
    }
  }

  /**
   * Get specific document from DigiLocker
   */
  async getDocument(accessToken, docId) {
    try {
      const response = await axios.get(`${this.baseUrl}/user/documents/${docId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data;
    } catch (error) {
      logger.error('DigiLocker getDocument error:', error);
      throw new Error('Failed to get document from DigiLocker');
    }
  }

  /**
   * Pull document from issuer
   */
  async pullDocument(accessToken, docType, docId) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/user/documents/pull`,
        {
          doc_type: docType,
          doc_id: docId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      logger.error('DigiLocker pullDocument error:', error);
      throw new Error('Failed to pull document from issuer');
    }
  }

  /**
   * Verify document with issuer
   */
  async verifyDocument(accessToken, docUri) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/user/documents/verify`,
        {
          doc_uri: docUri,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      logger.error('DigiLocker verifyDocument error:', error);
      throw new Error('Failed to verify document with issuer');
    }
  }
}

module.exports = new DigiLockerIntegration();

const Notification = require('../models/Notification');
const User = require('../models/User');
const logger = require('../utils/logger');

class NotificationService {
  /**
   * Create notification
   */
  async createNotification(recipientId, type, title, message, options = {}) {
    try {
      const notification = await Notification.create({
        recipient: recipientId,
        type,
        title,
        message,
        application: options.applicationId,
        isActionable: options.isActionable || false,
        actionUrl: options.actionUrl,
        actionLabel: options.actionLabel,
        priority: options.priority || 'medium',
        expiresAt: options.expiresAt,
        metadata: options.metadata,
      });

      // Send notifications through different channels
      await this.sendNotification(notification);

      return notification;
    } catch (error) {
      logger.error('Create notification error:', error);
      throw error;
    }
  }

  /**
   * Send notification through configured channels
   */
  async sendNotification(notification) {
    try {
      const user = await User.findById(notification.recipient);

      // Send push notification
      await this.sendPushNotification(notification, user);

      // Send SMS for high priority notifications
      if (notification.priority === 'high' || notification.priority === 'urgent') {
        await this.sendSMS(notification, user);
      }

      // Send email
      await this.sendEmail(notification, user);

      // Update notification delivery status
      await notification.save();
    } catch (error) {
      logger.error('Send notification error:', error);
    }
  }

  /**
   * Send push notification
   */
  async sendPushNotification(notification, user) {
    try {
      // TODO: Implement push notification service (Firebase Cloud Messaging)
      logger.info(`Push notification sent to user ${user._id}: ${notification.title}`);

      notification.channels.push.sent = true;
      notification.channels.push.sentAt = Date.now();
    } catch (error) {
      logger.error('Send push notification error:', error);
    }
  }

  /**
   * Send SMS notification
   */
  async sendSMS(notification, user) {
    try {
      // TODO: Implement SMS service integration
      logger.info(`SMS sent to ${user.phone}: ${notification.title}`);

      notification.channels.sms.sent = true;
      notification.channels.sms.sentAt = Date.now();
    } catch (error) {
      logger.error('Send SMS error:', error);
    }
  }

  /**
   * Send email notification
   */
  async sendEmail(notification, user) {
    try {
      // TODO: Implement email service (Nodemailer)
      logger.info(`Email sent to ${user.email}: ${notification.title}`);

      notification.channels.email.sent = true;
      notification.channels.email.sentAt = Date.now();
    } catch (error) {
      logger.error('Send email error:', error);
    }
  }

  /**
   * Get notifications for user
   */
  async getUserNotifications(userId, options = {}) {
    try {
      const { unreadOnly, limit = 20, skip = 0 } = options;

      const query = { recipient: userId };
      if (unreadOnly) {
        query['channels.push.read'] = false;
      }

      const notifications = await Notification.find(query)
        .sort('-createdAt')
        .limit(limit)
        .skip(skip);

      return notifications;
    } catch (error) {
      logger.error('Get user notifications error:', error);
      throw error;
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId, userId) {
    try {
      const notification = await Notification.findOne({
        _id: notificationId,
        recipient: userId,
      });

      if (!notification) {
        throw new Error('Notification not found');
      }

      notification.channels.push.read = true;
      notification.channels.push.readAt = Date.now();

      await notification.save();

      return notification;
    } catch (error) {
      logger.error('Mark notification as read error:', error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read for user
   */
  async markAllAsRead(userId) {
    try {
      await Notification.updateMany(
        { recipient: userId, 'channels.push.read': false },
        {
          'channels.push.read': true,
          'channels.push.readAt': Date.now(),
        }
      );

      return { success: true };
    } catch (error) {
      logger.error('Mark all notifications as read error:', error);
      throw error;
    }
  }

  /**
   * Send application status notification
   */
  async sendApplicationStatusNotification(applicationId, status, userId) {
    const statusMessages = {
      submitted: {
        title: 'Application Submitted Successfully',
        message: 'Your scholarship application has been submitted successfully. It is now under review.',
      },
      under_review: {
        title: 'Application Under Review',
        message: 'Your application is currently being reviewed by the authorities.',
      },
      verified: {
        title: 'Application Verified',
        message: 'Your application has been verified successfully.',
      },
      approved: {
        title: 'Application Approved',
        message: 'Congratulations! Your scholarship application has been approved.',
      },
      sanctioned: {
        title: 'Scholarship Sanctioned',
        message: 'Your scholarship has been sanctioned. Disbursement will be processed soon.',
      },
      disbursed: {
        title: 'Scholarship Disbursed',
        message: 'Your scholarship amount has been disbursed to your bank account.',
      },
      rejected: {
        title: 'Application Rejected',
        message: 'Your application has been rejected. Please check the remarks for more details.',
        priority: 'high',
      },
    };

    const messageConfig = statusMessages[status] || statusMessages.submitted;

    return await this.createNotification(
      userId,
      'application_status_update',
      messageConfig.title,
      messageConfig.message,
      {
        applicationId,
        isActionable: true,
        actionUrl: `/applications/${applicationId}`,
        actionLabel: 'View Application',
        priority: messageConfig.priority || 'medium',
      }
    );
  }

  /**
   * Send document deficiency notification
   */
  async sendDeficiencyNotification(applicationId, deficiencies, userId) {
    const message = deficiencies
      .map((d) => `- ${d.description}: ${d.requiredAction}`)
      .join('\n');

    return await this.createNotification(
      userId,
      'document_required',
      'Documents Required',
      `Your application requires additional documents:\n${message}`,
      {
        applicationId,
        isActionable: true,
        actionUrl: `/applications/${applicationId}`,
        actionLabel: 'Upload Documents',
        priority: 'high',
      }
    );
  }

  /**
   * Send payment notification
   */
  async sendPaymentNotification(applicationId, amount, userId) {
    return await this.createNotification(
      userId,
      'payment_disbursed',
      'Scholarship Disbursed',
      `An amount of ₹${amount} has been disbursed to your bank account.`,
      {
        applicationId,
        isActionable: true,
        actionUrl: `/payments`,
        actionLabel: 'View Details',
        priority: 'high',
      }
    );
  }
}

module.exports = new NotificationService();

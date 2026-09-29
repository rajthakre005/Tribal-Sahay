const mongoose = require('mongoose');
const { NOTIFICATION_TYPES } = require('../config/constants');

const notificationSchema = new mongoose.Schema(
  {
    // Reference to User
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Notification Type
    type: {
      type: String,
      enum: Object.values(NOTIFICATION_TYPES),
      required: [true, 'Notification type is required'],
    },

    // Notification Content
    title: {
      type: String,
      required: [true, 'Notification title is required'],
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
    },

    // Related Application (if any)
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
    },

    // Actionable
    isActionable: {
      type: Boolean,
      default: false,
    },
    actionUrl: String,
    actionLabel: String,

    // Delivery Status
    channels: {
      push: {
        sent: { type: Boolean, default: false },
        sentAt: Date,
        read: { type: Boolean, default: false },
        readAt: Date,
      },
      sms: {
        sent: { type: Boolean, default: false },
        sentAt: Date,
        delivered: { type: Boolean, default: false },
        deliveredAt: Date,
      },
      email: {
        sent: { type: Boolean, default: false },
        sentAt: Date,
        delivered: { type: Boolean, default: false },
        deliveredAt: Date,
      },
    },

    // Priority
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },

    // Expiry
    expiresAt: Date,

    // Metadata
    metadata: mongoose.Schema.Types.Mixed,
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, 'channels.push.read': 1 });
notificationSchema.index({ type: 1 });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;

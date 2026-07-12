const notificationRepository = require('../repositories/notificationRepository');
const Driver = require('../models/Driver');
const ApiError = require('../utils/apiError');

class NotificationService {
  /**
   * Create and record a system alert.
   */
  async createNotification(recipientId, type, title, message) {
    try {
      return await notificationRepository.create({
        recipient: recipientId,
        type,
        title,
        message
      });
    } catch (error) {
      console.error('[NOTIFICATION ERROR] Failed to record notification:', error.message);
    }
  }

  /**
   * Retrieve paginated notifications list for a user.
   */
  async getNotifications(recipientId, queryParams) {
    const { results, page, limit, totalPages, totalResults } = 
      await notificationRepository.findAll(recipientId, queryParams);
    
    return {
      notifications: results,
      pagination: {
        page,
        limit,
        totalPages,
        totalResults
      }
    };
  }

  /**
   * Mark notification as read.
   */
  async markAsRead(id, recipientId) {
    const notification = await notificationRepository.markAsRead(id, recipientId);
    if (!notification) {
      throw new ApiError('Notification not found or access denied', 404);
    }
    return notification;
  }

  /**
   * Delete a notification log.
   */
  async deleteNotification(id, recipientId) {
    const notification = await notificationRepository.delete(id, recipientId);
    if (!notification) {
      throw new ApiError('Notification not found or access denied', 404);
    }
    return true;
  }

  /**
   * Cron-ready function: Check driver licenses and log warnings/expiries.
   */
  async checkLicenseExpirations(systemUserId) {
    const today = new Date();
    const alertLimit = new Date();
    alertLimit.setDate(today.getDate() + 30); // Alert 30 days before

    const drivers = await Driver.find({ isDeleted: false });

    for (const driver of drivers) {
      const expiry = new Date(driver.licenseExpiryDate);
      
      if (expiry < today && driver.status !== 'License Expired') {
        // License Expired
        await this.createNotification(
          systemUserId || driver.createdBy,
          'License Expired',
          'Driving License Expired',
          `Driver ${driver.fullName}'s license (${driver.licenseNumber}) expired on ${expiry.toDateString()}.`
        );
      } else if (expiry >= today && expiry <= alertLimit) {
        // License Expiring soon
        const daysLeft = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
        await this.createNotification(
          systemUserId || driver.createdBy,
          'License Expiring',
          'Driving License Expiring Soon',
          `Driver ${driver.fullName}'s license (${driver.licenseNumber}) expires in ${daysLeft} days.`
        );
      }
    }
  }
}

module.exports = new NotificationService();

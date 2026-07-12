const Notification = require('../models/Notification');
const { applyQueryOptions } = require('../utils/queryHelper');

class NotificationRepository {
  /**
   * Create a new notification.
   */
  async create(data) {
    const notification = new Notification(data);
    return await notification.save();
  }

  /**
   * Fetch all notifications for a recipient (paginated, sorted, filtered).
   */
  async findAll(recipientId, queryParams) {
    const query = {
      ...queryParams,
      recipient: recipientId
    };
    const searchableFields = ['title', 'message', 'type'];
    return await applyQueryOptions(Notification, query, searchableFields);
  }

  /**
   * Mark a notification as read.
   */
  async markAsRead(id, recipientId) {
    return await Notification.findOneAndUpdate(
      { _id: id, recipient: recipientId },
      { isRead: true },
      { new: true }
    ).exec();
  }

  /**
   * Delete a notification.
   */
  async delete(id, recipientId) {
    return await Notification.findOneAndDelete({ _id: id, recipient: recipientId }).exec();
  }
}

module.exports = new NotificationRepository();

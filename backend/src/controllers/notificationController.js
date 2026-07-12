const notificationService = require('../services/notificationService');
const ApiResponse = require('../utils/apiResponse');

const getNotifications = async (req, res, next) => {
  try {
    const data = await notificationService.getNotifications(req.user.id, req.query);
    return ApiResponse.success(res, 'Notifications fetched successfully.', data);
  } catch (error) {
    next(error);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const notification = await notificationService.markAsRead(req.params.id, req.user.id);
    return ApiResponse.success(res, 'Notification marked as read successfully.', notification);
  } catch (error) {
    next(error);
  }
};

const deleteNotification = async (req, res, next) => {
  try {
    await notificationService.deleteNotification(req.params.id, req.user.id);
    return ApiResponse.success(res, 'Notification deleted successfully.');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  deleteNotification
};

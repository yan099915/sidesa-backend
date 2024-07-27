const { error } = require("winston");
const services = require("../services");

module.exports = {
  // get user notification
  getNotification: async (req, res) => {
    try {
      const { page, limit } = req.query;
      if (!req.userId) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized",
        });
      }

      const criteria = {
        name: "id_pengguna",
        value: req.userId,
      };

      // get user notification
      const notifications = await services.notification.getUserNotifications(criteria, page, limit);
      if (notifications.length === 0) {
        return res.status(204).json({
          error: false,
          message: "Notification not found",
        });
      }
      return res.status(200).json({
        error: false,
        message: "Notification successfully retrieved",
        data: notifications,
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: "Internal server error",
      });
    }
  },

  // update notification status
  updateNotificationStatus: async (req, res) => {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({
          error: true,
          message: "Id is required",
        });
      }

      const criteria = {
        name: "id",
        value: id,
      };

      // update notification status
      const updateStatus = await services.notification.updateNotification(criteria, { status: "read" });
      if (updateStatus === null) {
        return res.status(204).json({
          error: false,
          message: "Notification not found",
        });
      }

      return res.status(200).json({
        error: false,
        message: "Notification status updated",
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: "Internal server error",
      });
    }
  },
};

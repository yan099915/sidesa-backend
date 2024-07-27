const { Notification } = require("../models");
const { Op, where } = require("sequelize");
module.exports = {
  // create notification
  createNotification: async (data) => {
    try {
      // create notification
      const newNotification = await Notification.create(data);
      return newNotification;
    } catch (error) {
      throw error;
    }
  },

  // get all user notification
  getUserNotifications: async (criteria, page, pageSize) => {
    try {
      //  create endless scrolling for notification with pagination
      // if page and pageSize is empty set it into default value
      if (!page || !pageSize) {
        page = 1;
        pageSize = 10;
      }

      const offset = (page - 1) * pageSize;

      // get total count of notifications
      const totalNotifications = await Notification.count(
        {
          where: {
            [criteria.name]: {
              [Op.eq]: criteria.value,
            },
          },
        } // Use the dynamic where object
      );

      // get total count of unread notifications with criteria and status unread
      const unreadNotifications = await Notification.count({
        where: {
          [Op.and]: [{ [criteria.name]: criteria.value }, { status: "unread" }],
        },
      });

      // get all notification data with pagination
      const allNotifications = await Notification.findAll({
        where: {
          [criteria.name]: {
            [Op.eq]: criteria.value,
          },
        }, // Use the dynamic where object
        attributes: ["id", "status", "message", "url", "created_at"], // Ensure these attributes are included
        order: [["created_at", "DESC"]],
        limit: Number(pageSize),
        offset: Number(offset),
      });

      // calculate total pages
      const totalPages = Math.ceil(totalNotifications / pageSize);

      return {
        notifications: allNotifications,
        count: totalNotifications,
        unread: unreadNotifications,
        currentPage: Number(page),
        totalPages: totalPages,
      };
    } catch (error) {
      console.log(error, "error");
      throw error;
    }
  },

  // update notification by dynamic criteria
  updateNotification: async (criteria, data) => {
    try {
      // update notification with dynamic criteria
      const updateNotification = await Notification.update(data, {
        where: {
          [criteria.name]: {
            [Op.eq]: criteria.value,
          },
        },
      });
      return updateNotification;
    } catch (error) {
      throw error;
    }
  },
};

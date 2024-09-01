const { Op } = require("sequelize");
const { Announcement, AnnouncementStatus, AnnouncementType, sequelize } = require("../models");

module.exports = {
  createAnnouncement: async (data) => {
    try {
      const announcement = Announcement.create(data);
      return announcement;
    } catch (error) {
      throw new Error(error);
    }
  },

  getAnnouncements: async (page, limit) => {
    try {
      if (!page) {
        page = 1;
      }
      if (!limit) {
        limit = 10;
      }

      const offset = page * limit - limit;

      const getAnnouncement = await Announcement.findAndCountAll({
        attributes: ["id", "title", "author_id", "status", "type", "created_at", "updated_at"],
        include: [
          {
            model: AnnouncementStatus,
            as: "announcement_status",
          },
          {
            model: AnnouncementType,
            as: "announcement_type",
          },
        ],
        limit: parseInt(limit),
        offset: offset,
      });

      return {
        announcements: getAnnouncement.rows,
        totalItems: getAnnouncement.count,
        currentPage: Number(page),
        totalPages: Math.ceil(getAnnouncement.count / limit),
      };
    } catch (error) {
      throw new Error(error);
    }
  },

  getAnnouncementDetails: async (id) => {
    try {
      const getAnnouncement = await Announcement.findOne({
        where: {
          id: id,
        },
        include: [
          {
            model: AnnouncementStatus,
            as: "announcement_status",
            attributes: ["id", "name"],
          },
          {
            model: AnnouncementType,
            as: "announcement_type",
            attributes: ["id", "name"],
          },
        ],
      });

      return getAnnouncement;
    } catch (error) {
      throw new Error(error);
    }
  },

  getAnnouncementStatus: async () => {
    try {
      const getAnnouncementStatus = await AnnouncementStatus.findAll({
        attributes: ["id", "name"],
      });

      return getAnnouncementStatus;
    } catch (error) {
      throw new Error(error);
    }
  },

  getAnnouncementType: async () => {
    try {
      const getAnnouncementType = await AnnouncementType.findAll({
        attributes: ["id", "name"],
      });

      return getAnnouncementType;
    } catch (error) {
      throw new Error(error);
    }
  },

  updateAnnouncement: async (data) => {
    try {
      const updateAnnouncement = await Announcement.update(data, {
        where: {
          id: data.id,
        },
      });

      return updateAnnouncement;
    } catch (error) {
      throw new Error(error);
    }
  },

  deleteAnnouncement: async (id) => {
    try {
      const deleteAnnouncement = await Announcement.destroy({
        where: {
          id: id,
        },
      });

      return deleteAnnouncement;
    } catch (error) {
      throw new Error(error);
    }
  },

  getPublishedAnnouncements: async (page, limit) => {
    try {
      if (!page) {
        page = 1;
      }
      if (!limit) {
        limit = 10;
      }

      const offset = page * limit - limit;

      const getAnnouncement = await Announcement.findAndCountAll({
        where: {
          status: 2,
        },
        attributes: ["id", "title", "status", "type", "created_at", "updated_at"],
        include: [
          {
            model: AnnouncementStatus,
            as: "announcement_status",
          },
          {
            model: AnnouncementType,
            as: "announcement_type",
          },
        ],
        limit: parseInt(limit),
        offset: offset,
      });

      return {
        announcements: getAnnouncement.rows,
        totalItems: getAnnouncement.count,
        currentPage: Number(page),
        totalPages: Math.ceil(getAnnouncement.count / limit),
      };
    } catch (error) {
      throw new Error(error);
    }
  },

  getPublishedAnnouncementsDetails: async (id) => {
    try {
      const getAnnouncement = await Announcement.findOne({
        where: {
          id: id,
          status: 2,
        },
        include: [
          {
            model: AnnouncementStatus,
            as: "announcement_status",
            attributes: ["id", "name"],
          },
          {
            model: AnnouncementType,
            as: "announcement_type",
            attributes: ["id", "name"],
          },
        ],
      });

      return getAnnouncement;
    } catch (error) {
      throw new Error(error);
    }
  },
};

const services = require("../services");

module.exports = {
  createAnnouncement: async (req, res) => {
    //  create new announcement
    try {
      const userId = req.userId;

      const data = {
        author_id: userId,
        status: 1,
      };

      const createAnnouncement = await services.announcement.createAnnouncement(data);

      res.status(201).send({
        error: false,
        message: "Create announcement success",
        data: createAnnouncement,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: true, message: "Internal server error" });
    }
  },

  getAnnouncements: async (req, res) => {
    // get article
    try {
      const { page, limit } = req.query;

      const getArticle = await services.announcement.getAnnouncements(page, limit);

      res.status(200).send({
        error: false,
        message: "Find article data success",
        data: getArticle,
      });
    } catch (error) {
      console.log(error, "ini errorny");
      res.status(500).send({ error: true, message: "Internal server error" });
    }
  },

  getAnnouncementDetails: async (req, res) => {
    // get article details
    try {
      const { id } = req.params;

      const getArticle = await services.announcement.getAnnouncementDetails(id);

      res.status(200).send({
        error: false,
        message: "Find article data success",
        data: getArticle,
      });
    } catch (error) {
      console.log(error, "ini errorny");
      res.status(500).send({ error: true, message: "Internal server error" });
    }
  },

  getAnnouncementStatus: async (req, res) => {
    // get article details
    try {
      const getArticle = await services.announcement.getAnnouncementStatus();

      res.status(200).send({
        error: false,
        message: "Find article data success",
        data: getArticle,
      });
    } catch (error) {
      console.log(error, "ini errorny");
      res.status(500).send({ error: true, message: "Internal server error" });
    }
  },

  getAnnouncementType: async (req, res) => {
    // get article details
    try {
      const getArticle = await services.announcement.getAnnouncementType();

      res.status(200).send({
        error: false,
        message: "Find article data success",
        data: getArticle,
      });
    } catch (error) {
      console.log(error, "ini errorny");
      res.status(500).send({ error: true, message: "Internal server error" });
    }
  },

  updateAnnouncement: async (req, res) => {
    // update article details
    try {
      const { id, title, content, status, type, featured } = req.body;

      const data = { id, title, content, status, type, featured };

      const updateArticle = await services.announcement.updateAnnouncement(data);

      res.status(200).send({
        error: false,
        message: "Update article success",
        data: updateArticle,
      });
    } catch (error) {
      console.log(error, "ini errorny");
      res.status(500).send({ error: true, message: "Internal server error" });
    }
  },

  deleteAnnouncement: async (req, res) => {
    // delete article
    try {
      const { id } = req.params;

      const deleteArticle = await services.announcement.deleteAnnouncement(id);

      res.status(200).send({
        error: false,
        message: "Delete article success",
        data: deleteArticle,
      });
    } catch (error) {
      console.log(error, "ini errorny");
      res.status(500).send({ error: true, message: "Internal server error" });
    }
  },

  getPublishedAnnouncements: async (req, res) => {
    // get published article
    try {
      const { page, limit } = req.query;

      const getArticle = await services.announcement.getPublishedAnnouncements(page, limit);

      res.status(200).send({
        error: false,
        message: "Find announcements data success",
        data: getArticle,
      });
    } catch (error) {
      console.log(error, "ini errorny");
      res.status(500).send({ error: true, message: "Internal server error" });
    }
  },

  getPublishedAnnouncementsDetails: async (req, res) => {
    // get published article details
    try {
      const { id } = req.params;

      const getArticle = await services.announcement.getPublishedAnnouncementsDetails(id);

      res.status(200).send({
        error: false,
        message: "Find announcement data success",
        data: getArticle,
      });
    } catch (error) {
      console.log(error, "ini errorny");
      res.status(500).send({ error: true, message: "Internal server error" });
    }
  },
};

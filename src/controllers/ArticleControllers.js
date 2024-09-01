// import services
const services = require("../services");

module.exports = {
  createArticle: async (req, res) => {
    //  create new article
    try {
      const userId = req.userId;

      const data = {
        author_id: userId,
        status: 1,
      };

      const createArticle = await services.article.createArticle(data);

      res.status(201).send({
        error: false,
        message: "Create article success",
        data: createArticle,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: true, message: "Internal server error" });
    }
  },

  getArticleDetails: async (req, res) => {
    // get article details
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).send({ error: true, message: "Article ID is required" });
      }

      const getArticle = await services.article.getArticleDetails(id);

      res.status(200).send({
        error: false,
        message: "Find article data success",
        data: getArticle,
      });
    } catch (error) {
      res.status(500).send({ error: true, message: "Internal server error" });
    }
  },

  updateArticle: async (req, res) => {
    // update article details
    try {
      const { id, title, content, thumbnail, status, featured } = req.body;

      if (!id) {
        return res.status(400).send({ error: true, message: "Article ID is required" });
      }

      const data = { id, title, content, thumbnail, status, featured };

      const updateArticle = services.article.updateArticle(data);

      res.status(200).send({
        error: false,
        message: "Update article success",
        data: updateArticle,
      });
    } catch (error) {
      res.status(500).send({ error: true, message: "Internal server error" });
    }
  },

  deleteArticle: async (req, res) => {
    // delete article
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).send({ error: true, message: "Article ID is required" });
      }

      const deleteArticle = services.article.deleteArticle(id);

      res.status(200).send({
        error: false,
        message: "Delete article success",
        data: deleteArticle,
      });
    } catch (error) {
      res.status(500).send({ error: true, message: "Internal server error" });
    }
  },

  getArticles: async (req, res) => {
    // get article
    try {
      const { page, limit } = req.query;

      const getArticle = await services.article.getArticles(page, limit);

      res.status(200).send({
        error: false,
        message: "Find article data success",
        data: getArticle,
      });
    } catch (error) {
      res.status(500).send({ error: true, message: "Internal server error" });
    }
  },

  getArticleStatus: async (req, res) => {
    // get article status
    try {
      const getArticleStatus = await services.article.getArticleStatus();

      res.status(200).send({
        error: false,
        message: "Find article status data success",
        data: getArticleStatus,
      });
    } catch (error) {
      res.status(500).send({ error: true, message: "Internal server error" });
    }
  },

  uploadArticleImage: async (req, res) => {
    // upload article image
    const { article_id } = req.body;
    const article_image = req.files["article_image"] ? req.files["article_image"][0].filename : null;

    if (!article_id) {
      return res.status(400).send({ error: true, message: "Article ID is required" });
    }

    if (!article_image) {
      return res.status(400).send({ error: true, message: "Image is required" });
    }

    const data = { article_id, name: article_image };

    console.log(data, "datantya");

    const uploadImage = await services.article.uploadImage(data);

    console.log(uploadImage, "uploadImage");

    res.status(201).send({
      error: false,
      message: "Upload image success",
      url: uploadImage.dataValues.name,
    });
  },

  uploadArticleThumbnail: async (req, res) => {
    // upload article thumbnail
    const article_thumbnail = req.files["article_thumbnails"] ? req.files["article_thumbnails"][0].filename : null;

    if (!article_thumbnail) {
      return res.status(400).send({ error: true, message: "Thumbnail is required" });
    }

    const data = { name: article_thumbnail };

    const uploadThumbnail = services.article.uploadThumbnail(data);

    res.status(201).send({
      error: false,
      message: "Upload thumbnail success",
      data: uploadThumbnail,
    });
  },

  getArticleThumbnail: async (req, res) => {
    // get article thumbnail
    try {
      const { page, limit } = req.query;

      const getThumbnail = await services.article.getArticleThumbnails(page, limit);

      res.status(200).send({
        error: false,
        message: "Find thumbnail data success",
        data: getThumbnail,
      });
    } catch (error) {
      res.status(500).send({ error: true, message: "Internal server error" });
    }
  },

  // get featured articles
  getFeaturedArticles: async (req, res) => {
    try {
      const getFeaturedArticles = await services.article.getFeaturedArticles();

      res.status(200).send({
        error: false,
        message: "Find featured article data success",
        data: getFeaturedArticles,
      });
    } catch (error) {
      res.status(500).send({ error: true, message: "Internal server error" });
    }
  },

  //   public api controller  start here
  getPublishedArticles: async (req, res) => {
    // get published articles
    try {
      const { page, limit } = req.query;

      const getPublishedArticle = await services.article.getPublishedArticles(page, limit);

      res.status(200).send({
        error: false,
        message: "Find published article data success",
        data: getPublishedArticle,
      });
    } catch (error) {
      res.status(500).send({ error: true, message: "Internal server error" });
    }
  },

  getPublishedArticleDetails: async (req, res) => {
    // get published article details
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).send({ error: true, message: "Article ID is required" });
      }

      const getPublishedArticle = await services.article.getPublishedArticleDetails(id);

      res.status(200).send({
        error: false,
        message: "Find published article data success",
        data: getPublishedArticle,
      });
    } catch (error) {
      res.status(500).send({ error: true, message: "Internal server error" });
    }
  },
};

// import model
const { Op } = require("sequelize");
const { Articles, ArticleStatus, ArticleThumbnail, Images, sequelize } = require("../models");

module.exports = {
  createArticle: async (data) => {
    //  create new blank article
    try {
      const article = Articles.create(data);
      return article;
    } catch (error) {
      throw new Error(error);
    }
  },

  getArticleDetails: async (id) => {
    // get article details
    try {
      const getArticle = await Articles.findOne({
        where: {
          id: id,
        },
        include: [
          {
            model: ArticleStatus,
            as: "article_status",
            attributes: ["id", "name"],
          },
        ],
      });

      return getArticle;
    } catch (error) {
      throw new Error(error);
    }
  },

  getArticles: async (page, limit) => {
    // get all article
    try {
      if (!page) {
        page = 1;
      }
      if (!limit) {
        limit = 10;
      }

      const offset = page * limit - limit;

      const getArticle = await Articles.findAndCountAll({
        attributes: ["id", "title", "author_id", "status", "thumbnail", "featured", "created_at", "updated_at"],
        include: [
          {
            model: ArticleStatus,
            as: "article_status",
          },
        ],
        order: [["created_at", "DESC"]],
        limit: parseInt(limit),
        offset: offset,
      });

      //   console.log(getArticle, "get article");
      return {
        articles: getArticle.rows,
        totalItems: getArticle.count,
        totalPages: Math.ceil(getArticle.count / limit),
        currentPage: Number(page),
      };
    } catch (error) {
      console.log(error, "error article services");
      throw new Error(error);
    }
  },

  updateArticle: async (data) => {
    // update article
    try {
      const updateArticle = await Articles.update(data, {
        where: {
          id: data.id,
        },
      });

      return updateArticle;
    } catch (error) {
      throw new Error(error);
    }
  },

  deleteArticle: async (id) => {
    // delete article
    try {
      const deleteArticle = await Articles.destroy({
        where: {
          id: id,
        },
      });

      return deleteArticle;
    } catch (error) {
      throw new Error(error);
    }
  },

  getArticleStatus: async () => {
    // get article status
    try {
      const getArticleStatus = await ArticleStatus.findAll({
        attributes: ["id", "name"],
      });
      return getArticleStatus;
    } catch (error) {
      throw new Error(error);
    }
  },

  uploadImage: async (data) => {
    // insert image to database
    try {
      const image = Images.create(data);
      return image;
    } catch (error) {
      throw new Error(error);
    }
  },

  deleteImage: async (data) => {
    // delete article image
  },

  uploadThumbnail: async (data) => {
    // insert thumbnail to database
    try {
      const thumbnail = ArticleThumbnail.create(data);
      return thumbnail;
    } catch (error) {
      console.log(error, "error upload thumbnail");
      throw new Error(error);
    }
  },

  getArticleThumbnails: async (page, limit) => {
    // get article thumbnail
    try {
      if (!page) {
        page = 1;
      }
      if (!limit) {
        limit = 10;
      }
      const offset = page * limit - limit;
      const getArticleThumbnail = await ArticleThumbnail.findAndCountAll({
        attributes: ["id", "name"],
        limit: parseInt(limit),
        offset: offset,
      });

      return {
        thumbnails: getArticleThumbnail.rows,
        totalItems: getArticleThumbnail.count,
        totalPages: Math.ceil(getArticleThumbnail.count / limit),
        currentPage: Number(page),
      };
    } catch (error) {
      throw new Error(error);
    }
  },

  getFeaturedArticles: async () => {
    // get featured articles
    try {
      const getFeaturedArticles = await Articles.findAndCountAll({
        attributes: ["id", "title", "author_id", "status", "thumbnail", "created_at", "updated_at"],
        where: {
          featured: 1,
        },
        include: [
          {
            model: ArticleThumbnail,
            as: "article_thumbnail",
            attributes: ["name"],
          },
        ],
      });

      return getFeaturedArticles;
    } catch (error) {
      console.log(error, "error article services");
      throw new Error(error);
    }
  },

  //   public api services start here
  getPublishedArticles: async (page, limit) => {
    // get all article
    try {
      if (!page) {
        page = 1;
      }
      if (!limit) {
        limit = 10;
      }

      const offset = page * limit - limit;

      const getArticle = await Articles.findAndCountAll({
        where: {
          status: 2,
        },
        attributes: ["id", "title", "thumbnail", "created_at", "updated_at"],
        include: [
          {
            model: ArticleThumbnail,
            as: "article_thumbnail",
            attributes: ["name"],
          },
        ],
        limit: parseInt(limit),
        offset: offset,
      });

      //   console.log(getArticle, "get article");
      return {
        articles: getArticle.rows,
        totalItems: getArticle.count,
        totalPages: Math.ceil(getArticle.count / limit),
        currentPage: Number(page),
      };
    } catch (error) {
      console.log(error, "error article services");
      throw new Error(error);
    }
  },

  //   get published article details
  getPublishedArticleDetails: async (id) => {
    // get article details
    try {
      const getArticle = await Articles.findOne({
        where: {
          id: id,
          status: 2,
        },
        attributes: {
          exclude: ["id", "status", "author_id", "created_at", "updated_at"],
        },
        include: [
          {
            model: ArticleThumbnail,
            as: "article_thumbnail",
            attributes: ["name"],
          },
        ],
      });

      return getArticle;
    } catch (error) {
      throw new Error(error);
    }
  },
};

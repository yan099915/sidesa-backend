const router = require("express").Router();
const upload = require("../common/multerUploader");
require("dotenv").config();

const articleControllers = require("../controllers/ArticleControllers");
const announcementControllers = require("../controllers/AnnouncementControllers");

// articles
router.get("/public/articles", articleControllers.getPublishedArticles);
router.get("/public/featured-articles", articleControllers.getFeaturedArticles);
router.get("/public/article/:id", articleControllers.getPublishedArticleDetails);
router.get("/public/announcements", announcementControllers.getPublishedAnnouncements);
router.get("/public/announcement/:id", announcementControllers.getPublishedAnnouncementsDetails);

module.exports = router;

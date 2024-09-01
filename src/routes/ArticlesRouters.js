const router = require("express").Router();
const upload = require("../common/multerUploader");
require("dotenv").config();

const articleControllers = require("../controllers/ArticleControllers");
const middleware = require("../middlewares/authMiddlewares");

router.post("/article-image", middleware.isAdmin, upload.fields([{ name: "article_image", maxCount: 1 }]), articleControllers.uploadArticleImage);
router.get("/articles", middleware.isAdmin, articleControllers.getArticles);
router.post("/article", middleware.isAdmin, articleControllers.createArticle);
router.put("/article", middleware.isAdmin, articleControllers.updateArticle);
router.delete("/article/:id", middleware.isAdmin, articleControllers.deleteArticle);
router.get("/article/:id", middleware.isAdmin, articleControllers.getArticleDetails);
router.get("/article-status", middleware.isAdmin, articleControllers.getArticleStatus);
router.post(
  "/article-thumbnail",
  middleware.isAdmin,
  upload.fields([{ name: "article_thumbnails", maxCount: 1 }]),
  articleControllers.uploadArticleThumbnail
);
router.get("/article-thumbnail", middleware.isAdmin, articleControllers.getArticleThumbnail);
module.exports = router;

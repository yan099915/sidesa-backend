const router = require("express").Router();
const upload = require("../common/multerUploader");
require("dotenv").config();

const fileControllers = require("../controllers/FilesControllers");
const middleware = require("../middlewares/authMiddlewares");

router.get("/file/:type/:filename", middleware.isAdmin, fileControllers.requestFiles);
router.get("/profile/:filename", middleware.isAuth, fileControllers.profilePicture);

module.exports = router;

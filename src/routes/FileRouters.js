const router = require("express").Router();
const upload = require("../common/multerUploader");
require("dotenv").config();

const fileControllers = require("../controllers/FilesControllers");
const middleware = require("../middlewares/authMiddlewares");

router.get("/file/:type/:filename", middleware.isAdmin, fileControllers.requestFiles);

module.exports = router;

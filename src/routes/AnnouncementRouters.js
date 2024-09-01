const router = require("express").Router();
const upload = require("../common/multerUploader");
require("dotenv").config();

const announcementControllers = require("../controllers/AnnouncementControllers");
const middleware = require("../middlewares/authMiddlewares");

router.get("/announcements", middleware.isAdmin, announcementControllers.getAnnouncements);
router.post("/announcement", middleware.isAdmin, announcementControllers.createAnnouncement);
router.delete("/announcement/:id", middleware.isAdmin, announcementControllers.deleteAnnouncement);
router.get("/announcement/:id", middleware.isAdmin, announcementControllers.getAnnouncementDetails);
router.get("/announcement-status", middleware.isAdmin, announcementControllers.getAnnouncementStatus);
router.get("/announcement-type", middleware.isAdmin, announcementControllers.getAnnouncementType);
router.put("/announcement", middleware.isAdmin, announcementControllers.updateAnnouncement);
module.exports = router;

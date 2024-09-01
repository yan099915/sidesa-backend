const router = require("express").Router();
require("dotenv").config();

const reportControllers = require("../controllers/ReportControllers");
const middleware = require("../middlewares/authMiddlewares");

// articles
router.get("/portal-report", middleware.isAdmin, reportControllers.getPortalReports);
router.get("/resident-report", middleware.isAdmin, reportControllers.getResidentReports);

module.exports = router;

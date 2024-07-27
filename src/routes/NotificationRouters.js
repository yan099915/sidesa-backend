const router = require("express").Router();
require("dotenv").config();

const notificationControllers = require("../controllers/NotificationControllers");
const middleware = require("../middlewares/authMiddlewares");

router.get("/notification", middleware.isAuth, notificationControllers.getNotification);
router.put("/notification", middleware.isAuth, notificationControllers.updateNotificationStatus);

module.exports = router;

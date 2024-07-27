const router = require("express").Router();
require("dotenv").config();

const usersControllers = require("../controllers/UsersControllers");
const middleware = require("../middlewares/authMiddlewares");

router.post("/register", usersControllers.register);
router.get("/verify-email", usersControllers.verifyEmail);
router.post("/login", usersControllers.login);
router.post("/resend-email", usersControllers.resendEmail);
router.get("/session", middleware.isAuth, usersControllers.sessionToken);
router.get("/logout", usersControllers.logout);
router.get("/menu", middleware.isAuth, usersControllers.getMenu);
router.get("notification", middleware.isAuth, usersControllers.getNotification);

module.exports = router;

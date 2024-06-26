const router = require("express").Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const path = require("path");

const usersControllers = require("../controllers/UsersControllers");
const middleware = require("../middlewares/authMiddlewares");
const multer = require("multer");

// Set storage engine for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = "";
    if (file.fieldname === "foto_diri") {
      folder = "foto_diri";
    } else if (file.fieldname === "foto_ktp") {
      folder = "foto_ktp";
    } else if (file.fieldname === "foto_kk") {
      folder = "foto_kk";
    }
    cb(null, path.join(__dirname, "../../files/", folder));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Nama file dengan timestamp
  },
});

// Initialize multer upload
const upload = multer({ storage: storage });

router.post("/register", usersControllers.register);
router.get("/verify-email", usersControllers.verifyEmail);
router.post("/login", usersControllers.login);
router.post("/resend-email", usersControllers.resendEmail);
router.get("/session", usersControllers.sessionToken);
router.get("/logout", usersControllers.logout);
router.get("/menu", middleware.isAuth, usersControllers.getMenu);
router.get("/verification-status", middleware.isAuth, usersControllers.checkVerificationStatus);

// Route for request verification with image upload
router.post(
  "/request-verification",
  middleware.isAuth,
  upload.fields([
    { name: "foto_diri", maxCount: 1 },
    { name: "foto_ktp", maxCount: 1 },
    { name: "foto_kk", maxCount: 1 },
  ]),
  usersControllers.requestDataVerification
);

module.exports = router;

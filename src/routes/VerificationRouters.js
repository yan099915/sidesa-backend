const router = require("express").Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const path = require("path");
const { ENV } = process.env;

const verificationControllers = require("../controllers/VerificationControllers");
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
    if (ENV === "development") {
      cb(null, path.join(__dirname, "../../files/", folder));
    } else {
      cb(null, path.join(__dirname, "../../../public_html/assets/files/", folder));
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Nama file dengan timestamp
  },
});

// Initialize multer upload
const upload = multer({ storage: storage });

router.get("/verification-status", middleware.isAuth, verificationControllers.checkVerificationStatus);
router.get("/verification", middleware.isAuth, verificationControllers.getAllVerifications);
router.get("/verification-details", middleware.isAuth, verificationControllers.getVerificationDetails);
router.post("/verification-approval", middleware.isAuth, verificationControllers.approveVerification);

// Route for request verification with image upload
router.post(
  "/request-verification",
  middleware.isAuth,
  upload.fields([
    { name: "foto_diri", maxCount: 1 },
    { name: "foto_ktp", maxCount: 1 },
    { name: "foto_kk", maxCount: 1 },
  ]),
  verificationControllers.requestDataVerification
);

module.exports = router;

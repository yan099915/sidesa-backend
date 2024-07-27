const router = require("express").Router();
require("dotenv").config();
const upload = require("../common/multerUploader");

const requestControllers = require("../controllers/RequestControllers");
const middleware = require("../middlewares/authMiddlewares");

// Middleware to check if file exists
const checkFileExists = (req, res, next) => {
  if (!req.files || !req.files["surat"] || req.files["surat"].length === 0) {
    return res.status(400).json({ error: "File surat is required" });
  }
  next();
};
router.get("/request-history", middleware.isAuth, requestControllers.getUserRequests);
router.get("/requests", middleware.isAdmin, requestControllers.getRequests);
router.get("/request-details", middleware.isAuth, requestControllers.requestDetails);
router.post("/request", middleware.isAuth, upload.fields([{ name: "surat_rs", maxCount: 1 }]), requestControllers.createRequest);
router.post(
  "/request-update",
  middleware.isAdmin,
  upload.fields([{ name: "surat", maxCount: 1 }]),
  //   checkFileExists,
  requestControllers.updateRequest
);
module.exports = router;

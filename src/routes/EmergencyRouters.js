const router = require("express").Router();
const upload = require("../common/multerUploader");
require("dotenv").config();

const emergencyControllers = require("../controllers/EmergencyControllers");
const middleware = require("../middlewares/authMiddlewares");

router.post("/emergency", middleware.isAuth, upload.fields([{ name: "foto_emergency", maxCount: 1 }]), emergencyControllers.createEmergency);
router.get("/emergency", middleware.isAdmin, emergencyControllers.getEmergencies);
router.get("/emergency/:id", middleware.isAdmin, emergencyControllers.emergencyDetails);
router.put("/emergency/:id", middleware.isAdmin, emergencyControllers.updateEmergency);
router.post("/emergency/view", middleware.isAdmin, emergencyControllers.writeEmergencyViewLog);
router.post("/emergency/broadcast", middleware.isAdmin, emergencyControllers.broadcastEmergency);

module.exports = router;

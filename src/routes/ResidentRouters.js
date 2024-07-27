const router = require("express").Router();
require("dotenv").config();

const residentControllers = require("../controllers/ResidentControllers");
const middleware = require("../middlewares/authMiddlewares");

router.get("/resident-list", middleware.isAuth, residentControllers.getAllResidents);
router.get("/resident/:nik", middleware.isAuth, residentControllers.findResidents);
router.post("/resident", middleware.isAuth, residentControllers.createResident);

module.exports = router;

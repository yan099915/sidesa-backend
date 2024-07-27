const router = require("express").Router();
require("dotenv").config();

const familyControllers = require("../controllers/FamilyControllers");
const middleware = require("../middlewares/authMiddlewares");

router.get("/family-info", middleware.isAuth, familyControllers.getFamilyInfo);

module.exports = router;

const router = require("express").Router();
require("dotenv").config();

const residentControllers = require("../controllers/ResidentControllers");
const middleware = require("../middlewares/authMiddlewares");

router.post("/verification", middleware.isAuth, residentControllers.verification);

module.exports = router;

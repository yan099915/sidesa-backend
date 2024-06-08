const router = require("express").Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();

const usersControllers = require("../controllers/UsersControllers");

router.post("/register", usersControllers.register);
router.get("/verify-email", usersControllers.verifyEmail);
router.post("/login", usersControllers.login);

module.exports = router;

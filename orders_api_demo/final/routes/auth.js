const express = require("express");
const router = express.Router();
const auth = require("../controllers/auth");

const authenticateToken = require("../middleware/authentication");
const authAdmin = require("../middleware/authAdmin");
const authUser = require("../middleware/authUser");

router.post("/register", auth.register);
router.post("/login", auth.login);
router.post("/logout", auth.logout);

module.exports = router;

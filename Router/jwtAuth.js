const router = require("express").Router();
const validInfo = require("../middleware/validInfo");
const { registerUser, loginUser } = require("../Controllers/authController");

// REGISTER
router.post("/register", validInfo, registerUser);
// LOGIN
router.post("/login", validInfo, loginUser);

module.exports = router;

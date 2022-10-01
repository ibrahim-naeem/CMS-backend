const router = require("express").Router();
const validInfo = require("./validInfo");
const {
  registerUser,
  loginUser,
  getUserRoles,
} = require("../Controllers/authController");

//ROLES
// ROUTE => http://localhost:5000/auth/roles
router.get("/roles", getUserRoles);

// REGISTER
// ROUTE => http://localhost:5000/auth/register
router.post("/register", validInfo, registerUser);

// LOGIN
// ROUTE => http://localhost:5000/auth/login
router.post("/login", validInfo, loginUser);

module.exports = router;

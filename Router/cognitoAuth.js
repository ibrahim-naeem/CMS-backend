const router = require("express").Router();
const {
  signUp,
  verify,
  signIn,
  signOut,
  getUserRoles,
} = require("../Controllers/authCognitoController");

//ROLES
// ROUTE => // http://localhost:5000/cognito/roles
router.get("/roles", getUserRoles);
router.post("/signup", signUp);
router.post("/verify", verify);
router.post("/signin", signIn);
router.get("/signout", signOut);

module.exports = router;

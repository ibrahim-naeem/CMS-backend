const router = require("express").Router();
const {
  signUp,
  verify,
  signIn,
  signOut,
} = require("../Controllers/authCognitoController");

router.get("/signup", signUp);
router.get("/verify", verify);
router.get("/signin", signIn);
router.get("/signout", signOut);

module.exports = router;

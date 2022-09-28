const router = require("express").Router();
const {
  signUp,
  verify,
  signIn,
  signOut,
} = require("../Controllers/authCognitoController");

router.post("/signup", signUp);
router.post("/verify", verify);
router.get("/signin", signIn);
router.get("/signout", signOut);

module.exports = router;

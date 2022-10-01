const router = require("express").Router();
const authorization = require("../middleware/authorization");

//Controllers

const {
  getUserName,
  getPersonalDetails,
  addPersonalDetails,
} = require("../Controllers/userDetailsController");

//GET user mini details
// http://localhost:5000/user/
router.get("/", authorization, getUserName);

//GET user fulll details
// http://localhost:5000/user/personalDetails
router.get("/personalDetails", authorization, getPersonalDetails);

//POST user fulll details
// http://localhost:5000/user/personalDetails
router.post("/personalDetails", authorization, addPersonalDetails);

module.exports = router;

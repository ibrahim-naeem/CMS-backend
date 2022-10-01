const router = require("express").Router();
const authorization = require("../middleware/authorization");

const {
  deleteLeave,
  addNewLeave,
  getUserSpecificLeaves,
  getAllLeaves,
} = require("../Controllers/leavesController");

//LEAVES
// GET All leave details
// http://localhost:5000/user/getAllleaves
router.get("/getAllleaves", authorization, getAllLeaves);

//GET leaves details
// http://localhost:5000/user/leave
router.get("/leave", authorization, getUserSpecificLeaves);

// http://localhost:5000/user/leave
router.post("/leave", authorization, addNewLeave);

// DELETE leave details
// http://localhost:5000/user/trainings/:id
router.delete("/leave/:id", authorization, deleteLeave);

module.exports = router;

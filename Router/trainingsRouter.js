const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

const {
  getAllTrainings,
  getUserSpecificTrainings,
  addTraining,
  deleteTraining,
} = require("../Controllers/trainingsController");

// TRAININGS
// GET All trainings details
// http://localhost:5000/user/getAllTrainings
router.get("/getAllTrainings", authorization, getAllTrainings);

// GET trainings details BY userID
// http://localhost:5000/user/trainings
router.get("/trainings", authorization, getUserSpecificTrainings);

// http://localhost:5000/user/trainings
router.post("/trainings", authorization, addTraining);

// DELETE trainings details
// http://localhost:5000/user/trainings/:id
router.delete("/trainings/:id", authorization, deleteTraining);

module.exports = router;

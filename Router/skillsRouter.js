const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

const {
  deleteSkill,
  addNewSkill,
  getUserSpecificSkills,
  getAllSkills,
} = require("../Controllers/skillsController");

// SkillSets
// GET All skillset details
// http://localhost:5000/user/getAllskillsets
router.get("/getAllskillsets", authorization, getAllSkills);

//GET skills details
// http://localhost:5000/user/skills
router.get("/skills", authorization, getUserSpecificSkills);

// http://localhost:5000/user/skill
router.post("/skill", authorization, addNewSkill);

// DELETE skills details
// http://localhost:5000/user/trainings/:id
router.delete("/skills/:id", authorization, deleteSkill);

module.exports = router;

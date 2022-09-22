const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

//Controllers
const {
  uploadFile,
  getFiles,
  deleteFiles,
  downloadFile,
} = require("../Controllers/fileController");
const {
  uploadImageToS3,
  getS3ImagePath,
  getImagePathFromDB,
} = require("../Controllers/ImageController");
const {
  getAllTrainings,
  getUserSpecificTrainings,
  addTraining,
  deleteTraining,
} = require("../Controllers/trainingController");
const {
  getUserName,
  getPersonalDetails,
  addPersonalDetails,
} = require("../Controllers/userDetailsController");
const {
  deleteSkill,
  addNewSkill,
  getUserSpecificSkills,
  getAllSkills,
} = require("../Controllers/skilldController");
const {
  deleteLeave,
  addNewLeave,
  getUserSpecificLeaves,
  getAllLeaves,
} = require("../Controllers/leavesController");

//GET user mini details
// http://localhost:5000/user/
router.get("/", authorization, getUserName);

//GET user fulll details
// http://localhost:5000/user/personalDetails
router.get("/personalDetails", authorization, getPersonalDetails);

//POST user fulll details
// http://localhost:5000/user/personalDetails
router.post("/personalDetails", authorization, addPersonalDetails);

//DIRECTOR
// GET All director details
// http://localhost:5000/user/getAlldirector
router.get("/getAlldirector", authorization, async (req, res) => {
  try {
    const director = await pool.query("SELECT * FROM director");
    if (director.rows.length !== 0) {
      res.status(200).json(director.rows);
    } else {
      res.status(404).json("No director found!!");
    }
  } catch (error) {
    console.error(error);
  }
});

//GET director details
// http://localhost:5000/user/director
router.get("/director", authorization, async (req, res) => {
  try {
    const director = await pool.query(
      "SELECT * FROM director WHERE $1 = ANY(managers)",
      [req.user]
    );
    if (director.rows.length !== 0) {
      res.status(200).json(director.rows);
    } else {
      res
        .status(404)
        .json({ error: "No director found against current User!!" });
    }
  } catch (error) {
    console.error(error);
  }
});

// DELETE director details
// http://localhost:5000/user/director/:id
router.delete("/director/:id", authorization, async (req, res) => {
  try {
    const { id } = req.params;
    const query = await pool.query(
      "DELETE FROM director WHERE director_id   = $1",
      [id]
    );
    res
      .status(200)
      .json({ message: `Director with id ${id} deleted successfully!!` });
  } catch (error) {
    console.error(error);
  }
});

//MANAGER
// GET All manager details
// http://localhost:5000/user/getAllmanagers
router.get("/getAllmanagers", authorization, async (req, res) => {
  try {
    const manager = await pool.query("SELECT * FROM managers");
    if (manager.rows.length !== 0) {
      res.status(200).json(manager.rows);
    } else {
      res.status(404).json("No manager found!!");
    }
  } catch (error) {
    console.error(error);
  }
});

//GET manager details
// http://localhost:5000/user/manager
router.get("/manager", authorization, async (req, res) => {
  try {
    const manager = await pool.query(
      "SELECT * FROM managers WHERE $1 = ANY(employees)",
      [req.user]
    );
    if (manager.rows.length !== 0) {
      res.status(200).json(manager.rows);
    } else {
      res.status(404).json("No manager found against current User!!");
    }
  } catch (error) {
    console.error(error);
  }
});

//POST manager details
// http://localhost:5000/user/manager
router.post("/manager", async (req, res) => {
  try {
    const { first_name, last_name, title, employees } = req.body;
    const query = await pool.query(
      "INSERT INTO managers (first_name, last_name, title, employees) VALUES ($1, $2, $3, $4) RETURNING *",
      [first_name, last_name, title, employees]
    );
    res.json(query.rows[0]);
  } catch (error) {
    console.error(error);
  }
});

// DELETE manager details
// http://localhost:5000/user/manager/:id
router.delete("/manager/:id", authorization, async (req, res) => {
  try {
    const { id } = req.params;
    const query = await pool.query(
      "DELETE FROM managers WHERE manager_id  = $1",
      [id]
    );
    res
      .status(200)
      .json({ message: `Manager with id ${id} deleted successfully!!` });
  } catch (error) {
    console.error(error);
  }
});

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
router.delete("/skills/:id", deleteSkill);

//PROJECTS
// GET All project details
// http://localhost:5000/user/getAllprojects
router.get("/getAllprojects", authorization, async (req, res) => {
  try {
    const project = await pool.query("SELECT * FROM projects");
    if (project.rows.length !== 0) {
      res.status(200).json(project.rows);
    } else {
      res.status(404).json("No project found!!");
    }
  } catch (error) {
    console.error(error);
  }
});
//GET projects details
// http://localhost:5000/user/projects
router.get("/projects", authorization, async (req, res) => {
  try {
    const projects = await pool.query(
      "SELECT * FROM projects WHERE $1 = ANY(employees_id)",
      [req.user]
    );

    if (projects.rows.length !== 0) {
      res.status(200).json(projects.rows);
    } else {
      res.status(404).json("No projects found against current User!!");
    }
  } catch (error) {
    console.error(error);
  }
});

//POST projects details
// http://localhost:5000/user/projects
router.post("/projects", async (req, res) => {
  try {
    const { project_name, director_id, manager_id, employees_id } = req.body;
    const query = await pool.query(
      "INSERT INTO projects (project_name, director_id, manager_id,  employees_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [project_name, director_id, manager_id, employees_id]
    );
    res.json(query.rows[0]);
  } catch (error) {
    console.error(error);
  }
});

// DELETE project details
// http://localhost:5000/user/trainings/:id
router.delete("/project/:id", authorization, async (req, res) => {
  try {
    const { id } = req.params;
    const query = await pool.query(
      "DELETE FROM projects WHERE project_id  = $1",
      [id]
    );
    res
      .status(200)
      .json({ message: `Project with id ${id} deleted successfully!!` });
  } catch (error) {
    console.error(error);
  }
});

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

// FILE ROUTE START
//POST file details in Database
// http://localhost:5000/user/uploadFile
router.post("/uploadFile", authorization, uploadFile);
router.get("/getFiles", authorization, getFiles);

// http://localhost:5000/user/deleteFiles/:id
router.delete("/deleteFiles/:id", authorization, deleteFiles);
router.get("/downloadFile/:id", authorization, downloadFile);

// FILE ROUTE END

//IMAGE ROUTES ---##3---
router.post("/uploadImage", authorization, uploadImageToS3);
router.get("/getImagepath", authorization, getImagePathFromDB);
router.get("/getImage/:id", getS3ImagePath);

module.exports = router;

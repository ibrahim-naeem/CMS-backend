const pool = require("../db");

// SkillSets
// GET All skillset details
// http://localhost:5000/user/getAllskillsets
const getAllSkills = async (req, res) => {
  try {
    const skillset = await pool.query("SELECT * FROM skills");
    if (skillset.rows.length !== 0) {
      res.status(200).json(skillset.rows);
    } else {
      res.status(404).json("No skillset found!!");
    }
  } catch (error) {
    console.error(error);
  }
};

//GET skills details
// http://localhost:5000/user/skills
const getUserSpecificSkills = async (req, res) => {
  try {
    const skills = await pool.query(
      "SELECT * FROM skills WHERE $1 = ANY(employees)",
      [req.user]
    );

    if (skills.rows.length !== 0) {
      res.status(200).json(skills.rows);
    } else {
      res.status(404).json("No Leaves found against current User!!");
    }
  } catch (error) {
    console.error(error);
  }
};

// http://localhost:5000/user/skill
const addNewSkill = async (req, res) => {
  try {
    const { SkillsetName } = req.body;

    const gettingAllskills = await pool.query("SELECT * FROM skills");
    // console.log(gettingAllskills.rows);
    let isUserExist = false;
    let isSkillSetExist = false;
    let skillSetIDArray = [];
    let existedSkillSetID;
    if (gettingAllskills.rows.length !== 0) {
      gettingAllskills.rows.map(async (skill) => {
        if (
          skill.skill_name.trim().toLowerCase() ==
          SkillsetName.trim().toLowerCase()
        ) {
          existedSkillSetID = skill.skill_id;
          isSkillSetExist = true;
          skill.employees.map((employeeID) => {
            skillSetIDArray.push(employeeID);
          });

          skill.employees.map((employeeID) => {
            if (employeeID === req.user) {
              isUserExist = true;
            }
          });
        }
      });
    }
    if (isSkillSetExist) {
      if (isUserExist) {
        res.send("User already exist");
      } else {
        //query to add user to existing training
        const query = pool.query(
          "Update skills SET employees = $1 WHERE skill_id = $2",
          [[...skillSetIDArray, req.user], existedSkillSetID]
        );
        res
          .status(200)
          .json({ message: "Training Found but no user...USER Added" });
      }
    } else {
      //add training and add user
      const query = await pool.query(
        "INSERT INTO skills (skill_name, employees) VALUES ($1, $2) RETURNING *",
        [SkillsetName, [req.user]]
      );
      res.status(200).json({
        msg: "No Matching training found and new TRAINING Added to DB",
      });
    }
  } catch (error) {
    console.error(error);
  }
};

// DELETE skills details
// http://localhost:5000/user/trainings/:id
const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("ID", id);
    console.log("Req USER", req.user);

    const query = await pool.query(
      "UPDATE skills SET employees = array_remove(employees, $1) WHERE skill_id = $2",
      [req.user, id]
    );

    res
      .status(200)
      .json({ message: `Skill with id ${id} deleted successfully!!` });
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  getAllSkills,
  getUserSpecificSkills,
  addNewSkill,
  deleteSkill,
};

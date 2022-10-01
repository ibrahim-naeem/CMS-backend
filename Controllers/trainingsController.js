const pool = require("../db");

// http://localhost:5000/user/getAllTrainings
const getAllTrainings = async (req, res) => {
  try {
    const trainings = await pool.query("SELECT * FROM trainings");
    if (trainings.rows.length !== 0) {
      res.status(200).json(trainings.rows);
    } else {
      res.status(404).json("No Trainings found!!");
    }
  } catch (error) {
    console.error(error);
  }
};

// GET trainings details BY userID
// http://localhost:5000/user/trainings
const getUserSpecificTrainings = async (req, res) => {
  try {
    const trainings = await pool.query(
      "SELECT * FROM trainings WHERE $1 =  ANY(employees) ",
      [req.user]
    );
    if (trainings.rows.length !== 0) {
      res.status(200).json(trainings.rows);
    } else {
      res.status(404).json("No Trainings found against current User!!");
    }
  } catch (error) {
    console.error(error);
  }
};
// http://localhost:5000/user/trainings
const addTraining = async (req, res) => {
  try {
    const { trainingName } = req.body;
    console.log(trainingName, req.user);
    const gettingAllTraining = await pool.query("SELECT * FROM trainings");
    let isUserExist = false;
    let isTrainingExist = false;
    let trainingIDArray = [];
    let existedTrainingID;

    if (gettingAllTraining.rows.length !== 0) {
      gettingAllTraining.rows.map(async (training) => {
        if (
          training.training_name.trim().toLowerCase() ==
          trainingName.trim().toLowerCase()
        ) {
          existedTrainingID = training.training_id;
          isTrainingExist = true;
          training.employees.map((employeeID) => {
            trainingIDArray.push(employeeID);
          });

          training.employees.map((trainingID) => {
            if (trainingID === req.user) {
              isUserExist = true;
            }
          });
        }
      });
    }
    if (isTrainingExist) {
      if (isUserExist) {
        console.log("Adding  training to existed User");
        res.send("User already exist");
      } else {
        //query to add user to existing training
        const query = pool.query(
          "Update trainings SET employees = $1 WHERE training_id = $2",
          [[...trainingIDArray, req.user], existedTrainingID]
        );
        res
          .status(200)
          .json({ message: "Training Found but no user...USER Added" });
      }
    } else {
      //add training and add user
      console.log("Adding new training");
      const query = await pool.query(
        "INSERT INTO trainings (training_name, employees) VALUES ($1, $2) RETURNING *",
        [trainingName, [req.user]]
      );
      res.status(200).json({
        msg: "No Matching training found and new TRAINING Added to DB",
      });
    }
  } catch (error) {
    console.error(error);
  }
};

// DELETE trainings details
// http://localhost:5000/user/trainings/:id
const deleteTraining = async (req, res) => {
  try {
    const { id } = req.params;

    const query = await pool.query(
      "UPDATE trainings SET employees = array_remove(employees, $1) WHERE training_id = $2",
      [req.user, id]
    );

    res
      .status(200)
      .json({ message: `Training with id ${id} deleted successfully!!` });
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  getAllTrainings,
  getUserSpecificTrainings,
  addTraining,
  deleteTraining,
};

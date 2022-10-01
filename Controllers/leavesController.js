const pool = require("../db");

//LEAVES
// GET All leave details
// http://localhost:5000/user/getAllleaves
const getAllLeaves = async (req, res) => {
  try {
    const leave = await pool.query("SELECT * FROM leave");
    if (leave.rows.length !== 0) {
      res.status(200).json(leave.rows);
    } else {
      res.status(404).json("No leave found!!");
    }
  } catch (error) {
    console.error(error);
  }
};

//GET leaves details
// http://localhost:5000/user/leave
const getUserSpecificLeaves = async (req, res) => {
  try {
    const leave = await pool.query("SELECT * FROM leave WHERE user_id = ($1)", [
      req.user,
    ]);

    if (leave.rows.length !== 0) {
      res.status(200).json(leave.rows);
    } else {
      res.status(404).json("No Leaves found against current User!!");
    }
  } catch (error) {
    console.error(error);
  }
};

// http://localhost:5000/user/leave
const addNewLeave = async (req, res) => {
  try {
    const { date, leaveStatus } = req.body;

    const gettingAllLeave = await pool.query("SELECT * FROM leave");

    let updateLeave = false;

    if (gettingAllLeave.rows.length !== 0) {
      console.log(gettingAllLeave.rows);
      gettingAllLeave.rows.map((leave) => {
        let test = new Date(leave.created_at).toDateString();
        console.log(test, "--", leave.created_at, "--", date);
        if (test == date) {
          updateLeave = true;
        }
      });
    }

    console.log(updateLeave);
    // if (updateLeave) {
    //   const query = pool.query(
    //     "Update leave SET status = $1 , created_At = $2 WHERE user_id = $3",
    //     [leaveStatus, date, req.user]
    //   );
    // } else {
    //   //add training and add user
    //   const query = await pool.query(
    //     "INSERT INTO leave (user_id, status, created_At) VALUES ($1,$2,$3) RETURNING *",
    //     [req.user, leaveStatus, date]
    //   );
    //   res.status(200).json({
    //     msg: "New Leave Added to DB",
    //   });
    // }
  } catch (error) {
    console.error(error);
  }
};

// DELETE leave details
// http://localhost:5000/user/trainings/:id
const deleteLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const query = await pool.query("DELETE FROM leave WHERE leave_id  = $1", [
      id,
    ]);
    res
      .status(200)
      .json({ message: `Leave with id ${id} deleted successfully!!` });
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  getAllLeaves,
  getUserSpecificLeaves,
  addNewLeave,
  deleteLeave,
};

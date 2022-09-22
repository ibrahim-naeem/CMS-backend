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
    const leave = await pool.query(
      "SELECT * FROM leave WHERE $1 =  ANY(employees_id_status)",
      [req.user]
    );

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
    const { LeaveDate, leaveStatus } = req.body;

    const gettingAllLeave = await pool.query("SELECT * FROM leave");
    // console.log(gettingAllLeave.rows);
    let isUserExist = false;
    let isLeaveExist = false;
    let leaveIDandStatusArray = [];
    let existedLeaveID;
    if (gettingAllLeave.rows.length !== 0) {
      gettingAllLeave.rows.map(async (leave) => {
        if (leave.date == LeaveDate) {
          existedLeaveID = leave.leave_id;

          isLeaveExist = true;

          leave.employees_id_status.map((leaveArray) => {
            leaveIDandStatusArray.push(leaveArray);
          });

          leave.employees_id_status.map((leave_info) => {
            if (leave_info[0] === req.user) {
              isUserExist = true;
            }
          });
        }
      });
    }
    if (isLeaveExist) {
      if (isUserExist) {
        res.send("User already exist");
      } else {
        //query to add user to existing training
        const query = pool.query(
          "Update leave SET employees_id_status = $1 WHERE leave_id = $2",
          [[...leaveIDandStatusArray, [req.user, leaveStatus]], existedLeaveID]
        );
        res
          .status(200)
          .json({ message: "Leave Found but no user...USER Added" });
      }
    } else {
      //add training and add user
      const query = await pool.query(
        "INSERT INTO leave (date, employees_id_status) VALUES ($1, $2) RETURNING *",
        [LeaveDate, [req.user, leaveStatus]]
      );
      res.status(200).json({
        msg: "No Matching Leave found and new Leave Added to DB",
      });
    }
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

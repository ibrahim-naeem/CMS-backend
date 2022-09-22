const pool = require("../db");

//GET user mini details
// http://localhost:5000/user/
const getUserName = async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT user_name FROM user_details WHERE user_id = $1",
      [req.user]
    );
    res.json(user.rows[0]);
  } catch (error) {
    console.error(error);
  }
};

//GET user fulll details
// http://localhost:5000/user/personalDetails
const getPersonalDetails = async (req, res) => {
  try {
    const response = await pool.query(
      "SELECT * FROM user_details WHERE user_id = $1",
      [req.user]
    );

    res.json(response.rows[0]);
  } catch (error) {
    console.error(error);
  }
};

//POST user fulll details
// http://localhost:5000/user/personalDetails
const addPersonalDetails = async (req, res) => {
  try {
    const {
      userName,
      userStatus,
      dateOfBirth,
      gender,
      martial,
      joiningDate,
      confirmationDate,
      shiftType,
      education,
      family,
      employments,
      awards,
    } = req.body;
    const user_id = req.user;

    //EMPLOYEE -USER
    const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [
      user_id,
    ]);
    //DIRECTOR
    const director = await pool.query(
      "SELECT * FROM directors WHERE director_id = $1",
      [user_id]
    );
    //MANAGER
    const manager = await pool.query(
      "SELECT * FROM managers WHERE manager_id = $1",
      [user_id]
    );

    let name, email;

    if (user.rows.length !== 0) {
      const { user_name, user_email } = user.rows[0];
      name = user_name;
      email = user_email;
    } else if (director.rows.length !== 0) {
      const { director_name, director_email } = director.rows[0];
      name = director_name;
      email = director_email;
    } else if (manager.rows.length !== 0) {
      const { manager_name, manager_email } = manager.rows[0];
      name = manager_name;
      email = manager_email;
    }

    //checking if user Exist
    const checkUser = await pool.query(
      "SELECT user_status  FROM user_details WHERE user_id = $1",
      [user_id]
    );
    if (checkUser.rows.length !== 0) {
      //Update command ...
      const updateUserDetails = await pool.query(
        "UPDATE user_details SET user_id = $1, user_name = $2, user_status = $3, date_of_birth = $4, joining_data = $5, confirmation_date = $6, gender  = $7, martial = $8, shift_type = $9, education = $10, family = $11, emplymeents = $12, awards = $13 WHERE user_id = $14",
        [
          user_id,
          userName,
          userStatus,
          dateOfBirth,
          joiningDate,
          confirmationDate,
          gender,
          martial,
          shiftType,
          education,
          family,
          employments,
          awards,
          user_id,
        ]
      );
      const updatedDetails = await pool.query(
        "SELECT * FROM user_details WHERE user_id = $1",
        [user_id]
      );
      res.status(201).json(updatedDetails.rows[0]);
    } else {
      const query = await pool.query(
        "INSERT INTO user_details (user_id,user_name,user_email, user_status  ,date_of_birth ,joining_data  ,confirmation_date ,gender ,martial ,shift_type ,education ,family ,emplymeents ,awards) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *",
        [
          user_id,
          name,
          email,
          userStatus,
          dateOfBirth,
          joiningDate,
          confirmationDate,
          gender,
          martial,
          shiftType,
          education,
          family,
          employments,
          awards,
        ]
      );
      res.status(201).json(query.rows[0]);
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  getUserName,
  getPersonalDetails,
  addPersonalDetails,
};

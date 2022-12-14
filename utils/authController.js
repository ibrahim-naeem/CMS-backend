const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const getUserRoles = async (req, res) => {
  try {
    const userRoles = await pool.query("SELECT * FROM roles");
    res.status(200).json(userRoles.rows);
  } catch (error) {
    console.log(error);
    // res.status(5000).json(error);
  }
};

const registerUser = async (req, res) => {
  try {
    // 1. Destructure the request body
    const { username, email, role, password } = req.body;
    // 2. Check if the user does exists then throw error

    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);
    if (user.rows.length !== 0) {
      res.status(401).send("User already exist");
    }

    //3.Bcrypt user's password
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptPassword = await bcrypt.hash(password, salt);

    // 4. Enter a new user inside the database

    const newUser = await pool.query(
      `INSERT INTO users (user_name, user_email, user_password, user_role) VALUES ($1,$2,$3, $4) RETURNING *`,
      [username, email, bcryptPassword, role]
    );

    //Generate the JWT token
    let token = await jwtGenerator(newUser.rows[0].user_id);

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error!!");
  }
};

const loginUser = async (req, res) => {
  try {
    // 1. Destructure the request body
    const { email, password } = req.body;
    // 2. Check if the user does exists if not then throw error
    let user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);

    // if (user.rows.length === 0) {
    //   res.status(401).json(`No user found with this ${email} email!!`);
    // }

    //3.Check if the incoming password is same as database password

    let validPassword = await bcrypt.compare(
      password,
      user.rows[0].user_password
    );

    if (!validPassword) {
      res.status(401).json("Password or Email is incorrect");
    }

    //4. Generate the JWT token
    let token;
    if (user.rows.length !== 0) {
      token = await jwtGenerator(user.rows[0].user_id);
    }

    res.json(token);
  } catch (error) {
    console.error(error);
    // res.status(500).send("Server Error!!");
  }
};
module.exports = {
  getUserRoles,
  registerUser,
  loginUser,
};

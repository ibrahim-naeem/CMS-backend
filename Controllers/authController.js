const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");

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

    const director = await pool.query(
      "SELECT * FROM directors WHERE director_email = $1",
      [email]
    );
    if (director.rows.length !== 0) {
      res.status(401).send("director already exist");
    }

    const manager = await pool.query(
      "SELECT * FROM managers WHERE manager_email = $1",
      [email]
    );
    if (manager.rows.length !== 0) {
      res.status(401).send("manager already exist");
    }
    //3.Bcrypt user's password
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptPassword = await bcrypt.hash(password, salt);

    // 4. Enter a new user inside the database
    let newdirector;
    let newManager;
    let newEmployee;

    if (role == "director") {
      newdirector = await pool.query(
        `INSERT INTO directors (director_name, director_email, director_password) VALUES ($1,$2,$3) RETURNING *`,
        [username, email, bcryptPassword]
      );
    } else if (role == "manager") {
      newManager = await pool.query(
        `INSERT INTO managers (manager_name, manager_email, manager_password) VALUES ($1,$2,$3) RETURNING *`,
        [username, email, bcryptPassword]
      );
    } else if (role == "employee") {
      newEmployee = await pool.query(
        `INSERT INTO users (user_name, user_email, user_password) VALUES ($1,$2,$3) RETURNING *`,
        [username, email, bcryptPassword]
      );
    }
    //Generate the JWT token
    let token;
    if (newdirector) {
      token = await jwtGenerator(newdirector.rows[0].director_id);
    } else if (newManager) {
      token = await jwtGenerator(newManager.rows[0].manager_id);
    } else if (newEmployee) {
      token = await jwtGenerator(newEmployee.rows[0].user_id);
    }

    res.json({ token });
  } catch (error) {
    console.error(error);
    // res.status(500).send("Server Error!!");
  }
};

const loginUser = async (req, res) => {
  try {
    // 1. Destructure the request body
    const { email, password } = req.body;

    let user;
    let director;
    let manager;
    // 2. Check if the user does exists if not then throw error
    user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);
    if (user.rows.length === 0) {
      director = await pool.query(
        "SELECT * FROM directors WHERE director_email = $1",
        [email]
      );
      if (director.rows.length === 0) {
        manager = await pool.query(
          "SELECT * FROM managers WHERE manager_email = $1",
          [email]
        );
        if (manager.rows.length === 0) {
          res.status(401).json(`No user found with this ${email} email!!`);
        }
      }
    }

    //3.Check if the incoming password is same as database password

    let validPassword;

    if (user.rows.length !== 0) {
      validPassword = await bcrypt.compare(
        password,
        user.rows[0].user_password
      );
    } else if (director.rows.length !== 0) {
      validPassword = await bcrypt.compare(
        password,
        director.rows[0].director_password
      );
    } else if (manager.rows.length !== 0) {
      validPassword = await bcrypt.compare(
        password,
        manager.rows[0].manager_password
      );
    }

    if (!validPassword) {
      res.status(401).json("Password or Email is incorrect");
    }

    //4. Generate the JWT token
    let token;

    if (user.rows.length !== 0) {
      token = await jwtGenerator(user.rows[0].user_id);
    } else if (director.rows.length !== 0) {
      token = await jwtGenerator(director.rows[0].director_id);
    } else if (manager.rows.length !== 0) {
      token = await jwtGenerator(manager.rows[0].manager_id);
    }
    res.json(token);
  } catch (error) {
    console.error(error);
    // res.status(500).send("Server Error!!");
  }
};
module.exports = {
  registerUser,
  loginUser,
};

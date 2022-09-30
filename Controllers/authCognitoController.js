const pool = require("../db");
const bcrypt = require("bcrypt");
const AwsConfig = require("../AWS/Cognito/cognitoConfig");

const saveRegisterUserDataToDB = async (username, email, password, role) => {
  try {
    const user = await pool.query(
      "SELECT * FROM registeredUserDetails WHERE user_email = $1",
      [email]
    );
    if (user.rows.length !== 0) {
      res.json("User already exist");
    }

    //3.Bcrypt user's password
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptPassword = await bcrypt.hash(password, salt);

    // 4. Enter a new user inside the database
    const newUser = await pool.query(
      `INSERT INTO registeredUserDetails (user_name, user_email, user_password, user_role) VALUES ($1,$2,$3, $4) RETURNING *`,
      [username, email, bcryptPassword, role]
    );
  } catch (error) {
    console.log(error);
  }
};

const signUp = async (req, res) => {
  try {
    const { username, email, role, password } = req.body;

    agent = "none";
    AwsConfig.initAWS();
    AwsConfig.setCognitoAttributeList(email, agent);
    AwsConfig.getUserPool().signUp(
      email,
      password,
      AwsConfig.getCognitoAttributeList(),
      null,
      async (err, result) => {
        if (err) {
          return res.json(err);
        }
        await saveRegisterUserDataToDB(username, email, password, role);
        return res.status(201).json({
          username: result.user.getUsername(),
          userConfirmed: result.userConfirmed,
          message: `Verification Code sent on this ${result.user.getUsername()} email.`,
        });
      }
    );
  } catch (error) {
    console.log(error);
  }
};

const verify = async (req, res) => {
  try {
    const { email, verifiactionCode } = req.body;
    AwsConfig.getCognitoUser(email).confirmRegistration(
      verifiactionCode,
      true,
      (err, result) => {
        if (err) {
          return res.json({ statusCode: 422, response: err });
        }
        return res
          .status(200)
          .json({ message: "Email Verified", response: result });
      }
    );
  } catch (error) {
    console.log(error);
  }
};

const signIn = async (req, res) => {
  const { email, password } = req.body;

  console.log(email, password);

  try {
    let data = AwsConfig.getCognitoUser(email);
    AwsConfig.getCognitoUser(email).authenticateUser(
      AwsConfig.getAuthDetails(email, password),
      {
        onSuccess: async (result) => {
          const token = result.getAccessToken().getJwtToken();
          const uid = AwsConfig.decodeJWTToken(token);

          await saveVerifiedUserDataToDB(email, uid.user_uid);

          return res.status(200).json({
            uid,
            email: data.username,
            token,
          });
        },

        onFailure: (err) => {
          return res.json({
            statusCode: 400,
            response: err.message || JSON.stringify(err),
          });
        },
      }
    );
  } catch (error) {
    console.log(error);
  }
};

const saveVerifiedUserDataToDB = async (email, uid) => {
  // console.log(email)
  try {
    const user = await pool.query(
      "SELECT * FROM registeredUserDetails WHERE user_email = $1",
      [email]
    );
    if (user.rows.length !== 0) {
      const res = await user.rows[0];
      let username = res.user_name;
      let userEmail = res.user_email;
      let userPassword = res.user_password;
      let userRole = res.user_role;

      const checkUserInDB = await pool.query(
        "SELECT * FROM users WHERE user_email = $1",
        [email]
      );
      if (checkUserInDB.rows.length == 0) {
        const newUser = await pool.query(
          `INSERT INTO users (user_id, user_name, user_email, user_password, user_role) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
          [uid, username, userEmail, userPassword, userRole]
        );
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const signOut = async (req, res) => {
  const { email } = req.body;
  try {
    let data = AwsConfig.getCognitoUser(email);

    // res.json(data. .signOut());
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  signUp,
  verify,
  signIn,
  signOut,
};

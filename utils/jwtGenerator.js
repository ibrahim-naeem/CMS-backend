const jwt = require("jsonwebtoken");
require("dotenv").config();

function jwtGenerator(userID) {
  const payload = {
    user: userID,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "10h" });
}

module.exports = jwtGenerator;

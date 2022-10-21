const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
require("dotenv").config();

module.exports = async (req, res, next) => {
  try {
    const jwtToken = req.header("token");
    if (!jwtToken) {
      res.status(403).json("Not Authorized");
    } else {
      const data = jwt_decode(jwtToken);
      req.user = data.username;
      next();
    }
  } catch (error) {
    console.error(error);
    return res.status(403).json("Not Authorized");
  }
};

const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res, next) => {
  try {
    const jwtToken = req.header("token");
    if (!jwtToken) {
      res.status(403).json("Not Authorized");
    }

    jwt.verify(jwtToken, process.env.JWT_SECRET, (err, result) => {
      if (err) {
        return res.status(401).send({
          err: err,
          result: result,
        });
      } else {
        req.user = result.user;
        next();
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(403).json("Not Authorized");
  }
};

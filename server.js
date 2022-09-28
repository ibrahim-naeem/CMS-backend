const express = require("express");
const cors = require("cors");
const app = express();
const authJwt = require("./Router/jwtAuth");
const userData = require("./Router/userData");
const cognitoAuth = require("./Router/cognitoAuth");
require("dotenv").config();

const Port = process.env.PORT;
// app.use(express.static("pulib/uploads"));

//middleware
app.use(express.json());
app.use(cors());

//routes
app.use("/auth", authJwt);
app.use("/user", userData);

//Cognito
app.use("/cognito", cognitoAuth);

app.listen(Port, () => {
  console.log("Server is listening on ", Port);
});

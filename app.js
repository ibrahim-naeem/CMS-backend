const express = require("express");
const cors = require("cors");
// App Instance
const app = express();
// CONTROLLERS
const cognitoAuth = require("./Router/cognitoAuth");
const imageRouter = require("./Router/imagesRouter");
const userDetailsRouter = require("./Router/userDetailsRouter");
const skillRouter = require("./Router/skillsRouter");
const leaveRouter = require("./Router/leavesRouter");
const trainingRouter = require("./Router/trainingsRouter");
const fileRouter = require("./Router/filesRouter");

//MIDDLEWARES
app.use(express.json());
app.use(cors());

//ALL ROUTES START
//Cognito
app.use("/cognito", cognitoAuth);
//Image
app.use("/user", imageRouter);
// User Details
app.use("/user", userDetailsRouter);
// Skill
app.use("/user", skillRouter);
// Leave
app.use("/user", leaveRouter);
// Training
app.use("/user", trainingRouter);
// File
app.use("/user", fileRouter);

module.exports = app;



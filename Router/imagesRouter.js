const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

const {
  uploadImageToS3,
  getS3ImagePath,
  getImagePathFromDB,
} = require("../Controllers/ImagesController");

//IMAGE ROUTES ---##3---
router.post("/uploadImage", authorization, uploadImageToS3);
router.get("/getImagepath", authorization, getImagePathFromDB);
router.get("/getImage/:id", getS3ImagePath);

module.exports = router;

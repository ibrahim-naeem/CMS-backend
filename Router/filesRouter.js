const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

const {
  uploadFile,
  getFiles,
  deleteFiles,
  downloadFile,
} = require("../Controllers/fileController");

//POST file details in Database
// http://localhost:5000/user/uploadFile
router.post("/uploadFile", authorization, uploadFile);
router.get("/getFiles", authorization, getFiles);

// http://localhost:5000/user/deleteFiles/:id
router.delete("/deleteFiles/:id", authorization, deleteFiles);
router.get("/downloadFile/:id", authorization, downloadFile);

module.exports = router;

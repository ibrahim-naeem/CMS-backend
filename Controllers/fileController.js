const pool = require("../db");
const multer = require("multer");
const path = require("path");
const { uploadFileToS3 } = require("../AWS/S3/s3-fileUpload");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "Assets");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

var upload = multer({ storage: storage }).single("file");

// http://localhost:5000/user/uploadFile
const uploadFile = async (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }

    const filePath = `../${req.file.destination}/${req.file.filename}`;
    const fileType = req.file.mimetype;
    //upload file to S3
    const result = await uploadFileToS3(req.file);
    console.log(result, req.file);
    console.log(`/getFile/${result.Key}`);
    console.log(`/${req.user}/${result.Key}`);

    //db query
    const query = await pool.query(
      "INSERT INTO files (user_id, file_path, file_type) VALUES ($1, $2, $3)",
      // [req.user, `/getFile/${result.Key}`, fileType]
      [req.user, filePath, fileType]
    );

    return res.status(200).json({
      message: "File uploaded in Database successfully",
      filePath: `/${req.user}/${result.Key}`,
    });
  });
};

// http://localhost:5000/user/getFiles
const getFiles = async (req, res) => {
  try {
    const query = await pool.query("SELECT * FROM files WHERE user_id = $1", [
      req.user,
    ]);

    let files = query.rows;
    res.status(200).json(files);
    // console.log(files);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "No documents found..." });
  }
};

// http://localhost:5000/user/deleteFiles/:id
const deleteFiles = async (req, res) => {
  try {
    const { id } = req.params;
    const query = await pool.query("DELETE FROM files WHERE file_id  = $1", [
      id,
    ]);
    res
      .status(200)
      .json({ message: `fILE with id ${id} deleted successfully!!` });
  } catch (error) {
    console.error(error);
  }
};

const downloadFile = async (req, res) => {
  try {
    const { id } = req.params;
    const query = await pool.query("SELECT * FROM files WHERE file_id = $1", [
      id,
    ]);

    let fileName = query.rows[0].file_path;
    let file = path.join(__dirname, fileName);
    console.log(file);
    res.download(file, function (err) {
      console.log(err);
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = { uploadFile, getFiles, deleteFiles, downloadFile };

const pool = require("../db");
const multer = require("multer");
const { uploadImage, getImage } = require("../AWS/S3/s3-imageUpload");

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "Assets");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
let upload = multer({ storage: storage }).single("file");

//IMAGE ROUTES
const uploadImageToS3 = (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }

    //uploading to AWS S3
    const result = await uploadImage(req.file);

    console.log(result, req.file);
    //db query
    const imagePath = `../${req.file.destination}/${req.file.filename}`;
    const imageType = req.file.mimetype;
    let userExist;
    let existedImageID;

    const getUserID = await pool.query(
      "SELECT * FROM images WHERE user_id = $1",
      [req.user]
    );
    if (getUserID.rows.length !== 0) {
      userExist = true;
      existedImageID = getUserID.rows[0].image_id;
    }
    if (userExist) {
      const query = await pool.query(
        "UPDATE images SET image_path = $1, image_type = $2  WHERE image_id = $3",
        [`/getImage/${result.Key}`, imageType, existedImageID]
      );

      return res.status(200).json({
        message: "Image Updated successfully",
        imagePath: `/getImage/${result.Key}`,
      });
    } else {
      const query = await pool.query(
        "INSERT INTO images (user_id, image_path, image_type) VALUES ($1, $2, $3)",
        [req.user, `/getImage/${result.Key}`, imageType]
      );
      return res.status(200).json({
        message: "Added Image Successfully",
        imagePath: `/getImage/${result.Key}`,
      });
    }
  });
};

// /user/getImagepath
const getImagePathFromDB = async (req, res) => {
  try {
    const getImagePath = await pool.query(
      "SELECT image_path FROM images WHERE user_id = $1",
      [req.user]
    );

    res.status(200).json(getImagePath.rows[0]);
  } catch (error) {
    console.log(error);
  }
};

// /user/getImage/:id
//S3 get image route
const getS3ImagePath = (req, res) => {
  const key = req.params.id;
  if (key) {
    const readStream = getImage(key);
    readStream.pipe(res);
    // console.log("getS3ImagePath", readStream.pipe(res));
  }
};

module.exports = { uploadImageToS3, getImagePathFromDB, getS3ImagePath };

require("dotenv").config();
const fs = require("fs");
const S3 = require("aws-sdk/clients/s3");

// const cognito = require("aws-sdk/clients/cognitoidentityserviceprovider")

const bucketName = process.env.AWS_FILES_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

//upload image to s3

const uploadFileToS3 = (file) => {
  const fileStream = fs.createReadStream(file.path);

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename,
  };
  console.log(fileStream, uploadParams);
  return s3.upload(uploadParams).promise();
};

const getFileFromS3 = (fileKey) => {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName,
  };

  return s3.getObject(downloadParams).createReadStream();
};
module.exports = {
  uploadFileToS3,
  getFileFromS3,
};

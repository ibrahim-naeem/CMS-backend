require("dotenv").config();

const accessKeyId = process.env.AWS_RDS_KEY_ID;
const secretAccessKey = process.env.AWS_RDS_KEY;
const region = process.env.AWS_BUCKET_REGION;
const hostname = process.env.AWS_RDS_HOST_NAME;
const port = process.env.AWS_RDS_PORT;
const username = process.env.AWS_RDS_DB_USERNAME;
const database = process.env.AWS_RDS_DB_NAME;
const password = process.env.AWS_RDS_PASSWORD;

const Pool = require("pg").Pool;
const { RDS } = require("aws-sdk");

const signerOptions = {
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  region,
  hostname,
  port,
  username,
};

const signer = new RDS.Signer();
// const getPassword = () => signer.getAuthToken(signerOptions);

const pool = new Pool({
  host: signerOptions.hostname,
  port: signerOptions.port,
  user: signerOptions.username,
  database,
  password,
});

module.exports = pool;

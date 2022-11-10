const app = require('./app')

// ENVIROMENT VARIABLES
require("dotenv").config();

const Port = process.env.PORT;

app.listen(Port, () => {
    console.log("Server is listening on ", Port);
  });
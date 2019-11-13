const express = require("express");

const app = express();

const port = process.env.PORT || 5000;

//import DB connection method
require("./config/db");

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

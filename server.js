const express = require("express");

const app = express();

const port = process.env.PORT || 5000;

//import DB connection method
require("./config/db");

//Middleware
app.use(express.json());

//Route re-direction
app.use("/api/users", require("./routes/user"));

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

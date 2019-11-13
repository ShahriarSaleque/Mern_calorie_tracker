const mongoose = require("mongoose");
const config = require("config");

const conn_string = config.get("mongoURI");

//connect to the database
mongoose
  .connect(conn_string, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB is connected..."))
  .catch(err => console.log(err));

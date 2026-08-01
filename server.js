const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");

connectDB = require("./src/config/connectDB");

app.use(express.json());
app.use(cors());

connectDB();


app.get("/", (req, res) => {
  res.send("Welcome to the Blog API");
});


app.listen(process.env.Port, () => {
  console.log(`Server is running on port ${process.env.Port}`);
});




module.exports = app;
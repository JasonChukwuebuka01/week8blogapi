const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const blogRouter = require("./src/routes/blog.route");
const userRouter = require("./src/routes/user.routes");

connectDB = require("./src/config/connectDb");

app.use(express.json());
app.use(cors());

connectDB();

//routes
app.use("/api/blogs", blogRouter);
app.use("/api/users", userRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the Blog API");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

app.listen(process.env.Port, () => {
  console.log(`Server is running on port ${process.env.Port}`);
});

module.exports = app;

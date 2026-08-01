const Router = require("express").Router();
const validate = require("../middleware/validate.middleware");
const schema = require("../validations/postValidation.schema");


Router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});
const Router = require("express").Router();
const validate = require("../middleware/validate.middleware");
const { updatePostSchema, createPostSchema } = require("../validations/postValidation.schema");
const { createBlog, getBlogs, getBlogById, updateBlog, deleteBlog } = require("../controllers/blogController");


Router.get("/",  getBlogs);
Router.post("/", validate(createPostSchema), createBlog);
Router.get("/:id", getBlogById);
Router.put("/:id", validate(updatePostSchema), updateBlog);
Router.delete("/:id", deleteBlog);


module.exports = Router;
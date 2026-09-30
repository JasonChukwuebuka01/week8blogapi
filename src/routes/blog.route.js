const Router = require("express").Router();
const validate = require("../middleware/validate.middleware");
const { updatePostSchema, createPostSchema } = require("../validations/postValidation.schema");
const  protectAuth  = require("../middleware/protectAuth.middleware.js");
const { createBlog, getBlogs, getBlogById, updateBlog, deleteBlog } = require("../controllers/blogController");
const upload = require("../middleware/upload.middleware");

Router.get("/", protectAuth, getBlogs);
Router.post("/", validate(createPostSchema), protectAuth, upload.array("images", 5), createBlog);
Router.get("/:id", protectAuth, getBlogById);
Router.put("/:id", validate(updatePostSchema), protectAuth, upload.array("images", 5), updateBlog);
Router.delete("/:id", protectAuth, deleteBlog);



module.exports = Router;
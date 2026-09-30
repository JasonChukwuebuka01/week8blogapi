const Blog = require("../models/blogSchema");

//  CREATE -> Create a new blog
const createBlog = async (req, res, next) => {
  try {
    const { title, content } = req.body;


     const images = req.files ? req.files.map((file) => ({ url: file.path })) : [];

    const newBlog = await Blog.create({
      title,
      content,
      author: req.user.id,
      images
    });

    try {
      await newBlog.save();
    } catch (error) {
      next(error);
    }
    res.status(201).json(newBlog);
  } catch (error) {
    next(error);
  }
};

//  Get all blogs
const getBlogs = async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.q) {
      filter.$or = [
        { title: { $regex: req.query.q, $options: "i" } },
        { content: { $regex: req.query.q, $options: "i" } },
      ];
    }
    const blog = await Blog.find(filter).populate("author", "name email");
    res.status(200).json(blog);
  } catch (error) {
    next(error);
  }
};

// Get a single blog by ID
const getBlogById = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json(blog);
  } catch (error) {
    next(error);
  }
};




// Update a blog by ID
const updateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Extract author ID directly from the populated author object
    const authorId = blog.author._id
      ? blog.author._id.toString()
      : blog.author.toString();

    // Check ownership
    if (authorId !== req.user.id.toString()) {
      return res
        .status(403)
        .json({ message: "Forbidden: You can only update your own blogs" });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedBlog);
  } catch (error) {
    next(error);
  }
};

// Delete a blog by ID
const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Extract author ID directly from the populated author object
    const authorId = blog.author._id
      ? blog.author._id.toString()
      : blog.author.toString();

    // Check ownership
    if (authorId !== req.user.id.toString()) {
      return res
        .status(403)
        .json({ message: "Forbidden: You can only delete your own blogs" });
    }

    await blog.deleteOne();

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
};

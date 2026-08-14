const Blog = require("../models/blogSchema");





//  CREATE -> Create a new blog
const createBlog = async (req, res, next) => {
    try {
        const { title, content } = req.body;

        const newBlog = await Blog.create({
            title,
            content,
            author: req.user.id, 
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
        const blog = await Blog.find(filter);
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
        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedBlog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        res.status(200).json(updatedBlog);
    } catch (error) {
        next(error);
    }
};






// Delete a blog by ID
const deleteBlog = async (req, res, next) => {
    try {
        const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
        if (!deletedBlog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        res.status(200).json({ message: "Blog    deleted successfully" });
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
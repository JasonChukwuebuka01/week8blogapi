const Blog = require("../models/blogSchema");




//  CREATE -> Create a new post
const createPost = async (req, res, next) => {
    try {
        const newPost = await Blog.create(req.body);
        res.status(201).json(newPost);
    } catch (error) {
        next(error);
    }
};





//  Get all posts
const getPosts = async (req, res, next) => {
    try {
        const posts = await Blog.find();
        res.status(200).json(posts);
    } catch (error) {
        next(error);
    }
};





// Get a single post by ID
const getPostById = async (req, res, next) => {
    try {
        const post = await Blog.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json(post);
    } catch (error) {
        next(error);
    }
};








// Update a post by ID 
const updatePost = async (req, res, next) => {
    try {
        const updatedPost = await Blog.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedPost) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json(updatedPost);
    } catch (error) {
        next(error);
    }
};






// Delete a post by ID
const deletePost = async (req, res, next) => {
    try {
        const deletedPost = await Blog.findByIdAndDelete(req.params.id);
        if (!deletedPost) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost,
};
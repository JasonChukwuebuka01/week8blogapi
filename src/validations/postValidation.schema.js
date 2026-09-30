const Joi = require("joi");

const createPostSchema = Joi.object({
    title: Joi.string().trim().min(3).max(100).required().messages({
        "string.empty": "Title is required",
        "string.min": "Title should not be less than 3 characters",
        "string.max": "Title should not exceed 100 characters",
    }),
    content: Joi.string().min(10).required().messages({
        "string.empty": "Content is required",
        "string.min": "Content should not be less than 10 characters",
    }),
    images: Joi.array().items(Joi.string()).optional(),
});

const updatePostSchema = Joi.object({
    title: Joi.string().trim().min(3).max(100).messages({
        "string.min": "Title should not be less than 3 characters",
        "string.max": "Title should not exceed 100 characters",
    }),
    content: Joi.string().min(10).messages({
        "string.min": "Content should not be less than 10 characters",
    }),
    images: Joi.array().items(Joi.string()).optional(),
}).min(1).messages({
    "object.min": "Please provide at least one field to update",
});

module.exports = {
    createPostSchema,
    updatePostSchema,
};
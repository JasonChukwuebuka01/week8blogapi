const userSchema = require("../models/userSchema");

const profileAvaterController = async (req, res, next) => {

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Update the user's profile image URL in the database
    const email = req.user.email;
    const updatedUser = await userSchema.findOneAndUpdate(
     { email },
      { profileImage: req.file.path },
      { new: true },
    );

    if (!updatedUser) {
     return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "File uploaded successfully",
      file: req.file,
      user: updatedUser,
    });

  } catch (error) {
    next(error);
  }
};

module.exports = { profileAvaterController };

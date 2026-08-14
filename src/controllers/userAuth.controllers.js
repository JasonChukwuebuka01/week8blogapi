const User  = require("../models/userSchema");
const bcrypt = require("bcrypt");
const generateToken  = require("../utils/jwt.js");

const signUpController = async (req, res, next) => {
  const { name, email, password } = req.body;
  console.log("Received sign-up request:", req.body);

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const generatedSalt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, generatedSalt);

  try {
    const newUser = new User({
      name,
      email,
      password : hashedPassword
    });

    await newUser.save();

    res.status(201).json({ message: "User created successfully" });

  } catch (err) {
    next(err);
  }
};




const loginController = async (req, res, next) => {
  
 const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

     const resUser={
      id: user._id,
      name: user.name,
      email: user.email
     };

    const token = generateToken(user);
    res.status(200).json({ message: "Login successful", user: resUser, token });

  } catch (err) {
    next(err);
  }
};


module.exports = {
  signUpController,
  loginController
};
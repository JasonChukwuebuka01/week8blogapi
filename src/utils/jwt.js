const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    name: user.name,
  };
  const secretKey = process.env.JWT_SECRET;
  const options = {
    expiresIn: "7d",
  };

  return jwt.sign(payload, secretKey, options);
};

module.exports = generateToken;
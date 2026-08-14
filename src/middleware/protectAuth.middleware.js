const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

const protectAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

  
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
   
    const verifyUser = await User.findOne({ email: decoded.email });

    if (!verifyUser) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User no longer exists" });
    }

    // 3. Attach sanitized user to request object
    req.user = {
      id: verifyUser._id,
      name: verifyUser.name,
      email: verifyUser.email,
    };

    next();
  } catch (err) {
    // Catch JWT-specific errors cleanly
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    console.error("Auth Middleware Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = protectAuth;

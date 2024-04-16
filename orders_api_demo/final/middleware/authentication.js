const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");
const User = require("../db/AuthQuery");

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("No JWT token found in request headers");
    throw new UnauthenticatedError("Authentication Invalid");
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT token:", decoded);
    const [rows] = await User.selectUser(decoded.userId);
    if (!rows || rows.length === 0) {
      console.error("User not found in database");
      throw new UnauthenticatedError("User not found");
    }
    const user = rows[0];
    // Attach user information to request object
    req.user = {
      userId: user.id,
      name: user.name,
      role: user.role,
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    throw new UnauthenticatedError("Authentication Invalid");
  }
};

module.exports = auth;

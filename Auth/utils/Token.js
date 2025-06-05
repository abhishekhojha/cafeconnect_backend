const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
function generateToken(user) {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
    restaurant: user.restaurant,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
}

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
}

module.exports = { generateToken, verifyToken };

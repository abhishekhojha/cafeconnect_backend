const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
function generateRefreshToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
}

function verifyRefreshToken(refreshToken) {
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
}

module.exports = { generateRefreshToken, verifyRefreshToken };

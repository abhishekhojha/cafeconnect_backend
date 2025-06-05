const { generateToken, verifyToken } = require("./Token");
const { generateRefreshToken, verifyRefreshToken } = require("./RefreshToken");
module.exports = {
  generateToken,
  verifyToken,
  generateRefreshToken,
  verifyRefreshToken,
};

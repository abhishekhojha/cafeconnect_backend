const express = require("express");
const router = express.Router();
const {
  Login,
  Register,
  setPin,
  LogOut,
  changePassword,
} = require("./AuthController");
const { protect } = require("../middleware/Auth")
router.post("/login", Login);
router.post("/register", Register);
router.put("/setpin", setPin)
router.post("/logout", protect, LogOut)
router.put("/changepassword", protect, changePassword)
module.exports = router
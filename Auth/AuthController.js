const User = require("./User");
const { generateToken, generateRefreshToken } = require("./utils");

async function Login(req, res) {
  const { email, password, type } = req.body || {};
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and Password are required" });
    }
    const user = await User.findOne({ email }).select("+password +pin");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch =
      type != "pin"
        ? await user.comparePassword(password)
        : await user.comparePin(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Password" });
    }
    if (!user.isActive) {
      return res.status(403).json({ message: "User is not active" });
    }
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);
    user.refreshToken = refreshToken;
    await user.save();
    return res.status(200).json({
      message: "Login successful",
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        restaurant: user.restaurant,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function Register(req, res) {
  const { name, email, password } = req.body || {};
  try {
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, Email and Password are required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = new User({
      name,
      email,
      password,
    });
    await user.save();
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);
    user.refreshToken = refreshToken;
    await user.save();
    
    return res.status(201).json({
      message: "User registered successfully",
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        restaurant: user.restaurant,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function setPin(req, res) {
  const { pin } = req.body || {};
  const { id } = req.user || {};
  try {
    if (!pin) {
      return res.status(400).json({ message: "Pin is required" });
    }
    const user = User.findById(id).select("+pin");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.pin = pin;
    await user.save();
    return res.status(200).json({ message: "Pin set successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function changePassword(req, res) {
  const { oldPassword, newPassword } = req.body || {};
  const { id } = req.user || {};
  try {
    const user = await User.findById(id).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid old password" });
    }
    user.password = newPassword;
    await user.save();
    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function LogOut(req, res) {
  const { id } = req.user || {};
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.refreshToken = null;
    await user.save();
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  Login,
  Register,
  setPin,
  LogOut,
  changePassword,
};

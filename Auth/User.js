const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    role: {
      type: String,
      enum: ["super_admin", "admin", "cashier", "waiter"],
      default: "waiter",
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      default: null,
    },
    refreshToken: { type: String, default: null },
    isActive: { type: Boolean, default: true },
    pin: { type: String, default: null },
    img: { type: String, default: null },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

UserSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();
  bcrypt.hash(this.password, 10, (err, hash) => {
    if (err) return next(err);
    this.password = hash;
    next();
  });
});

UserSchema.pre("save", function (next) {
  if (!this.isModified("pin")) return next();
  bcrypt.hash(this.pin, 10, (err, hash) => {
    if (err) return next(err);
    this.pin = hash;
    next();
  });
});

UserSchema.methods.comparePassword = function (password) {
  return new Promise((resolve, rejected) => {
    bcrypt.compare(password, this.password, (err, isMatch) => {
      if (err) return rejected(err);
      resolve(isMatch);
    });
  });
};

UserSchema.methods.comparePin = function (pin) {
  return new Promise((resolve, rejected) => {
    bcrypt.compare(pin, this.pin, (err, isMatch) => {
      if (err) return rejected(err);
      resolve(isMatch);
    });
  });
};
const User = mongoose.model("User", UserSchema);
module.exports = User;

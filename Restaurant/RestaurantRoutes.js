const express = require("express");
const router = express.Router();
const {
  createRestaurant,
  getAllRestaurant,
  getRestaurantByID,
  updateRestaurant,
  deleteRestaurant,
} = require("./RestaurantController");
const { protect, roleProtect } = require("../middleware/Auth");

router.get("/", protect, roleProtect(["super_admin"]), getAllRestaurant);

router.post("/", protect, roleProtect(["super_admin"]), createRestaurant);

router.put(
  "/:id",
  protect,
  roleProtect(["admin", "super_admin"]),
  updateRestaurant
);

router.get(
  "/find/:id",
  protect,
  roleProtect(["admin", "super_admin"]),
  getRestaurantByID
);

router.delete(
  "/:id",
  protect,
  roleProtect(["admin", "super_admin"]),
  deleteRestaurant
);

module.exports = router;

const Restaurant = require("./Restaurant");
const { User } = require("../Auth");
async function createRestaurant(req, res) {
  try {
    const { name, address, contactInfo } = req.body || {};
    if (!name || !address || !contactInfo) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const newRestaurant = new Restaurant({
      name,
      address,
      contactInfo,
      createdBy: req.user.id,
    });
    await newRestaurant.save();
    return res
      .status(201)
      .json({ message: "Restaurant Created Successfully", data: newRestaurant });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "server error", error: error.message });
  }
}

async function getAllRestaurant(req, res) {
  try {
    let limit = parseInt(req.query.limit) || 10;
    let page = parseInt(req.query.page) || 1;
    let skip = (page - 1) * limit;
    let totalPage = await Restaurant.countDocuments();
    const restaurant = await Restaurant.find()
      .select("name")
      .populate("createdBy", "name email")
      .skip(skip)
      .limit(limit);
    res.status(200).json({
      data: restaurant,
      pagination: {
        page: page,
        pages: Math.ceil(totalPage),
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "server error", error: error.message });
  }
}

async function getRestaurantByID(req, res) {
  try {
    const id = req.params.id || null;
    const restaurant = await Restaurant.findById(id).populate(
      "createdBy",
      "name email"
    );
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    return res.status(200).json({
      data: restaurant,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "server error", error: error.message });
  }
}

async function updateRestaurant() {
  try {
    const restaurant_id = req.params.id || null;
    const updates = req.body || {};
    if (restaurant_id) {
      return res.status(404).json({ message: "Restaurant required" });
    }
    const restaurant = await Restaurant.findByIdAndUpdate(
      restaurant_id,
      updates,
      { new: true, runValidators: true }
    );
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    return res.status(200).json({ message: "Restaurant updated", restaurant });
  } catch (error) {
    if(error.name == "ValidationError"){
        return res.status(400).json({ 
        message: "Validation failed",
        errors: Object.values(error.errors).map(err => err.message) 
      });
    }
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
}

async function deleteRestaurant(req, res) {
  try {
    const restaurant = await Restaurant.findById(req.params.id || null);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    await restaurant.deleteOne();
    return res.status(200).json({ message: "Restaurant deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
}

module.exports = {
  createRestaurant,
  getAllRestaurant,
  getRestaurantByID,
  updateRestaurant,
  deleteRestaurant
}
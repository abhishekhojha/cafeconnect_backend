const express = require("express");
const dotenv = require("dotenv");
// const routes = require('./routes');
require("./db/db");

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Routes
const { AuthRoutes } = require("./Auth");
app.use("/auth", AuthRoutes);

const RestaurantRoutes = require("./Restaurant/RestaurantRoutes");
app.use("/restaurant", RestaurantRoutes);

app.use("/", (req, res) => {
  return res.send("Welcome to the API");
});


// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

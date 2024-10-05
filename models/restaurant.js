const mongoose = require("mongoose");

const menuItem = new mongoose.Schema(
  {
    category: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    available: { type: Boolean, required: true },
  },
  { _id: true }
);

const Restaurant = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  menu: {
    starters: [menuItem],
    mainCourse: [menuItem],
    beverages: [menuItem],
  },
});

const restaurant = mongoose.model("Restaurant", Restaurant);
const menu = mongoose.model("Menu", menuItem);
module.exports = { restaurant, menu };

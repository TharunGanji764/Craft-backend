const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  items: [
    {
      menuItem: { type: mongoose.Schema.Types.ObjectId, ref: "Menu" },
      quantity: { type: Number, required: true },
    },
  ],
  deliveryAddress: { type: String, required: true },
  totalCost: { type: Number, required: true },
  status: {
    type: String,
    enum: [
      "Pending",
      "Confirmed",
      "In Progress",
      "Out for Delivery",
      "Delivered",
    ],
    default: "Pending",
  },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Order", orderSchema);

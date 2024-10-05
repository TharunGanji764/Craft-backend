const Order = require("../models/order");
const { restaurant, menu } = require("../models/restaurant");
const express = require("express");
const app = express();
const socketIo = require("socket.io");
const http = require("http");
const server = http.createServer(app);
const io = socketIo(server);
const placeOrder = async (req, res) => {
  try {
    const { id } = req;
    const { restaurantId, items, deliveryAddress } = req.body;
    const getRestaurant = await restaurant.findById(restaurantId);
    console.log(getRestaurant);
    if (!getRestaurant) {
      return res.status(400).json({ error: "Restaurant not found" });
    }

    let total_cost = 0;
    const orderItems = [];

    for (const each of items) {
      let foundItem = null;

      foundItem = getRestaurant.menu.starters.find((item) =>
        item._id.equals(each.menuItem)
      );
      if (!foundItem) {
        foundItem = getRestaurant.menu.mainCourse.find((item) =>
          item._id.equals(each.menuItem)
        );
      }
      if (!foundItem) {
        foundItem = getRestaurant.menu.beverages.find((item) =>
          item._id.equals(each.menuItem)
        );
      }

      if (!foundItem) {
        return res
          .status(404)
          .json({ error: `Menu item not found for ID: ${each.menuItem}` });
      }

      total_cost += foundItem.price * each.quantity;
      orderItems.push({
        menuItem: foundItem._id,
        quantity: each.quantity,
      });
    }
    const newOrder = new Order({
      user: id,
      restaurantId: restaurantId,
      items: orderItems,
      deliveryAddress,
      totalCost: total_cost,
    });
    const result = await newOrder.save();
    return res.status(200).json({
      message: "Order Placed Successfully",
      order: result,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    const orderDetails = await Order.findById(orderId);
    if (!orderDetails) {
      return res.status(400).json({ error: "Order not found" });
    }
    return res.status(200).json(orderDetails);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const getOrderData = await Order.findById(orderId);
    if (!getOrderData) {
      return res.status(400).json({ error: "Order not found" });
    }
    getOrderData.status = status;
    await getOrderData.save();
    return res.status(200).json({ message: "Status Updated Successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    if (!orders) {
      return res.status(400).json({ message: "No orders Found" });
    }
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const trackOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const orderData = await Order.findById(orderId).populate("items");
    if (!orderData) {
      return res.status(400).json({ error: "Order not found" });
    }
    const restaurantName = await restaurant.findById(orderData.restaurantId);
    return res.status(200).json({
      orderId: orderData._id,
      status: orderData.status,
      restaurant: restaurantName.name,
      items: orderData.items,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const realTimeUpdate = async (req, res) => {
  const { status } = req.body;
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status },
      { new: true }
    );

    io.emit("orderStatus", { orderId: order._id, status: order.status });
    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  placeOrder,
  getOrderDetails,
  updateOrderStatus,
  getAllOrders,
  trackOrder,
  realTimeUpdate,
};

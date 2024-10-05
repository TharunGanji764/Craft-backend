const orderController = require("../controllers/orderController");
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authenticate");

router.post("/orders", auth, orderController.placeOrder);
router.get("/orders/:orderId", auth, orderController.getOrderDetails);
router.put("/orders/:orderId/status", auth, orderController.updateOrderStatus);
router.get("/orders", auth, orderController.getAllOrders);
router.get("/orders/:orderId/track", auth, orderController.trackOrder);
router.put("/orders/:orderId/track", auth, orderController.realTimeUpdate);
module.exports = router;

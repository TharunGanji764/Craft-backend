const express = require("express");
const cors = require("cors");
const app = express();
const socketIo = require("socket.io");
const http = require("http");
require("dotenv").config();
const connectDb = require("./config/db");

port = process.env.PORT;

app.use(express.json());
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server);

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("orderStatus", (orderId) => {
    console.log(`Tracking order: ${orderId}`);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

const userRoutes = require("./routes/userRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const orderRoutes = require("./routes/orderRoutes");

app.use("/user", userRoutes);
app.use(restaurantRoutes);
app.use(orderRoutes);

connectDb();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

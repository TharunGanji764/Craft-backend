const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middlewares/authenticate");

//User Routes
router.post("/register", userController.Register);
router.post("/login", userController.Login);
router.get("/profile", auth, userController.getProfile);
router.put("/profile", auth, userController.updateProfile);

module.exports = router;

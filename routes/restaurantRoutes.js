const espress = require("express");
const restaurantController = require("../controllers/restaurantController");
const router = espress.Router();

router.post("/restaurants", restaurantController.addRestaurant);
router.post("/restaurants/:restaurantId/menu", restaurantController.addMenu);
router.put("/restaurants/:restaurantId", restaurantController.updateRestaurant);
router.put(
  "/restaurants/:restaurantId/menu/:itemId",
  restaurantController.updateMenuItem
);

module.exports = router;

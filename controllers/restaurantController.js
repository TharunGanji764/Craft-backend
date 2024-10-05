const { restaurant, menu } = require("../models/restaurant");

const addRestaurant = async (req, res) => {
  try {
    const { name, location } = req.body;
    const newRestaurant = new restaurant({ name, location });
    await newRestaurant.save();
    return res.status(200).json(newRestaurant);
  } catch (err) {
    return res.status(500).json(err);
  }
};
const updateRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { name, location } = req.body;
    const getRestaurant = await restaurant.findById(restaurantId);
    if (!getRestaurant) {
      return res.status(400).json("Restaurant does not exist");
    }
    if (name) {
      getRestaurant.name = name;
    }
    if (location) {
      getRestaurant.location = location;
    }
    await getRestaurant.save();
    return res.status(200).json("Restaurant Updated Successfully");
  } catch (err) {
    return res.status(500).json(err);
  }
};

const addMenu = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { name, description, price, available, category } = req.body;
    const restaurantExist = await restaurant.findById(restaurantId);
    if (!restaurantExist) {
      return res.status(400).json("Restaurant does not exist");
    }
    const newMenu = { name, description, price, available, category };
    if (category === "starters") {
      restaurantExist.menu.starters.push(newMenu);
    } else if (category === "mainCourse") {
      restaurantExist.menu.mainCourse.push(newMenu);
    } else if (category === "beverages") {
      restaurantExist.menu.beverages.push(newMenu);
    } else {
      res.status(400).json("Invalid Category");
    }
    const addMenuToMenu = new menu({
      name,
      description,
      price,
      available,
      category,
    });
    await addMenuToMenu.save();
    await restaurantExist.save();
    return res.status(200).json("Menu Added Successfully");
  } catch (err) {
    return res.status(500).json(err);
  }
};

const updateMenuItem = async (req, res) => {
  try {
    const { restaurantId, itemId } = req.params;
    const { name, category, price, available, description } = req.body;
    const getRestaurant = await restaurant.findById(restaurantId);
    if (!getRestaurant) {
      return res.status(400).json("Restaurant does not exist");
    }

    let menuItem;
    if (category === "starters") {
      menuItem = getRestaurant.menu.starters.find(
        (each) => each._id.toString() === itemId
      );
    } else if (category === "mainCourse") {
      menuItem = getRestaurant.menu.mainCourse.find(
        (each) => each._id.toString() === itemId
      );
    } else if (category === "beverages") {
      menuItem = getRestaurant.menu.beverages.find(
        (each) => each._id.toString() === itemId
      );
    } else {
      return res.status(400).json({ message: "Invalid category" });
    }
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    menuItem.name = name || menuItem.name;
    menuItem.description = description || menuItem.description;
    menuItem.price = price || menuItem.price;
    menuItem.available =
      available !== undefined ? available : menuItem.available;

    await getRestaurant.save();
    return res.status(200).json(menuItem);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  addRestaurant,
  addMenu,
  updateRestaurant,
  updateMenuItem,
};

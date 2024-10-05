const jwtToken = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const user = require("../models/user");
const secretkey = process.env.SECRETE_TOKEN;

const Register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExist = await user.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new user({ name, email, password: hashedPassword });
    await newUser.save();
    return res.status(200).json({ message: "User created successfully" });
  } catch (err) {
    return res.status(500).json(err);
  }
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExist = await user.findOne({ email });
    if (!userExist) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const isMatch = await bcrypt.compare(password, userExist.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Password" });
    }
    const payload = {
      userId: userExist._id,
    };
    const token = jwtToken.sign(payload, secretkey);
    return res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    return res.status(500).json(err);
  }
};

const getProfile = async (req, res) => {
  try {
    const { id } = req;
    const getUserDetails = await user.findById(id);
    return res.status(200).json(getUserDetails);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const updateProfile = async (req, res) => {
  try {
    const { id } = req;
    const { name, email, password } = req.body;
    const userExist = await user.findById(id);
    if (!userExist) {
      return res.status(400).json({ message: "User does not exist" });
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      userExist.password = hashedPassword;
      await userExist.save();
      return res.status(200).json({ message: "Password updated successfully" });
    }
    if (name) {
      userExist.name = name;
      await userExist.save();
      return res.status(200).json({ message: "Name updated successfully" });
    }
    if (email) {
      userExist.email = email;
      await userExist.save();
      return res.status(200).json({ message: "Email updated successfully" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};
module.exports = { Register, Login, getProfile, updateProfile };

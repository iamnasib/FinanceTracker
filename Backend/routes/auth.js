const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env.local") });
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const express = require("express");
const router = express.Router();
const {
  createDefaultAccounts,
  createDefaultCategories,
} = require("../utils/defaultData");
const fetchUser = require("../middleware/fetchUser");

//PARENT ROUTE -> /api/auth

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }
    //Convert the password to hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user = new User({
      name: name,
      email: email,
      password: hashedPassword,
    });
    await user.save();
    await createDefaultAccounts(user._id);
    await createDefaultCategories(user._id);

    //generate JWT authToken for the user
    const authToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    //return 201 response with authToken
    return res.status(201).json({ authToken });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ error: "Invalid Credentials" });
    }

    //compare the hashed password to the passwrd string using bcrypt.compare
    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect) {
      return res.status(400).json({ error: "Invalid Credentials" });
    }

    //generate JWT authToken for the user
    const authToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    //return 200 response with authToken
    return res.status(200).json({ authToken });
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

// get-user api call with fetchUser middelware to check if the authToken is valid and then check if the user is present in our Database
router.get("/get-user", fetchUser, async (req, res) => {
  try {
    const userId = req.user; //getting the user Id that we set in the fetchUser Middleware
    let user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(400).json({ error: "Invalid Credentials" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

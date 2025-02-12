const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env.local") });
const express = require("express");
const Category = require("../models/Category");
const fetchUser = require("../middleware/fetchUser");
const router = express.Router();

//PARENT ROUTE -> /api/category

router.post("/create", fetchUser, async (req, res) => {
  try {
    const { name, type } = req.body;
    let category = new Category({
      user: req.user,
      name,
      type,
    });
    // Validate the  category
    await category.validate();

    // Save the category if validation passes
    await category.save();
    return res.status(201).json({ category });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/get/:id", fetchUser, async (req, res) => {
  try {
    const categoryId = req.params.id;
    let category = await Category.findById(categoryId); //find the category using id passed in the url parameter

    // return Not Found status if category is not found
    if (!category) {
      return res.status(404).json({ error: "Not found" });
    }

    // return success response with the category that is found
    return res.status(200).json({ category });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/get", fetchUser, async (req, res) => {
  try {
    let categories = await Category.find({ user: req.user }); //getting the user Id that we set in the fetchUser Middleware

    // return success response with the categories that are found for the authenticated user
    return res.status(200).json({ categories });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/update/:id", fetchUser, async (req, res) => {
  try {
    const categoryId = req.params.id;
    let category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: "Not found" });
    }
    if (category.user.toString() !== req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { name, type } = req.body;

    // Update the category fields
    if (name) {
      category.name = name;
    }
    if (type) {
      category.type = type;
    }

    // Validate the updated category
    await category.validate();

    // Save the category if validation passes
    await category.save();

    // return success response with the updated category
    return res.status(200).json({ category });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/delete/:id", fetchUser, async (req, res) => {
  try {
    const categoryId = req.params.id;
    let category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: "Not found" });
    }

    //return Unauthorized if the Authenticated user is not the owner of the category
    if (category.user.toString() !== req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Delete the category
    await category.deleteOne();

    return res.status(200).json({ success: "Category Deleted" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

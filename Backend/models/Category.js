const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["Income", "Expense"],
    required: true,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
  archive: {
    type: Boolean,
    default: false,
  },
});

const Category = mongoose.model("category", CategorySchema);
module.exports = Category;

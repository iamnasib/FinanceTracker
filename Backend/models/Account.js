const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema({
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
    enum: ["Cash", "Bank", "Credit Card", "Digital Wallet"],
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
});

const Account = mongoose.model("account", AccountSchema);
module.exports = Account;

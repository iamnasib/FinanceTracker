const Account = require("../models/Account");
const Category = require("../models/Category");

const createDefaultAccounts = async (userId) => {
  const defaultAccounts = [
    { user: userId, name: "Cash", type: "Cash" },
    { user: userId, name: "Bank Account", type: "Bank" },
  ];

  await Account.insertMany(defaultAccounts);
};

const createDefaultCategories = async (userId) => {
  const defaultCategories = [
    { user: userId, name: "Salary", type: "Income" },
    { user: userId, name: "Rent", type: "Expense" },
    { user: userId, name: "Bills", type: "Expense" },
  ];

  await Category.insertMany(defaultCategories);
};

module.exports = { createDefaultAccounts, createDefaultCategories };

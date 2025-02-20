const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env.local") });
const express = require("express");
const Transaction = require("../models/Transaction");
const Account = require("../models/Account");
const Category = require("../models/Category");
const fetchUser = require("../middleware/fetchUser");
const router = express.Router();

//PARENT ROUTE -> /api/transaction

router.post("/create", fetchUser, async (req, res) => {
  try {
    const { type, fromAccount, toAccount, description, amount, category } =
      req.body;

    // Validate amount
    if (amount <= 0) {
      return res
        .status(400)
        .json({ error: "Amount must be a positive number" });
    }
    let transaction = new Transaction({
      user: req.user,
      type,
      fromAccount,
      toAccount,
      description,
      amount,
      category,
    });
    // Validate the  transaction
    await transaction.validate();

    // Fetch account details
    const fromAccountDetails = fromAccount
      ? await Account.findById(fromAccount)
      : null;
    const toAccountDetails = toAccount
      ? await Account.findById(toAccount)
      : null;

    // Logic for the transaction of type Transfer
    if (type === "Transfer") {
      if (!fromAccount || !toAccount) {
        return res.status(400).json({
          error: "Both Accounts are required for Transfer transactions",
        });
      }

      //get accounts and check if they exist and belong to the user and have sufficient balance

      if (!fromAccountDetails || !toAccountDetails) {
        return res.status(404).json({ error: "Account not found" });
      }
      if (
        fromAccountDetails.user.toString() !== req.user ||
        toAccountDetails.user.toString() !== req.user
      ) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      if (fromAccountDetails.balance < amount) {
        return res.status(400).json({ error: "Insufficient balance" });
      }

      // Deduct the amount from the fromAccount and add it to the toAccount
      fromAccountDetails.balance -= amount;
      toAccountDetails.balance += amount;
      await fromAccountDetails.save();
      await toAccountDetails.save();
    }
    // Logic for the transaction of type Expense
    else if (type === "Expense") {
      if (!fromAccount) {
        return res.status(400).json({
          error: "Account is required",
        });
      }
      if (!fromAccountDetails) {
        return res.status(404).json({ error: "Account not found" });
      }
      if (fromAccountDetails.user.toString() !== req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      if (fromAccountDetails.balance < amount) {
        return res.status(400).json({ error: "Insufficient balance" });
      }
      fromAccountDetails.balance -= amount;
      await fromAccountDetails.save();
    }
    // Logic for the transaction of type Income
    else if (type === "Income") {
      if (!fromAccount) {
        return res.status(400).json({
          error: "Account is required",
        });
      }
      if (!fromAccountDetails) {
        return res.status(404).json({ error: "Account not found" });
      }
      if (fromAccountDetails.user.toString() !== req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      fromAccountDetails.balance += amount;
      await fromAccountDetails.save();
    }
    // Save the transaction if validation passes
    await transaction.save();
    return res.status(201).json({ transaction });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/get/:id", fetchUser, async (req, res) => {
  try {
    const transactionsId = req.params.id;
    let transaction = await Transaction.findById(transactionsId); //find the transaction using id passed in the url parameter

    // return Not Found status if transaction is not found
    if (!transaction) {
      return res.status(404).json({ error: "Not found" });
    }

    // return success response with the transaction that is found
    return res.status(200).json({ transaction });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/get", fetchUser, async (req, res) => {
  try {
    let transactions = await Transaction.find({ user: req.user }); //getting the user Id that we set in the fetchUser Middleware

    // return success response with the transactions that are found for the authenticated user
    return res.status(200).json({ transactions });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/delete/:id", fetchUser, async (req, res) => {
  try {
    const transactionId = req.params.id;
    let transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      return res.status(404).json({ error: "Not found" });
    }

    //return Unauthorized if the Authenticated user is not the owner of the transaction
    if (transaction.user.toString() !== req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Fetch account details
    const fromAccountDetails =
      (await Account.findById(transaction.fromAccount)) || null;

    const toAccountDetails =
      (await Account.findById(transaction.toAccount)) || null;

    const type = transaction.type; //transaction type

    // Logic for the transaction of type Transfer
    if (type === "Transfer") {
      //get accounts and check if they exist and belong to the user

      if (!fromAccountDetails || !toAccountDetails) {
        return res.status(404).json({ error: "Account not found" });
      }
      if (
        fromAccountDetails.user.toString() !== req.user ||
        toAccountDetails.user.toString() !== req.user
      ) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Revert back  the amount that was transferred between the accounts
      fromAccountDetails.balance += transaction.amount;
      toAccountDetails.balance -= transaction.amount;
      await fromAccountDetails.save();
      await toAccountDetails.save();
    }
    // Logic for the transaction of type Expense
    else if (type === "Expense") {
      if (!fromAccountDetails) {
        return res.status(404).json({ error: "Account not found" });
      }
      if (fromAccountDetails.user.toString() !== req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // add the amount back to the account from which it was deducted
      fromAccountDetails.balance += transaction.amount;
      await fromAccountDetails.save();
    }
    // Logic for the transaction of type Income
    else if (type === "Income") {
      if (!fromAccount) {
        return res.status(400).json({
          error: "Account is required",
        });
      }
      if (!fromAccountDetails) {
        return res.status(404).json({ error: "Account not found" });
      }
      if (fromAccountDetails.user.toString() !== req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // deduct the amount from the account to which it was added
      fromAccountDetails.balance -= transaction.amount;
      await fromAccountDetails.save();
    }

    // Delete the transaction
    await transaction.deleteOne();

    return res.status(200).json({ success: "Transaction Deleted" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

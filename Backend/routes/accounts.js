const path = require("path");
require("dotenv").config({path: path.resolve(__dirname, ".env.local")});
const express = require("express");
const Account = require("../models/Account");
const fetchUser = require("../middleware/fetchUser");
const router = express.Router();

//PARENT ROUTE -> /api/account

router.post("/create", fetchUser, async (req, res) => {
  try {
    const {name, type, balance} = req.body;
    let account = new Account({
      user: req.user,
      name,
      type,
      balance,
    });
    // Validate the account
    await account.validate();

    // Save the account if validation passes
    await account.save();
    return res.status(201).json({account});
  } catch (error) {
    return res.status(500).json({error: "Internal server error"});
  }
});

router.get("/get/:id", fetchUser, async (req, res) => {
  try {
    const accountId = req.params.id;
    let account = await Account.findById(accountId); //find the account using id passed in the url parameter

    // return Not Found status if account is not found
    if (!account) {
      return res.status(404).json({error: "Not found"});
    }

    // return success response with the account that is found
    return res.status(200).json({account});
  } catch (error) {
    return res.status(500).json({error: "Internal server error"});
  }
});

router.get("/get", fetchUser, async (req, res) => {
  try {
    const isArchived = req.query.archived === "true";

    let accounts = await Account.find({
      user: req.user,
      archive: isArchived, // Use the converted boolean value
    });
    // return success response with the accounts that are found for the authenticated user
    return res.status(200).json({accounts});
  } catch (error) {
    return res.status(500).json({error: "Internal server error"});
  }
});

router.patch("/update/:id", fetchUser, async (req, res) => {
  try {
    const accountId = req.params.id;
    let account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({error: "Not found"});
    }
    if (account.user.toString() !== req.user) {
      return res.status(401).json({error: "Unauthorized"});
    }
    const {name, type, balance} = req.body;

    // Update the account fields
    if (name) {
      account.name = name;
    }
    if (type) {
      account.type = type;
    }
    if (balance !== undefined) {
      account.balance = balance;
    }

    // Validate the updated account
    await account.validate();

    // Save the account if validation passes
    await account.save();

    // return success response with the updated account
    return res.status(200).json({account});
  } catch (error) {
    return res.status(500).json({error: "Internal server error"});
  }
});
router.patch("/archive/:id", fetchUser, async (req, res) => {
  try {
    const accountId = req.params.id;
    let account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({error: "Not found"});
    }
    if (account.user.toString() !== req.user) {
      return res.status(401).json({error: "Unauthorized"});
    }

    account.archive = !account.archive; // Toggle the archive status

    // Validate the updated account
    await account.validate();

    // Save the account if validation passes
    await account.save();

    // return success response with the updated account
    return res.status(200).json({account});
  } catch (error) {
    return res.status(500).json({error: "Internal server error"});
  }
});

router.delete("/delete/:id", fetchUser, async (req, res) => {
  try {
    const accountId = req.params.id;
    let account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({error: "Not found"});
    }

    //return Unauthorized if the Authenticated user is not the owner of the account
    if (account.user.toString() !== req.user) {
      return res.status(401).json({error: "Unauthorized"});
    }

    // Delete the account
    await account.deleteOne();

    return res.status(200).json({success: "Account Deleted"});
  } catch (error) {
    return res.status(500).json({error: "Internal server error"});
  }
});

module.exports = router;

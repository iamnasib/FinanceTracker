const mongoose = require("mongoose");
const dbURI =
  process.env.NODE_ENV === "production"
    ? process.env.DB_URI_PROD
    : process.env.DB_URI_DEV;
const connectDB = async () => {
  await mongoose.connect(dbURI);
  console.log("connected to Mongo DB");
};
module.exports = connectDB;

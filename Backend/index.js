const path = require("path");
require("dotenv").config({path: path.resolve(__dirname, ".env.local")});
const express = require("express");
const connectDB = require("./db");
let cors = require("cors");
const startServer = async () => {
  try {
    await connectDB();
    const app = express();
    const port = 5000;
    app.use(express.json());
    app.use(cors());

    app.use("/api/auth", require("./routes/auth"));
    app.use("/api/account", require("./routes/accounts"));
    app.use("/api/category", require("./routes/category"));
    app.use("/api/transaction", require("./routes/transaction"));

    app.listen(port, "0.0.0.0", () => {
      console.log(`Finance Tracking listening on ${port}`);
    });
  } catch (error) {
    console.error("Failed to start the server", error);
    process.exit();
  }
};
startServer();

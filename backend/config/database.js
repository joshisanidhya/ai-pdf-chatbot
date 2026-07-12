/**
 * MongoDB Database Connection
 */

const mongoose = require("mongoose");
const logger = require("../utils/logger");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    logger.info(`✅ MongoDB connected: ${conn.connection.host}`);

    mongoose.connection.on("disconnected", () => {
      logger.warn("⚠️ MongoDB disconnected");
    });

    mongoose.connection.on("reconnected", () => {
      logger.info("✅ MongoDB reconnected");
    });

    mongoose.connection.on("error", (err) => {
      logger.error("MongoDB runtime error:");
      console.error(err);
    });

  } catch (err) {

    logger.error("❌ MongoDB connection failed");
    console.error(err);

    console.error("Name:", err.name);
    console.error("Message:", err.message);
    console.error("Code:", err.code);

    if (process.env.NODE_ENV === "development") {
      logger.info("Retrying MongoDB connection in 5 seconds...");
      setTimeout(connectDB, 5000);
    } else {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
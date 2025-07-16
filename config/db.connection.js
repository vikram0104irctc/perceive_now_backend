import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import logger from "../logger/logger.js";

const URI = process.env.MONGO_URI;

if (!URI) {
  throw new Error("MONGO_URI environment variable is not defined");
}

// MongoDB connection options for production
const connectionOptions = {
  maxPoolSize: 10, // Maximum number of sockets in the connection pool
  serverSelectionTimeoutMS: 5000, // Timeout for server selection
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
  heartbeatFrequencyMS: 10000, // How often to check connection status
  retryWrites: true,
  retryReads: true,
};

// Connection event handlers
mongoose.connection.on("connected", () => {
  logger.info(`MongoDB connected to ${mongoose.connection.db?.databaseName}`);
});

mongoose.connection.on("error", (err) => {
  logger.error("MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  logger.warn("MongoDB disconnected");
});

// Graceful shutdown handler
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  logger.info("MongoDB connection closed due to application termination");
  process.exit(0);
});

export async function connectToDatabase() {
  try {
    if (mongoose.connection.readyState === 1) {
      logger.info("Using existing MongoDB connection");
      return mongoose;
    }

    logger.info("Establishing new MongoDB connection...");
    const connection = await mongoose.connect(URI, connectionOptions);
    logger.info("MongoDB connection established successfully");
    return connection;
  } catch (error) {
    logger.error("Failed to connect to MongoDB:", error);
    throw error;
  }
}

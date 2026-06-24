import mongoose from "mongoose";
import dns from "dns";
import ora from "ora";
import { ENV } from "./env.js";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

export const connectDB = async () => {
  if (!ENV.MONGODB_URI) {
    console.warn(
      "⚠️  MONGODB_URI is not defined. Skipping MongoDB connection."
    );
    return;
  }

  const spinner = ora("Connecting to MongoDB Atlas...").start();

  try {
    const conn = await mongoose.connect(ENV.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    spinner.succeed(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    spinner.fail(`MongoDB Connection Error: ${error.message}`);
    console.warn(
      "⚠️  The server will continue running without MongoDB. Fix your MONGODB_URI in .env to connect Atlas."
    );
  }
};

mongoose.connection.on("disconnected", () => {
  ora().warn("MongoDB disconnected");
});

mongoose.connection.on("reconnected", () => {
  ora().succeed("MongoDB reconnected");
});
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const url = "mongodb://mongo/ESP-back"; 

export const dbConnection = async (): Promise<void> => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions);

    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Error connecting to database:", error);
    throw new Error("Error connecting to database");
  }
};

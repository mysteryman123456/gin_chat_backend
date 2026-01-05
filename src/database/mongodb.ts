import mongoose from "mongoose";
import { MONGO_URI } from "../config";

export async function connectToDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Database Connected successfully");
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
}

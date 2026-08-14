import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);

    console.log("✅ MongoDB Connected");

    console.log("Connected DB:", mongoose.connection.db.databaseName);
  } catch (error) {
    console.log("❌ MongoDB Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;

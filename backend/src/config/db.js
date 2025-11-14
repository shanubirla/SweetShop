const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      console.error("Missing MONGO_URI");
      return;
    }
    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB error:", err);
    if (process.env.NODE_ENV !== "test") process.exit(1);
  }
};

module.exports = connectDB;

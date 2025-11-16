const mongoose = require("mongoose");

const uri = "mongodb+srv://ershivamsharma0402_db_user:44W8rcNGxmZCEHjj@cluster0.aydkjjk.mongodb.net/?appName=Cluster0";

async function connectDB() {
  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB connected successfully!");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
  }
}

module.exports = connectDB;

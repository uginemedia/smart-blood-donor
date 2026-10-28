const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // await mongoose.connect(process.env.MONGO_URI);
    await mongoose.connect(
      `mongodb+srv://codingweb656_db_user:Z9aYEXXnkeDHjyQI@cluster0.vwmxnzu.mongodb.net/`,
    );

    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ Database Connection Failed");
    console.error(error.message);

    process.exit(1);
  }
};

module.exports = connectDB;

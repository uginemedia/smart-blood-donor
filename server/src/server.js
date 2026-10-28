const app = require("./app");
const PORT = process.env.PORT || 5000;
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/db");

try {
  app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server running on http://localhost:${PORT}`);
  });
} catch (error) {
  console.error("❌ Database Connection Failed");
  console.error(error.message);
  process.exit(1);
}

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const app = express();
const authRoutes = require("./routes/authRoutes.js");
const userRoutes = require("./routes/userRoutes");
const bloodRequestRoutes = require("./routes/bloodRequestRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const donationRoutes = require("./routes/donationRoutes");
const dotenv = require("dotenv");

dotenv.config();

const allowedOrigins = [
  "http://localhost:5173",
  "https://melodious-pony-9d8ec1.netlify.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(helmet());

app.use(cookieParser());

app.use(morgan("dev"));

// Authentication Route
app.use("/api/auth", authRoutes);

// User Data
app.use("/api/users", userRoutes);

// Blood Request API
app.use("/api/blood-requests", bloodRequestRoutes);

// User Notifications
app.use("/api/notifications", notificationRoutes);

// User Blood Donations
app.use("/api/donations", donationRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Smart Blood Donor Matching API Running",
  });
});

module.exports = app;

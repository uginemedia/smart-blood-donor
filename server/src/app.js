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

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true, // If you are using cookies, sessions, or authorization headers
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
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

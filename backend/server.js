// backend/server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

const plantRoutes = require("./routes/plants");
const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chat"); // 👈 add this

// Load env (.env in same folder as server.js)
dotenv.config({ path: path.join(__dirname, ".env") });

console.log("MONGO_URL present?", !!process.env.MONGO_URL);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/plants", plantRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes); // 👈 use chat router here

// ❌ REMOVE this whole old chat route:
// app.post("/api/chat", (req, res) => { ... });

// MongoDB
if (!process.env.MONGO_URL) {
  console.error("❌ MONGO_URL is not set in .env");
} else {
  mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));
}

// Start server
app.listen(PORT, () =>
  console.log(`✅ Backend running on http://localhost:${PORT}`)
);

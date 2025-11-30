// backend/server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

const plantRoutes = require("./routes/plants");
const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chat");

// ✅ Load env (.env in same folder as server.js)
dotenv.config({ path: path.join(__dirname, ".env") });


const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Routes
app.use("/api/plants", plantRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

// ✅ MongoDB Atlas Connection
if (!process.env.MONGODB_URL) {
  console.error("❌ MONGODB_URL is not set in .env");
} else {
  mongoose
    .connect(process.env.MONGODB_URL, {
      serverSelectionTimeoutMS: 10000,
    })
    .then(() => console.log("✅ MongoDB (Atlas) connected successfully"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));
}

// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});

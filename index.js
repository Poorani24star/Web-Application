import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// CONNECT TO MONGODB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("✅ Connected to MongoDB (Atlas or Local)"))
  .catch((err) => console.error("❌ Database connection error:", err));

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Server running...");
});

// START SERVER
app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
});

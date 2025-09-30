require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const allowedOrigins = [
  'http://localhost:3000',
  'https://your-app-name.vercel.app', 
  'https://exam-portal-frontend.vercel.app' 
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS not allowed'), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
const app = express();

app.use(cors());
app.use(express.json());


mongoose
  .connect("mongodb://127.0.0.1:27017/exam_portal", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/exams", require("./routes/exam"));
app.use("/api/results", require("./routes/result"));

// Test Route
app.get("/", (req, res) => {
  res.json({ message: "Exam Portal API is running!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

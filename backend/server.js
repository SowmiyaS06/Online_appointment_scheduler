require("dotenv").config();

// Set default JWT_SECRET if not loaded from .env
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'medbook-super-secret-jwt-key-2024-production-ready-secure';
  console.log('⚠️  JWT_SECRET not found in .env, using default value');
}

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const passport = require("passport");
const mockDatabase = require("./services/mockDatabase");
const Appointment = require("./models/Appointment");

// ---------------------
// ✅ Validate ENV Vars
// ---------------------
const requiredVars = [
  "JWT_SECRET",
];
requiredVars.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Missing required environment variable: ${key}`);
    process.exit(1);
  }
});

// Check Google OAuth configuration
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || 
    process.env.GOOGLE_CLIENT_ID === 'your-real-google-client-id-here' || 
    process.env.GOOGLE_CLIENT_SECRET === 'your-real-google-client-secret-here') {
  console.log('⚠️  Google OAuth not configured - using demo mode');
  console.log('To enable real Google authentication:');
  console.log('1. Visit https://console.cloud.google.com/apis/credentials');
  console.log('2. Create OAuth 2.0 Client ID credentials');
  console.log('3. Set authorized redirect URI to: http://localhost:5000/api/auth/google/callback');
  console.log('4. Update GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env file');
  console.log('5. Restart the backend server');
} else {
  console.log('✅ Google OAuth is configured and ready for real authentication');
}

console.log("✅ Environment variables loaded successfully");

// ---------------------
// ✅ Import passport config
// ---------------------
require("./config/passport");

// ---------------------
// ✅ Import routes
// ---------------------
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const appointmentRoutes = require("./routes/appointments");
const reportRoutes = require("./routes/reports");

// ---------------------
// ✅ Import middleware
// ---------------------
const errorHandler = require("./middleware/errorHandler");

const app = express();

// ---------------------
// ✅ Middleware
// ---------------------
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5177",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));

// ---------------------
// ✅ Passport
// ---------------------
app.use(passport.initialize());

// ---------------------
// ✅ Routes
// ---------------------
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/reports", reportRoutes);

// ---------------------
// ✅ Database Connection
// ---------------------
let databaseConnected = false;

if (process.env.MONGODB_URI) {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("✅ Connected to MongoDB");
      databaseConnected = true;
    })
    .catch((error) => {
      console.error("❌ MongoDB connection error:", error.message);
      console.log("⚠️  Falling back to mock database");
      mockDatabase.initializeSampleData();
      databaseConnected = false;
    });
} else {
  console.log("⚠️  MONGODB_URI not found in environment variables");
  console.log("⚠️  Using mock database for testing");
  mockDatabase.initializeSampleData();
  databaseConnected = false;
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  // Check actual mongoose connection state
  const isMongoDBConnected = mongoose.connection.readyState === 1;
  
  res.json({
    message: "MedBook API is running!",
    timestamp: new Date().toISOString(),
    googleOAuthConfigured: !(!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || 
      process.env.GOOGLE_CLIENT_ID === 'your-real-google-client-id-here' || 
      process.env.GOOGLE_CLIENT_SECRET === 'your-real-google-client-secret-here'),
    database: isMongoDBConnected ? 'MongoDB Connected' : 'Using Mock Database'
  });
});

// ---------------------
// ✅ Start Server
// ---------------------
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📝 Health check endpoint: http://localhost:${PORT}/api/health`);
  
  // Check if MongoDB is actually connected after server starts
  setTimeout(() => {
    const isMongoDBConnected = mongoose.connection.readyState === 1;
    if (isMongoDBConnected) {
      console.log("✅ MongoDB is connected and ready");
    } else {
      console.log("📝 Mock database initialized with sample data");
      console.log("📝 Available users:");
      console.log("   - Patient: john.patient@example.com / password123");
      console.log("   - Doctor: sarah.johnson@example.com / password123");
      console.log("📝 Use these credentials for testing");
    }
  }, 1000);
});

// ---------------------
// ✅ Scheduled Tasks
// ---------------------
// Update appointment statuses every hour
const updateAppointmentStatuses = async () => {
  try {
    const result = await Appointment.updateAllAppointmentStatuses();
    if (result.modifiedCount > 0) {
      console.log(`✅ Updated ${result.modifiedCount} appointment statuses to 'completed'`);
    }
  } catch (error) {
    console.error('❌ Error updating appointment statuses:', error);
  }
};

// Run immediately on startup
updateAppointmentStatuses();

// Schedule to run every hour
setInterval(updateAppointmentStatuses, 60 * 60 * 1000); // 1 hour

module.exports = app;
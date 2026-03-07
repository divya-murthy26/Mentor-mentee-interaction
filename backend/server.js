const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const mentorRoutes = require('./routes/mentorRoutes');
const menteeRoutes = require('./routes/menteeRoutes');
const interactionRoutes = require('./routes/interactionRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const statsRoutes = require('./routes/statsRoutes');

const app = express();

/* ---------------- Middleware ---------------- */

const corsOptions = {
  origin: function (origin, callback) {
    console.log('Incoming Request Origin:', origin); // Debug log to check what browser sends

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Allow localhost, the main vercel app, and any Vercel preview URLs for this project
    if (origin.startsWith("http://localhost") || origin.endsWith(".vercel.app")) {
      return callback(null, true);
    }
    console.error('Blocked by CORS:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* ---------------- Routes ---------------- */

app.use('/api/auth', authRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/mentees', menteeRoutes);
app.use('/api/interactions', interactionRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/stats', statsRoutes);

/* ---------------- Health Route ---------------- */

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend running' });
});

/* ---------------- Error Handler ---------------- */

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

/* ---------------- Server + DB ---------------- */

const PORT = process.env.PORT || 5000;

// Use the same variable name you defined in .env
const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB error:', err);
    process.exit(1);
  });

module.exports = app;
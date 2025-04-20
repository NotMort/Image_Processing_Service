const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const imageRoutes = require('./routes/image')
const rateLimit = require('express-rate-limit');
const path = require('path');
const cors = require('cors');
const globalLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100, 
  });
dotenv.config();
const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api', imageRoutes);
app.use(globalLimiter);
module.exports = app;

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const imageRoutes = require('./routes/image')
const rateLimit = require('express-rate-limit');


const globalLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100, 
  });
dotenv.config();

const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api', imageRoutes);
app.use(globalLimiter);
module.exports = app;

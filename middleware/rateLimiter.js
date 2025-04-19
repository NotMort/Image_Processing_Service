const rateLimit = require('express-rate-limit');

const imageLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 20, 
  message: 'Too many requests. Please try again later.',
});

module.exports = imageLimiter;

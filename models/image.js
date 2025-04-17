const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  filename: String,
  path: String,
  originalName: String,
  mimeType: String,
  size: Number,
  transformations: { type: Object, default: {} },
}, { timestamps: true });

module.exports = mongoose.model('Image', imageSchema);

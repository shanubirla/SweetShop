const mongoose = require('mongoose');

const SweetSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  category: { type: String, default: 'General', index: true },
  price: { type: Number, required: true, default: 0 },
  quantity: { type: Number, default: 0 },
  description: { type: String, default: '' },
  imageUrl: String,   // <-- Add this
}, { timestamps: true });
module.exports = mongoose.model('Sweet', SweetSchema);

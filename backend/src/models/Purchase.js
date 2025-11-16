const mongoose = require('mongoose');

const PurchaseSchema = new mongoose.Schema({
  sweetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sweet', required: true },
  quantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Purchase', PurchaseSchema);

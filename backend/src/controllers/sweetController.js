const Sweet = require('../models/Sweet');
const Purchase = require('../models/Purchase');
const mongoose = require('mongoose');

exports.createSweet = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);
    console.log("REQ FILE:", req.file);

    const data = req.body;

    if (req.file) {
      data.imageUrl = req.file.path;
    }

    const sweet = new Sweet(data);
    await sweet.save();

    res.status(201).json({ success: true, sweet });

  } catch (err) {
    console.error("🔥 CREATE SWEET ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};




exports.updateSweet = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    if (req.file) {
      data.imageUrl = req.file.path;
    }

    const updated = await Sweet.findByIdAndUpdate(id, data, { new: true });

    res.json({ success: true, sweet: updated });

  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ success: false });
  }
};


exports.deleteSweet = async (req, res) => {
  const id = req.params.id;
  await Sweet.findByIdAndDelete(id);
  res.json({ success: true });
};

exports.getSweet = async (req, res) => {
  const sweet = await Sweet.findById(req.params.id);
  res.json({ success: true, sweet });
};

/**
 * GET /api/sweets
 * query params: search, category, sort (price_asc, price_desc, stock_asc, stock_desc), page, limit
 */
exports.listSweets = async (req, res) => {
  const { search, category, sort, page = 1, limit = 12 } = req.query;
  const filter = {};
  if (search) filter.name = new RegExp(search, 'i');
  if (category) filter.category = category;

  let sortObj = { createdAt: -1 };
  if (sort === 'price_asc') sortObj = { price: 1 };
  if (sort === 'price_desc') sortObj = { price: -1 };
  if (sort === 'stock_asc') sortObj = { quantity: 1 };
  if (sort === 'stock_desc') sortObj = { quantity: -1 };

  const skip = (Number(page) - 1) * Number(limit);
  const [total, sweets] = await Promise.all([
    Sweet.countDocuments(filter),
    Sweet.find(filter).sort(sortObj).skip(skip).limit(Number(limit))
  ]);

  res.json({ success: true, total, page: Number(page), limit: Number(limit), sweets });
};

/**
 * Record a purchase (to be used for sales analytics)
 */
exports.createPurchase = async (req, res) => {
  const { sweetId, quantity } = req.body;
  if (!mongoose.Types.ObjectId.isValid(sweetId)) return res.status(400).json({ success: false, message: 'Invalid sweetId' });

  const sweet = await Sweet.findById(sweetId);
  if (!sweet) return res.status(404).json({ success: false, message: 'Sweet not found' });
  if (sweet.quantity < quantity) return res.status(400).json({ success: false, message: 'Insufficient stock' });

  const totalPrice = quantity * sweet.price;
  const purchase = new Purchase({ sweetId, quantity, totalPrice });
  await purchase.save();

  sweet.quantity -= quantity;
  await sweet.save();

  res.status(201).json({ success: true, purchase });
};

/**
 * Dashboard stats
 */
exports.dashboardStats = async (req, res) => {
  // totals
  const totalSweets = await Sweet.countDocuments();
  const lowStockCount = await Sweet.countDocuments({ quantity: { $lte: 5 } });

  const categoriesAgg = await Sweet.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  // revenue and sales history (last 30 days default)
  const days = Number(req.query.days) || 30;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days + 1); // inclusive

  const revenueAgg = await Purchase.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' }, totalItems: { $sum: '$quantity' } } }
  ]);

  const salesHistory = await Purchase.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
        },
        totalSales: { $sum: '$totalPrice' },
        count: { $sum: '$quantity' }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

  res.json({
    success: true,
    stats: {
      totalSweets,
      lowStockCount,
      categories: categoriesAgg,
      totalRevenue,
      salesHistory
    }
  });
};

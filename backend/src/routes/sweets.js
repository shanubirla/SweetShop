const express = require("express");
const Sweet = require("../models/Sweet");
const auth = require("../middleware/auth");
const admin = require("../middleware/adminOnly");

const router = express.Router();

// CREATE SWEET (admin)
router.post("/", auth, admin, async (req, res) => {
  try {
    const sweet = await Sweet.create(req.body);
    return res.status(201).json(sweet);
  } catch (err) {
    return res.status(500).json({ message: "Error creating sweet" });
  }
});

// LIST SWEETS
router.get("/", auth, async (req, res) => {
  const sweets = await Sweet.find();
  return res.status(200).json(sweets);
});

// SEARCH SWEETS
router.get("/search", auth, async (req, res) => {
  const { name, category, min, max } = req.query;

  const query = {};
  if (name) query.name = new RegExp(name, "i");
  if (category) query.category = new RegExp(category, "i");
  if (min || max) query.price = {};

  if (min) query.price.$gte = Number(min);
  if (max) query.price.$lte = Number(max);

  const sweets = await Sweet.find(query);
  return res.status(200).json(sweets);
});

// UPDATE SWEET (admin)
router.put("/:id", auth, admin, async (req, res) => {
  try {
    const sweet = await Sweet.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    return res.status(200).json(sweet);
  } catch (err) {
    return res.status(500).json({ message: "Error updating sweet" });
  }
});

// DELETE SWEET (admin)
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    await Sweet.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Sweet deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Error deleting sweet" });
  }
});

module.exports = router;

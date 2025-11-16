require('dotenv').config();
const connectDB = require('../config/db');
const Sweet = require('../models/Sweet');
const Purchase = require('../models/Purchase');

const sweetsData = [
  { name: 'Rose Barfi', category: 'Barfi', price: 40, quantity: 50, description: 'Delicate rose barfi' },
  { name: 'Mango Gulab', category: 'Gulab', price: 60, quantity: 20, description: 'Mango flavored sweet' },
  { name: 'Pista Ladoo', category: 'Ladoo', price: 45, quantity: 30, description: 'Pistachio ladoo' },
  { name: 'Kaju Katli', category: 'Barfi', price: 80, quantity: 10, description: 'Classic cashew fudge' },
  { name: 'Cham Cham', category: 'Dessert', price: 35, quantity: 60, description: 'Soft & sweet' }
];

async function seed() {
  await connectDB(process.env.MONGO_URI);
  await Sweet.deleteMany({});
  await Purchase.deleteMany({});
  const sweets = await Sweet.insertMany(sweetsData);

  // create random purchases (last 20 days)
  const purchases = [];
  const now = new Date();
  for (let i = 0; i < 40; i++) {
    const sweet = sweets[Math.floor(Math.random() * sweets.length)];
    const qty = Math.max(1, Math.floor(Math.random() * 4));
    const daysAgo = Math.floor(Math.random() * 20);
    const createdAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    purchases.push({
      sweetId: sweet._id,
      quantity: qty,
      totalPrice: qty * sweet.price,
      createdAt
    });
    sweet.quantity = Math.max(0, sweet.quantity - qty);
  }
  await Promise.all(sweets.map(s => s.save()));
  await Purchase.insertMany(purchases);
  console.log('Seed complete');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });

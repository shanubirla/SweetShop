const request = require("supertest");
const app = require("../src/app");
const mongoose = require("mongoose");
const User = require("../src/models/User");
const Sweet = require("../src/models/Sweet");
const jwt = require("jsonwebtoken");

let userToken;
let adminToken;
let sweetId;

beforeAll(async () => {
  await mongoose.connection.dropDatabase();

  // create normal user
  await request(app).post("/api/auth/register").send({
    fullname: "Buyer User",
    email: "buyer@example.com",
    password: "Password123",
  });

  const loginUser = await request(app).post("/api/auth/login").send({
    email: "buyer@example.com",
    password: "Password123",
  });

  userToken = loginUser.body.token;

  // create admin
  const admin = await User.create({
    fullname: "Admin User",
    email: "admin@example.com",
    password: "$2b$10$abcdefghijklmnopqrstuv",
    role: "admin",
  });

  adminToken = jwt.sign({ id: admin._id, role: "admin" }, process.env.JWT_SECRET);

  // create initial sweet
  const sweet = await Sweet.create({
    name: "Lollipop",
    category: "Candy",
    price: 10,
    quantity: 2,
  });

  sweetId = sweet._id.toString();
});

afterAll(async () => {
  await mongoose.connection.close();
});


describe("Inventory: Purchase & Restock", () => {

  it("should allow a user to purchase a sweet", async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.quantity).toBe(1); // decreased
  });

  it("should return error if sweet is out of stock", async () => {
    // purchase once more → quantity becomes 0
    await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set("Authorization", `Bearer ${userToken}`);

    // now purchasing again should fail
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Out of stock");
  });

  it("should allow admin to restock", async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ amount: 5 });

    expect(res.status).toBe(200);
    expect(res.body.quantity).toBe(5);
  });

  it("should NOT allow non-admin to restock", async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/restock`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ amount: 3 });

    expect(res.status).toBe(403);
  });
});

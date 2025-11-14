const request = require("supertest");
const app = require("../src/app");
const mongoose = require("mongoose");
const User = require("../src/models/User");

let token;
let adminToken;
let createdSweetId;

beforeAll(async () => {
  await mongoose.connection.dropDatabase();

  // Create a normal user
  await request(app).post("/api/auth/register").send({
    fullname: "Normal User",
    email: "user@example.com",
    password: "Password123",
  });

  const loginUser = await request(app).post("/api/auth/login").send({
    email: "user@example.com",
    password: "Password123",
  });

  token = loginUser.body.token;

  // Create admin user
  const admin = await User.create({
    fullname: "Admin User",
    email: "admin@example.com",
    password: "$2b$10$abcdefghijklmnopqrstuv", // dummy hashed
    role: "admin",
  });

  const jwt = require("jsonwebtoken");
  adminToken = jwt.sign({ id: admin._id, role: "admin" }, process.env.JWT_SECRET);
});

afterAll(async () => {
  await mongoose.connection.close();
});


describe("Sweets API", () => {

  it("should create a sweet (admin only)", async () => {
    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Chocolate Bar",
        category: "Chocolate",
        price: 50,
        quantity: 10,
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("_id");
    createdSweetId = res.body._id;
  });

  it("should NOT allow non-admin to create sweet", async () => {
    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Candy",
        category: "Sugar",
        price: 10,
        quantity: 5,
      });

    expect(res.status).toBe(403);
  });

  it("should list all sweets", async () => {
    const res = await request(app)
      .get("/api/sweets")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should search sweets by name", async () => {
    const res = await request(app)
      .get("/api/sweets/search?name=Chocolate")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should update a sweet (admin only)", async () => {
    const res = await request(app)
      .put(`/api/sweets/${createdSweetId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        price: 60,
      });

    expect(res.status).toBe(200);
    expect(res.body.price).toBe(60);
  });

  it("should delete a sweet (admin only)", async () => {
    const res = await request(app)
      .delete(`/api/sweets/${createdSweetId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Sweet deleted");
  });

});

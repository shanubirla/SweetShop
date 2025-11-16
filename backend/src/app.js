require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/sweets", require("./routes/sweets"));
app.use('/api/dashboard', require('./routes/dashboard'));

module.exports = app;

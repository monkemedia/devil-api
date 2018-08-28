const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const productRoutes = require("./api/routes/products");
const vendorProductRoutes = require("./api/routes/vendorProducts");
const orderRoutes = require("./api/routes/orders");
const userRoutes = require('./api/routes/user');

const cors = require('cors');

mongoose.connect(
  "mongodb://monkemedia:" +
    process.env.MONGO_ATLAS_PW +
    "@cluster0-shard-00-00-rcli4.mongodb.net:27017,cluster0-shard-00-01-rcli4.mongodb.net:27017,cluster0-shard-00-02-rcli4.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true"
);

app.use(morgan("dev"));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// Routes which should handle requests
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/vendor-products", vendorProductRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/user", userRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;

const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const ProductsController = require('../controllers/products');


router.get("/", checkAuth, ProductsController.merchant_products_get_all);

module.exports = router;

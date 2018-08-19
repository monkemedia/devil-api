const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const ProductsController = require('../controllers/products');


router.get("/", checkAuth, ProductsController.vendor_products_get_all);

module.exports = router;

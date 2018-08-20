const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const ProductsController = require('../controllers/products');


router.get("/", checkAuth, ProductsController.vendor_products_get_all);
router.get("/:productId", checkAuth, ProductsController.vendor_products_get_product_by_id);

module.exports = router;

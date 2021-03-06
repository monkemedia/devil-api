const express = require("express");
const router = express.Router();

const ShopController = require('../controllers/shop');
const checkAuth = require('../middleware/check-auth');

router.get("/", ShopController.shop_get_all);

router.post("/", ShopController.shop_create_shop);

router.put("/:shopId", ShopController.shop_update_shop);

router.get("/:shopId", ShopController.shop_get_shop);

router.delete("/:shopId", ShopController.shop_delete_shop);

module.exports = router;

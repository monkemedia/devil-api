const express = require("express");
const router = express.Router();

const StripeController = require('../controllers/stripe');

router.post("/create-account", StripeController.create_account);

// router.post("/login", UserController.user_login);

// router.post("/token", UserController.token);

// router.delete("/:userId", checkAuth, UserController.user_delete);

module.exports = router;

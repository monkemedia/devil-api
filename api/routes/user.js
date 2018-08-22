const express = require("express");
const router = express.Router();

const UserController = require('../controllers/user');
const checkAuth = require('../middleware/check-auth');

router.get("/", UserController.all_users);

router.post("/signup", UserController.user_signup);

router.post("/login", UserController.user_login);

router.post("/token", UserController.token);

router.delete("/:userId", checkAuth, UserController.user_delete);

module.exports = router;

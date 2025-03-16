const express = require("express");
const { login, logout } = require("../controllers/auth/auth.controller");
const { authenticateToken } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/login", login);
router.delete("/logout", authenticateToken, logout);

module.exports = router;

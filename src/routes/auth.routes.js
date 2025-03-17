const express = require("express");
const { login, logout, me } = require("../controllers/auth/auth.controller");
const { authenticateToken } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/login", login);
router.delete("/logout", authenticateToken, logout);
router.get("/me", authenticateToken, me);

module.exports = router;

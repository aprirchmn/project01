const express = require("express");
const { loginGuru, loginSiswa, logout, Me } = require("../controllers/auth.controller");
const { verifyToken } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/login/guru", loginGuru);
router.post("/login/siswa", loginSiswa);
router.delete("/logout", verifyToken, logout);
router.get("/me", verifyToken, Me);

module.exports = router;

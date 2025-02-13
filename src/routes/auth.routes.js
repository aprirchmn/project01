const express = require("express");
const { loginGuru, loginSiswa, logout } = require("../controllers/auth.controller");

const router = express.Router();

router.post("/login/guru", loginGuru);
router.post("/login/siswa", loginSiswa);
router.post("/logout", logout);

module.exports = router;

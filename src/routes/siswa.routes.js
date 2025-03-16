const express = require("express");
const siswaController = require("../controllers/siswa.controller");
const {
  authenticateToken,
  isGuruOrAdmin,
} = require("../middleware/auth.middleware");
const { guru } = require("../db");

const router = express.Router();

router.get("/", authenticateToken, siswaController.getAll);
router.get("/:id", authenticateToken, siswaController.getById);
router.post("/", authenticateToken, isGuruOrAdmin, siswaController.create);
router.put("/:id", authenticateToken, isGuruOrAdmin, siswaController.update);
router.patch("/:id", authenticateToken, isGuruOrAdmin, siswaController.patch);
router.delete("/:id", authenticateToken, isGuruOrAdmin, siswaController.delete);

module.exports = router;

const express = require("express");
const kelasController = require("../controllers/kelas.controller");
const {
  authenticateToken,
  isGuruOrAdmin,
  isSiswaOrAdmin,
} = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", authenticateToken, kelasController.getAll);
router.get("/:id", authenticateToken, kelasController.getById);
router.post("/", authenticateToken, isGuruOrAdmin, kelasController.create);
router.put("/:id", authenticateToken, isGuruOrAdmin, kelasController.update);
router.delete("/:id", authenticateToken, isGuruOrAdmin, kelasController.delete);
router.patch("/:id", authenticateToken, isGuruOrAdmin, kelasController.patch);
router.post("/join", authenticateToken, isSiswaOrAdmin, kelasController.join);

module.exports = router;

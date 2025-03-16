const express = require("express");
const ujianController = require("../controllers/ujian.controller");
const {
  authenticateToken,
  isGuruOrAdmin,
} = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", authenticateToken, ujianController.getAll);
router.get("/:id", authenticateToken, isGuruOrAdmin, ujianController.getById);
router.post("/", authenticateToken, isGuruOrAdmin, ujianController.create);
router.put("/:id", authenticateToken, isGuruOrAdmin, ujianController.update);
router.patch("/:id", authenticateToken, isGuruOrAdmin, ujianController.patch);
router.delete("/:id", authenticateToken, isGuruOrAdmin, ujianController.delete);

module.exports = router;

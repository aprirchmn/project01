const express = require("express");
const guruController = require("../controllers/guru.controller");
const {
  authenticateToken,
  isGuruOrAdmin,
} = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", authenticateToken, isGuruOrAdmin, guruController.getAll);
router.get("/:id", authenticateToken, isGuruOrAdmin, guruController.getById);
router.post("/", authenticateToken, isGuruOrAdmin, guruController.create);
router.put("/:id", authenticateToken, isGuruOrAdmin, guruController.update);
router.delete("/:id", authenticateToken, isGuruOrAdmin, guruController.delete);
router.patch("/:id", authenticateToken, isGuruOrAdmin, guruController.patch);

module.exports = router;

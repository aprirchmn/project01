const express = require("express");
const ujianController = require("../controllers/ujian.controller");
const {
  authenticateToken,
  isGuruOrAdmin,
  isSiswaOrAdmin,
} = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", authenticateToken, ujianController.getAll);
router.get("/:id", authenticateToken, ujianController.getById);
router.post("/", authenticateToken, isGuruOrAdmin, ujianController.create);
router.put("/:id", authenticateToken, isGuruOrAdmin, ujianController.update);
router.patch("/:id", authenticateToken, isGuruOrAdmin, ujianController.patch);
router.delete("/:id", authenticateToken, isGuruOrAdmin, ujianController.delete);
router.post("/:id_ujian/start", authenticateToken, ujianController.startUjian);
router.post(
  "/submit-ujian",
  authenticateToken,
  isSiswaOrAdmin,
  ujianController.submitUjian,
);
router.post(
  "/:id/cheat",
  authenticateToken,
  isSiswaOrAdmin,
  ujianController.examCheating,
);

module.exports = router;

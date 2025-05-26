const express = require("express");
const ujianController = require("../controllers/ujian.controller");
const {
  authenticateToken,
  isGuruOrAdmin,
  isSiswaOrAdmin,
} = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", authenticateToken, ujianController.getAll);
router.get(
  "/laporan",
  authenticateToken,
  isGuruOrAdmin,
  ujianController.examResult,
);
router.get("/:id", authenticateToken, ujianController.getById);
router.get(
  "/:id_ujian/hasil",
  authenticateToken,
  isGuruOrAdmin,
  ujianController.examDetailResult,
);
router.get(
  "/:id_ujian/export",
  authenticateToken,
  isGuruOrAdmin,
  ujianController.exportExamResult,
);
router.post("/", authenticateToken, isGuruOrAdmin, ujianController.create);
router.put("/:id", authenticateToken, isGuruOrAdmin, ujianController.update);
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

const express = require("express");
const hasilujianController = require("../controllers/hasilujian.controller");
const {
  authenticateToken,
  isGuruOrAdmin,
} = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", authenticateToken, hasilujianController.getAll);
router.get(
  "/:id",
  authenticateToken,
  isGuruOrAdmin,
  hasilujianController.getById,
);
router.post("/", authenticateToken, hasilujianController.create);
router.put(
  "/:id",
  authenticateToken,
  isGuruOrAdmin,
  hasilujianController.update,
);
router.patch(
  "/:id",
  authenticateToken,
  isGuruOrAdmin,
  hasilujianController.patch,
);
router.delete(
  "/:id",
  authenticateToken,
  isGuruOrAdmin,
  hasilujianController.delete,
);

router.get("/hasil/:id", authenticateToken, hasilujianController.getHasilUjian);
router.get(
  "/:idUjian/review/:idSiswa",
  authenticateToken,
  hasilujianController.reviewJawaban,
);

module.exports = router;

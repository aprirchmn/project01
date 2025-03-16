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

module.exports = router;

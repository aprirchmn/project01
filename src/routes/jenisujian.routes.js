const express = require("express");
const jenisujianController = require("../controllers/jenisujian.controller");
const {
  authenticateToken,
  isGuruOrAdmin,
} = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", authenticateToken, isGuruOrAdmin, jenisujianController.getAll);
router.get(
  "/:id",
  authenticateToken,
  isGuruOrAdmin,
  jenisujianController.getById,
);
router.post("/", authenticateToken, isGuruOrAdmin, jenisujianController.create);
router.put(
  "/:id",
  authenticateToken,
  isGuruOrAdmin,
  jenisujianController.update,
);
router.delete(
  "/:id",
  authenticateToken,
  isGuruOrAdmin,
  jenisujianController.delete,
);
router.patch(
  "/:id",
  authenticateToken,
  isGuruOrAdmin,
  jenisujianController.patch,
);

module.exports = router;

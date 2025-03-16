const express = require("express");
const matapelajaranController = require("../controllers/matapelajaran.controller");
const {
  authenticateToken,
  isGuruOrAdmin,
} = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", authenticateToken, matapelajaranController.getAll);
router.get("/:id", authenticateToken, matapelajaranController.getById);
router.post(
  "/",
  authenticateToken,
  isGuruOrAdmin,
  matapelajaranController.create,
);
router.put(
  "/:id",
  authenticateToken,
  isGuruOrAdmin,
  matapelajaranController.update,
);
router.delete(
  "/:id",
  authenticateToken,
  isGuruOrAdmin,
  matapelajaranController.delete,
);
router.patch(
  "/:id",
  authenticateToken,
  isGuruOrAdmin,
  matapelajaranController.patch,
);

module.exports = router;

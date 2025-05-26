const express = require("express");
const router = express.Router();
const jurusanController = require("../controllers/jurusan.controller");
const {
  authenticateToken,
  isSuperAdmin,
  isGuruOrAdmin,
} = require("../middleware/auth.middleware");

router.get("/", authenticateToken, isGuruOrAdmin, jurusanController.getAll);

router.get("/:id", authenticateToken, isGuruOrAdmin, jurusanController.getById);

router.post("/", authenticateToken, isSuperAdmin, jurusanController.create);

router.put("/:id", authenticateToken, isSuperAdmin, jurusanController.update);

router.delete(
  "/:id",
  authenticateToken,
  isSuperAdmin,
  jurusanController.delete,
);

module.exports = router;

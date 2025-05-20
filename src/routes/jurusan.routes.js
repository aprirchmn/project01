const express = require("express");
const router = express.Router();
const jurusanController = require("../controllers/jurusan.controller");
const {
  authenticateToken,
  isSuperAdmin,
} = require("../middleware/auth.middleware");

router.get("/", authenticateToken, isSuperAdmin, jurusanController.getAll);

router.get("/:id", authenticateToken, isSuperAdmin, jurusanController.getById);

router.post("/", authenticateToken, isSuperAdmin, jurusanController.create);

router.put("/:id", authenticateToken, isSuperAdmin, jurusanController.update);

router.delete(
  "/:id",
  authenticateToken,
  isSuperAdmin,
  jurusanController.delete,
);

module.exports = router;

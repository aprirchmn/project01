const express = require("express");
const jawabanController = require("../controllers/jawaban.controller");
const { authenticateToken } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", authenticateToken, jawabanController.getAll);
router.get("/:id", authenticateToken, jawabanController.getById);
router.post("/", authenticateToken, jawabanController.create);
router.put("/:id", authenticateToken, jawabanController.update);
router.delete("/:id", authenticateToken, jawabanController.delete);
router.patch("/:id", authenticateToken, jawabanController.patch);

module.exports = router;

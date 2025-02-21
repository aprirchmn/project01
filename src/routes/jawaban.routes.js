const express = require("express");
const jawabanController = require("../controllers/jawaban.controller");
const { verifyToken } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", verifyToken, jawabanController.getAll);
router.get("/:id", verifyToken, jawabanController.getById);
router.post("/", verifyToken, jawabanController.create);
router.put("/:id", verifyToken, jawabanController.update);
router.delete("/:id", verifyToken, jawabanController.delete);
router.patch("/:id", verifyToken, jawabanController.patch);

module.exports = router;

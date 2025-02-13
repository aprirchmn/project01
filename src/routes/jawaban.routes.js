const express = require("express");
const jawabanController = require("../controllers/jawaban.controller");

const router = express.Router();

router.get("/", jawabanController.getAll);
router.get("/:id", jawabanController.getById);
router.post("/", jawabanController.create);
router.put("/:id", jawabanController.update);
router.delete("/:id", jawabanController.delete);
router.patch("/:id", jawabanController.patch);

module.exports = router;

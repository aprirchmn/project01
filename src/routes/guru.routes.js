const express = require("express");
const guruController = require("../controllers/guru.controller");

const router = express.Router();

router.get("/", guruController.getAll);
router.get("/:id", guruController.getById);
router.post("/", guruController.create);
router.put("/:id", guruController.update);
router.delete("/:id", guruController.delete);
router.patch("/:id", guruController.patch);

module.exports = router;

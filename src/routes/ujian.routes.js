const express = require("express");
const ujianController = require("../controllers/ujian.controller");

const router = express.Router();

router.get("/", ujianController.getAll);
router.get("/:id", ujianController.getById);
router.post("/", ujianController.create);
router.put("/:id", ujianController.update);
router.patch("/:id", ujianController.patch);
router.delete("/:id", ujianController.delete);

module.exports = router;

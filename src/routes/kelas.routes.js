const express = require("express");
const kelasController = require("../controllers/kelas.controller");

const router = express.Router();

router.get("/", kelasController.getAll);
router.get("/:id", kelasController.getById);
router.post("/", kelasController.create);
router.put("/:id", kelasController.update);
router.delete("/:id", kelasController.delete);
router.patch("/:id", kelasController.patch);

module.exports = router;

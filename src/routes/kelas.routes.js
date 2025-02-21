const express = require("express");
const kelasController = require("../controllers/kelas.controller");
const { verifyToken, guruOnly, siswaOnly } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", verifyToken, kelasController.getAll);
router.get("/:id", verifyToken, kelasController.getById);
router.post("/", verifyToken, guruOnly, kelasController.create);
router.put("/:id", verifyToken, guruOnly, kelasController.update);
router.delete("/:id", verifyToken, guruOnly, kelasController.delete);
router.patch("/:id", verifyToken, guruOnly, kelasController.patch);
router.post("/join", verifyToken, siswaOnly, kelasController.join);

module.exports = router;

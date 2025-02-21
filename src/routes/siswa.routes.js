const express = require("express");
const siswaController = require("../controllers/siswa.controller");
const { verifyToken, guruOnly } = require("../middleware/auth.middleware");
const { guru } = require("../db");

const router = express.Router();

router.get("/", verifyToken, siswaController.getAll);
router.get("/:id", verifyToken, siswaController.getById);
router.post("/", verifyToken, guruOnly, siswaController.create);
router.put("/:id", verifyToken, guruOnly, siswaController.update);
router.patch("/:id", verifyToken, guruOnly, siswaController.patch);
router.delete("/:id", verifyToken, guruOnly, siswaController.delete);

module.exports = router;

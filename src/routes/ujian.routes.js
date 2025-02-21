const express = require("express");
const ujianController = require("../controllers/ujian.controller");
const { verifyToken, guruOnly } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", verifyToken, ujianController.getAll);
router.get("/:id", verifyToken, guruOnly, ujianController.getById);
router.post("/", verifyToken, guruOnly, ujianController.create);
router.put("/:id", verifyToken, guruOnly, ujianController.update);
router.patch("/:id", verifyToken, guruOnly, ujianController.patch);
router.delete("/:id", verifyToken, guruOnly, ujianController.delete);

module.exports = router;

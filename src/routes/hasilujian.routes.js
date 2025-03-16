const express = require("express");
const hasilujianController = require("../controllers/hasilujian.controller");
const { verifyToken, guruOnly } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", verifyToken, hasilujianController.getAll);
router.get("/:id", verifyToken, hasilujianController.getById);
router.post("/", verifyToken, hasilujianController.create);
router.put("/:id", verifyToken, guruOnly, hasilujianController.update);
router.patch("/:id", verifyToken, guruOnly, hasilujianController.patch);
router.delete("/:id", verifyToken, guruOnly, hasilujianController.delete);

module.exports = router;

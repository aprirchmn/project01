const express = require("express");
const jenisujianController = require("../controllers/jenisujian.controller");
const { verifyToken, guruOnly } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", verifyToken, guruOnly, jenisujianController.getAll);
router.get("/:id", verifyToken, guruOnly, jenisujianController.getById);
router.post("/", verifyToken, guruOnly, jenisujianController.create);
router.put("/:id", verifyToken, guruOnly, jenisujianController.update);
router.delete("/:id", verifyToken, guruOnly, jenisujianController.delete);
router.patch("/:id", verifyToken, guruOnly, jenisujianController.patch);

module.exports = router;

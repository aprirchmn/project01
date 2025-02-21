const express = require("express");
const matapelajaranController = require("../controllers/matapelajaran.controller");
const { verifyToken, guruOnly } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", verifyToken, matapelajaranController.getAll);
router.get("/:id", verifyToken, matapelajaranController.getById);
router.post("/", verifyToken, guruOnly, matapelajaranController.create);
router.put("/:id", verifyToken, guruOnly, matapelajaranController.update);
router.delete("/:id", verifyToken, guruOnly, matapelajaranController.delete);
router.patch("/:id", verifyToken, guruOnly, matapelajaranController.patch);

module.exports = router;

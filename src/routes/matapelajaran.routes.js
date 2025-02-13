const express = require("express");
const matapelajaranController = require("../controllers/matapelajaran.controller");

const router = express.Router();

router.get("/", matapelajaranController.getAll);
router.get("/:id", matapelajaranController.getById);
router.post("/", matapelajaranController.create);
router.put("/:id", matapelajaranController.update);
router.delete("/:id", matapelajaranController.delete);
router.patch("/:id", matapelajaranController.patch);

module.exports = router;
